( () => {

  // Variables
  const asidenavMenu = document.querySelector('#asidenav-menu-modules');
  const notAccordionItems = asidenavMenu.querySelectorAll('.not-accordion-item');
  const accordionItems = asidenavMenu.querySelectorAll('.accordion-item');
  const sectionItems = asidenavMenu.querySelectorAll('.list-group-item-custom-level-1');

  // Eventos
  notAccordionItems.forEach( notAccordionItem => {
    notAccordionItem.addEventListener('click', collapseAccordion);
  });
  accordionItems.forEach( accordionItem => {
    accordionItem.addEventListener('click', clearSelection);
  });
  sectionItems.forEach( sectionItem => {
    sectionItem.addEventListener('click', addSelection);
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

    const activeButton = asidenavMenu.querySelector('.active');
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
    const activeButton = asidenavMenu.querySelector('.active');
    if (activeButton) {
      activeButton.classList.remove('active');
    }

    const clickedElement = e.target.closest('li');
    const button = clickedElement.querySelector('button');
    button.classList.add('active');
  }

})();