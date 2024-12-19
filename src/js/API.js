const loginsUrl = "http://localhost:4000/logins";
export const usersUrl = "http://localhost:4000/users";
export const officesUrl = "http://localhost:4000/offices";
export const departmentsUrl = "http://localhost:4000/departments";
export const clientsUrl = "http://localhost:4000/clients";
export const statusesUrl = "http://localhost:4000/statuses";

export const loginURL = 'http://localhost:8000/api/v1/login';
export const registerUserURL = 'http://localhost:8000/api/v1/register';

// Inicio de sesion de un cliente
export const login = async user => {
  try {
    const response = await fetch(loginURL, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Error en la solicitud: ${data.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error en la conexión o en la solicitud:', error);
  }
}

// Crea un registro
export const createRecord = async (record, url) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(record),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`Error en la solicitud: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error en la conexión o en la solicitud:', error);
  }
}

export const editRecord = async (record, url) => {
  try {
    const response = await fetch(`${url}/${record.id}`, {
      method: 'PUT',
      body: JSON.stringify(record),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`Error en la solicitud: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error en la conexión o en la solicitud:', error);
  }
}

// Elimina registro
export const deleteRecord = async (id, url) => {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      return true;
    } else {
      console.error(`Error en la solicitud: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('Error en la conexión o en la solicitud:', error);
    return false;
  }
}

// Obtieneun registro
export const getRecord = async (id, url) => {
  try {
    const response = await fetch(`${url}/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`Error en la solicitud: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('Error en la conexión o en la solicitud:', error);
    return null;
  }
}

// Obtiene registros
export const getRecords = async url => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`Error en la solicitud: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error en la conexión o en la solicitud:', error);
    return null;
  }
}

export const verifyEmailUser = async (urlVerification, authToken) => {
  try {
    const response = await fetch(urlVerification, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      console.error(`Error en la solicitud: ${response.status}`);
      return null;
    } 
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al verificar:", error);
    return null;
  }
}