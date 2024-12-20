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
  e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  // Captura de los elementos del formulario
  const officeName = registerForm.querySelector('[data-officeName]');
  const cif = registerForm.querySelector('[data-cif]');
  const invitationCode = registerForm.querySelector('[data-invitationCode]');
  const name = registerForm.querySelector('[data-name]');
  const lastname = registerForm.querySelector('[data-lastname]');
  const email = registerForm.querySelector('[data-email]');
  const password = registerForm.querySelector('[data-password]');
  const passwordConfirmation = registerForm.querySelector('[data-passwordConfirmation]');
  const policyTerms = registerForm.querySelector('[data-policyTerms]');

  // Construcción de los datos de usuario
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

  const policyTermsValue = { policyTerms: policyTerms.checked }
  
  // Validación del formulario
  const errors = validateErrors(user, policyTermsValue);

  // Limpieza de errores previos
  clearFieldErrors(registerForm, '.form__validation__error', '.form__input');
  
  // Se muestran los errores en los campos del formulario
  if (Object.keys(errors).length > 0) {
    showFieldErrors(registerForm, errors);
    return;
  }
  
  // Gestion de los botones de guardado
  const saveUserButton = registerForm.querySelector('#saveUserButton');
  const savingUserButton = registerForm.querySelector('#savingUserButton');
  toggleElements(saveUserButton, savingUserButton);

  try {
    // Enviar datos a la API
    const data = await fetchAPI('POST', registerUserURL, user);

    // Manejo de errores devueltos por la API
    if (!data.result) {
      if (Object.keys(data.status).length > 0) {
        showFieldErrors(registerForm, data.status);
      }
      return;
    }

    // Guardar token en localStorage
    const dataUserLogin = await login(user);
    localStorage.setItem('auth_token', dataUserLogin.token);
  } catch (error) {
    console.error('Error al obtener los datos:', error.message);
    return;
  } finally {
    toggleElements(savingUserButton, saveUserButton);
  }

  // Mostrar mensaje de verificación
  showModal('Verificar Usuario', 'Te hemos enviado un correo electrónico para que confirmes tu usuario.');

  // Reiniciar formulario
  clearForm(
    [officeName, cif, invitationCode, name, lastname, email, password, passwordConfirmation],
    [policyTerms]
  );

  // Mostrar formulario de login
  showLeftForm('register-container', 'login-container');
}

// Manda un correo electrónico al usuario para restablecer la contraseña
async function forgotPassword(e) {
  e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  // Captura de los elementos del formulario
  const email = forgotPasswordForm.querySelector('[data-email]');
  
  const user = { email: email.value };

  // Validación del formulario
  const errors = validateErrors(user);

  // Limpieza de errores previos
  clearFieldErrors(forgotPasswordForm, '.form__validation__error', '.form__input');
  
  // Se muestran los errores en los campos del formulario
  if (Object.keys(errors).length > 0) {
    showFieldErrors(forgotPasswordForm, errors);
    return;
  }

  // Gestion de los botones de continuar
  const continueButton = forgotPasswordForm.querySelector('#continueButton');
  const continuingButton = forgotPasswordForm.querySelector('#continuingButton');
  toggleElements(continueButton, continuingButton);

  // Se envian los datos del formulario a la Api para mandar el email de recuperar contraseña
  try {
    // Enviar datos a la API
    const data = await fetchAPI('POST', forgotPasswordURL, user);
    
    // Manejo de errores devueltos por la API
    if (!data.result) {
      if (Object.keys(data.status).length > 0) {
        showErrorForm(forgotPasswordForm, 'email', data.status);
      }
      return;
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error.message);
    return;
  } finally {
    toggleElements(continuingButton, continueButton);
  }

  // Mostrar mensaje de restablecimiento de contraseña
  showModal('Restablecimiento de contraseña', 'Te hemos enviado un correo electrónico con la solicitud de restablecimiento de contraseña.');

  // Reiniciar formulario
  clearForm([email]);

  // Mostrar formulario de login
  showLeftForm('forgot-password-container', 'login-container');
}

// Muestra un formulario deslizando hacia la derecha
function showRightForm(deleteFormName, addFormName) {
  toggleForms(deleteFormName, addFormName, 'slide-left', 'slide-right');
}

// Muestra un formulario deslizando hacia la izquierda
function showLeftForm(deleteFormName, addFormName) {
  toggleForms(deleteFormName, addFormName, 'slide-right', 'slide-left');
}

// Manejo genérico de la animación entre formularios
function toggleForms(deleteFormName, addFormName, deleteAnimation, addAnimation) {
  addClassFromId(deleteFormName, deleteAnimation);
  setTimeout(() => {
    addClassFromId(deleteFormName, 'd-none');
    addClassFromId(addFormName, addAnimation);
    removeClassFromId(addFormName, 'd-none');

    setTimeout(() => {
      removeClassFromId(addFormName, addAnimation);
    }, 50);
  }, 350);
}

// Borra todos los campos del formulario
function clearForm(inputFields, checkboxFields = []) {
  clearInputFields(inputFields);
  clearCheckBoxFields(checkboxFields);
}

// Muestra un mensaje al usuario en un modal
function showModal(title, body) {
  // Actualiza el título del modal
  const modalTitle = document.querySelector('.modal-title');
  if (modalTitle) modalTitle.textContent = title;

  // Actualiza el cuerpo del modal
  const modalBody = document.querySelector('.modal-body');
  if (modalBody) modalBody.textContent = body;

  // Muestra el modal usando el componente de Bootstrap
  if (notificationModal) notificationModal.show();
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