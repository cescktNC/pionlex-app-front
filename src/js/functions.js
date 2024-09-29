// Busca y devuelve el valor de una cookie
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Validación de campos vacios de un formulario
export function validateFields(obj) {
  return Object.values(obj).every( input => input !== '')
}

// Muestra mensaje de error en un formulario
// cuando no se han rellenado todos los campos.
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