import * as utilityFunctions from './functions';
import { clientsUrl, statusesUrl, fetchAPI, deleteRecord } from './API'
import $ from 'jquery';
import * as bootstrap from 'bootstrap'; // Para instancias de Bootstrap

const {
  validateErrors,
  clearFieldErrors,
  showFieldErrors,
  toggleElements,
  populateInputFields,
  clearInputFields,
  populateSelectOptions,
  setSelectOption,
  removeSelectedOption,
  showToast,
  languageDatatable,
  applyDataTableStyles,
  refreshDatatable,
  setMaxDateAttribute,
  getFormInputs,
  constructFormObject
} = utilityFunctions;

// Variables globales
let statuses;
let deleteClientButton,
  deletingClientButton,
  saveClientButton,
  savingClientButton,
  clientCreateEditForm,
  clientCreateEditModalLabel,
  clientToast,
  clientDeleteModal,
  clientCreateEditModal,
  toastBootstrap;

// Funciones
async function showClients() {
  const clients = await fetchAPI('GET', clientsUrl);
  statuses = await fetchAPI('GET', statusesUrl);

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

  // Limpieza de errores previos
  clearFieldErrors(clientCreateEditForm, '.form__validation__error', '[data-input]');

  // Configurar el atributo max del input de tipo date a la fecha actual
  setMaxDateAttribute();

  // Se obtiene la fila del cliente que se quiere editar
  const dataTableClients = $('#clientsTable').DataTable();
  const row = dataTableClients.row($(editButton).closest('tr'));

  // Se hace el destructuring del json row.data()
  const { name, lastname, phoneNumber, email, city, registrationDate, status } = row.data();
  const valuesInputFields = [name, lastname, phoneNumber, email, city, registrationDate, status];

  const inputFields = getFormInputs(clientCreateEditForm, '[data-input]');
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
  const selectStatus = clientCreateEditForm.querySelector('[data-status]');
  if (selectStatus.children.length === 1 && selectStatus.children[0].disabled) {
    populateSelectOptions(selectStatus, statuses, statusClient);
  } else {
    setSelectOption(selectStatus, statusClient);
  }
}

// Borra los datos del formulario de cliente
function clearClientForm() {
  clientCreateEditModalLabel.innerText = 'Crear Cliente';

  // Limpieza de los datos de los inputs
  clearInputFields(getFormInputs(clientCreateEditForm, '[data-input]'));

  // Limpieza de errores previos
  clearFieldErrors(clientCreateEditForm, '.form__validation__error', '[data-input]');

  // Configurar el atributo max del input de tipo date a la fecha actual
  setMaxDateAttribute();

  const selectStatus = clientCreateEditForm.querySelector('[data-status]');
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
  const response = await deleteRecord(idClient, clientsUrl);

  deleteClientButton.classList.add('d-none');
  deletingClientButton.classList.remove('d-none');
  // Esto es temporal para simular el tiempo de respuesta del backend
  setTimeout( async () => {
    clientDeleteModal.hide();
    deleteClientButton.classList.remove('d-none');
    deletingClientButton.classList.add('d-none');
    const clients = await fetchAPI('GET', clientsUrl);
    refreshDatatable('clientsTable', clients);
    showToast(response, deleteClientButton, clientToast, toastBootstrap, 'Eliminar', 'se ha eliminado correctamente', 'no ha podido ser eliminado');
  }, 2000);

  // Cuando se quite el codigo temporal anterior hay que descomentar estas líneas
  // clientDeleteModal.hide();
  // deleteClientButton.classList.remove('d-none');
  // deletingClientButton.classList.add('d-none');
  // const clients = await fetchAPI('GET', clientsUrl);
  // refreshDatatable('clientsTable', clients);
  // showToast(response, deleteClientButton, clientToast, toastBootstrap, 'Eliminar', 'se ha eliminado correctamente', 'no ha podido ser eliminado');
}

async function saveClient() {
  const inputFields = getFormInputs(clientCreateEditForm, '[data-input]');
  
  // Construcción de los datos de cliente
  let client = constructFormObject(inputFields);

  // Validación del formulario
  const errors = validateErrors(client);

  // Limpieza de errores previos
  clearFieldErrors(clientCreateEditForm, '.form__validation__error', '[data-input]');

  // Se muestran los errores en los campos del formulario
  if (Object.keys(errors).length > 0) {
    showFieldErrors(clientCreateEditForm, errors);
    return;
  }

  // Gestion de los botones de guardado
  toggleElements(saveClientButton, savingClientButton);

  const id = saveClientButton.dataset.idClient;
  if (id !== '') client.id = id;

  try {
    // Enviar datos a la API
    const data = await fetchAPI('POST', clientsUrl, client);
    
    // Manejo de errores devueltos por la API
    // if (!data.result) {
      // if (Object.keys(data.status).length > 0) {
      //   showFieldErrors(registerForm, data.status);
      // }
    //   return;
    // }
    

  } catch (error) {
    console.error('Error al obtener los datos:', error.message);
    return;
  } finally {
    toggleElements(savingClientButton, saveClientButton);
  }

  clientCreateEditModal.hide();

  const clients = await fetchAPI('GET', clientsUrl);
  refreshDatatable('clientsTable', clients);

  clearInputFields(inputFields);

  saveClientButton.dataset.idClient === ''
  ? showToast(true, saveClientButton, clientToast, toastBootstrap, 'Guardar', 'Cliente creado correctamente', 'No se ha podido crear el cliente')
  : showToast(true, saveClientButton, clientToast, toastBootstrap, 'Guardar', 'se ha modificado correctamente', 'no ha podido ser modificado');

}

export async function initClients() {
  // Inicializar variables
  clientCreateEditForm = document.querySelector('#clientCreateEditForm');
  const addNewClientButton = document.querySelector('#addNewClientButton');
  deleteClientButton = document.querySelector('#deleteClientButton');
  deletingClientButton = document.querySelector('#deletingClientButton');
  saveClientButton = document.querySelector('#saveClientButton');
  savingClientButton = document.querySelector('#savingClientButton');

  clientToast = document.querySelector('#clientToast');

  clientCreateEditModalLabel = document.querySelector('#clientCreateEditModalLabel');

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