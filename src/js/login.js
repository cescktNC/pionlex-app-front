import * as utilityFunctions from './functions';
import { fetchAPI, loginURL, registerUserURL, forgotPasswordURL, resetPasswordURL, verifyEmailUser } from './API';
import * as bootstrap from 'bootstrap'; // Para instancias de Bootstrap
import router from './routes';

const {
  validateErrors,
  clearFieldErrors,
  showFieldErrors,
  showErrorForm,
  toggleElements,
  clearInputFields,
  addClassFromId,
  removeClassFromId,
  getFormInputs,
  constructFormObject
} = utilityFunctions;

// Variables globales
let loginForm, 
  registerForm, 
  forgotPasswordForm, 
  recoverPasswordForm, 
  lostPasswordLink, 
  registerLink, 
  loginLinks, 
  notificationModal, 
  verifyEmail, 
  urlVerifyEmail, 
  tokenPasswordreset, 
  emailPasswordreset;

// Funciones

// Inicia sesión de un usuario
async function loginUser(e) {
  e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  // Captura de los elementos del formulario
  const inputFields = getFormInputs(loginForm, '[data-input]');

  // Construcción de los datos de usuario
  const user = constructFormObject(inputFields);

  // Validación del formulario
  const errors = validateErrors(user);

  // Limpieza de errores previos
  clearFieldErrors(loginForm, '.form__validation__error', 'input.form__input');

  // Se muestran los errores en los campos del formulario
  if (Object.keys(errors).length > 0) {
    showFieldErrors(loginForm, errors);
    return;
  }

   // Gestion de los botones de entrar
  const loginUserButton = document.querySelector('#loginUserButton');
  const logingUserButton = document.querySelector('#logingUserButton');
  toggleElements(loginUserButton, logingUserButton);

  try {
    // Enviar datos a la API
    const data = await fetchAPI('POST', loginURL, user);

    // Manejo de errores devueltos por la API
    if (data.errors && Object.keys(data.errors).length > 0) {
      showFieldErrors(loginForm, data.errors);
      return;
    }

    if (verifyEmail) {
      // Verificar usuario
      const response = await verifyEmailUser(urlVerifyEmail, token);
      console.log('Response: ', response);
    } else if (!data.user.verified) {
      showErrorForm(loginForm, 'email', 'Cuenta no verificada revisa el correo electrónico.');
      return;
    }

    // Guardar token en localStorage
    const token = data.token;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_name', data.user.name);

    // Guardar id's de los módulos en Local Storage
    if (data.user.modules) {
      localStorage.setItem('moduleIds', JSON.stringify(data.user.modules));
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error.message);
    return;
  } finally {
    toggleElements(logingUserButton, loginUserButton);
  }

  // Se redirige a la pantalla del CRM
  router.navigate('/loadModules');
}

// Crea un usuario en la BD
async function registerUser(e) {
  e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  // Captura de los elementos del formulario
  const inputFields = getFormInputs(registerForm, '[data-input]');
  const policyTerms = registerForm.querySelector('[data-policyTerms]');

  // Construcción de los datos de usuario
  const user = constructFormObject(inputFields);
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
    const dataUserLogin = await fetchAPI('POST', loginURL, user);
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
  clearInputFields([...inputFields, policyTerms]);

  // Mostrar formulario de login
  showLeftForm('register-container', 'login-container');
}

// Manda un correo electrónico al usuario para restablecer la contraseña
async function forgotPassword(e) {
  e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  // Captura de los elementos del formulario
  const email = forgotPasswordForm.querySelector('[data-email]');
  
  // Construcción de los datos de usuario
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
  clearInputFields([email]);

  // Mostrar formulario de login
  showLeftForm('forgot-password-container', 'login-container');
}

async function recoverPassword(e) {
  e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  // Captura de los elementos del formulario
  const inputFields = getFormInputs(recoverPasswordForm, '[data-input]');

  // Construcción de los datos de usuario
  const user = constructFormObject(inputFields);

  // Validación del formulario
  const errors = validateErrors(user);

  // Limpieza de errores previos
  clearFieldErrors(recoverPasswordForm, '.form__validation__error', '.form__input');

  // Se muestran los errores en los campos del formulario
  if (Object.keys(errors).length > 0) {
    showFieldErrors(recoverPasswordForm, errors);
    return;
  }

  // Gestion de los botones de continuar
  const confirmButton = recoverPasswordForm.querySelector('#confirmButton');
  const confirmingButton = recoverPasswordForm.querySelector('#confirmingButton');
  toggleElements(confirmButton, confirmingButton);

  // Se envian los datos del formulario a la Api para mandar el email de recuperar contraseña
  try {
    // Enviar datos a la API
    user.token = tokenPasswordreset;
    user.email = emailPasswordreset;
    const data = await fetchAPI('POST', resetPasswordURL, user);
    console.log(!data.result);
    
    // Manejo de errores devueltos por la API
    if (!data.result) {
      showErrorForm(recoverPasswordForm, 'password', data.status);
      return;
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error.message);
    return;
  } finally {
    toggleElements(confirmingButton, confirmButton);
  }

  // Mostrar mensaje de restablecimiento de contraseña
  showModal('Restablecimiento de contraseña', 'Tu contraseña se ha cambiada correctamente.');

  // Reiniciar formulario
  clearInputFields(inputFields);
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

function loadOptions(options) {

  if ('verifyEmail' in options) {
    verifyEmail = options.verifyEmail;
    urlVerifyEmail = options.urlVerification;
  }

  if ('passwordReset' in options) {
    tokenPasswordreset = options.token;
    emailPasswordreset = options.email;

    const containers = document.querySelectorAll('[id*="container"]');

    containers.forEach( container => {
      container.id.includes('recover-password')
      ? container.classList.remove('d-none')
      : container.classList.add('d-none');
    });
  }
}

export async function initLogin(options = {}) {
  // Inicializar variables
  loginForm = document.querySelector('#login-form');
  registerForm = document.querySelector('#register-form');
  forgotPasswordForm = document.querySelector('#forgot-password-form');
  recoverPasswordForm = document.querySelector('#recover-password-form');
  lostPasswordLink = document.querySelector('#lost-password-link');
  registerLink = document.querySelector('#login-container [data-registerLink]');
  loginLinks = document.querySelectorAll('[data-loginLink]');

  // Instanciar componentes de Bootstrap
  notificationModal = new bootstrap.Modal(document.querySelector('#notificationModal'));

  // Añadir eventos
  loginForm.addEventListener('submit', loginUser);
  registerForm.addEventListener('submit', registerUser);
  forgotPasswordForm.addEventListener('submit', forgotPassword);
  recoverPasswordForm.addEventListener('submit', recoverPassword);
  lostPasswordLink.addEventListener('click', () => showRightForm('login-container', 'forgot-password-container'));
  registerLink.addEventListener('click', () => showRightForm('login-container', 'register-container'));
  loginLinks.forEach( loginLink => {
    const container = loginLink.getAttribute('data-container');
    loginLink.addEventListener('click', () => showLeftForm(container, 'login-container'));
  });

  // Cargar opciones en caso de verificar email o resetar password
  if (Object.keys(options).length > 0) {
    loadOptions(options);
  }
}