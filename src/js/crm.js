import router from './routes';

const clientsCrmButton = document.querySelector('#clients-crm-button');
const usersCrmButton = document.querySelector('#users-crm-button');

clientsCrmButton.addEventListener('click', navigateToClients);
usersCrmButton.addEventListener('click', navigateToUsers);

function navigateToClients() {
  router.navigate('/clients');
}

function navigateToUsers() {
  router.navigate('/users');
}