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
    const invoiceID = 'ed4a1729-914f-400c-81b5-9c03968df2cf';
    ipcRenderer.send('fetch-invoice-channel', {'invoiceID': invoiceID});
});
