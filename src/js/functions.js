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

// Validación de campos de tipo checkBox de un formulario
export function validateCheckBoxes(obj) {
  return Object.values(obj).every( input => input !== false)
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
  inputFields.forEach( inputField => inputField.value = '' );
}

// Limpia los valores de los checkbox
export function clearCheckBoxFields(checkboxFields) {
  checkboxFields.forEach( checkboxField => checkboxField.checked = false );
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