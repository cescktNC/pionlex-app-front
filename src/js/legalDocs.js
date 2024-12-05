import router from './routes';

// Funciones

// Añado la clase activa al elemento del menú que se hace click
function addActiveClass(legalNavLinkElement) {
  const legalNavLinks = document.querySelectorAll('.legal-nav-link');
  // Elimino la clase activa de todos los elementos del menú para asegurar que solo uno quede seleccionado
  legalNavLinks.forEach( legalNavLink => {
    legalNavLink.classList.remove('legal-nav-link-active');
  });

  legalNavLinkElement.classList.add('legal-nav-link-active');
}

function navigateToOtherLegalData(e) {
  const legalNavLinkElement = e.target;
  addActiveClass(legalNavLinkElement);
  const templateName = legalNavLinkElement.id;
  router.navigate(`/legal-docs/${templateName}/0`);
}

export function initLegalDocs(docType) {
  const dataPolicy = document.querySelector('#data-policy');
  const termsOfUse = document.querySelector('#terms-of-use');
  const linkToSelect = document.querySelector(`#${docType}`);

  dataPolicy.addEventListener('click', navigateToOtherLegalData);
  termsOfUse.addEventListener('click', navigateToOtherLegalData);
  linkToSelect.classList.add('legal-nav-link-active');
}