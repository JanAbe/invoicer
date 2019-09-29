const { ipcRenderer } = require('electron');

ipcRenderer.on('submit-invoice-reply-channel', (event, args) => {
    console.log(args);
});



const validate = (node, regex) => {
    node.addEventListener('keyup', () => {
        regex.test(node.value) ? node.style.borderColor = '#2ecc71' : node.style.borderColor = '#FF796C';
    });
}

const emailValidator = () => {
    const validationRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const emailInput = document.querySelector('#email-input > input');
    emailInput.addEventListener('keyup', () => {
        const val = emailInput.value;
        validationRegex.test(val) ? emailInput.style.borderColor = '#2ecc71' : emailInput.style.borderColor = '#FF796C';
    });
}

validate(
    document.querySelector('#iban-input'),
    // todo: need regex for iban
);

validate(
    document.querySelector('#client-first-name'),
    /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
);

validate(
    document.querySelector('#client-last-name'),
    /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
);

validate(
    document.querySelector('#client-email'),
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

validate(
    document.querySelector('#city'),
    /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
);

validate(
    document.querySelector('#zipcode'),
    /^\d{4}\s*[a-zA-z]{2}$/
);

validate(
    document.querySelector('#street'),
    /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
);

validate(
    document.querySelector('#house-number'),
    /^[0-9][^\s]*$/
);

validate(
    document.querySelector('#job-description'),
    /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
);

validate(
    document.querySelector('#job-location'),
    /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
);

validate(
    document.querySelector('#job-directed-by'),
    /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
);

validate(
    document.querySelector('#job-start-date'),
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}/
)

validate(
    document.querySelector('#job-end-date'),
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}/
)

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
    <div class="form-group">
        <span style="display: inherit;">
            <button type="button" class="btn btn-default equipment-item-rm-btn icon icon-trash"></button>
        </span>
        <label>Naam</label>
        <input name="equipmentItemName" type="text" class="form-control" placeholder="Naam">
    </div>
    
    <div class="form-group">
        <label>Dagprijs</label>
        <input name="equipmentItemDayPrice" type="number" class="form-control" placeholder="Dagprijs">
    </div>

    <div class="two-input-fields">
        <div class="form-group">
            <label>Begindatum</label>
            <input name="equipmentItemStartDate" type="date" class="form-control" placeholder="Startdatum">
        </div>

        <div class="form-group">
            <label>Einddatum</label>
            <input name="equipmentItemEndDate" type="date" class="form-control" placeholder="Einddatum">
        </div>
    </div>
</div>
`;

extraEquipmentItemBtn.addEventListener('click', () => {
    equipmentItemSegment.insertAdjacentHTML("beforeend", equipmentItemHtmlSegment);
    
    const equipmentItemRemoveBtns = document.querySelectorAll('.equipment-item-rm-btn');

    const { jobStartDateVal, jodbEndDateVal } = getJobDateVals();
    const equipmentItemNames = document.querySelectorAll('input[name="equipmentItemName"]');
    const equipmentItemDayPrices = document.querySelectorAll('input[name="equipmentItemDayPrice"]');
    const equipmentItemStartDates = document.querySelectorAll('input[name="equipmentItemStartDate"]');
    const equipmentItemEndDates = document.querySelectorAll('input[name="equipmentItemEndDate"]');
    for (let i=0; i < equipmentItemEndDates.length; i++) {
        equipmentItemStartDates[i].value = jobStartDateVal;
        equipmentItemEndDates[i].value = jodbEndDateVal;

        removeEquipmentItemFieldsEvent(equipmentItemRemoveBtns[i]);
        validate(
            equipmentItemNames[i],
            /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
        );

        validate(
            equipmentItemDayPrices[i],
            /^[0-9][^\s]*$/
        )

        validate(
            equipmentItemStartDates[i],
            /^[0-9]{4}-[0-9]{2}-[0-9]{2}/
        )

        validate(
            equipmentItemEndDates[i],
            /^[0-9]{4}-[0-9]{2}-[0-9]{2}/
        )
    }

    syncJobDatesWith('input[name="equipmentItemStartDate"]', 'input[name="equipmentItemEndDate"]');
});

const removeEquipmentItemFieldsEvent = (btn) => {
    const parent = btn.parentElement.parentElement.parentElement;
    btn.addEventListener('click', () => {
        parent.remove();
    });
}

// to add cameraman input fields
let cameremanCounter = 0;
const cameramanBtn = document.querySelector('#cameraman-add-btn');
const cameramanSegment = document.querySelector('#cameraman-segment');
const cameremanHtmlSegment = `
    <div class="two-input-fields">
        <div class="form-group">
            <label>Voornaam</label>
            <input id="cameraman-firstName-input" name="firstName" type="text" class="form-control" placeholder="Voornaam" readonly>
        </div>

        <div class="form-group">
            <span style="display: inherit;">
                <button id="cameraman-rm-btn" type="button" class="btn btn-default icon icon-trash"></button>
            </span>
            <label>Achternaam</label>
            <input id="cameraman-lastName-input" name="lastName" type="text" class="form-control" placeholder="Achternaam" readonly>
        </div>
    </div>

    <div class="form-group">
        <label>Dagprijs</label>
        <input id="cameraman-dayPrice" name="dayPrice" type="number" class="form-control" placeholder="Dagprijs">
    </div>

    <div class="two-input-fields">
        <div class="form-group">
            <label>Begindatum</label>
            <input id="cameraman-startDate" name="startDate" type="date" class="form-control" placeholder="Begindatum">
        </div>

        <div class="form-group">
            <label>Einddatum</label>
            <input id="cameraman-endDate" name="endDate" type="date" class="form-control" placeholder="Einddatum">
        </div>
    </div>
`;

cameramanBtn.addEventListener('click', () => {
    if (++cameremanCounter == 1) {
        cameramanSegment.insertAdjacentHTML("beforeend", cameremanHtmlSegment);
    } 

    const cameremanRemoveBtn = document.querySelector('#cameraman-rm-btn');
    removeCameraFieldsEvent(cameremanRemoveBtn);

    validate(
        document.querySelector('#cameraman-firstName-input'),
        /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
    )

    validate(
        document.querySelector('#cameraman-lastName-input'),
        /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/
    )

    validate(
        document.querySelector('#cameraman-dayPrice'),
        /^[0-9][^\s]*$/
    )

    validate(
        document.querySelector('#cameraman-startDate'),
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}/
    )

    validate(
        document.querySelector('#cameraman-endDate'),
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}/
    )

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

/**
 * binds a click event to the provided button to remove the child nodes
 * of the cameramansegment
 */
const removeCameraFieldsEvent = (btn) => {
    btn.addEventListener('click', () => {
        cameremanCounter--;
        while(cameramanSegment.hasChildNodes()) {
            cameramanSegment.removeChild(cameramanSegment.firstChild);
        }
    });
}

/**
 * SyncJobDatesWith syncs the jobDates input fields with the inputfields
 * that are provided. When changing a date in one of the jobDate fields,
 * the provided dateinput fields values, change 
 * @param {css selector for the other startDate input field} startDateID 
 * @param {css selector for the other endDate input field} endDateID 
 */
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