( () => {

  // Variables
  const asidenavMenu = document.querySelector('#asidenav-menu-modules');
  const notAccordionItems = asidenavMenu.querySelectorAll('.not-accordion-item');
  const accordionItems = asidenavMenu.querySelectorAll('.accordion-item');

  // Eventos
  notAccordionItems.forEach( notAccordionItem => {
    notAccordionItem.addEventListener('click', collapseAccordion);
  });
  accordionItems.forEach( accordionItem => {
    accordionItem.addEventListener('click', clearSelection);
  });

  function collapseAccordion(e) {
    const clickedElement = e.target;
    clickedElement.classList.add('text-white');

    const accordionElement = asidenavMenu.querySelector('.show');
    const accordionElementParent = accordionElement.parentElement;
    const button = accordionElementParent.querySelector('button');
    button.classList.add('collapsed');
    button.setAttribute('aria-expanded', 'false');
    accordionElement.classList.remove('show');
  }

  function clearSelection() {
    const notAccordionElement = document.querySelector('li.not-accordion-item span.text-white');
    notAccordionElement.classList.remove('text-white');
  }

})();