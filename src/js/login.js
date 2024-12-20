import {
  showAlert,
  validateErrors,
  showFieldErrors,
  showErrorForm,
  clearFieldErrors,
  toggleElements,
  clearInputFields,
  clearCheckBoxFields,
  addClassFromId,
  removeClassFromId } from './functions';
import { 
  fetchAPI,
  registerUserURL, 
  forgotPasswordURL,
  login, 
  createRecord, 
  verifyEmailUser } from './API';
import * as bootstrap from 'bootstrap'; // Para poder crear instancias de bootstrap
import router from './routes';

// Variables
let loginForm, registerForm, forgotPasswordForm, lostPasswordLink, registerLink, loginLinks, notificationModal, verifyEmail, urlVerifyEmail;

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
  showModal('Verificar Usuario', 'Te hemos enviado un correo electrónico para que confirmes tu usuario.');

  // Se guarda el token del usuario en el local storage
  const dataUserLogin = await login(user);
  localStorage.setItem('auth_token', dataUserLogin.token);

  // Se resetea el formulario de Registro
  const inputFields = [officeName, cif, invitationCode, name, lastname, email, password, passwordConfirmation];
  const checkboxFields = [policyTerms];
  clearUserForm(inputFields, checkboxFields);
  toggleElements(savingUserButton, saveUserButton);

  // Se vuelve a cargar el formulario de Login
  showLeftForm('register-container', 'login-container');
}

async function forgotPassword(e) {
  // Se evita el comportamiento predeterminado del formulario (enviar los datos y recargar la página).
  e.preventDefault();

  // Se capturan todos los elementos del formulario de Recuperar Contraseña
  const email = forgotPasswordForm.querySelector('[data-email]');
  
  const user = {
    email: email.value
  };

  // Se valida el campo email
  const errors = validateErrors(user);
  
  // Se muestran los errores en los campos del formulario
  if (Object.keys(errors).length !== 0) {
    showFieldErrors(forgotPasswordForm, errors);
    return;
  }

  // Se muestra el botón de 'Continuando...'
  const continueButton = forgotPasswordForm.querySelector('#continueButton');
  const continuingButton = forgotPasswordForm.querySelector('#continuingButton');
  toggleElements(continueButton, continuingButton);

  // Se envian los datos del formulario a la Api para mandar el email de recuperar contraseña
  try {
    const data = await fetchAPI('POST', forgotPasswordURL, user);
    toggleElements(continuingButton, continueButton);
    if (!data.result) {
      if (Object.keys(data.status).length !== 0) {
        showErrorForm(forgotPasswordForm, 'email', data.status);
        return;
      }
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error.message);
  }

  // Se muestra el modal para que el usuario restablezca la contraseña des de su correo
  showModal('Restablecimiento de contraseña', 'Te hemos enviado un correo electrónico con la solicitud de restablecimiento de contraseña.');

  // Se resetea el formulario de Registro
  clearUserForm([email]);

  // Se vuelve a cargar el formulario de Login
  showLeftForm('forgot-password-container', 'login-container');
}

// Muestra el formulario de Registro
function showRightForm(deleteFormName, addFormName) {
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
function showLeftForm(deleteFormName, addFormName) {
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
function clearUserForm(inputFields, checkboxFields = []) {
  clearInputFields(inputFields);
  clearCheckBoxFields(checkboxFields);
}

function showModal(title, body) {
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = title;

  const modalBody = document.querySelector('.modal-body');
  modalBody.textContent = body;

  notificationModal.show();
}

export async function initLogin(options = {}, urlVerification) {
  // Inicializar variables
  loginForm = document.querySelector('#login-form');
  registerForm = document.querySelector('#register-form');
  forgotPasswordForm = document.querySelector('#forgot-password-form');
  lostPasswordLink = document.querySelector('#lost-password-link');
  registerLink = document.querySelector('#login-container [data-registerLink]');
  loginLinks = document.querySelectorAll('[data-loginLink]');

  // Instanciar componentes de Bootstrap
  notificationModal = new bootstrap.Modal(document.querySelector('#notificationModal'));

  // Añadir eventos
  loginForm.addEventListener('submit', loginUser);
  registerForm.addEventListener('submit', registerUser);
  forgotPasswordForm.addEventListener('submit', forgotPassword);
  lostPasswordLink.addEventListener('click', () => showRightForm('login-container', 'forgot-password-container'));
  registerLink.addEventListener('click', () => showRightForm('login-container', 'register-container'));
  loginLinks.forEach( loginLink => {
    const container = loginLink.getAttribute('data-container');
    loginLink.addEventListener('click', () => showLeftForm(container, 'login-container'));
  });

  // Lógica
  verifyEmail = options.verifyEmail;
  urlVerifyEmail = urlVerification;
}