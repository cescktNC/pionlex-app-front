import $ from 'jquery';

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

/***************************************************************************/
/**                            FORMULARIOS                                **/
/***************************************************************************/

// Validación de campos vacios de un formulario
export function validateFields(obj) {
  return Object.values(obj).every( input => input !== '')
}

export function validatePhoneNumber(phoneNumber) {
  // const phoneNumberPattern = /^\+?[0-9]{1,3}?[0-9]{7,15}$/; // Valida números de cualquier pais
  const phoneNumberPattern = /^(?:\+34)?[0-9]{9}$/; // Valida números de españa
  return phoneNumberPattern.test(phoneNumber);
}

export function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Rellena los inputs
export function populateInputFields(inputFields, valuesInputFields) {
  inputFields.forEach( (inputField, key) => inputField.value = valuesInputFields[key] );
}

// Limpia los valores de los input
export function clearInputFields(inputFields) {
  inputFields.forEach( inputField => inputField.value = '' );
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

  let alert = document.querySelector('.bg-danger-subtle');

  if (!alert) {
    alert = document.createElement('div');
    alert.classList.add('row', 'justify-content-center');
    alert.innerHTML = `
      <div class="col-11 col-sm-10 col-lg-8">
        <p class="rounded bg-danger-subtle text-danger text-center px-1 py-1 mt-3">
          <strong class="fw-bold">¡Error!</strong>
          <span>${message}</span>
        </p>
      </div>
    `;
    container.appendChild(alert);
  } else {
    alert.innerHTML = `
      <strong class="fw-bold">¡Error!</strong>
      <span>${message}</span>
    `;
  }

  clearTimeout(alertTimeout);
  alertTimeout = setTimeout( () => {
    alert.remove();
  }, 3000);
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
  }, 3000);
}

/***************************************************************************/
/**                               TOASTS                                  **/
/***************************************************************************/

// Se muestra el toast correspondiente a la respuesta del backend
export function showToast(response, button, toast, toastBootstrap, title, successMessage, errorMessage) {
  const iconToastHeader = toast.querySelector('.toast-header i');
  const titleToastHeader = toast.querySelector('.toast-header strong');
  const toastBody = toast.querySelector('.toast-body');
  const fullName = button.dataset.fullName;

  titleToastHeader.innerText = title;

  if (response) {
    iconToastHeader.classList.add('fa-solid', 'fa-check');
    toastBody.innerText = `${fullName} ${successMessage}.`;
    toast.classList.add('toastSuccess');
  } else {
    iconToastHeader.classList.add('fa-solid', 'fa-triangle-exclamation');
    toastBody.innerText = `${fullName} ${errorMessage}.`;
    toast.classList.add('toastError');
  }
  toastBootstrap.show();
}

/***************************************************************************/
/**                             DATATABLES                                **/
/***************************************************************************/

// Se refresca el datatable actualizando el listado
export async function refreshDatatable(dataTableName, data) {
  const dataTable = $(`#${dataTableName}`).DataTable();
  const currentPage = dataTable.page();

  dataTable.clear();
  dataTable.rows.add(data);
  dataTable.draw();
  dataTable.page(currentPage).draw('page');
}