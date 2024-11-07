import { showAlert, validateFields, addClassFromId, removeClassFromId } from './functions';
import { urlUsers, urlOffices, urlDepartments, login, createRecord, getRecords } from './API';
import router from './routes';

// Variables
const formLogin = document.querySelector('#form-login');
const formUserSignUp = document.querySelector('#form-user-sign-up');
const formOfficeSignUp = document.querySelector('#form-office-sign-up');
const loginLinkFromUserSignUp = document.querySelector('#login-link-from-user-sign-up');
const loginLinkFromOfficeSignUp = document.querySelector('#login-link-from-office-sign-up');
const signUpLink = document.querySelector('#sign-up-link');
const userSignUpLink = document.querySelector('#user-sign-up-link');
const officeSignUpLink = document.querySelector('#office-sign-up-link');
const returnLinkToLoginForm = document.querySelector('#return-link-to-login-form');
const userSignUpLinkToSelectSignUpForm = document.querySelector('#user-return-link-to-select-sign-up-form');
const officeReturnLinkToSelectSignUpForm = document.querySelector('#office-return-link-to-select-sign-up-form');

// Eventos
formLogin.addEventListener('submit', validateUser);
formUserSignUp.addEventListener('submit', validateUserSignUp);
formOfficeSignUp.addEventListener('submit', validateOfficeSignUp);
loginLinkFromUserSignUp.addEventListener('click', () => changeForms('container-user-sign-up', 'container-login'));
loginLinkFromOfficeSignUp.addEventListener('click', () => changeForms('container-office-sign-up', 'container-login'));
signUpLink.addEventListener('click', () => changeForms('container-login', 'container-select-sign-up'));
userSignUpLink.addEventListener('click', () => changeForms('container-select-sign-up', 'container-user-sign-up'));
officeSignUpLink.addEventListener('click', () => changeForms('container-select-sign-up','container-office-sign-up'));
returnLinkToLoginForm.addEventListener('click', () => changeForms('container-select-sign-up', 'container-login'));
userSignUpLinkToSelectSignUpForm.addEventListener('click', () => changeForms('container-user-sign-up', 'container-select-sign-up'));
officeReturnLinkToSelectSignUpForm.addEventListener('click', () => changeForms('container-office-sign-up', 'container-select-sign-up'));

// Funciones
async function validateUser(e) {
  e.preventDefault();
  
  const username = document.querySelector('#username').value;
  const passwordLogin = document.querySelector('#password-login').value;

  const user = {
    username,
    passwordLogin
  }

  if (!validateFields(user)) {
    showAlert('Todos los campos son obligatorios.', 'form-login');
    return;
  }
  
  const data = await login(user);
  if (!validateToken(data)) {
    showAlert('Usuario no registrado.', 'form-login');
    return;
  }

  const token = data.token;
  document.cookie = `auth_token=${token}; path=/; secure; SameSite=Lax`;

  localStorage.setItem('moduleIds', JSON.stringify(data.modules));

  router.navigate('/loadModules');
}

async function validateUserSignUp(e) {
  e.preventDefault();

  const userSignUpName = document.querySelector('#user-sign-up-name').value;
  const lastname = document.querySelector('#lastname').value;
  const username = createUserName(userSignUpName, lastname);
  const birthdate = document.querySelector('#birthdate').value;
  const gender = document.querySelector('input[name="gender"]:checked').id;
  const emailAddress = document.querySelector('#emailAddress').value;
  const department = document.querySelector('#department').value;
  const position = document.querySelector('#position').value;
  const invitationCodeUser = document.querySelector('#invitation-code-user').value;
  const passwordSignUp = document.querySelector('#password-sign-up').value;

  const userSignUp = {
    userSignUpName,
    lastname,
    username,
    birthdate,
    gender,
    emailAddress,
    department,
    position,
    invitationCodeUser,
    passwordSignUp
  }

  if (!validateFields(userSignUp)) {
    showAlert('Todos los campos son obligatorios.', 'form-user-sign-up');
    return;
  }

  const data = await createRecord(userSignUp, urlUsers);
  if (!userHasBeenAdded(data)) {
    showAlert('Usuario ya registrado.', 'form-user-sign-up');
    return;
  }

  changeForms('container-user-sign-up', 'container-login');
  document.querySelector('#username').value = username;
}

async function validateOfficeSignUp(e) {
  e.preventDefault();

  const nameOfficeSignUp = document.querySelector('#name-office-sign-up').value;
  const cif = document.querySelector('#cif').value;
  const invitationCodeOffice = document.querySelector('#invitation-code-office').value;

  const office = {
    nameOfficeSignUp,
    cif,
    invitationCodeOffice
  }

  if (!validateFields(office)) {
    showAlert('Todos los campos son obligatorios.', 'form-office-sign-up');
    return;
  }
  
  const data = await createRecord(office, urlOffices);
  if (!officeHasBeenAdded(data)) {
    showAlert('Despacho ya registrado.', 'form-office-sign-up');
    return;
  }

  changeForms('container-office-sign-up', 'container-login');
}

function validateToken(data) {
  return true;
  // return data.token;
}

function userHasBeenAdded(data) {
  return true;
}

function officeHasBeenAdded(data) {
  return true;
}

function changeForms(deleteFormName, addFormName) {
  addClassFromId(deleteFormName, 'd-none');
  removeClassFromId(addFormName, 'd-none');
}

async function showDepartments() {
  const departments = await getRecords(urlDepartments);
  const departmentSelect = document.querySelector('#department');

  departments.forEach( department => {
    const { id, name } = department;
    const option = document.createElement('option');
    option.value = id;
    option.innerText = name;
    departmentSelect.appendChild(option);
  });
}

function createUserName(name, lastname) {
  const firstCharName = name.charAt(0).toLocaleLowerCase();
  const lastnames = lastname.split(' ');
  const firstLastname = lastnames.shift().toLocaleLowerCase();

  let username = firstCharName + firstLastname;
  username = username.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return username;
}

showDepartments();