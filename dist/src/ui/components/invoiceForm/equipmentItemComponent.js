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

    /**
     * Initializes the component
     */
    init() {
        this.add();
        this.validateFields();
        this.remove();
    }

    /**
     * Adds the equipment-item to the equipmentItem segment
     */
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
    
    /**
     * Syncs the equipment item dates with the value of the provided date fields
     * @param {*} startDateID 
     * @param {*} endDateID 
     */
    syncDatesWith(startDateID, endDateID) {
        const equipmentItemStartDates = document.querySelectorAll(`.${this.startDateID}`);
        const equipmentItemEndDates = document.querySelectorAll(`.${this.endDateID}`);

        const startDate = document.querySelector(startDateID);
        const endDate = document.querySelector(endDateID);

        for (const date of equipmentItemStartDates) {
            date.value = startDate.value;
        }
        
        for (const date of equipmentItemEndDates) {
            date.value = endDate.value;
        }

        startDate.addEventListener('keyup', () => {
            for (const date of equipmentItemStartDates) {
                date.value = startDate.value;
            }
        });

        endDate.addEventListener('keyup', () => {
            for (const date of equipmentItemEndDates) {
                date.value = endDate.value;
            }
        });
    }

    /**
     * Validates all input fields of the equipmentItem segment
     */
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

    /**
     * Sets the html of the component
     */
    setHTML() {
        this.html = `
            <div class="equipment-item">
                <div class="form-group">
                    <span style="display: inherit;">
                        <button type="button" class="btn btn-default equipment-item-rm-btn icon icon-trash"></button>
                    </span>
                    <label>Naam</label>
                    <input name="equipmentItemName" type="text" class="form-control equipment-item-name" placeholder="Naam">
                </divfirstName>
                
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