import router from './routes';

( () => {

  // Variables
  const modulesMap = {
    1: {
      moduleTemplate: 'menu/module1',
      defaultSection: '/module1Section1'
    },
    2: {
      moduleTemplate: 'menu/module2',
      defaultSection: '/module2Section1'
    },
    3: {
      moduleTemplate: 'menu/crm',
      defaultSection: '/clients'
    },
    4: {
      moduleTemplate: 'menu/module4',
      defaultSection: '/module4Section1'
    },
    5: {
      moduleTemplate: 'menu/module5',
      defaultSection: '/module5Section1'
    },
    6: {
      moduleTemplate: 'menu/module6',
      defaultSection: '/module6Section1'
    },
    7: {
      moduleTemplate: 'menu/module7',
      defaultSection: '/module7Section1'
    },
    8: {
      moduleTemplate: 'menu/module8',
      defaultSection: '/module8Section1'
    },
    9: {
      moduleTemplate: 'menu/module9',
      defaultSection: '/module9Section1'
    }
  };

  

  async function loadModules() {
    try {
      const asidenavMenu = document.querySelector('#asidenav-menu-modules');
      const moduleIds = JSON.parse(localStorage.getItem('moduleIds'));

      for (const module of moduleIds) {
        const moduleTemplate = modulesMap[module].moduleTemplate;
        
        const response = await fetch(`/src/templates/${moduleTemplate}.html`);
        const html = await response.text();
        asidenavMenu.innerHTML += html;
      }

      const firstModule = moduleIds.shift();
      const templateToLoad = modulesMap[firstModule].defaultSection;

      if (asidenavMenu.querySelectorAll('li').length > 0) {
        const firstLi = asidenavMenu.querySelector('li');
        const button = firstLi.querySelector('button');

        if (firstLi.classList.contains('accordion-item')) {
          button.classList.remove('collapsed');
          button.setAttribute('aria-expanded', 'true');

          const accordionElement = firstLi.querySelector('div');
          accordionElement.classList.add('show');
        } else {
          button.classList.add('text-white');
        }
      }

      router.navigate(templateToLoad);
    } catch(error) {
      console.log('Error al cargar el menú');
      document.getElementById('content-page').innerHTML = '<p>Error al cargar la vista</p>';
    }
  }

  loadModules();
})();