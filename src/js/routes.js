import Navigo from 'navigo';
import { getCookie, addScripts } from './functions';
import { initClients } from './clients';
import { initUsers } from './users';

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
    // Crago el nuevo template
    const response = await fetch(`/src/templates/${templateName}.html`);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;

    // Añado el script correspondiente al template
    if (scriptsToAdd.length > 0) {
      addScripts(scriptsToAdd);
    }
  } catch (error) {
    console.log(`Error al cargar el template: ${templateName}`);
    document.getElementById(containerId).innerHTML = '<p>Error al cargar la vista</p>';
  }
}

// Listado de todas las rutas de la aplicación
router
  .on('/login', () => {
    loadTemplate('login/login', ['login']);
  })
  .on('/loadModules', () => {
    loadTemplate('menu/menu', ['modules']);
  })
  .on('/clients', requireAuth( async () => {
    await loadTemplate('crm/clients/list', [], 'content-page');
    initClients();
  }))
  .on('/users', requireAuth( async () => {
    await loadTemplate('crm/users/list', [], 'content-page');
    initUsers();
  }))
  .on('/module4Section1', requireAuth( () => {
    loadTemplate('module4/section1/list', [], 'content-page');
  }))
  .notFound( () => {
    document.getElementById('app').innerHTML = '<h1>404 - Página no encontrada</h1>';
  });

export default router;