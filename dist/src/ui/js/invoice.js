const { ipcRenderer } = require('electron');

// todo: refactor client-side js code by using classes
// todo: mirror back-end domain by creating dto's.
    // these can be sent over ipcRender instead of unnamed js-objects

const invoiceSection = document.querySelector('#invoice-section');
ipcRenderer.on('generate-invoice-reply-channel', (_, html) => {
    console.log(html);
    while (invoiceSection.hasChildNodes()) {
        if (invoiceSection.firstChild.id === 'print-btn-wrapper') {
            break;
        }
        invoiceSection.removeChild(invoiceSection.firstChild);
    }

    invoiceSection.insertAdjacentHTML('afterbegin', html);
});

/**
 * listenForPrintEvent listens for the user to
 * fire the print command by typing ctrl+p or command+p
 * or by pressing the print-button
 */
// todo: fix this. It only works if someone presses ctrl+p
    // and saves the document.
    // If cancel is pressed ctrl+p doesn't work anymore
    // and the sidebar doesn't get shown again
const listenForPrintEvent = () => {
    listenForPrintButtonPressed('#print-btn');
    listenForCtrlPKeysPressed();
}

const listenForCtrlPKeysPressed = () => {
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            window.print();
        }
    });
}

const listenForPrintButtonPressed = (btnID) => {
    const printBtn = document.querySelector(btnID);
    printBtn.addEventListener('click', () => {
        window.print();
    });
}

listenForPrintEvent();