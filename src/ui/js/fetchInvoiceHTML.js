const { ipcRenderer } = require('electron');

const invoiceSection = document.querySelector('#invoice-html');
ipcRenderer.on('fetch-invoice-reply-channel', (event, args) => {
    // args is the html
    // gotta paste this into a html file and show it to the user
    // console.log(args);
    invoiceSection.insertAdjacentHTML('beforeend', args);
});

const fetchInvoiceBtn = document.querySelector('#fetch-invoice-btn');
fetchInvoiceBtn.addEventListener('click', () => {
    const invoiceID = 'acbef742-7cec-48ec-aa05-129d2ca0b44c';
    ipcRenderer.send('fetch-invoice-channel', {'invoiceID': invoiceID});
});
