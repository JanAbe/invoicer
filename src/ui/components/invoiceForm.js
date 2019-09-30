
class InvoiceFormComponent {
    constructor() {
        this.parentID = 'invoice-form-parent';
        this.addCameramanID = 'cameraman-add-btn';
        this.addEquipmentItemID = 'equipment-item-add-btn';
        this.cameramanComponent = new CameramanComponent();
        this.equipmentItemComponent = new EquipmentItemComponent();
    }

    init() {
        this.add();
        this.addCameramanSegment();
        this.addEquipmentItemSegment();
    }

    /**
     * Adds the invoice form to the parent
     */
    add() {
        this.setHTML();
        const parent = document.querySelector(`#${this.parentID}`);
        parent.insertAdjacentHTML('afterbegin', this.html);
    }

    addCameramanSegment() {
        const addCameramanBtn = document.querySelector(`#${this.addCameramanID}`);
        addCameramanBtn.addEventListener('click', () => {
            this.cameramanComponent.init();
        });
    }

    addEquipmentItemSegment() {
        const addEquipmentItemBtn = document.querySelector(`#${this.addEquipmentItemID}`);
        addEquipmentItemBtn.addEventListener('click', () => {
            this.equipmentItemComponent.init();
        });
    }

    setHTML() {
        this.html = `
            <form>
                <div class="container">
                    <div id="form-title">
                        <h3>Create Invoice</h3>
                    </div>

                    <div id="bank-account-segment-title">
                        <h5><strong>IBAN</strong></h5>
                    </div>
                    <div id="bank-account-segment">
                        <div class="form-group">
                            <label>IBAN</label>
                            <input id="iban-input" name='iban' type="text" class="form-control"
                                placeholder="IBAN">
                        </div>
                    </div>

                    <div id="client-segment-title">
                        <h5><strong>Klantgegevens</strong></h5>
                    </div>
                    <div id="client-segment">
                        <div class="two-input-fields">
                            <div class="form-group">
                                <label>Voornaam</label>
                                <input id="client-first-name" name="firstName" type="text" class="form-control"
                                    placeholder="Voornaam">
                            </div>
                            <div class="form-group">
                                <label>Achternaam</label>
                                <input id="client-last-name" name="lastName" type="text" class="form-control" placeholder="Achternaam">
                            </div>
                        </div>

                        <div id="email-input" class="form-group">
                            <label>Email</label>
                            <input id="client-email" name="email" type="email" class="form-control" placeholder="email">
                        </div>

                        <div class="two-input-fields">
                            <div class="form-group">
                                <label>Stad</label>
                                <input id="city" name="city" type="text" class="form-control" placeholder="Stad">
                            </div>
                            <div class="form-group">
                                <label>Postcode</label>
                                <input id="zipcode" name="zipcode" type="text" class="form-control" placeholder="Postcode">
                            </div>
                        </div>

                        <div class="two-input-fields">
                            <div class="form-group">
                                <label>Straatnaam</label>
                                <input id="street" name="street" type="text" class="form-control" placeholder="Straatnaam">
                            </div>
                            <div class="form-group">
                                <label>Huisnummer</label>
                                <input id="house-number" name="houseNumber" type="number" class="form-control"
                                    placeholder="Huisnummer">
                            </div>
                        </div>
                    </div>

                    <div id="job-segment-title">
                        <h5><strong>Werk/Opdracht gegevens</strong></h5>
                    </div>

                    <div id="job-segment">
                        <div class="form-group">
                            <label>Omschrijving</label>
                            <input id="job-description" name="description" type="text" class="form-control"
                                placeholder="Omschrijving">
                        </div>

                        <div class="two-input-fields">
                            <div class="form-group">
                                <label>Locatie</label>
                                <input id="job-location" name="location" type="text" class="form-control" placeholder="Locatie">
                            </div>

                            <div class="form-group">
                                <label>Regie</label>
                                <input id="job-directed-by" name="directedBy" type="text" class="form-control"
                                    placeholder="Regie">
                            </div>
                        </div>

                        <div class="two-input-fields">
                            <div class="form-group">
                                <label>Begindatum</label>
                                <input id="job-start-date" name="jobStartDate" type="date" class="form-control"
                                    placeholder="Begindatum">
                            </div>

                            <!-- todo: change front-end date input field format to DD/MM/YYYY from MM/DD/YYYY -->
                            <div class="form-group">
                                <label>Einddatum</label>
                                <input id="job-end-date" name="jobEndDate" type="date" class="form-control"
                                    placeholder="Einddatum">
                            </div>
                        </div>
                    </div>

                    <div id="cameraman-segment-title">
                        <span style="display: inherit;">
                            <button id="cameraman-add-btn" type="button"
                                class="btn btn-default icon icon-right"></button>
                            <h5><strong>Cameraman</strong></h5>
                        </span>
                    </div>

                    <div id="cameraman-segment">
                    </div>

                    <div id="equipment-item-segment-title">
                        <span style="display: inherit;">
                            <button id="equipment-item-add-btn" type="button"
                                class="btn btn-default icon icon-right"></button>
                            <h5><strong>Apparatuur</strong></h5>
                        </span>
                    </div>

                    <div id="equipment-item-segment">
                    </div>

                    <div id="button-segment">
                        <div class="form-group">
                            <div id="btn-wrapper" class="form-actions">
                                <a href="./invoices.html" id="cancel-btn" type="submit" class="btn btn-form btn-default">Cancel</a>
                                <a href="./invoices.html" id="create-invoice-btn" 
                                    class="btn btn-form btn-primary">Create</a>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `
    }
}

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

    setHTML() {
        this.html = `
            <div class="two-input-fields">
                <div class="form-group">
                    <label>Voornaam</label>
                    <input id=${this.firstNameFieldID} name="firstName" type="text" class="form-control" placeholder="Voornaam" readonly>
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

class EquipmentItemComponent {
    constructor() {
        this.counter = 0; // to keep track how many equipment-items there are
        this.id = 'equipment-item-segment';
        this.nameID = 'equipment-item-name';
        this.dayPriceID = 'equipment-item-day-price';
        this.startDateID = 'equipment-item-start-date';
        this.endDateID =  'equipment-item-end-date';
        this.removeButtonID = 'equipment-item-rm-btn';
    }

    init() {
        this.add();
        this.validateFields();
        this.remove();
    }

    add() {
        this.setHTML();
        const equipmentItemSegment = document.querySelector(`#${this.id}`);
        equipmentItemSegment.insertAdjacentHTML('afterbegin', this.html);
        this.counter++;
    }

    /**
     * Binds a click event to all remove equipment items
     * respectively and removes this equipmentItem when clicked
     */
    remove() {
        const { removeButtons } = this.getAllElements();
        for(let i=0; i<this.counter; i++) {
            const parent = removeButtons[i].parentElement.parentElement.parentElement;
            removeButtons[i].addEventListener('click', () => {
                parent.remove();
                this.counter--;
            });
        }
    }

    validateFields() {
        const { names, dayPrices, startDates, endDates } = this.getAllElements();
        for (let i=0; i<this.counter; i++) {
            validate(names[i], /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
            validate(dayPrices[i], /^[0-9][^\s]*$/);
            validate(startDates[i], /^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
            validate(endDates[i], /^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        }
    }

    /**
     * Gets all the elements present in the equipmentItemSegment
     */
    getAllElements() {
        const names = document.querySelectorAll(`.${this.nameID}`);
        const dayPrices = document.querySelectorAll(`.${this.dayPriceID}`);
        const startDates = document.querySelectorAll(`.${this.startDateID}`);
        const endDates = document.querySelectorAll(`.${this.endDateID}`);
        const removeButtons = document.querySelectorAll(`.${this.removeButtonID}`);

        return { names, dayPrices, startDates, endDates, removeButtons };
    }

    setHTML() {
        this.html = `
            <div class="equipment-item">
                <div class="form-group">
                    <span style="display: inherit;">
                        <button type="button" class="btn btn-default equipment-item-rm-btn icon icon-trash"></button>
                    </span>
                    <label>Naam</label>
                    <input name="equipmentItemName" type="text" class="form-control equipment-item-name" placeholder="Naam">
                </div>
                
                <div class="form-group">
                    <label>Dagprijs</label>
                    <input name="equipmentItemDayPrice" type="number" class="form-control equipment-item-day-price" placeholder="Dagprijs">
                </div>

                <div class="two-input-fields">
                    <div class="form-group">
                        <label>Begindatum</label>
                        <input name="equipmentItemStartDate" type="date" class="form-control equipment-item-start-date" placeholder="Startdatum">
                    </div>

                    <div class="form-group">
                        <label>Einddatum</label>
                        <input name="equipmentItemEndDate" type="date" class="form-control equipment-item-end-date" placeholder="Einddatum">
                    </div>
                </div>
            </div>
        `
        
    }

}