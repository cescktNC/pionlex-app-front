import { 
  showAlert, 
  validateFields, 
  validateCheckBoxes, 
  validateEmail,
  clearInputFields, 
  clearCheckBoxFields, 
  addClassFromId, 
  removeClassFromId } from './functions';
import { urlOffices, login, createRecord } from './API';
import * as bootstrap from 'bootstrap'; // Para poder crear instancias de bootstrap
import router from './routes';

// Variables
const formLogin = document.querySelector('#form-login');
const formSignUp = document.querySelector('#form-sign-up');
const signUpLink = document.querySelector('#sign-up-link');
const loginLink = document.querySelector('#login-link');
const dataPolicyLink = document.querySelector('#data-policy');
const termsOfUseLink = document.querySelector('#terms-of-use');
const clientDeleteModal = new bootstrap.Modal(document.querySelector('#userVerifyModal'));

// Eventos
formLogin.addEventListener('submit', validateUser);
formSignUp.addEventListener('submit', validateSignUp);
signUpLink.addEventListener('click', () => showSignUpForm('container-login', 'container-sign-up'));
loginLink.addEventListener('click', () => showLoginForm('container-sign-up', 'container-login'));
dataPolicyLink.addEventListener('click', redirectToLegalTemplate);
termsOfUseLink.addEventListener('click', redirectToLegalTemplate);

// Funciones

// Inicia sesión de un usuario
async function validateUser(e) {
  // Se evita el comportamiento predeterminado del formulario (enviar los datos y recargar la página).
  e.preventDefault();
  
  // Se capturan todos los elementos del formulario de Login
  const username = document.querySelector('#username').value;
  const passwordLogin = document.querySelector('#password-login').value;

  const user = {
    username,
    passwordLogin
  }

  // Se valida que todos los campos del formulario de Login se han rellenado
  if (!validateFields(user)) {
    showAlert('Todos los campos son obligatorios.', 'form-login');
    return;
  }
  
  // Se envian los datos del formulario a la Api para comprobar si el usuario esta registrado al sistema
  const data = await login(user);
  if (!validateToken(data)) {
    showAlert('Usuario no registrado.', 'form-login');
    return;
  }

  // Se guarda el token del usuario a una cookie
  const token = data.token;
  document.cookie = `auth_token=${token}; path=/; secure; SameSite=Lax`;

  // Se guardan los id's, de los módulos contratados, en el Local Storage
  localStorage.setItem('moduleIds', JSON.stringify(data.modules));

  // Se redirige a la pantalla del CRM
  router.navigate('/loadModules');
}

// Crea un usuario en la BD
async function validateSignUp(e) {
  // Se evita el comportamiento predeterminado del formulario (enviar los datos y recargar la página).
  e.preventDefault();

  // Se capturan todos los elementos del formulario de Registro
  const nameOfficeSignUp = document.querySelector('#officeName');
  const cif = document.querySelector('#cif');
  const invitationCode = document.querySelector('#invitationCode');
  const name = document.querySelector('#name');
  const lastname = document.querySelector('#lastname');
  const emailAddress = document.querySelector('#emailAddress');
  const passwordSignUp = document.querySelector('#passwordSignUp');
  const confirmPasswordSignUp = document.querySelector('#confirmPasswordSignUp');
  const dataPolicy = document.querySelector('#dataPolicy');
  const termsOfUse = document.querySelector('#termsOfUse');

  const office = {
    nameOfficeSignUp: nameOfficeSignUp.value,
    cif: cif.value,
    invitationCode: invitationCode.value,
    name: name.value,
    lastname: lastname.value,
    emailAddress: emailAddress.value,
    passwordSignUp: passwordSignUp.value,
    confirmPasswordSignUp: confirmPasswordSignUp.value
  }

  // Se valida que todos los campos del formulario de Registro se han rellenado
  if (!validateFields(office)) {
    showAlert('Todos los campos son obligatorios.', 'form-sign-up');
    return;
  }

  // Se valida que el formato del email es correcto
  if (!validateEmail(emailAddress.value)) {
    showAlert('Email incorrecto.', 'form-sign-up');
    return;
  }

  // Se valida que las dos contraseñas son correctas
  if (passwordSignUp.value !== confirmPasswordSignUp.value) {
    showAlert('Contraseñas distintas.', 'form-sign-up');
    return;
  }

  // Se valida que se han marcado los checbox de las políticas y términos
  const policyTerms = {
    dataPolicy: dataPolicy.checked,
    termsOfUse: termsOfUse.checked
  }

  if (!validateCheckBoxes(policyTerms)) {
    showAlert('Políticas y Términos obligatorios.', 'form-sign-up');
    return;
  }
  
  // Se envian los datos del formulario a la Api para crear el registro en la BD
  const data = await createRecord(office, urlOffices);
  if (!officeHasBeenAdded(data)) {
    showAlert('Despacho ya registrado.', 'form-sign-up');
    return;
  }

  // Se resetea el formulario de Registro
  const inputFields = [nameOfficeSignUp, cif, invitationCode, name, lastname, emailAddress, passwordSignUp, confirmPasswordSignUp];
  const checkboxFields = [dataPolicy, termsOfUse];
  clearUserForm(inputFields, checkboxFields);

  clientDeleteModal.show();
  // Se vuelve a cargar el formulario de Login
  showLoginForm('container-sign-up', 'container-login');
}

function validateToken(data) {
  return true;
  // return data.token;
}

function officeHasBeenAdded(data) {
  return true;
}

// Muestra el formulario de Registro
function showSignUpForm(deleteFormName, addFormName) {
  addClassFromId(deleteFormName, 'slide-left');
  setTimeout( () => {
    addClassFromId(deleteFormName, 'd-none');
    addClassFromId(addFormName, 'slide-right');
    removeClassFromId(addFormName, 'd-none');
    setTimeout( () => {
      removeClassFromId(addFormName, 'slide-right');
    }, 50);
  }, 350);
}

// Muestra el formulario de Login
function showLoginForm(deleteFormName, addFormName) {
  addClassFromId(deleteFormName, 'slide-right');
  setTimeout( () => {
    addClassFromId(deleteFormName, 'd-none');
    addClassFromId(addFormName, 'slide-left');
    removeClassFromId(addFormName, 'd-none');
    setTimeout( () => {
      removeClassFromId(addFormName, 'slide-left');
    }, 50);
  }, 350);
}

// Borra todos los campos del formulario de Registro
function clearUserForm(inputFields, checkboxFields) {
  clearInputFields(inputFields);
  clearCheckBoxFields(checkboxFields);
}

// Redirige a la página de terminos legales
function redirectToLegalTemplate(e) {
  const templateName = e.target.id;
  router.navigate(`/legal-docs/${templateName}/1`);
}