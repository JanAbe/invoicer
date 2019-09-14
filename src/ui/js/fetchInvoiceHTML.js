// const { ipcRenderer } = require('electron');


// // send
// const fetchInvoiceBtn = document.querySelector('#fetch-invoice-btn');
// fetchInvoiceBtn.addEventListener('click', () => {
//     const invoiceID = '87960d00-1d0c-42e2-837b-fdb17cea6d1e';
//     ipcRenderer.send('fetch-invoice-channel', {'invoiceID': invoiceID});
// });

// listen
// const invoiceSection = document.querySelector('#invoice-html');
// ipcRenderer.on('fetch-invoice-reply-channel', (event, args) => {
//     // args is the html
//     // gotta paste this into a html file and show it to the user
//     // console.log(args);
//     invoiceSection.insertAdjacentHTML('beforeend', args);
// });
