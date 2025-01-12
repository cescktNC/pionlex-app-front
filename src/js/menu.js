// Variables
let scrollTimeOut;
const page = document.querySelector('.page');
const navbarMenu = document.querySelector('.navbar-menu');
const asidenavMenu = document.querySelector('.asidenav-menu');
const asidenavMenuModules = document.querySelector('#asidenav-menu-modules');
const notAccordionItems = asidenavMenuModules.querySelectorAll('.not-accordion-item');
const accordionItems = asidenavMenuModules.querySelectorAll('.accordion-item');
const sectionItems = asidenavMenuModules.querySelectorAll('.list-group-item-custom-level-1');
const sunIcon = document.querySelector('#sun-icon');
const moonIcon = document.querySelector('#moon-icon');
const themeSwitcher = document.querySelector('#theme-switcher');
const contentPage = document.querySelector('#content-page');
const footerYear = document.querySelector('[data-footer-year]');

// Eventos
asidenavMenu.addEventListener('scroll', scroll);
notAccordionItems.forEach( notAccordionItem => {
  notAccordionItem.addEventListener('click', collapseAccordion);
});
accordionItems.forEach( accordionItem => {
  accordionItem.addEventListener('click', clearSelection);
});
sectionItems.forEach( sectionItem => {
  sectionItem.addEventListener('click', addSelection);
});
themeSwitcher.addEventListener('click', () => {
  page.classList.toggle('form--dark--theme');
  navbarMenu.classList.toggle('dark-theme');
  sunIcon.classList.toggle('d-none');
  moonIcon.classList.toggle('d-none');
  contentPage.classList.toggle('dark-theme-content-page');
});

// Año en el footer
footerYear.textContent = new Date().getFullYear();

// Funciones
function scroll() {
  asidenavMenu.classList.add('scrolling');

  clearTimeout(scrollTimeOut);
  scrollTimeOut = setTimeout( () => {
    asidenavMenu.classList.remove('scrolling');
  }, 500);
}

function collapseAccordion(e) {
  const clickedElement = e.target;
  clickedElement.classList.add('text-white');

  const accordionElement = asidenavMenuModules.querySelector('.show');
  const accordionElementParent = accordionElement.parentElement;
  const button = accordionElementParent.querySelector('button');
  button.classList.add('collapsed');
  button.setAttribute('aria-expanded', 'false');
  accordionElement.classList.remove('show');

  const activeButton = asidenavMenuModules.querySelector('.active');
  if (activeButton) {
    activeButton.classList.remove('active');
  }
}

function clearSelection() {
  const notAccordionElement = document.querySelector('li.not-accordion-item span.text-white');
  if (notAccordionElement) {
    notAccordionElement.classList.remove('text-white');
  }
}

function addSelection(e) {
  const activeButton = asidenavMenuModules.querySelector('.active');
  if (activeButton) {
    activeButton.classList.remove('active');
  }

  const clickedElement = e.target.closest('li');
  const button = clickedElement.querySelector('button');
  button.classList.add('active');
}