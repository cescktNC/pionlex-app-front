import Navigo from 'navigo';
import { getCookie } from './functions';

const router = new Navigo('/');

// En el index.html, cargo el template y el script pasados por parámetro
async function loadTemplate(templateName, script = null) {
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
    document.getElementById('app').innerHTML = html;

    // Añado el script correspondiente al template
    if (script) {
      const scriptElement = document.createElement('script');
      scriptElement.type = 'module';
      scriptElement.src = script;
      document.body.appendChild(scriptElement);
    }
  } catch (error) {
    console.log(`Error al cargar el template: ${templateName}`);
    document.getElementById('app').innerHTML = `<p>Error al cargar la vista</p>`;
  }
}

// Se comprueba si el usuario está logeado
function requireAuth(callback) {
  return () => {
    if (getCookie('auth_token')) {
      callback();
    } else  {
      router.navigate('/login');
    }
  }
}

// Listado de todas las rutas de la aplicación
router
  .on('/login', () => {
    loadTemplate('login/login', '/src/js/login.js');
  })
  .on('/clients', requireAuth( () => {
    loadTemplate('crm/clients/list', '/src/js/clients.js');
  }))
  .on('/users', requireAuth( () => {
    loadTemplate('crm/users/list');
  }))
  .notFound( () => {
    document.getElementById('app').innerHTML = '<h1>404 - Página no encontrada</h1>';
  });

export default router;