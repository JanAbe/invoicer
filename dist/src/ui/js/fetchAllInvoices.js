const { ipcRenderer } = require('electron');

/**
 * readyPage runs all methods necessary to set up the page
 */
const readyPage = () => {
    fetchAllInvoices('fetch-all-invoices-channel');
    bindViewInvoiceEventToButton('generate-invoice-channel');
    fetchAllInvoicesHTMLAndInsert('fetch-all-invoices-reply-channel');
}

/**
 * fetchAllInvoices sends a request to the
 * provided channel to get all invoices
 */
const fetchAllInvoices = (chan) => {
    ipcRenderer.send(chan);
}

/**
 * bindViewInvoiceEventToButton binds a click event to the 'view invoice' button.
 * When clicked, the invoice will be displayed so the user can look at it.
 */
const bindViewInvoiceEventToButton = (chan) => {
    const viewInvoiceBtn = document.querySelector('#view-invoice-btn');
    viewInvoiceBtn.addEventListener('click', () => {
        const userID = localStorage.getItem('id');
        ipcRenderer.send(chan, {'invoiceID': getSelectedInvoiceID(), 'userID': userID});
    });
}

/**
 * getSelectedInvoiceID returns the value, the id, of the selected invoice.
 */
const getSelectedInvoiceID = () => {
    const radioBtns = document.querySelectorAll('input[name="invoice-radio-btn"]');
    let selectedInvoiceID = radioBtns[0].value;
    for (const btn of radioBtns) {
        if (btn.checked) {
            selectedInvoiceID = btn.value;
        }
    }

    return selectedInvoiceID;
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
        invoicesTable.insertAdjacentHTML('beforeend', html);
        bindClickEventToRow();
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
    console.log(tableRows);
    for (const row of tableRows) {
        row.addEventListener('click', () => {
            row.querySelector('input').checked = true;
        });
    }
}

readyPage();