import { 
  validateFields, 
  validatePhoneNumber, 
  validateEmail, 
  populateInputFields, 
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
import { urlClients, urlStatuses, createRecord, editRecord, getRecords, deleteRecord } from './API'
import $ from 'jquery';
import * as bootstrap from 'bootstrap'; // Para poder crear instancias de bootstrap

// Variables globales
let statuses;
let addNewClientButton, deleteClientButton, deletingClientButton, saveClientButton, savingClientButton;
let clientCreateEditModalLabel, inputName, inputLastname, inputPhoneNumber, inputEmail, inputCity, inputRegistrationDate, inputFields, selectStatus;
let clientToast, clientDeleteModal, clientCreateEditModal, toastBootstrap;

// Funciones
async function showClients() {
  const clients = await getRecords(urlClients);
  statuses = await getRecords(urlStatuses);

  // Si ya existe una instancia del DataTable 'clientsTable', se destruye
  if ($.fn.DataTable.isDataTable('#clientsTable')) {
    $('#clientsTable').DataTable().destroy();
  }

  $('#clientsTable').DataTable({
    data: clients,
    columns: [
      { 
        data: null,
        className: 'td td-align-left',
        render: data => `${data.name} ${data.lastname}`
      },
      { data: 'phoneNumber', className: 'td td-align-center' },
      { data: 'email', className: 'td td-align-center' },
      { data: 'city', className: 'td td-align-center' },
      { data: 'registrationDate', className: 'td td-align-center' },
      // { 
      //   data: 'fecha_alta',
      //   className: 'td td-align-center',
      //   render: data => {
      //     const [year, month, day] = data.split('-');
      //     return `${day}/${month}/${year}`;
      //   }
      // },
      { 
        data: null,
        className: 'td td-align-center',
        width: '140px',
        render: data => {
          const status = statuses.find(status => status.id === data.status);
          return `
            <div class="client-status">
              <span>${status.name}</span>
            </div>`;
        }
      },
      {
        data: null,
        className: 'td td-align-center',
        orderable: false,
        render: data => {
          return `
            <button type="button" data-bs-toggle="modal" data-bs-target="#clientCreateEditModal" class="btn-edit" data-id="${data.id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" data-bs-toggle="modal" data-bs-target="#clientDeleteModal" class="btn-delete" data-id="${data.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          `;
        }
      }
    ],
    language: languageDatatable('es'),
    createdRow: function(row, data) {
      const statusCell = $('td', row).eq(5);
      let div = statusCell.find('div');
      const status = parseInt(data.status);

      switch (status) {
        case 1:
          div.addClass('in-progress');
          break;
        case 2:
          div.addClass('awaiting-documentation');
          break;
        case 3:
          div.addClass('closed');
          break;
        case 4:
          div.addClass('new');
          break;
        case 5:
          div.addClass('pending-payment');
          break;
        case 6:
          div.addClass('under-review');
          break;
        case 7:
          div.addClass('awaiting-resolution');
          break;
        case 8:
          div.addClass('overdue');
          break;
        case 9:
          div.addClass('archived');
          break;
        case 10:
          div.addClass('pending-resolution');
          break;
      }
    }
  });

  $('#clientsTable').on('click', '.btn-delete', handleDeleteClientClick);

  $('#clientsTable').on('click', '.btn-edit', handleEditClientClick);

}

function handleDeleteClientClick(event) {
  const deleteButton = event.target.parentElement;
  const idClient = deleteButton.dataset.id;

  // Se obtiene la fila del cliente que se quiere eliminar
  const dataTableClients = $('#clientsTable').DataTable();
  const row = dataTableClients.row($(deleteButton).closest('tr'));

  // Se guarda el nombre completo del cliente
  const rowData = row.data();
  const fullName = `${rowData.name} ${rowData.lastname}`;

  handleClientEditOrDelete(idClient, fullName, false);
}

async function handleEditClientClick(event) {
  const editButton = event.target.parentElement;
  const idClient = editButton.dataset.id;

  clientCreateEditModalLabel.innerText = 'Editar Cliente';

  // Se obtiene la fila del cliente que se quiere editar
  const dataTableClients = $('#clientsTable').DataTable();
  const row = dataTableClients.row($(editButton).closest('tr'));

  // Se hace el destructuring del json row.data()
  const { name, lastname, phoneNumber, email, city, registrationDate, status } = row.data();
  const valuesInputFields = [name, lastname, phoneNumber, email, city, registrationDate, status];

  populateInputFields(inputFields, valuesInputFields);
  await showStatuses(status);

  const fullName = `${name} ${lastname}`;
  handleClientEditOrDelete(idClient, fullName);
}

// Guarda el id y el nombre completo del cliente en el botón correspondiente, para luego poderlo mostrar en el toast
function handleClientEditOrDelete(idClient, fullName, editButton = true) {
  if (editButton) {
    saveClientButton.dataset.idClient = idClient;
    saveClientButton.dataset.fullName = fullName;
  } else {
    deleteClientButton.dataset.idClient = idClient;
    deleteClientButton.dataset.fullName = fullName;
  }
}

// Muestra los diferentes estados en el select de los formulario de crear y editar cliente
async function showStatuses(statusClient) {
  // Verifica si el select ya contiene las opciones. Si no tiene opciones rellenar el select. 
  // Si ya tiene opciones, selecciona la opción correspondiente.
  if (selectStatus.children.length === 1 && selectStatus.children[0].disabled) {
    populateSelectOptions(selectStatus, statuses, statusClient);
  } else {
    setSelectOption(selectStatus, statusClient);
  }
}

// Borra los datos del formulario de cliente
function clearClientForm() {
  clientCreateEditModalLabel.innerText = 'Crear Cliente';
  clearInputFields(inputFields);
  if (selectStatus.children.length === 1 && selectStatus.children[0].disabled) {
    populateSelectOptions(selectStatus, statuses);
  } else {
    removeSelectedOption(selectStatus);
  }
  saveClientButton.dataset.idClient = '';
  saveClientButton.dataset.fullName = '';
}

// Elimina un cliente de la BD
async function deleteClient() {
  const idClient = parseInt(deleteClientButton.dataset.idClient);
  const response = await deleteRecord(idClient, urlClients);

  deleteClientButton.classList.add('d-none');
  deletingClientButton.classList.remove('d-none');
  // Esto es temporal para simular el tiempo de respuesta del backend
  setTimeout( async () => {
    clientDeleteModal.hide();
    deleteClientButton.classList.remove('d-none');
    deletingClientButton.classList.add('d-none');
    const clients = await getRecords(urlClients);
    refreshDatatable('clientsTable', clients);
    showToast(response, deleteClientButton, clientToast, toastBootstrap, 'Eliminar', 'se ha eliminado correctamente', 'no ha podido ser eliminado');
  }, 2000);

  // Cuando se quite el codigo temporal anterior hay que descomentar estas líneas
  // clientDeleteModal.hide();
  // deleteClientButton.classList.remove('d-none');
  // deletingClientButton.classList.add('d-none');
  // const clients = await getRecords(urlClients);
  // refreshDatatable('clientsTable', clients);
  // showToast(response, deleteClientButton, clientToast, toastBootstrap, 'Eliminar', 'se ha eliminado correctamente', 'no ha podido ser eliminado');
}

async function saveClient() {
  const id = saveClientButton.dataset.idClient;
  const name = inputName.value;
  const lastname = inputLastname.value;
  const phoneNumber = inputPhoneNumber.value;
  const email = inputEmail.value;
  const city = inputCity.value;
  const registrationDate = inputRegistrationDate.value;
  const status = selectStatus.value;

  let client;
  id === ''
  ? client = { name, lastname, phoneNumber, email, city, registrationDate, status }
  : client = { id, name, lastname, phoneNumber, email, city, registrationDate, status };
  
  if (!validateFields(client)) {
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
  if (saveClientButton.dataset.idClient === '') {
    response = await createRecord(client, urlClients);
    successMessage = 'Cliente creado correctamente';
    errorMessage = 'No se ha podido crear el cliente';
  } else {
    response = await editRecord(client, urlClients);
    successMessage = 'se ha modificado correctamente';
    errorMessage = 'no ha podido ser modificado';
  }

  saveClientButton.classList.add('d-none');
  savingClientButton.classList.remove('d-none');
  // Esto es temporal para simular el tiempo de respuesta del backend
  setTimeout( async () => {
    clientCreateEditModal.hide();
    saveClientButton.classList.remove('d-none');
    savingClientButton.classList.add('d-none');
    const clients = await getRecords(urlClients);
    refreshDatatable('clientsTable', clients);
    showToast(response, saveClientButton, clientToast, toastBootstrap, 'Guardar', successMessage, errorMessage);
  }, 2000);

  // Cuando se quite el codigo temporal anterior hay que descomentar estas líneas
  // clientCreateEditModal.hide();
  // saveClientButton.classList.remove('d-none');
  // savingClientButton.classList.add('d-none');
  // const clients = await getRecords(urlClients);
  // refreshDatatable('clientsTable', clients);
  // showToast(response, saveClientButton, clientToast, toastBootstrap, 'Guradar', 'se ha modificado correctamente', 'no ha podido ser modificado');

}

export async function initClients() {
  // Inicializar variables
  addNewClientButton = document.querySelector('#addNewClientButton');
  deleteClientButton = document.querySelector('#deleteClientButton');
  deletingClientButton = document.querySelector('#deletingClientButton');
  saveClientButton = document.querySelector('#saveClientButton');
  savingClientButton = document.querySelector('#savingClientButton');

  clientToast = document.querySelector('#clientToast');

  clientCreateEditModalLabel = document.querySelector('#clientCreateEditModalLabel');
  inputName = document.querySelector('#name');
  inputLastname = document.querySelector('#lastname');
  inputPhoneNumber = document.querySelector('#phoneNumber');
  inputEmail = document.querySelector('#email');
  inputCity = document.querySelector('#city');
  inputRegistrationDate = document.querySelector('#registrationDate');
  inputFields = [inputName, inputLastname, inputPhoneNumber, inputEmail, inputCity, inputRegistrationDate];
  selectStatus = document.querySelector('#status');

  // Instanciar componentes de Bootstrap
  clientDeleteModal = new bootstrap.Modal(document.querySelector('#clientDeleteModal'));
  clientCreateEditModal = new bootstrap.Modal(document.querySelector('#clientCreateEditModal'));
  toastBootstrap = bootstrap.Toast.getOrCreateInstance(clientToast);

  // Añadir eventos
  addNewClientButton.addEventListener('click', clearClientForm);
  deleteClientButton.addEventListener('click', deleteClient);
  saveClientButton.addEventListener('click', saveClient);

  // Lógica
  await showClients();
  applyDataTableStyles('clientsTable');
}