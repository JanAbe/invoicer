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
    invoiceSection.style.margin = 0;
    
    const creationDateSection = document.querySelector('#creation-date');
    creationDateSection.style.gridColumnStart = 4;
    creationDateSection.style.gridColumnEnd = 5;
    creationDateSection.style.textAlign = 'left';
    
    const generalInfoSection = document.querySelector('#general-info');
    generalInfoSection.style.gridColumnStart = 4;
    generalInfoSection.style.gridColumnEnd = 5;
    generalInfoSection.style.textAlign = 'left';

    const paymentInfoSection = document.querySelector('#payment-info');
    paymentInfoSection.style.gridColumnStart = 2;
    paymentInfoSection.style.gridColumnEnd = 4;
}

const showElement = (identifier) => {
    const element = document.querySelector(identifier);
    element.style.display = 'block';

    invoiceSection.style.margin = '20px 10% 20px 10%';
    
    const creationDateSection = document.querySelector('#creation-date');
    creationDateSection.style.gridColumnStart = 2;
    creationDateSection.style.gridColumnEnd = 3;
    creationDateSection.style.textAlign = 'right';
    
    const generalInfoSection = document.querySelector('#general-info');
    generalInfoSection.style.gridColumnStart = 2;
    generalInfoSection.style.gridColumnEnd = 3;
    generalInfoSection.style.textAlign = 'right';
    
    const paymentInfoSection = document.querySelector('#payment-info');
    paymentInfoSection.style.gridColumnStart = 1;
    paymentInfoSection.style.gridColumnEnd = 3;
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