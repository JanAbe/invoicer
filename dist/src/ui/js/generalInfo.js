const btn = document.querySelector('#save-general-info-btn');
const firstName = document.querySelector('#firstName-input');
const lastName = document.querySelector('#lastName-input');
const iban = document.querySelector('#iban-input');

firstName.value = localStorage.getItem('firstName');
lastName.value = localStorage.getItem('lastName');
iban.value = localStorage.getItem('iban');

btn.addEventListener('click', () => {
    localStorage.setItem('firstName', firstName.value);
    localStorage.setItem('lastName', lastName.value);
    localStorage.setItem('iban', iban.value);
});