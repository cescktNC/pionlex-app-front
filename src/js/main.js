// Importar DataTables
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net-dt';

// Se importa bootstrap y estilos propios
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap';
import '/src/scss/style.scss';

// Se importa FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Se importa la libreria de enrutamiento
import router from './routes';
import { verifyEmailUser } from './API';

router.resolve();

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const verificationUrl = urlParams.get('verification_url');
  const signature = urlParams.get('signature');

  const app = document.querySelector('#app');
  if (!app) return;
  
  if (verificationUrl && signature) {
    const urlVerification =  verificationUrl + '&signature=' + signature;
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      app.textContent = 'Verificando tu correo...';
      const response = await verifyEmailUser(urlVerification, authToken);
      if (response) {
        app.textContent = '¡Correo verificado correctamente!';
        router.navigate('/loadModules');
      } else {
        app.textContent = 'Te estamos redirigiendo a la pantalla de login...';
        redirectToLoginPage(urlVerification);
      }
    } else {
      app.textContent = 'Te estamos redirigiendo a la pantalla de login...';
      redirectToLoginPage(urlVerification);
    }
  }

});

function redirectToLoginPage(urlVerification) {
  setTimeout( () => {
    router.navigate(`/login/verifyEmail/${encodeURIComponent(urlVerification)}`);
  }, 3000);
}