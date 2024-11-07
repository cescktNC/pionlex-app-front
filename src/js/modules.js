import router from './routes';
import { removeAllScriptsExceptMain, addScripts } from './functions';

( () => {

  // Variables
  const modulesMap = {
    1: {
      moduleTemplate: 'menu/module1',
      defaultSection: '/module1Section1',
      scripts: []
    },
    2: {
      moduleTemplate: 'menu/module2',
      defaultSection: '/module2Section1',
      scripts: []
    },
    3: {
      moduleTemplate: 'menu/crm',
      defaultSection: '/clients',
      scripts: ['menu', 'crm', 'clients', 'users']
      // scripts: ['clients', 'users', 'legalProceedings', 'documentTemplates', 'digitalSignature', 'issues', 'emails']
    },
    4: {
      moduleTemplate: 'menu/module4',
      defaultSection: '/module4Section1',
      scripts: []
    },
    5: {
      moduleTemplate: 'menu/module5',
      defaultSection: '/module5Section1',
      scripts: []
    },
    6: {
      moduleTemplate: 'menu/module6',
      defaultSection: '/module6Section1',
      scripts: []
    },
    7: {
      moduleTemplate: 'menu/module7',
      defaultSection: '/module7Section1',
      scripts: []
    },
    8: {
      moduleTemplate: 'menu/module8',
      defaultSection: '/module8Section1',
      scripts: []
    },
    9: {
      moduleTemplate: 'menu/module9',
      defaultSection: '/module9Section1',
      scripts: []
    }
  };

  const moduleIds = JSON.parse(localStorage.getItem('moduleIds'));

  // Funciones
  // Carga los scripts y los menus correspondientes a los módulos que tiene que cargar
  async function loadModules() {
    try {
      const asidenavMenu = document.querySelector('#asidenav-menu-modules');

      for (const module of moduleIds) {
        const moduleTemplate = modulesMap[module].moduleTemplate;
        
        const response = await fetch(`/src/templates/${moduleTemplate}.html`);
        const html = await response.text();
        asidenavMenu.innerHTML += html;
      }

      const firstModule = moduleIds[0];
      const templateToLoad = modulesMap[firstModule].defaultSection;

      if (asidenavMenu.querySelectorAll('li').length > 0) {
        const firstLi = asidenavMenu.querySelector('li');
        const button = firstLi.querySelector('button');

        if (firstLi.classList.contains('accordion-item')) {
          button.classList.remove('collapsed');
          button.setAttribute('aria-expanded', 'true');

          const accordionElement = firstLi.querySelector('div');
          accordionElement.classList.add('show');

          const sectionFirstItem = firstLi.querySelector('.list-group-item-custom-level-1');
          const buttonFirstItem = sectionFirstItem.querySelector('button');
          buttonFirstItem.classList.add('active');
        } else {
          const span = button.querySelector('span');
          span.classList.add('text-white');
        }
      }
      loadScripts();
      router.navigate(templateToLoad);
    } catch(error) {
      console.log('Error al cargar el menú');
      document.getElementById('content-page').innerHTML = '<p>Error al cargar la vista</p>';
    }
  }

  // Se añaden los scripts correspondientes a cada template
  function loadScripts() {
    const modulesScripts = getModuleScripts();
    removeAllScriptsExceptMain();
    addScripts(modulesScripts);
  }

  // Obtiene los nombres de los scripts de los modulos que se van a cargar
  function getModuleScripts() {
    let modulesScripts = [];
    for (const module of moduleIds) {
      modulesScripts = [...modulesScripts, ...modulesMap[module].scripts];
    }
    return modulesScripts;
  }

  loadModules();

})();