const { ipcRenderer } = require('electron');

// todo: refactor client-side js code by using classes
// todo: mirror back-end domain by creating dto's.
    // these can be sent over ipcRender instead of unnamed js-objects

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

const hideElement = (identifier) => {
    const element = document.querySelector(identifier);
    element.style.display = 'none';
    invoiceSection.style.margin = 0;
    
    // todo: look for a cleaner and better way to do this
    // maybe give all these elements another class something like 'printable'
    // hide and show + restyle all elements with this class
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

    const generalUserInfo = document.querySelector('#general-user-info');
    generalUserInfo.style.gridColumnStart = 4;
    generalUserInfo.style.gridColumnEnd = 5;
    generalUserInfo.style.paddingLeft = '0px';
    generalUserInfo.style.justifySelf = 'flex-start';

    const agreement = document.querySelector('#agreement');
    agreement.style.gridColumnStart = 1;
    agreement.style.gridColumnEnd = 5;
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
    
    const generalUserInfo = document.querySelector('#general-user-info');
    generalUserInfo.style.gridColumnStart = 3;
    generalUserInfo.style.gridColumnEnd = 4;
    
    const agreement = document.querySelector('#agreement');
    agreement.style.gridColumnStart = 1;
    agreement.style.gridColumnEnd = 3;
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