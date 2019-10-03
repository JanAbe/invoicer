const { ipcRenderer } = require('electron');

const invoiceSection = document.querySelector('#invoice-section');
ipcRenderer.on('fetch-one-invoice-reply-channel', (_, html) => {
    while (invoiceSection.hasChildNodes()) {
        if (invoiceSection.firstChild.id === 'update-btn-wrapper') {
            break;
        }
        invoiceSection.removeChild(invoiceSection.firstChild);
    }

    invoiceSection.insertAdjacentHTML('afterbegin', html);
});


// om een of andere reden wordt deze handeling meerdere keren uitgevoerd
// als er 1x op de update-knop wordt gedrukt.
const listenForUpdateButtonPressed = (btnID) => {
    const updateBtn = document.querySelector(btnID);
    updateBtn.addEventListener('click', () => {
        let vals = {};
        let equipmentItems = [];
        let cameraman = {};
        const bankSegment = document.querySelector('#bank-account-segment');
        const clientSegment = document.querySelector('#client-segment');
        const jobSegment = document.querySelector('#job-segment');
        const cameramanSegment = document.querySelector('#cameraman-segment');
        const equipmentItemSegments = document.querySelectorAll('.equipment-item');

        vals['invoiceID'] = document.querySelector('#invoice-id').value;
        vals['invoiceNumber'] = document.querySelector('#invoice-number').value;
        vals['clientID'] = document.querySelector('#client-id').value;

        const bankInputs = bankSegment.querySelectorAll('input');
        for (input of bankInputs) {
            vals[input.name] = input.value;
        }

        const clientInputs = clientSegment.querySelectorAll('input');
        for (input of clientInputs) {
            vals[input.name] = input.value;
        }

        const jobInputs = jobSegment.querySelectorAll('input');
        for (input of jobInputs) {
            vals[input.name] = input.value;
        }

        const cameraInputs = cameramanSegment.querySelectorAll('input');
        for (input of cameraInputs) {
            cameraman[input.name] = input.value;
        }

        for (item of equipmentItemSegments) {
            let equipmentItem = {}
            inputFields = item.querySelectorAll('input');
            for (input of inputFields) {
                equipmentItem[input.name] = input.value;
            }
            equipmentItems.push(equipmentItem);
        }

        if (Object.keys(cameraman).length !== 0) {
            vals['cameraman'] = cameraman;
        }

        if (Object.keys(equipmentItems).length !== 0) {
            vals['equipmentItems'] = equipmentItems;
        }

        ipcRenderer.send('update-invoice-channel', vals);
    });
}

listenForUpdateButtonPressed('#update-btn');