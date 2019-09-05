
const btn = document.querySelector('#equipment-item-add-btn');
const equipmentItemSegment = document.querySelector('#equipment-item-segment');
const htmlSegment = `
<div class="equipment-item">
    <div class="form-group">
        <label>Name</label>
        <input type="text" class="form-control" placeholder="Name">
    </div>

    <div class="form-group">
        <label>Start Date</label>
        <input type="date" class="form-control" placeholder="Start Date">
    </div>

    <div class="form-group">
        <label>End Date</label>
        <input type="date" class="form-control" placeholder="End Date">
    </div>
    
    <div class="form-group">
        <label>Day Price</label>
        <input type="number" class="form-control" placeholder="Day Price">
    </div>
</div>
`;
btn.addEventListener('click', () => {
    equipmentItemSegment.insertAdjacentHTML("beforeend", htmlSegment);
});