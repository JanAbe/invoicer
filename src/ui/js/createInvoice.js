
const extraEquipmentItemBtn = document.querySelector('#equipment-item-add-btn');
const equipmentItemSegment = document.querySelector('#equipment-item-segment');
const equipmentItemHtmlSegment = `
<div class="equipment-item">
    <div class="two-input-fields">
        <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" placeholder="Name">
        </div>
        
        <div class="form-group">
            <label>Day Price</label>
            <input type="number" class="form-control" placeholder="Day Price">
        </div>
    </div>

    <div class="two-input-fields">
        <div class="form-group">
            <label>Start Date</label>
            <input type="date" class="form-control" placeholder="Start Date">
        </div>

        <div class="form-group">
            <label>End Date</label>
            <input type="date" class="form-control" placeholder="End Date">
        </div>
    </div>
</div>
`;

extraEquipmentItemBtn.addEventListener('click', () => {
    equipmentItemSegment.insertAdjacentHTML("beforeend", equipmentItemHtmlSegment);
});


/*
maybe add something like a default value/ settings page
on this page the user can specify things like:
    default name for the cameraman
    default iban for the cameraman
    default dayprice for the cameraman
    default dayprice for equipmentItems
this info gets stored in the localstorage
*/
let cameremanCounter = 0;
const camermanBtn = document.querySelector('#cameraman-add-btn');
const cameramanSegment = document.querySelector('#cameraman-segment');
const cameremanHtmlSegment = `
    <div class="two-input-fields">
        <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" placeholder="Name" value="Bob Baker">
        </div>
        
        <div class="form-group">
            <label>Day Price</label>
            <input type="number" class="form-control" placeholder="Day Price">
        </div>
    </div>

    <div class="two-input-fields">
        <div class="form-group">
            <label>Start Date</label>
            <input type="date" class="form-control" placeholder="Start Date">
        </div>
        
        <div class="form-group">
            <label>End Date</label>
            <input type="date" class="form-control" placeholder="End Date">
        </div>
    </div>
`;

camermanBtn.addEventListener('click', () => {
    if (++cameremanCounter == 1) {
        cameramanSegment.insertAdjacentHTML("beforeend", cameremanHtmlSegment);
    } 
});