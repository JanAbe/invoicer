class InvoiceComponent {
    constructor() {
        this.parentID = 'invoice-form-parent';
        this.ibanID = 'iban';
        this.clientFirstNameID = 'client-first-name';
        this.clientLastNameID = 'client-last-name';
        this.clientEmailID = 'client-email';
        this.clientCityID = 'client-city';
        this.clientZipcodeID = 'client-zipcode';
        this.clientStreetID = 'client-street';
        this.clientHouseNumberID = 'client-house-number';
        this.jobDescriptionID = 'job-description';
        this.jobLocationID = 'job-location';
        this.jobDirectedByID = 'job-directed-by';
        this.jobStartDateID = 'job-start-date';
        this.jobEndDateID = 'job-end-date';
        this.addCameramanID = 'cameraman-add-btn';
        this.addEquipmentItemID = 'equipment-item-add-btn';
        this.createInvoiceID = 'create-invoice-btn';
        this.cancelID = 'cancel-btn';
        this.cameramanComponent = new CameramanComponent();
        this.equipmentItemComponent = new EquipmentItemComponent();
    }

    /**
     * initializes the invoiceForm component
     */
    init() {
        this.add();
        this.validateFields();
        this.preFillIBAN();
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

    /**
     * Adds the cameraman segment when the addCameramanButton is pressed
     */
    addCameramanSegment() {
        const addCameramanBtn = document.querySelector(`#${this.addCameramanID}`);
        addCameramanBtn.addEventListener('click', () => {
            this.cameramanComponent.init();
            this.cameramanComponent.syncDatesWith(`#${this.jobStartDateID}`, `#${this.jobEndDateID}`);
        });
    }

    /**
     * Adds the equipmentItem segment when the addEquipmentItemButton is pressed
     */
    addEquipmentItemSegment() {
        const addEquipmentItemBtn = document.querySelector(`#${this.addEquipmentItemID}`);
        addEquipmentItemBtn.addEventListener('click', () => {
            this.equipmentItemComponent.init();
            this.equipmentItemComponent.syncDatesWith(`#${this.jobStartDateID}`, `#${this.jobEndDateID}`);
        });
    }

    /**
     * Creates an object containing all necessary invoice data 
     */
    create() {
        let invoice = {};
        let equipmentItems = [];
        let cameraman = {};
        const bankSegment = document.querySelector('#bank-account-segment');
        const clientSegment = document.querySelector('#client-segment');
        const jobSegment = document.querySelector('#job-segment');
        const cameramanSegment = document.querySelector('#cameraman-segment');
        const equipmentItemSegments = document.querySelectorAll('.equipment-item');

        const bankInputs = bankSegment.querySelectorAll('input');
        for (const input of bankInputs) {
            invoice[input.name] = input.value;
        }

        const clientInputs = clientSegment.querySelectorAll('input');
        for (const input of clientInputs) {
            invoice[input.name] = input.value;
        }

        const jobInputs = jobSegment.querySelectorAll('input');
        for (const input of jobInputs) {
            invoice[input.name] = input.value;
        }

        const cameraInputs = cameramanSegment.querySelectorAll('input');
        for (const input of cameraInputs) {
            cameraman[input.name] = input.value;
        }

        for (const item of equipmentItemSegments) {
            let equipmentItem = {}
            const inputFields = item.querySelectorAll('input');
            for (const input of inputFields) {
                equipmentItem[input.name] = input.value;
            }
            equipmentItems.push(equipmentItem);
        }

        if (Object.keys(cameraman).length !== 0) {
            invoice['cameraman'] = cameraman;
        }

        if (Object.keys(equipmentItems).length !== 0) {
            invoice['equipmentItems'] = equipmentItems;
        }

        return invoice;
    }

    /**
     * Prefills the iban field
     */
    preFillIBAN() {
        const iban = document.querySelector(`#${this.ibanID}`);
        iban.value = localStorage.getItem('iban');
    }

    /**
     * Validates the input fields of the invoice component
     */
    validateFields() {
        const iban = document.querySelector(`#${this.ibanID}`);
        const clientFirstName = document.querySelector(`#${this.clientFirstNameID}`);
        const clientLastName = document.querySelector(`#${this.clientLastNameID}`);
        const clientEmail = document.querySelector(`#${this.clientEmailID}`);
        const clientCity = document.querySelector(`#${this.clientCityID}`);
        const clientZipcode = document.querySelector(`#${this.clientZipcodeID}`);
        const clientStreet = document.querySelector(`#${this.clientStreetID}`);
        const clientHouseNumber = document.querySelector(`#${this.clientHouseNumberID}`);
        const jobDescription = document.querySelector(`#${this.jobDescriptionID}`);
        const jobLocation = document.querySelector(`#${this.jobLocationID}`);
        const jobDirectedBy = document.querySelector(`#${this.jobDirectedByID}`);
        const jobStartDate = document.querySelector(`#${this.jobStartDateID}`);
        const jobEndDate = document.querySelector(`#${this.jobEndDateID}`);

        validate(iban, );
        validate(clientFirstName, /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
        validate(clientLastName, /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
        validate(clientEmail, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        validate(clientCity, /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
        validate(clientZipcode, /^\d{4}\s*[a-zA-z]{2}$/);
        validate(clientStreet, /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
        validate(clientHouseNumber, /^[0-9][^\s]*$/);
        validate(jobDescription, /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
        validate(jobLocation, /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
        validate(jobDirectedBy, /^[a-zA-Z][^\s]*[\s|a-zA-Z]*?$/);
        validate(jobStartDate, /^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        validate(jobEndDate, /^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
    }

    /**
     * Sets the html of this component
     */
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
                            <input id="${this.ibanID}" name='iban' type="text" class="form-control"
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
                                <input id="${this.clientFirstNameID}" name="firstName" type="text" class="form-control"
                                    placeholder="Voornaam">
                            </div>
                            <div class="form-group">
                                <label>Achternaam</label>
                                <input id="${this.clientLastNameID}" name="lastName" type="text" class="form-control" placeholder="Achternaam">
                            </div>
                        </div>

                        <div id="email-input" class="form-group">
                            <label>Email</label>
                            <input id="${this.clientEmailID}" name="email" type="email" class="form-control" placeholder="email">
                        </div>

                        <div class="two-input-fields">
                            <div class="form-group">
                                <label>Stad</label>
                                <input id="${this.clientCityID}" name="city" type="text" class="form-control" placeholder="Stad">
                            </div>
                            <div class="form-group">
                                <label>Postcode</label>
                                <input id="${this.clientZipcodeID}" name="zipcode" type="text" class="form-control" placeholder="Postcode">
                            </div>
                        </div>

                        <div class="two-input-fields">
                            <div class="form-group">
                                <label>Straatnaam</label>
                                <input id="${this.clientStreetID}" name="street" type="text" class="form-control" placeholder="Straatnaam">
                            </div>
                            <div class="form-group">
                                <label>Huisnummer</label>
                                <input id="${this.clientHouseNumberID}" name="houseNumber" type="number" class="form-control"
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
                            <input id="${this.jobDescriptionID}" name="description" type="text" class="form-control"
                                placeholder="Omschrijving">
                        </div>

                        <div class="two-input-fields">
                            <div class="form-group">
                                <label>Locatie</label>
                                <input id="${this.jobLocationID}" name="location" type="text" class="form-control" placeholder="Locatie">
                            </div>

                            <div class="form-group">
                                <label>Regie</label>
                                <input id="${this.jobDirectedByID}" name="directedBy" type="text" class="form-control"
                                    placeholder="Regie">
                            </div>
                        </div>

                        <div class="two-input-fields">
                            <div class="form-group">
                                <label>Begindatum</label>
                                <input id="${this.jobStartDateID}" name="jobStartDate" type="date" class="form-control"
                                    placeholder="Begindatum">
                            </div>

                            <!-- todo: change front-end date input field format to DD/MM/YYYY from MM/DD/YYYY -->
                            <div class="form-group">
                                <label>Einddatum</label>
                                <input id="${this.jobEndDateID}" name="jobEndDate" type="date" class="form-control"
                                    placeholder="Einddatum">
                            </div>
                        </div>
                    </div>

                    <div id="cameraman-segment-title">
                        <span style="display: inherit;">
                            <button id="${this.addCameramanID}" type="button"
                                class="btn btn-default icon icon-right"></button>
                            <h5><strong>Cameraman</strong></h5>
                        </span>
                    </div>

                    <div id="cameraman-segment">
                    </div>

                    <div id="equipment-item-segment-title">
                        <span style="display: inherit;">
                            <button id="${this.addEquipmentItemID}" type="button"
                                class="btn btn-default icon icon-right"></button>
                            <h5><strong>Apparatuur</strong></h5>
                        </span>
                    </div>

                    <div id="equipment-item-segment">
                    </div>

                    <div id="button-segment">
                        <div class="form-group">
                            <div id="btn-wrapper" class="form-actions">
                                <a href="./invoices.html" id="${this.cancelID}" type="submit" class="btn btn-form btn-default">Cancel</a>
                                <a href="./invoices.html" id="${this.createInvoiceID}" 
                                    class="btn btn-form btn-primary">Create</a>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `
    }
}