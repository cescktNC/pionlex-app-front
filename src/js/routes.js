import Navigo from 'navigo';
import { getCookie } from './functions';

const router = new Navigo('/');

// Se comprueba si el usuario está logeado
function requireAuth(callback) {
  return () => {
    if (getCookie('auth_token')) {
      // En caso de que el usuario refresque la pagina
      !document.getElementById('asidenav-menu-modules')
      ? router.navigate('/loadModules')
      : callback();
    } else  {
      router.navigate('/login');
    }
  }
}

// En el index.html, cargo el template y el script pasados por parámetro
async function loadTemplate(templateName, scriptsToAdd, containerId = 'app') {
  try {
    // Borro todos los scritps cargados menos el del main.js
    const scripts = document.querySelectorAll('script');
    scripts.forEach( script => {
      if (!script.src.includes('main.js')) {
        script.remove();
      }
    });

    // Crago el nuevo template
    const response = await fetch(`/src/templates/${templateName}.html`);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;

    // Añado el script correspondiente al template
    if (scriptsToAdd.length > 0) {
      scriptsToAdd.forEach( script => {
        const scriptElement = document.createElement('script');
        scriptElement.type = 'module';
        scriptElement.src = script;
        document.body.appendChild(scriptElement);
      });
    }
  } catch (error) {
    console.log(`Error al cargar el template: ${templateName}`);
    document.getElementById(containerId).innerHTML = '<p>Error al cargar la vista</p>';
  }
}

// Listado de todas las rutas de la aplicación
router
  .on('/login', () => {
    loadTemplate('login/login', ['/src/js/login.js']);
  })
  .on('/loadModules', () => {
    loadTemplate('menu/menu', ['/src/js/modules.js']);
  })
  .on('/clients', requireAuth( () => {
    loadTemplate('crm/clients/list', ['/src/js/clients.js', '/src/js/menu.js'], 'content-page');
  }))
  .on('/users', requireAuth( () => {
    loadTemplate('crm/users/list');
  }))
  .on('/module4Section1', requireAuth( () => {
    loadTemplate('module4/section1/list', ['/src/js/menu.js'], 'content-page');
  }))
  .notFound( () => {
    document.getElementById('app').innerHTML = '<h1>404 - Página no encontrada</h1>';
  });

export default router;