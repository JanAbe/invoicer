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
 * fetchAllInvoicesHTMLAndInsert listens to the provided channel to see
 * if all invoices have been requested. If this is the case
 * the rendered html is added to the page. Thereafter a click event
 * is added to all rendered buttons.
 */
const fetchAllInvoicesHTMLAndInsert = (chan) => {
    const invoicesTable = document.querySelector('#invoices-table');
    ipcRenderer.on(chan, (_, html) => {
        invoicesTable.insertAdjacentHTML('beforeend', html);
        bindGenerateInvoiceEventToButtons('.generate-invoice-btn', 'generate-invoice-channel');
    });
}

// todo: remove, as is probably unnsecesarry
/**
 * bindEventToButtons binds a click event to all buttons with the
 * specified css-class. Each click event has a function that
 * sends a request to the specified channel to generate an invoice
 * with the id that is the value of the clicked button. 
 */
const bindGenerateInvoiceEventToButtons = (class_, chan) => {
    const generateInvoiceButtons = document.querySelectorAll(class_);
    for (const btn of generateInvoiceButtons) {
        btn.addEventListener('click', () => {
            const invoiceID = btn.value;
            const userID = localStorage.getItem('id');
            ipcRenderer.send(chan, {'invoiceID': invoiceID, 'userID': userID});
        });
    }
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

readyPage();