const { ipcRenderer } = require('electron');

const btn = document.querySelector('#save-btn');
const firstName = document.querySelector('#first-name-input');
const lastName = document.querySelector('#last-name-input');
const iban = document.querySelector('#iban-input');
const companyName = document.querySelector('#company-name-input');
const jobTitle = document.querySelector('#job-title-input');
const bankAccountNr = document.querySelector('#bank-account-nr-input');
const phoneNr = document.querySelector('#phone-nr-input');
const mobileNr = document.querySelector('#mobile-nr-input');
const email = document.querySelector('#email-input');
const cocNr = document.querySelector('#coc-input');
const vatNr = document.querySelector('#vat-id-nr-input');
const varNr = document.querySelector('#var-nr-input');
const city = document.querySelector('#city-input');
const zipcode = document.querySelector('#zipcode-input');
const street = document.querySelector('#street-input');
const houseNr = document.querySelector('#house-nr-input');
const id = document.querySelector('#user-id');

firstName.value = localStorage.getItem('firstName');
lastName.value = localStorage.getItem('lastName');
iban.value = localStorage.getItem('iban');
companyName.value = localStorage.getItem('companyName');
jobTitle.value = localStorage.getItem('jobTitle');
bankAccountNr.value = localStorage.getItem('bankAccountNr');
phoneNr.value = localStorage.getItem('phoneNr');
mobileNr.value = localStorage.getItem('mobileNr');
email.value = localStorage.getItem('email');
cocNr.value = localStorage.getItem('cocNr');
vatNr.value = localStorage.getItem('vatNr');
varNr.value = localStorage.getItem('varNr');
city.value = localStorage.getItem('city');
zipcode.value = localStorage.getItem('zipcode');
street.value = localStorage.getItem('street');
houseNr.value = localStorage.getItem('houseNr');

btn.addEventListener('click', () => {
    localStorage.setItem('firstName', firstName.value);
    localStorage.setItem('lastName', lastName.value);
    localStorage.setItem('iban', iban.value);
    localStorage.setItem('iban', iban.value);
    localStorage.setItem('companyName', companyName.value);
    localStorage.setItem('jobTitle', jobTitle.value);
    localStorage.setItem('bankAccountNr', bankAccountNr.value);
    localStorage.setItem('phoneNr', phoneNr.value);
    localStorage.setItem('mobileNr', mobileNr.value);
    localStorage.setItem('email', email.value);
    localStorage.setItem('cocNr', cocNr.value);
    localStorage.setItem('vatNr', vatNr.value);
    localStorage.setItem('varNr', varNr.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('zipcode', zipcode.value);
    localStorage.setItem('street', street.value);
    localStorage.setItem('houseNr', houseNr.value);
    localStorage.setItem('id', id.value);

    let userinfo = {};
    userinfo[id.name] = id.value;
    userinfo[firstName.name] = firstName.value;
    userinfo[lastName.name] = lastName.value;
    userinfo[iban.name] = iban.value;
    userinfo[companyName.name] = companyName.value;
    userinfo[jobTitle.name] = jobTitle.value;
    userinfo[bankAccountNr.name] = bankAccountNr.value;
    userinfo[phoneNr.name] = phoneNr.value;
    userinfo[mobileNr.name] = mobileNr.value;
    userinfo[email.name] = email.value;
    userinfo[cocNr.name] = cocNr.value;
    userinfo[vatNr.name] = vatNr.value;
    userinfo[varNr.name] = varNr.value;
    userinfo[city.name] = city.value;
    userinfo[zipcode.name] = zipcode.value;
    userinfo[street.name] = street.value;
    userinfo[houseNr.name] = houseNr.value;

    ipcRenderer.send('submit-user-channel', userinfo);
});

ipcRenderer.on('submit-user-reply-channel', (_, userID) => {
    id.value = userID;
});