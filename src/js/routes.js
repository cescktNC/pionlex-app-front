import Navigo from 'navigo';

const router = new Navigo('/');

async function loadTemplate(templateName, script = null) {
  try {
    const response = await fetch(`/src/templates/${templateName}.html`);
    const html = await response.text();
    document.getElementById('app').innerHTML = html;

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

router
  .on('/login', () => {
    loadTemplate('login/login', '/src/js/login.js');
  })
  .on('/clients', () => {
    loadTemplate('crm/clients/list');
  })
  .on('/users', () => {
    loadTemplate('crm/users/list');
  })
  .notFound( () => {
    document.getElementById('app').innerHTML = '<h1>404 - Página no encontrada</h1>';
  });

export default router;