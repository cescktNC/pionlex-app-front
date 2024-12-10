import { 
  showAlert, 
  validateFields, 
  validateCheckBoxes, 
  clearRadioFields, 
  clearInputFields, 
  clearCheckBoxFields, 
  addClassFromId, 
  removeClassFromId } from './functions';
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
const dataPolicyLink = document.querySelector('#data-policy');
const termsOfUseLink = document.querySelector('#terms-of-use');

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
dataPolicyLink.addEventListener('click', redirectToLegalTemplate);
termsOfUseLink.addEventListener('click', redirectToLegalTemplate);

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

  const userSignUpName = document.querySelector('#user-sign-up-name');
  const lastname = document.querySelector('#lastname');
  const username = createUserName(userSignUpName.value, lastname.value);
  const birthdate = document.querySelector('#birthdate');
  const gender = document.querySelector('input[name="gender"]:checked').id;
  const emailAddress = document.querySelector('#emailAddress');
  const department = document.querySelector('#department');
  const position = document.querySelector('#position');
  const invitationCodeUser = document.querySelector('#invitation-code-user');
  const passwordSignUp = document.querySelector('#password-sign-up');
  const dataPolicy = document.querySelector('#dataPolicy');
  const termsOfUse = document.querySelector('#termsOfUse');

  const userSignUp = {
    userSignUpName: userSignUpName.value,
    lastname: lastname.value,
    username: username.value,
    birthdate: birthdate.value,
    gender,
    emailAddress: emailAddress.value,
    department: department.value,
    position: position.value,
    passwordSignUp: passwordSignUp.value
  }

  if (!validateFields(userSignUp)) {
    showAlert('Todos los campos son obligatorios.', 'form-user-sign-up');
    return;
  }

  const policyTerms = {
    dataPolicy: dataPolicy.checked,
    termsOfUse: termsOfUse.checked
  }

  if (!validateCheckBoxes(policyTerms)) {
    showAlert('Políticas y Términos obligatorios.', 'form-user-sign-up');
    return;
  }

  userSignUp.invitationCodeUser = invitationCodeUser;

  const data = await createRecord(userSignUp, urlUsers);
  if (!userHasBeenAdded(data)) {
    showAlert('Usuario ya registrado.', 'form-user-sign-up');
    return;
  }

  // Reseteo el formulario
  const inputFields = [userSignUpName, lastname, birthdate, emailAddress, department, position, passwordSignUp];
  const checkboxFields = [dataPolicy, termsOfUse];
  clearUserForm(inputFields, checkboxFields);

  changeForms('container-user-sign-up', 'container-login');
  document.querySelector('#username').value = username;
}

// Borra todos los campos del formulario de registro de un usuario
function clearUserForm(inputFields, checkboxFields) {
  clearInputFields(inputFields);
  clearCheckBoxFields(checkboxFields);

  const inputGenderMale = document.querySelector('#male');
  const inputGenderFemale = document.querySelector('#female');
  const inputRadios = [inputGenderMale, inputGenderFemale];
  clearRadioFields(inputRadios);
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

function redirectToLegalTemplate(e) {
  const templateName = e.target.id;
  router.navigate(`/legal-docs/${templateName}/1`);
}

showDepartments();