const { ipcRenderer } = require('electron');

/**
 * readyPage runs all methods necessary to set up the page
 */
const readyPage = () => {
    fetchAllInvoices('fetch-all-invoices-channel');
    bindViewInvoiceEventToButton('generate-invoice-channel');
    bindDeleteInvoiceEventToButton('delete-invoice-channel');
    fetchAllInvoicesHTMLAndInsert('fetch-all-invoices-reply-channel');
}

/**
 * fetchAllInvoices sends a request to the
 * provided channel to get all invoices
 */
const fetchAllInvoices = (chan) => {
    ipcRenderer.send(chan);
}

const bindDeleteInvoiceEventToButton = (chan) => {
    const deleteInvoiceBtn = document.querySelector('#delete-invoice-btn');
    deleteInvoiceBtn.addEventListener('click', () => {
        const { id, element } = getSelectedInvoice();
        ipcRenderer.send(chan, {'invoiceID': id});
        element.style.display = 'none';
    });
}

/**
 * bindViewInvoiceEventToButton binds a click event to the 'view invoice' button.
 * When clicked, the invoice will be displayed so the user can look at it.
 */
const bindViewInvoiceEventToButton = (chan) => {
    const viewInvoiceBtn = document.querySelector('#view-invoice-btn');
    viewInvoiceBtn.addEventListener('click', () => {
        const userID = localStorage.getItem('id');
        ipcRenderer.send(chan, {'invoiceID': getSelectedInvoice()['id'], 'userID': userID});
    });
}

/**
 * getSelectedInvoice gets the the selected invoice id and element
 */
const getSelectedInvoice = () => {
    const radioBtns = document.querySelectorAll('input[name="invoice-radio-btn"]');
    for (const btn of radioBtns) {
        if (btn.checked) {
            return { id: btn.value, element: btn.parentElement.parentElement };
        }
    }
}

/**
 * fetchAllInvoicesHTMLAndInsert listens to the provided channel to see
 * if all invoices have been requested. If this is the case
 * the rendered html is added to the page. Thereafter a click event
 * is added to all rendered rows.
 */
const fetchAllInvoicesHTMLAndInsert = (chan) => {
    const invoicesTable = document.querySelector('#invoices-table');
    ipcRenderer.on(chan, (_, html) => {
        // is there a way to make this better and more clear. Functions
        // that rely on html elements need to be placed here because of the async nature
        // of the functions that return the html body. Otherwise the html page is empty
        // when these functions are called.
        invoicesTable.insertAdjacentHTML('beforeend', html);
        try {
            bindClickEventToRow();
            filterInvoices();
        } catch(e) {
            // todo: think about what to do here
        }
    });
}

/**
 * bindClickEventToRow binds a click event to each row
 * When a row is pressed, it's radiobutton is set to 'checked'
 * This way the whole row can be pressed, instead of the small
 * radiobutton
 */
const bindClickEventToRow = () => {
    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows[0].querySelector('input').checked = true; // set first row as selected
    for (const row of tableRows) {
        row.addEventListener('click', () => {
            row.querySelector('input').checked = true;
        });
    }
}

/**
 * filterInvoices filters the invoices based on a user provided searchterm
 * Only the invoices that satisfy the searchterm are shown.
 */
const filterInvoices = () => {
    const searchbar = document.querySelector('#search-invoices-input');
    const tableRows = document.querySelectorAll('table tbody tr');

    searchbar.addEventListener('keyup', () => {
        const searchTerm = searchbar.value.toLowerCase();
        for (const row of tableRows) {
            const cleanedData = row.innerText.trim().toLowerCase();
            if (cleanedData.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

readyPage();