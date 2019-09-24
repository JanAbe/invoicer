const { ipcRenderer } = require('electron');

ipcRenderer.on('submit-invoice-error-channel', (event, args) => {
    console.log(args);
});

// fetch submitted form data and send to the main process
const createInvoiceBtn = document.querySelector('#create-invoice-btn');
createInvoiceBtn.addEventListener('click', () => {
    let vals = {};
    let equipmentItems = [];
    let cameraman = {};
    const bankSegment = document.querySelector('#bank-account-segment');
    const clientSegment = document.querySelector('#client-segment');
    const jobSegment = document.querySelector('#job-segment');
    const cameramanSegment = document.querySelector('#cameraman-segment');
    const equipmentItemSegments = document.querySelectorAll('.equipment-item');

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

    ipcRenderer.send('submit-invoice-channel', vals);
});

const getJobDateVals = () => {
    const jobStartDateVal = document.querySelector('#job-start-date').value;
    const jodbEndDateVal = document.querySelector('#job-end-date').value;

    return { jobStartDateVal, jodbEndDateVal };
}

// to add extra equipmentItem input fields
const extraEquipmentItemBtn = document.querySelector('#equipment-item-add-btn');
const equipmentItemSegment = document.querySelector('#equipment-item-segment');
const equipmentItemHtmlSegment = `
<div class="equipment-item">
    <div class="two-input-fields">
        <div class="form-group">
            <label>Name</label>
            <input name="equipmentItemName" type="text" class="form-control" placeholder="Name">
        </div>
        
        <div class="form-group">
            <label>Day Price</label>
            <input name="equipmentItemDayPrice" type="number" class="form-control" placeholder="Day Price">
        </div>
    </div>

    <div class="two-input-fields">
        <div class="form-group">
            <label>Start Date</label>
            <input name="equipmentItemStartDate" type="date" class="form-control" placeholder="Start Date">
        </div>

        <div class="form-group">
            <label>End Date</label>
            <input name="equipmentItemEndDate" type="date" class="form-control" placeholder="End Date">
        </div>
    </div>
</div>
`;

extraEquipmentItemBtn.addEventListener('click', () => {
    equipmentItemSegment.insertAdjacentHTML("beforeend", equipmentItemHtmlSegment);
    
    const { jobStartDateVal, jodbEndDateVal } = getJobDateVals();
    const equipmentItemStartDates = document.querySelectorAll('input[name="equipmentItemStartDate"]');
    const equipmentItemEndDates = document.querySelectorAll('input[name="equipmentItemEndDate"]');
    for (let i=0; i < equipmentItemEndDates.length; i++) {
        equipmentItemStartDates[i].value = jobStartDateVal;
        equipmentItemEndDates[i].value = jodbEndDateVal;
        
        syncJobDatesWith('input[name="equipmentItemStartDate"]', 'input[name="equipmentItemEndDate"]');
    }

});


// to add cameraman input fields
let cameremanCounter = 0;
const cameramanBtn = document.querySelector('#cameraman-add-btn');
const cameremanRemoveBtn = document.querySelector('#cameraman-rm-btn');
const cameramanSegment = document.querySelector('#cameraman-segment');
const cameremanHtmlSegment = `
    <div class="two-input-fields">
        <div class="form-group">
            <label>FirstName</label>
            <input id="cameraman-firstName-input" name="firstName" type="text" class="form-control" placeholder="Name">
        </div>

        <div class="form-group">
            <label>LastName</label>
            <input id="cameraman-lastName-input" name="lastName" type="text" class="form-control" placeholder="LastName">
        </div>
    </div>

    <div class="form-group">
        <span style="display: inherit;">
            <button id="cameraman-rm-btn" type="button" class="btn btn-default">&#8722;</button>
            <label>Day Price</label>
        </span>
        <input name="dayPrice" type="number" class="form-control" placeholder="Day Price">
    </div>

    <div class="two-input-fields">
        <div class="form-group">
            <label>Start Date</label>
            <input name="startDate" type="date" class="form-control" placeholder="Start Date">
        </div>

        <div class="form-group">
            <label>End Date</label>
            <input name="endDate" type="date" class="form-control" placeholder="End Date">
        </div>
    </div>
`;

cameramanBtn.addEventListener('click', () => {
    if (++cameremanCounter == 1) {
        cameramanSegment.insertAdjacentHTML("beforeend", cameremanHtmlSegment);
    } 
    const cameramanFirstNameInput = document.querySelector('#cameraman-firstName-input');
    const cameramanLastNameInput = document.querySelector('#cameraman-lastName-input');
    cameramanFirstNameInput.value = localStorage.getItem('firstName');
    cameramanLastNameInput.value = localStorage.getItem('lastName');

    const { jobStartDateVal, jodbEndDateVal } = getJobDateVals();
    const cameramanStartDate = document.querySelector('input[name="startDate"]');
    const cameramanEndDate = document.querySelector('input[name="endDate"]');
    cameramanStartDate.value = jobStartDateVal;
    cameramanEndDate.value = jodbEndDateVal;

    syncJobDatesWith('input[name="startDate"]', 'input[name="endDate"]');
});

const syncJobDatesWith = (startDateID, endDateID) => {
	document.querySelector('#job-start-date').addEventListener('keyup', () => {
        const otherStartDates = document.querySelectorAll(startDateID);
        for (startDate of otherStartDates) {
    		startDate.value = document.querySelector('#job-start-date').value; 
        }
    });

	document.querySelector('#job-end-date').addEventListener('keyup', () => {
        const otherEndDates = document.querySelectorAll(endDateID);
        for (endDate of otherEndDates) {
    		endDate.value = document.querySelector('#job-end-date').value; 
        }
	});
}


const iban = document.querySelector('#iban-input');
iban.value = localStorage.getItem('iban');