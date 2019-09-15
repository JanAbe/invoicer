const { ipcRenderer } = require('electron');

const invoiceSection = document.querySelector('#invoice-section');
ipcRenderer.on('generate-invoice-reply-channel', (_, html) => {
    while (invoiceSection.hasChildNodes()) {
        invoiceSection.removeChild(invoiceSection.lastChild);
    }
    invoiceSection.insertAdjacentHTML('beforeend', html);
});

const hideElement = (class_) => {
    const element = document.querySelector(class_);
    element.style.display = 'none';
}

const showElement = (class_) => {
    const element = document.querySelector(class_);
    element.style.display = 'block';
}

const hideElements = (classes) => {
    for (const class_ of classes) {
        hideElement(class_);
    }
}

const showElements = (classes) => {
    for (const class_ of classes) {
        showElement(class_);
    }
}

/**
 * listenForPrintEvent listens for the user to
 * fire the print command by typing ctrl+p or command+p
 */
// this only works if someone presses ctrl+p
    // and saves the document
    // if cancel is pressed ctrl+p doesn't work anymore
    // and the sidebar doesn't get shown again
const listenForPrintEvent = () => {
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            hideElements(['.sidebar', '.toolbar']);
            window.print();
        }
        showElements(['.sidebar', '.toolbar']);
    });
}

// todo: add button to print page to pdf as alternative to ctrl+p

listenForPrintEvent();