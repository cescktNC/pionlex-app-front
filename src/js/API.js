const urlUsers = "http://localhost:4000/users";
const urlLogin = "http://localhost:4000/data";

export const login = async user => {
  try {
    const response = await fetch(urlLogin);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const createUser = async user => {
  try {
    await fecth(urlUsers, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    window.location.href = 'index.html';
  } catch (error) {
    console.log(error);
  }
}

export const getClients = async () => {
  try {
    const response = await fetch(urlUsers);
    const clients = await response.json();
    return clients;
  } catch (error) {
    console.log(error);
  }
}