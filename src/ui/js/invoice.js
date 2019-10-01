const { ipcRenderer } = require('electron');

const invoiceSection = document.querySelector('#invoice-section');
ipcRenderer.on('generate-invoice-reply-channel', (_, html) => {
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