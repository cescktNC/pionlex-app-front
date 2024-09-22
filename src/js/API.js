const urlLogins = "http://localhost:4000/logins";
const urlUsers = "http://localhost:4000/users";
const urlOffices = "http://localhost:4000/offices";

export const login = async user => {
  try {
    const response = await fetch(urlLogins, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const createUser = async user => {
  try {
    const response = await fetch(urlUsers, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const createOffice = async office => {
  try {
    const response = await fetch(urlOffices, {
      method: 'POST',
      body: JSON.stringify(office),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
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