/***************************************************************************/
/**                             GENERALES                                 **/
/***************************************************************************/

// Busca y devuelve el valor de una cookie
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
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
    if (name.toLocaleLowerCase() === optionToSelect.toLocaleLowerCase()) {
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
    const name = option.innerText;
    if (name.toLocaleLowerCase() === optionToSelect.toLocaleLowerCase()) {
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

// Muestra mensaje de error en un formulario cuando no se han rellenado todos los campos.
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