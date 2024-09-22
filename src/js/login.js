import { showAlert, validateFields, addClassFromId, removeClassFromId } from './functions';
import { login, createUser, createOffice } from './API';
import router from './routes';

( () => {

  // Variables
  const formLogin = document.querySelector('#form-login');
  const formUserRegister = document.querySelector('#form-user-register');
  const formOfficeRegister = document.querySelector('#form-office-register');
  const loginLinkFromUserRegister = document.querySelector('#login-link-from-user-register');
  const loginLinkFromOfficeRegister = document.querySelector('#login-link-from-office-register');
  const registerLink = document.querySelector('#register-link');
  const userRegisterLink = document.querySelector('#user-register-link');
  const officeRegisterLink = document.querySelector('#office-register-link');
  const returnLinkToLoginForm = document.querySelector('#return-link-to-login-form');
  const userReturnLinkToSelectRegisterForm = document.querySelector('#user-return-link-to-select-register-form');
  const officeReturnLinkToSelectRegisterForm = document.querySelector('#office-return-link-to-select-register-form');
  
  // Eventos
  formLogin.addEventListener('submit', validateUser);
  formUserRegister.addEventListener('submit', validateUserRegister);
  formOfficeRegister.addEventListener('submit', validateOfficeRegister);
  loginLinkFromUserRegister.addEventListener('click', () => showLoginForm('card-user-register', 'slide-down'));
  loginLinkFromOfficeRegister.addEventListener('click', () => showLoginForm('card-office-register', 'slide-right'));
  registerLink.addEventListener('click', () => showSelectRegisterForm('card-login', 'slide-up'));
  userRegisterLink.addEventListener('click', showUserRegisterForm);
  officeRegisterLink.addEventListener('click', showDepartmentRegisterForm);
  returnLinkToLoginForm.addEventListener('click', () => showLoginForm('card-select-form-register', 'slide-left'));
  userReturnLinkToSelectRegisterForm.addEventListener('click', () => showSelectRegisterForm('card-user-register', 'slide-down'));
  officeReturnLinkToSelectRegisterForm.addEventListener('click', () => showSelectRegisterForm('card-office-register', 'slide-right'));

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

    // const token = data[0].token;
    const token = 'jus5648sanm546123lo8iuysdaaAsU5ghj151Z65';
    document.cookie = `auth_token=${token}; path=/; secure; SameSite=Lax`;
    router.navigate('/clients');
  }

  async function validateUserRegister(e) {
    e.preventDefault();

    const userRegisterName = document.querySelector('#user-register-name').value;
    const lastname = document.querySelector('#lastname').value;
    const birthdate = document.querySelector('#birthdate').value;
    const gender = document.querySelector('input[name="gender"]:checked').id;
    const emailAddress = document.querySelector('#emailAddress').value;
    const department = document.querySelector('#department').value;
    const position = document.querySelector('#position').value;
    const invitationCodeUser = document.querySelector('#invitation-code-user').value;
    const passwordRegister = document.querySelector('#password-register').value;

    const userRegister = {
      userRegisterName,
      lastname,
      birthdate,
      gender,
      emailAddress,
      department,
      position,
      invitationCodeUser,
      passwordRegister
    }

    if (!validateFields(userRegister)) {
      showAlert('Todos los campos son obligatorios.', 'form-user-register');
      return;
    }

    const data = await createUser(userRegister);
    if (!userHasBeenAdded(data)) {
      showAlert('Usuario ya registrado.', 'form-user-register');
      return;
    }

    // window.location.reload();
    showLoginForm('card-user-register', 'slide-down');
  }

  async function validateOfficeRegister(e) {
    e.preventDefault();

    const nameOfficeRegister = document.querySelector('#name-office-register').value;
    const cif = document.querySelector('#cif').value;
    const invitationCodeOffice = document.querySelector('#invitation-code-office').value;

    const office = {
      nameOfficeRegister,
      cif,
      invitationCodeOffice
    }

    if (!validateFields(office)) {
      showAlert('Todos los campos son obligatorios.', 'form-office-register');
      return;
    }
    
    const data = await createOffice(office);
    if (!officeHasBeenAdded(data)) {
      showAlert('Despacho ya registrado.', 'form-office-register');
      return;
    }

    showLoginForm('card-office-register', 'slide-down');
  }

  function validateToken(data) {
    return true;
    // return data[0]?.token;
  }

  function userHasBeenAdded(data) {
    return true;
  }

  function officeHasBeenAdded(data) {
    return true;
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
    removeClassFromId('card-user-register', 'slide-down');
  }

  function showDepartmentRegisterForm() {
    addClassFromId('card-select-form-register', 'slide-left');
    removeClassFromId('card-office-register', 'slide-right');
  }

})();