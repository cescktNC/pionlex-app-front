import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap';
import '/src/scss/style.scss';
import { getCookie } from './functions';
import router from './routes';

router.resolve();

( () => {
  const token = getCookie('auth_token');

  if (token) {
    console.log('Usuario registrado!');
    router.navigate('/clients');
  } else {
    router.navigate('/login');
  }
})();