import {
  showAlert,
  validateErrors,
  showFieldErrors,
  clearFieldErrors,
  validateEmptyFields,
  toggleElements,
  clearInputFields,
  clearCheckBoxFields,
  addClassFromId,
  removeClassFromId } from './functions';
import { registerUserURL, login, createRecord, verifyEmailUser } from './API';
import * as bootstrap from 'bootstrap'; // Para poder crear instancias de bootstrap
import router from './routes';

// Variables
let loginForm, registerForm, registerLink, loginLink, dataPolicyLink, termsOfUseLink, userVerifyModal, verifyEmail, urlVerifyEmail;

// Funciones

// Inicia sesión de un usuario
async function loginUser(e) {
  // Se evita el comportamiento predeterminado del formulario (enviar los datos y recargar la página).
  e.preventDefault();

  // Se capturan todos los elementos del formulario de Login
  const email = loginForm.querySelector('[data-email]').value;
  const password = loginForm.querySelector('[data-password]').value;

  const user = {
    email,
    password
  };

  // Se valida que todos los campos del formulario de Registro
  const errors = validateErrors(user);

  // Se limpian los mensajes de error del formulario
  clearFieldErrors(loginForm, '.form__validation__error', 'input.form__input');

  // Se muestran los errores en los campos del formulario
  if (Object.keys(errors).length !== 0) {
    showFieldErrors(loginForm, errors);
    return;
  }

  const loginUserButton = document.querySelector('#loginUserButton');
  const logingUserButton = document.querySelector('#logingUserButton');
  toggleElements(loginUserButton, logingUserButton);

  // Se envian los datos del formulario a la Api para comprobar si el usuario esta registrado al sistema
  const dataLogin = await login(user);

  if (dataLogin.errors) {
    showFieldErrors(loginForm, dataLogin.errors);
    toggleElements(logingUserButton, loginUserButton);
    return;
  }

  // Se guarda el token del usuario a una cookie
  const token = dataLogin.token;
  localStorage.setItem('auth_token', token);

  // Se guardan los id's, de los módulos contratados, en el Local Storage
  if (dataLogin.user.modules) {
    localStorage.setItem('moduleIds', JSON.stringify(dataLogin.user.modules));
  }

  if (verifyEmail) {
    const response = await verifyEmailUser(urlVerifyEmail, token);
    console.log('Response: ', response);
  } else if (!dataLogin.user.verified) {
    toggleElements(logingUserButton, loginUserButton);
    showAlert('Por favor, verifica tu cuenta revisando tu correo electrónico.', 'login-form');
    return;
  }

  // Se redirige a la pantalla del CRM
  router.navigate('/loadModules');
}

// Crea un usuario en la BD
async function registerUser(e) {
  // Se evita el comportamiento predeterminado del formulario (enviar los datos y recargar la página).
  e.preventDefault();

  // Se capturan todos los elementos del formulario de Registro
  const officeName = registerForm.querySelector('[data-officeName]');
  const cif = registerForm.querySelector('[data-cif]');
  const invitationCode = registerForm.querySelector('[data-invitationCode]');
  const name = registerForm.querySelector('[data-name]');
  const lastname = registerForm.querySelector('[data-lastname]');
  const email = registerForm.querySelector('[data-email]');
  const password = registerForm.querySelector('[data-password]');
  const passwordConfirmation = registerForm.querySelector('[data-passwordConfirmation]');
  const policyTerms = registerForm.querySelector('[data-policyTerms]');

  const user = {
    officeName: officeName.value,
    cif: cif.value,
    invitationCode: invitationCode.value,
    name: name.value,
    lastname: lastname.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value
  }

  const policyTermsValue = {
    policyTerms: policyTerms.checked
  }
  
  // Se valida que todos los campos del formulario de Registro
  const errors = validateErrors(user, policyTermsValue);

  // Se limpian los mensajes de error del formulario
  clearFieldErrors(registerForm, '.form__validation__error', '.form__input');
  
  // Se muestran los errores en los campos del formulario
  if (Object.keys(errors).length !== 0) {
    showFieldErrors(registerForm, errors);
    return;
  }
  
  // Se muestra el botón de 'Gurdando...'
  const saveUserButton = registerForm.querySelector('#saveUserButton');
  const savingUserButton = registerForm.querySelector('#savingUserButton');
  toggleElements(saveUserButton, savingUserButton);

  // Se envian los datos del formulario a la Api para crear el registro en la BD
  const dataUserRegistered = await createRecord(user, registerUserURL);

  if (!dataUserRegistered.result) {
    if (Object.keys(dataUserRegistered.status).length !== 0) {
      showFieldErrors(registerForm, dataUserRegistered.status);
      toggleElements(savingUserButton, saveUserButton);
      return;
    }
  }

  // Se muestra el modal para que verifique el usuario desde su correo
  userVerifyModal.show();

  // Se guarda el token del usuario en el local storage
  const dataUserLogin = await login(user);
  localStorage.setItem('auth_token', dataUserLogin.token);

  // Se resetea el formulario de Registro
  const inputFields = [officeName, cif, invitationCode, name, lastname, email, password, passwordConfirmation];
  const checkboxFields = [policyTerms];
  clearUserForm(inputFields, checkboxFields);
  toggleElements(savingUserButton, saveUserButton);

  // Se vuelve a cargar el formulario de Login
  showLoginForm('register-container', 'login-container');
}

// Muestra el formulario de Registro
function showRegisterForm(deleteFormName, addFormName) {
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

export async function initLogin(options = {}, urlVerification) {
  // Inicializar variables
  loginForm = document.querySelector('#login-form');
  registerForm = document.querySelector('#register-form');
  registerLink = document.querySelector('#register-link');
  loginLink = document.querySelector('#login-link');
  dataPolicyLink = document.querySelector('#data-policy');
  termsOfUseLink = document.querySelector('#terms-of-use');

  // Instanciar componentes de Bootstrap
  userVerifyModal = new bootstrap.Modal(document.querySelector('#userVerifyModal'));

  // Añadir eventos
  loginForm.addEventListener('submit', loginUser);
  registerForm.addEventListener('submit', registerUser);
  registerLink.addEventListener('click', () => showRegisterForm('login-container', 'register-container'));
  loginLink.addEventListener('click', () => showLoginForm('register-container', 'login-container'));
  dataPolicyLink.addEventListener('click', redirectToLegalTemplate);
  termsOfUseLink.addEventListener('click', redirectToLegalTemplate);

  // Lógica
  verifyEmail = options.verifyEmail;
  urlVerifyEmail = urlVerification;
}