const { ipcRenderer } = require('electron');

console.log('hi');
const body = document.querySelector('body');
ipcRenderer.on('fetch-invoice-reply-channel', (_, html) => {
    console.log('received');
    body.insertAdjacentHTML('afterbegin', html);
});