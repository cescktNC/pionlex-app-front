import { 
  validateEmptyFields, 
  validatePhoneNumber, 
  validateEmail, 
  populateInputFields,
  setRadioValue,
  clearRadioFields,
  clearInputFields, 
  populateSelectOptions, 
  setSelectOption, 
  removeSelectedOption, 
  showError,
  showToast,
  languageDatatable,
  applyDataTableStyles,
  refreshDatatable
} from './functions';
import { usersUrl, departmentsUrl, getRecord, deleteRecord } from './API'
import $ from 'jquery';
import * as bootstrap from 'bootstrap'; // Para poder crear instancias de bootstrap

// Variables globales
let departments;
let addNewUserButton, deleteUserButton, deletingUserButton, saveUserButton, savingUserButton;
let userCreateEditModalLabel, inputName, inputLastname, inputBirthdate, inputGenderMale, inputGenderFemale, inputPhoneNumber, inputEmail, selectDepartment, inputPosition, inputFields, inputRadios;
let userToast, userDeleteModal, userCreateEditModal, toastBootstrap;

// Funciones
// Muestra el listado de usuarios en un datatable
async function showUsers() {
  const users = await fetchAPI('GET', usersUrl);
  departments = await fetchAPI('GET', departmentsUrl);

  // Si ya existe una instancia del DataTable 'usersTable', se destruye
  if ($.fn.DataTable.isDataTable('#usersTable')) {
    $('#usersTable').DataTable().destroy();
  }

  $('#usersTable').DataTable({
    data: users,
    columns: [
      { 
        data: null,
        className: 'td td-align-left',
        render: data => {
          const profileImageUrl = data.profileImageUrl || 'images/profile_picture/no-photo.jpg';
          return `
              <img src="${profileImageUrl}" alt="Imagen de perfil" class="profile-photo">
              ${data.name} ${data.lastname}
          `;
        }
      },
      { data: 'phoneNumber', className: 'td td-align-center' },
      { data: 'email', className: 'td td-align-center' },
      { data: 'position', className: 'td td-align-center' },
      { 
        data: null,
        className: 'td td-align-center td-w-300',
        width: '140px',
        render: data => {
          const department = departments.find(department => department.id === data.department);
          return `<span>${department.name}</span>`;
        }
      },
      {
        data: null,
        className: 'td td-align-center',
        orderable: false,
        render: data => {
          return `
            <button type="button" data-bs-toggle="modal" data-bs-target="#userCreateEditModal" class="btn-edit" data-id="${data.id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" data-bs-toggle="modal" data-bs-target="#userDeleteModal" class="btn-delete" data-id="${data.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          `;
        }
      }
    ],
    language: languageDatatable('es'),
  });

  $('#usersTable').on('click', '.btn-delete', handleDeleteUserClick);

  $('#usersTable').on('click', '.btn-edit', handleEditUserClick);

}

// Recoge el id y nombre completo del usuario para mandarlo al botón de 'Eliminar'
function handleDeleteUserClick(event) {
  const deleteButton = event.target.parentElement;
  const idUser = deleteButton.dataset.id;

  // Se obtiene la fila del usuario que se quiere eliminar
  const dataTableUsers = $('#usersTable').DataTable();
  const row = dataTableUsers.row($(deleteButton).closest('tr'));

  // Se guarda el nombre completo del usuario
  const rowData = row.data();
  const fullName = `${rowData.name} ${rowData.lastname}`;

  handleUserEditOrDelete(idUser, fullName, false);
}

async function handleEditUserClick(event) {
  const editButton = event.target.parentElement;
  const idUser = editButton.dataset.id;

  userCreateEditModalLabel.innerText = 'Editar Usuario';

  const user = await getRecord(idUser, usersUrl);
  const { name, lastname, birthdate, gender, phoneNumber, email, department, position } = user;
  const valuesInputFields = [name, lastname, birthdate, phoneNumber, email, position];

  populateInputFields(inputFields, valuesInputFields);
  setRadioValue(inputRadios, gender);
  await showDepartments(department);

  const fullName = `${name} ${lastname}`;
  handleUserEditOrDelete(idUser, fullName);
}

// Guarda el id y el nombre completo del usuario en el botón correspondiente, para luego poderlo mostrar en el toast
function handleUserEditOrDelete(idUser, fullName, editButton = true) {
  if (editButton) {
    saveUserButton.dataset.idUser = idUser;
    saveUserButton.dataset.fullName = fullName;
  } else {
    deleteUserButton.dataset.idUser = idUser;
    deleteUserButton.dataset.fullName = fullName;
  }
}

// Muestra los diferentes departamentos en el select de los formulario de crear y editar usuario
async function showDepartments(departmentUser) {
  if (selectDepartment.children.length === 1 && selectDepartment.children[0].disabled) {
    populateSelectOptions(selectDepartment, departments, departmentUser);
  } else {
    setSelectOption(selectDepartment, departmentUser);
  }
}

// Borra los datos del formulario de usuario
function clearUserForm() {
  userCreateEditModalLabel.innerText = 'Crear Usuario';
  clearInputFields(inputFields);
  clearRadioFields(inputRadios);
  if (selectDepartment.children.length === 1 && selectDepartment.children[0].disabled) {
    populateSelectOptions(selectDepartment, departments);
  } else {
    removeSelectedOption(selectDepartment);
  }
  saveUserButton.dataset.idUser = '';
  saveUserButton.dataset.fullName = '';
}

// Elimina un usuario de la BD
async function deleteUser() {
  const idUser = parseInt(deleteUserButton.dataset.idUser);
  const response = await deleteRecord(idUser, usersUrl);

  deleteUserButton.classList.add('d-none');
  deletingUserButton.classList.remove('d-none');
  // Esto es temporal para simular el tiempo de respuesta del backend
  setTimeout( async () => {
    userDeleteModal.hide();
    deleteUserButton.classList.remove('d-none');
    deletingUserButton.classList.add('d-none');
    const users = await fetchAPI('GET', usersUrl);
    refreshDatatable('usersTable', users);
    // showToast(response, deleteUserButton, userToast, toastBootstrap, 'Eliminar', 'se ha eliminado correctamente', 'no ha podido ser eliminado');
  }, 2000);

  // Cuando se quite el codigo temporal anterior hay que descomentar estas líneas
  // userDeleteModal.hide();
  // deleteUserButton.classList.remove('d-none');
  // deletingUserButton.classList.add('d-none');
  // const users = await fetchAPI('GET', usersUrl);
  // refreshDatatable('usersTable', users);
  // showToast(response, deleteUserButton, userToast, toastBootstrap, 'Eliminar', 'se ha eliminado correctamente', 'no ha podido ser eliminado');
}

// Guarda los datos de un usuario
async function saveUser() {

  const id = saveUserButton.dataset.idUser;
  const name = inputName.value;
  const lastname = inputLastname.value;
  const birthdate = inputBirthdate.value;
  const gender = document.querySelector('input[name="gender"]:checked').id;
  const phoneNumber = inputPhoneNumber.value;
  const email = inputEmail.value;
  const department = selectDepartment.value;
  const position = inputPosition.value;

  let user;
  id === ''
  ? user = { name, lastname, birthdate, gender, phoneNumber, email, department, position }
  : user = { id, name, lastname, birthdate, gender, phoneNumber, email, department, position };
  console.log(user);
  
  if (!validateEmptyFields(user)) {
    showError('Todos los campos son obligatorios.', 'errorAlert');
    return;
  }

  if (!validatePhoneNumber(phoneNumber)) {
    showError('Teléfono incorrecto.', 'errorAlert');
    return;
  }

  if (!validateEmail(email)) {
    showError('Email incorrecto.', 'errorAlert');
    return;
  }

  let response, successMessage, errorMessage;
  if (saveUserButton.dataset.idUser === '') {
    response = await fetchAPI('POST', usersUrl, user);
    successMessage = 'Usuario creado correctamente';
    errorMessage = 'No se ha podido crear el usuario';
  } else {
    response = await fetchAPI('POST', usersUrl, user);
    successMessage = 'se ha modificado correctamente';
    errorMessage = 'no ha podido ser modificado';
  }

  saveUserButton.classList.add('d-none');
  savingUserButton.classList.remove('d-none');
  // Esto es temporal para simular el tiempo de respuesta del backend
  setTimeout( async () => {
    userCreateEditModal.hide();
    saveUserButton.classList.remove('d-none');
    savingUserButton.classList.add('d-none');
    const users = await fetchAPI('GET', usersUrl);
    refreshDatatable('usersTable', users);
    // showToast(response, saveUserButton, userToast, toastBootstrap, 'Guardar', successMessage, errorMessage);
  }, 2000);

  // Cuando se quite el codigo temporal anterior hay que descomentar estas líneas
  // userCreateEditModal.hide();
  // saveUserButton.classList.remove('d-none');
  // savingUserButton.classList.add('d-none');
  // const users = await fetchAPI('GET', usersUrl);
  // refreshDatatable('usersTable', users);
  // showToast(response, saveUserButton, userToast, toastBootstrap, 'Guardar', successMessage, errorMessage);

}

export async function initUsers() {
  // Inicializar variables
  addNewUserButton = document.querySelector('#addNewUserButton');
  deleteUserButton = document.querySelector('#deleteUserButton');
  deletingUserButton = document.querySelector('#deletingUserButton');
  saveUserButton = document.querySelector('#saveUserButton');
  savingUserButton = document.querySelector('#savingUserButton');

  userToast = document.querySelector('#userToast');

  userCreateEditModalLabel = document.querySelector('#userCreateEditModalLabel');
  inputName = document.querySelector('#name');
  inputLastname = document.querySelector('#lastname');
  inputBirthdate = document.querySelector('#birthdate');
  inputGenderMale = document.querySelector('#male');
  inputGenderFemale = document.querySelector('#female');
  inputPhoneNumber = document.querySelector('#phoneNumber');
  inputEmail = document.querySelector('#email');
  selectDepartment = document.querySelector('#department');
  inputPosition = document.querySelector('#position');
  inputFields = [inputName, inputLastname, inputBirthdate,inputPhoneNumber, inputEmail, inputPosition];
  inputRadios = [inputGenderMale, inputGenderFemale];

  // Instanciar componentes de Bootstrap
  userDeleteModal = new bootstrap.Modal(document.querySelector('#userDeleteModal'));
  userCreateEditModal = new bootstrap.Modal(document.querySelector('#userCreateEditModal'));
  toastBootstrap = bootstrap.Toast.getOrCreateInstance(userToast);

  // Añadir eventos
  addNewUserButton.addEventListener('click', clearUserForm);
  deleteUserButton.addEventListener('click', deleteUser);
  saveUserButton.addEventListener('click', saveUser);

  // Lógica
  await showUsers();
  applyDataTableStyles('usersTable');
}