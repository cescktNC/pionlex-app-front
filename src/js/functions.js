import { passwordMinLength, userFieldLabels, errorMessages } from './constants';
import $ from 'jquery';
import * as bootstrap from 'bootstrap'; // Para instancias de Bootstrap

/***************************************************************************/
/**                             GENERALES                                 **/
/***************************************************************************/

// Busca y devuelve el valor de una cookie
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Borra todos los scritps cargados menos el del main.js
export function removeAllScriptsExceptMain() {
  const scripts = document.querySelectorAll('script');
  scripts.forEach( script => {
    if (!script.src.includes('main.js')) {
      script.remove();
    }
  });
}

// Añade los scripts pasados por parámetro
export function addScripts(scripts) {
  scripts.forEach( script => {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'module';
    scriptElement.src = `/src/js/${script}.js`;
    document.body.appendChild(scriptElement);
  });
}

// Añade una clase a un elemento html
export function addClassFromId(id, className) {
  const htmlElement = document.querySelector(`#${id}`);
  htmlElement.classList.add(className);
}

// Elimina una clase a un elemento html
export function removeClassFromId(id, className) {
  const htmlElement = document.querySelector(`#${id}`);
  htmlElement.classList.remove(className);
}

// Intercambia dos elementos ocultando el primero y mostrando el segundo
export function toggleElements(elementToHide, elementToShow) {
  elementToHide.classList.add('d-none');
  elementToShow.classList.remove('d-none');
}

/***************************************************************************/
/**                            FORMULARIOS                                **/
/***************************************************************************/

export function validateErrors(obj, checkBoxes = {}) {
  let errors = {};
  
  errors = validateEmptyFields(obj);
  
  if (("email" in obj) && !errors.email) {
    errors = {...errors, ...validateEmail(obj.email)};
  }
  
  if (("password" in obj) && !errors.password) {
    errors = {...errors, ...validatePassword(obj)};
  }

  if (("phoneNumber" in obj) && !errors.phoneNumber) {
    errors = {...errors, ...validatePhoneNumber(obj.phoneNumber)};
  }

  if (Object.keys(checkBoxes).length > 0) {
    errors = {...errors, ...validateCheckBoxes(checkBoxes)};
  }

  return errors;
}

export function showFieldErrors(form, errors) {
  for (let [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      value = value.pop();
    }
    const fieldName = userFieldLabels[key] || key;
    showErrorForm(form, key, value.replace(key, fieldName));
  }
}

export function clearFieldErrors(form, classNameErrors, classNameInputs, inputClass = 'mb-14', spanClass = 'd-none') {
  const spanErrors = form.querySelectorAll(`${classNameErrors}`);
  spanErrors.forEach( span => span.classList.add(spanClass) );
  
  const inputs = form.querySelectorAll(`${classNameInputs}`);
  inputs.forEach( input => input.classList.add(inputClass) );
}

export function showErrorForm(form, fieldId, errorMessage, inputClass = 'mb-14', spanClass = 'd-none') {
  const input = form.querySelector(`[data-${fieldId}]`);
  if (!input) return;
  
  input.classList.remove(inputClass);
  
  const span = form.querySelector(`.form__validation__error[data-error-for="${fieldId}"]`);

  if (span) {
    span.classList.remove(spanClass);
    span.innerHTML = `<i class="fa-solid fa-circle-exclamation form__validation__error__icon"></i>${errorMessage}`;
  }
}

// Validación de campos vacios de un formulario
export function validateEmptyFields(obj) {
  let emptyFields = {};

  for (let [key, value] of Object.entries(obj)) {
    if (value === '' && key !== 'password_confirmation') {
      emptyFields[key] = errorMessages.required.replace(':field', key);
    }
  }
  return emptyFields;
}

// Se valida que el formato del email es correcto
export function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailPattern.test(email)) {
    return {
      email: errorMessages.email.replace(':field', 'email'),
    };
  }

  return {};
}

// Se valida que las dos contraseñas son correctas
function validatePassword(obj) {
  if (obj.password) {
    if (obj.password.length < passwordMinLength) {
      return {
        password: errorMessages.min.string
                    .replace(':field', 'password')
                    .replace(':min', passwordMinLength),
      };
    }
    if (("password_confirmation" in obj) && obj.password !== obj.password_confirmation) {
      return {
        password: errorMessages.confirmed.replace(':field', 'password'),
      };
    }
  }

  return {};
}

// Validación de campos de tipo checkBox de un formulario
function validateCheckBoxes(obj) {
  let emptyCheckFields = {};
  
  for (let [key, value] of Object.entries(obj)) {
    if (!value) {
      emptyCheckFields[key] = errorMessages.policiesAndTerms;
    }
  }

  return emptyCheckFields;
}

export function validatePhoneNumber(phoneNumber) {
  // const phoneNumberPattern = /^\+?[0-9]{1,3}?[0-9]{7,15}$/; // Valida números de cualquier pais
  const phoneNumberPattern = /^(?:\+34)?[0-9]{9}$/; // Valida números de españa

  if (!phoneNumberPattern.test(phoneNumber)) {
    return {
      phoneNumber: errorMessages.phoneNumber.replace(':field', 'Teléfono'),
    };
  }

  return {};
}

// Rellena los inputs
export function populateInputFields(inputFields, valuesInputFields) {
  inputFields.forEach( (inputField, key) => inputField.value = valuesInputFields[key] );
}

// Marca como seleccionado el radio button cuyo id coincide con el value
export function setRadioValue(inputRadios, value) {
  inputRadios.forEach(radio => radio.checked = radio.id === value.toLowerCase());
}

// Resetea los radio button seleccionando sólamente el primero
export function clearRadioFields(inputRadios) {
  inputRadios.forEach( (radio, key) => {
    radio.checked = key === 0;
  });
}

// Limpia los valores de los input
export function clearInputFields(inputFields) {
  inputFields.forEach( inputField => {
    if (inputField.type === 'checkbox') {
      inputField.checked = false;
      return;
    }
    inputField.value = '' 
  });
}

// Rellena un elemento <select> dejando la opción 'optionToSelect' seleccionada
export function populateSelectOptions(selectField, options, optionToSelect) {
  options.forEach( status => {
    const { id, name } = status;
    const optionField = document.createElement('option');
    optionField.value = id;
    optionField.innerText = name;
    if (id === optionToSelect) {
      selectField.querySelector('option[selected]').removeAttribute('selected');
      optionField.selected = true;
    }
    selectField.appendChild(optionField);
  });
}

// Deja una opción seleccionada de un elemento <select>
export function setSelectOption(selectField, optionToSelect) {
  const options = Array.from(selectField.children);
  options.forEach( option => {
    const id = option.value;
    if (id === optionToSelect) {
      option.selected = true;
    }
  });
}

// Resetea un elemento <select> dejando la opción por defecto seleccionada
export function removeSelectedOption(selectField) {
  const options = Array.from(selectField.children);
  options.forEach( option => {
    if (option.selected) {
      option.selected = false;
    }
  });
  options[0].selected = true;
}

// Muestra mensaje de error en los formularios de login cuando no se han rellenado todos los campos.
let alertTimeout;
export function showAlert(message, containerSelector) {

  const container = document.getElementById(containerSelector);

  if (!container) {
    console.log(`El contenedor ${containerSelector} no existe.`);
    return;
  }

  let alert = container.querySelector('.danger');

  if (!alert) {
    alert = document.createElement('div');
    alert.innerHTML = `
      <p class="danger">
        <strong>¡Error!</strong>
        <span>${message}</span>
      </p>
    `;
    container.appendChild(alert);
  } else {
    alert.innerHTML = `
      <strong>¡Error!</strong>
      <span>${message}</span>
    `;
  }

  alertTimeout = setTimeout( () => {
    alert.remove();
  }, 10000);
}

// Muestra mensaje de error en un formulario cuando no se han rellenado todos los campos.
let errorTimeout;
export function showError(message, containerSelector) {

  const container = document.getElementById(containerSelector);

  if (!container) {
    console.log(`El contenedor ${containerSelector} no existe.`);
    return;
  }

  let error = document.querySelector('.errorAlert');

  if (!error) {
    container.classList.add('errorAlert');
    container.innerText = message;
  } else {
    error.classList.add('errorAlert');
    error.innerText = message;
  }

  clearTimeout(errorTimeout);
  errorTimeout = setTimeout( () => {
    container.innerText = '';
    container.classList.remove('errorAlert');
  }, 5000);
}

// Configurar el atributo max en un input de tipo date a la fecha actual
export function setMaxDateAttribute() {
  const inputDate = clientCreateEditForm.querySelector('[data-registrationDate]');
  const today = new Date().toISOString().split('T')[0];
  inputDate.setAttribute('max', today);
}

export function getFormInputs(form, selector) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("El primer argumento debe ser un elemento de formulario válido.");
  }

  if (typeof selector !== "string" || selector.trim() === "") {
    throw new Error("El selector debe ser un string CSS válido.");
  }

  return form.querySelectorAll(selector);
}

export function constructFormObject(inputs) {
  let object = {};
  inputs.forEach( input => {
    if (input.type === 'checkbox') {
      object = { ...object, ...{ [input.name]: input.checked } };
      return;
    }
    object = { ...object, ...{ [input.name]: input.value } }
  });

  return object;
}

/***************************************************************************/
/**                               TOASTS                                  **/
/***************************************************************************/

// Se muestra el toast correspondiente a la respuesta del backend
export function showToast(isSuccess, title, message) {
  const toast = document.querySelector('[data-toast]');
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
  const iconToastHeader = toast.querySelector('.toast-header i');
  const titleToastHeader = toast.querySelector('.toast-header strong');
  const toastBody = toast.querySelector('.toast-body');

  titleToastHeader.innerText = title;
  toastBody.innerText = message;

  if (isSuccess) {
    iconToastHeader.classList.add('fa-solid', 'fa-check');
    toast.classList.add('toastSuccess');
  } else {
    iconToastHeader.classList.add('fa-solid', 'fa-triangle-exclamation');
    toast.classList.add('toastError');
  }
  toastBootstrap.show();
}

/***************************************************************************/
/**                             DATATABLES                                **/
/***************************************************************************/

// Devuelve las traducciones del datatable
export function languageDatatable(idLanguage) {
  const language = {
    es: {
      "lengthMenu": "Mostrar _MENU_ clientes",
      "search": "Buscar:",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ clientes",
      "infoEmpty": "Mostrando 0 a 0 de 0 clientes",
      "infoFiltered": "(filtrado de _MAX_ clientes en total)",
      "infoPostFix": "", // Añade información al final del 'info'
      "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
      },
      "emptyTable": "No hay información",
      "loadingRecords": "Cargando...",
      "processing": "Procesando...",
      "zeroRecords": "No se encontraron resultados",
      "thousands": ".",
      "decimal": ",",
      // Añade una descripción de que se puede ordenar de forma ascendente y descendente para lectores de pantalla (accesibilidad)
      "aria": {
        "sortAscending": ": activar para ordenar la columna de manera ascendente",
        "sortDescending": ": activar para ordenar la columna de manera descendente"
      }
    },
    en: {
      "lengthMenu": "Show _MENU_ clients",
      "search": "Search:",
      "info": "Showing _START_ to _END_ of _TOTAL_ clients",
      "infoEmpty": "Showing 0 to 0 of 0 clients",
      "infoFiltered": "(filtered from _MAX_ total clients)",
      "infoPostFix": "",
      "paginate": {
        "first": "First",
        "last": "Last",
        "next": "Next",
        "previous": "Previous"
      },
      "emptyTable": "No data available",
      "loadingRecords": "Loading...",
      "processing": "Processing...",
      "zeroRecords": "No matching records found",
      "thousands": ",",
      "decimal": ".",
      "aria": {
        "sortAscending": ": activate to sort column ascending",
        "sortDescending": ": activate to sort column descending"
      }
    },
    fr: {
      "lengthMenu": "Afficher _MENU_ clients",
      "search": "Rechercher:",
      "info": "Affichage de _START_ à _END_ sur _TOTAL_ clients",
      "infoEmpty": "Affichage de 0 à 0 sur 0 clients",
      "infoFiltered": "(filtré de _MAX_ clients au total)",
      "infoPostFix": "",
      "paginate": {
        "first": "Premier",
        "last": "Dernier",
        "next": "Suivant",
        "previous": "Précédent"
      },
      "emptyTable": "Aucune donnée disponible",
      "loadingRecords": "Chargement...",
      "processing": "Traitement...",
      "zeroRecords": "Aucun résultat trouvé",
      "thousands": " ",
      "decimal": ",",
      "aria": {
        "sortAscending": ": activer pour trier la colonne de manière ascendante",
        "sortDescending": ": activer pour trier la colonne de manière descendante"
      }
    },
    pt: {
      "lengthMenu": "Mostrar _MENU_ clientes",
      "search": "Buscar:",
      "info": "Mostrando _START_ até _END_ de _TOTAL_ clientes",
      "infoEmpty": "Mostrando 0 até 0 de 0 clientes",
      "infoFiltered": "(filtrado de _MAX_ clientes no total)",
      "infoPostFix": "",
      "paginate": {
        "first": "Primeiro",
        "last": "Último",
        "next": "Próximo",
        "previous": "Anterior"
      },
      "emptyTable": "Nenhuma informação disponível",
      "loadingRecords": "Carregando...",
      "processing": "Processando...",
      "zeroRecords": "Nenhum resultado encontrado",
      "thousands": ".",
      "decimal": ",",
      "aria": {
        "sortAscending": ": ativar para ordenar a coluna de forma ascendente",
        "sortDescending": ": ativar para ordenar a coluna de forma descendente"
      }
    }
  };
  return language[idLanguage] || language['es']; // Por defecto en español si no existe el idioma
}

// Se aplican los estilos al datatTable
export function applyDataTableStyles(idTable) {
  // Sección de 'Mostrar' n elementos por página
  const lengthElement = document.querySelector(`#${idTable}_wrapper .dt-length`);
  lengthElement.classList.add('lengthElementDataTable');

  // Sección de 'Buscar'
  const searchElement = document.querySelector(`#${idTable}_wrapper .dt-search`);
  searchElement.classList.add('searchElementDataTable');

  // Sección de información (Mostrando 1 a 10 de 28 elementos)
  const infoElement = document.querySelector(`#${idTable}_wrapper .dt-info`);
  infoElement.classList.add('infoElementDataTable');

  // Sección de Paginación
  const pagingElement = document.querySelector(`#${idTable}_wrapper .dt-paging`);
  pagingElement.classList.add('pagingElementDataTable');
}

// Se refresca el datatable actualizando el listado
export async function refreshDatatable(dataTableName, data) {
  const dataTable = $(`#${dataTableName}`).DataTable();
  const currentPage = dataTable.page();

  dataTable.clear();
  dataTable.rows.add(data);
  dataTable.draw();
  dataTable.page(currentPage).draw('page');
}