
class CameramanComponent {
    constructor() {
        this.counter = 0; // necessary to make sure only one cameraman segment is present at max
        this.id = 'cameraman-segment';
        this.firstNameFieldID = 'cameraman-first-name';
        this.lastNameFieldID = 'cameraman-last-name';
        this.dayPriceFieldID = 'cameraman-day-price';
        this.startDateFieldID = 'cameraman-start-date';
        this.endDateFieldID = 'cameraman-end-date';
        this.removeButtonID = 'cameraman-rm-btn';
    }

    /**
     * Readies the component. Should be executed when the 
     * invoice form is already added to the page. 
     */
    init() {
        this.add();
        this.preFillNameFields('firstName', 'lastName');
        this.validateFields();
        this.remove();
    }

    /**
     * Adds the cameraman component html to the cameraman segment,
     * if it isn't already present on the page.
     */
    add() {
        if (++this.counter !== 1) {
            return;
        }
        this.setHTML();
        const cameramanSegment = document.querySelector(`#${this.id}`);
        cameramanSegment.insertAdjacentHTML('beforeend', this.html);
    }

    /**
     * Prefills the firstName and lastName fields
     * with the values present in localstorage
     * @param {localstorage key of firstname} key1 
     * @param {localstorage key of lastname} key2 
     */
    preFillNameFields(key1, key2) {
        document.querySelector(`#${this.firstNameFieldID}`).value = localStorage.getItem(key1);
        document.querySelector(`#${this.lastNameFieldID}`).value = localStorage.getItem(key2);
    }

    /**
     * Removes all fields within the cameramanSegment when the remove cameraman
     * button is pressed.
     */
    remove() {
        const removeButton = document.querySelector(`#${this.removeButtonID}`);
        removeButton.addEventListener('click', () => {
            this.counter--;
            const cameramanSegment = document.querySelector(`#${this.id}`);
            while (cameramanSegment.hasChildNodes()) {
                cameramanSegment.removeChild(cameramanSegment.firstChild);
            }
        });
    }

    /**
     * Syncs the cameraman dates with the value of the provided date fields
     * @param {*} startDateID 
     * @param {*} endDateID 
     */
    syncDatesWith(startDateID, endDateID) {
        const cameramanStartDate = document.querySelector(`#${this.startDateFieldID}`);
        const cameramanEndDate = document.querySelector(`#${this.endDateFieldID}`);

        const startDate = document.querySelector(startDateID);
        const endDate = document.querySelector(endDateID);

        cameramanStartDate.value = startDate.value;
        cameramanEndDate.value = endDate.value;

        startDate.addEventListener('keyup', () => {
            cameramanStartDate.value = startDate.value; 
        });

        endDate.addEventListener('keyup', () => {
            cameramanEndDate.value = endDate.value;
        });
    }

    /**
     * Validates input fields of the cameraman component
     */
    validateFields() {
        const firstName = document.querySelector(`#${this.firstNameFieldID}`);
        const lastName = document.querySelector(`#${this.lastNameFieldID}`);
        const dayPrice = document.querySelector(`#${this.dayPriceFieldID}`);
        const startDate = document.querySelector(`#${this.startDateFieldID}`);
        const endDate = document.querySelector(`#${this.endDateFieldID}`);

        validate(firstName, /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
        validate(lastName, /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
        validate(dayPrice, /^[0-9][^\s]*$/);
        validate(startDate, /^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        validate(endDate, /^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
    }

    /**
     * Sets the html of this component
     */
    setHTML() {
        this.html = `
            <div class="two-input-fields">
                <div class="form-group">
                    <label>Voornaam</label>
                    <input id="${this.firstNameFieldID}" name="firstName" type="text" class="form-control" placeholder="Voornaam" readonly>
                </div>

                <div class="form-group">
                    <span style="display: inherit;">
                        <button id="${this.removeButtonID}" type="button" class="btn btn-default icon icon-trash"></button>
                    </span>
                    <label>Achternaam</label>
                    <input id="${this.lastNameFieldID}" name="lastName" type="text" class="form-control" placeholder="Achternaam" readonly>
                </div>
            </div>

            <div class="form-group">
                <label>Dagprijs</label>
                <input id="${this.dayPriceFieldID}" name="dayPrice" type="number" class="form-control" placeholder="Dagprijs">
            </div>

            <div class="two-input-fields">
                <div class="form-group">
                    <label>Begindatum</label>
                    <input id="${this.startDateFieldID}" name="startDate" type="date" class="form-control" placeholder="Begindatum">
                </div>

                <div class="form-group">
                    <label>Einddatum</label>
                    <input id="${this.endDateFieldID}" name="endDate" type="date" class="form-control" placeholder="Einddatum">
                </div>
            </div>
        `
    }
}