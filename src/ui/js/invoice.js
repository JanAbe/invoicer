const { ipcRenderer } = require('electron');

const body = document.querySelector('body');
ipcRenderer.on('generate-invoice-reply-channel', (_, html) => {
    body.insertAdjacentHTML('afterbegin', html);
});