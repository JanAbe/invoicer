const { ipcRenderer } = require('electron');

/**
 * readyPage runs all methods necessary to set up the page
 */
const readyPage = () => {
    fetchAllInvoices('fetch-all-invoices-channel');
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
            ipcRenderer.send(chan, {'invoiceID': invoiceID});
        });
    }
}

readyPage();