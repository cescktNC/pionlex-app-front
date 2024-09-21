import { showAlert, validateFields, addClassFromId, removeClassFromId } from './functions';
import { login } from './API';
import router from './routes';

( () => {

  // Variables
  const formLogin = document.querySelector('#form-login');
  const loginLink = document.querySelector('#loginLink');

  const registerLink = document.querySelector('#registerLink');
  const userRegisterLink = document.querySelector('#userRegisterLink');
  const officeRegisterLink = document.querySelector('#officeRegisterLink');
  const returnLinkToLoginForm = document.querySelector('#returnLinkToLoginForm');
  const returnLinkToSelectRegisterForm = document.querySelector('#returnLinkToSelectRegisterForm');
  
  // Eventos
  formLogin.addEventListener('submit', validateUser);
  loginLink.addEventListener('click', () => showLoginForm('card-register', 'slide-down'));
  registerLink.addEventListener('click', () => showSelectRegisterForm('card-login', 'slide-up'));
  userRegisterLink.addEventListener('click', showUserRegisterForm);
  officeRegisterLink.addEventListener('click', showDepartmentRegisterForm);
  returnLinkToLoginForm.addEventListener('click', () => showLoginForm('card-select-form-register', 'slide-left'));
  returnLinkToSelectRegisterForm.addEventListener('click', () => showSelectRegisterForm('card-register', 'slide-down'));

  // Funciones
  async function validateUser(e) {
    e.preventDefault();
    
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const user = {
      username,
      password
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

    const token = data[0].token;
    document.cookie = `auth_token=${token}; path=/; secure; SameSite=Lax`;
    router.navigate('/clients');
  }

  function validateToken(data) {
    return data[0]?.token;
  }

  function showSelectRegisterForm(id, className) {
    addClassFromId(id, className);
    removeClassFromId('card-select-form-register', 'slide-left');
  }

  function showLoginForm(id, className) {
    addClassFromId(id, className);
    removeClassFromId('card-login', 'slide-up');
  }

  function showUserRegisterForm() {
    addClassFromId('card-select-form-register', 'slide-left');
    removeClassFromId('card-register', 'slide-down');
  }

  function showDepartmentRegisterForm() {
    addClassFromId('card-select-form-register', 'slide-left');

  }

})();