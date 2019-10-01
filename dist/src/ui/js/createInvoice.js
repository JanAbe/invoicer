const { ipcRenderer } = require('electron');

const invoiceForm = new InvoiceComponent();
invoiceForm.init();

document.querySelector(`#${invoiceForm.createInvoiceID}`).addEventListener('click', () => {
    ipcRenderer.send('submit-invoice-channel', invoiceForm.create());
})

ipcRenderer.on('submit-invoice-reply-channel', (event, args) => {
    console.log(args);
});