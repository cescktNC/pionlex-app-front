( () => {

  // Variables
  let scrollTimeOut;
  const asidenavMenu = document.querySelector('.asidenav-menu');

  // Eventos
  asidenavMenu.addEventListener('scroll', () => {
    asidenavMenu.classList.add('scrolling');

    clearTimeout(scrollTimeOut);
    scrollTimeOut = setTimeout( () => {
      asidenavMenu.classList.remove('scrolling');
    }, 500);
  });

})();