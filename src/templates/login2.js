import '/src/js/bootstrap';
import '/src/scss/style.scss';
import axios from 'axios';

const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', event => {

  event.preventDefault();

  let formData = {};
  let formIsValid = true;
  const inputs = document.querySelectorAll('#form-login input');

  inputs.forEach( input => {
    removeError(input);
    if (input.value.trim() === '') {
      formIsValid = false;
      showError(input);
    } else {
      formData[input.name] = input.value;
    }
  });

  if (formIsValid) {
    const formLogin = document.getElementById('form-login');
    login(formLogin, formData);
  } else {
    console.log('Formulario No Válido');
  }

});

function showError(input) {

  let errorElementEmptyField = input.parentElement.nextElementSibling;

  if (errorElementEmptyField && errorElementEmptyField.classList.contains('form__error__message')) {
    input.classList.add('error-border');
    input.classList.add('mb-0');
    input.previousElementSibling.classList.add('mb-0');
    input.value = '';
    errorElementEmptyField.classList.add('error-message-active');
  }
}

function removeError(input) {

  let errorElementEmptyField = input.parentElement.nextElementSibling;
  let errorMessageUnregisteredUser = input.parentElement.parentElement.nextElementSibling;

  if (errorElementEmptyField && errorElementEmptyField.classList.contains('form__error__message')) {
    input.classList.remove('error-border');
    input.classList.remove('mb-0');
    input.previousElementSibling.classList.remove('mb-0');
    if (input.type === 'text') {
      input.value = input.value.trim();
    }
    errorElementEmptyField.classList.remove('error-message-active');
  }

  if (errorMessageUnregisteredUser) {
    errorMessageUnregisteredUser.classList.remove('d-block');
  }
}

async function login(formLogin, formData) {
  try {
    const formLoginUrl = formLogin.action;
    const response = await axios.post(formLoginUrl, formData);
    // const response = simApiLogin();

    const token = response.data.token;
    document.cookie = `auth_token=${token}; path=/; secure; SameSite=Lax`;

    window.location.href = '/templates/crm/crm.html';
  } catch (error) {
    console.error('Error de autenticación:', error);
    let errorMessage = formLogin.nextElementSibling;
    errorMessage.classList.add('d-block');
  }
}

function simApiLogin() {
  const response = {
    data: {
      token: 'ghfh8648ñ4gyrmnv87961reyibg58465yiggvfkjhgbs45565eytwfbxncmoik'
    }
  };
  return response;
}