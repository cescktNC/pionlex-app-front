import { showAlert, validateFields, addClassFromId, removeClassFromId } from './functions';
import { login, createUser, createOffice, getDepartments } from './API';
import router from './routes';

( () => {

  document.addEventListener('DOMContentLoaded', () => {
    console.log('aaaaa');
    showDepartments();
  });

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

  function redirect(pageName) {
    console.log('Hola');
    router.navigate(pageName);
  }

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

  async function validateUserSignUp(e) {
    e.preventDefault();

    const userSignUpName = document.querySelector('#user-sign-up-name').value;
    const lastname = document.querySelector('#lastname').value;
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

    const data = await createUser(userSignUp);
    if (!userHasBeenAdded(data)) {
      showAlert('Usuario ya registrado.', 'form-user-sign-up');
      return;
    }

    changeForms('container-user-sign-up', 'container-login');
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
    
    const data = await createOffice(office);
    if (!officeHasBeenAdded(data)) {
      showAlert('Despacho ya registrado.', 'form-office-sign-up');
      return;
    }

    changeForms('container-office-sign-up', 'container-login');
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

  function changeForms(deleteFormName, addFormName) {
    addClassFromId(deleteFormName, 'd-none');
    removeClassFromId(addFormName, 'd-none');
  }

  async function showDepartments() {
    console.log('hola');
    const departments = await getDepartments();
    const departmentSelect = document.querySelector('#department');

    departments.forEach( department => {
      const { id, nombre } = department;
      const option = document.createElement('option');
      option.innerHTML = `<option value="${id}">${nombre}</option>`;
      departmentSelect.appendChild(option);
    });
  }

})();