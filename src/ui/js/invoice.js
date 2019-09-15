const { ipcRenderer } = require('electron');

// todo: refactor client-side js code by using classes
// todo: mirror back-end domain by creating dto's.
    // these can be sent over ipcRender instead of unnamed js-objects

const invoiceSection = document.querySelector('#invoice-section');
ipcRenderer.on('generate-invoice-reply-channel', (_, html) => {
    while (invoiceSection.hasChildNodes()) {
        invoiceSection.removeChild(invoiceSection.lastChild);
    }
    invoiceSection.insertAdjacentHTML('afterbegin', html);
});

const hideElement = (identifier) => {
    const element = document.querySelector(identifier);
    element.style.display = 'none';
}

const showElement = (identifier) => {
    const element = document.querySelector(identifier);
    element.style.display = 'block';
}

const hideElements = (identifiers) => {
    for (const identifier of identifiers) {
        hideElement(identifier);
    }
}

const showElements = (identifiers) => {
    for (const identifier of identifiers) {
        showElement(identifier);
    }
}

/**
 * listenForPrintEvent listens for the user to
 * fire the print command by typing ctrl+p or command+p
 * or by pressing the print-button
 */
// todo: fix this this only works if someone presses ctrl+p
    // and saves the document
    // if cancel is pressed ctrl+p doesn't work anymore
    // and the sidebar doesn't get shown again
const listenForPrintEvent = () => {
    listenForPrintButtonPressed('#print-btn', ['#print-btn', '.sidebar', '.toolbar']);
    listenForCtrlPKeysPressed(['#print-btn', '.sidebar', '.toolbar']);
}

const listenForCtrlPKeysPressed = (identifiers) => {
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            hideElements(identifiers);
            window.print();
        }
        showElements(identifiers);
    });
}

const listenForPrintButtonPressed = (btnID, identifiers) => {
    const printBtn = document.querySelector(btnID);
    printBtn.addEventListener('click', () => {
        hideElements(identifiers);
        window.print();
        showElements(identifiers);
    });
}

listenForPrintEvent();