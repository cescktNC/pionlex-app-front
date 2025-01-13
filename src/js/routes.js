import Navigo from 'navigo';
import { removeAllScriptsExceptMain, addScripts } from './functions';
import { initLogin } from './login';
import { initClients } from './clients';
import { initUsers } from './users';
import { initLegalDocs } from './legalDocs';

const router = new Navigo('/');

// Se comprueba si el usuario está logeado
function requireAuth(callback) {
  return () => {
    if (localStorage.getItem('auth_token')) {
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

async function loadLegalContentTemplate(templateName, scriptsToAdd, loadScript) {
  try {
    const legalContent = document.querySelector('#legal-content');
    // Si no existe el menú lateral lo cargo
    if (!legalContent) {
      // Crago el nuevo template
      const response = await fetch(`/src/templates/legal/legal-docs.html`);
      const html = await response.text();
      document.getElementById('app').innerHTML = html;
    }

    // Crago el template Legal pasado por parámetro
    const response = await fetch(`/src/templates/${templateName}.html`);
    const html = await response.text();
    document.getElementById('legal-content').innerHTML = html;

    // Añado el script correspondiente al template
    if (loadScript && scriptsToAdd.length > 0) {
      removeAllScriptsExceptMain();
      addScripts(scriptsToAdd);
    }
  } catch (error) {
    console.log(`Error al cargar el template: ${templateName}`);
    document.getElementById('app').innerHTML = '<p>Error al cargar la vista</p>';
  }
}

// Listado de todas las rutas de la aplicación
router
  .on('/', () => {
    console.log('Página principal cargada');
  })
  .on('/login', async () => {
    await loadTemplate('login/login', ['login']);
    initLogin();
  })
  .on('/login/:action/:urlVerification', async ( params ) => {
    const action = params.data.action;
    const urlVerification = params.data.urlVerification;
    await loadTemplate('login/login', ['login']);
    initLogin( { 
      [action]: true,
      urlVerification: urlVerification
     }, urlVerification );
  })
  .on('/password-reset/:token', async ( params ) => {
    const token = params.data.token;
    const email = params.params.email;
    await loadTemplate('login/login', ['login']);
    initLogin( { 
      passwordReset: true,
      token: token,
      email: email
    } );
  })
  .on('/loadModules', () => {
    loadTemplate('menu/menu', ['modules']);
  })
  .on('/legal-docs/:docType/:loadScript', async (params) => {
    const docType = params.data.docType;
    const loadScript = params.data.loadScript === '1';
    await loadLegalContentTemplate(`legal/${docType}`, ['legalDocs'], loadScript);
    loadScript ? initLegalDocs(docType) : null;
  })
  .on('/dashboard/overview', requireAuth( () => {
    loadTemplate('dashboard/overview', [], 'content-page');
  }))
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