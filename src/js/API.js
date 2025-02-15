const loginsUrl = "http://localhost:4000/logins";
export const usersUrl = "http://localhost:4000/users";
export const officesUrl = "http://localhost:4000/offices";
export const departmentsUrl = "http://localhost:4000/departments";
export const clientsUrl = "http://localhost:4000/clients";
export const statusesUrl = "http://localhost:4000/statuses";

export const loginURL = 'http://localhost:8000/api/v1/login';
export const registerUserURL = 'http://localhost:8000/api/v1/register';
export const forgotPasswordURL = 'http://localhost:8000/api/v1/forgot-password';
export const resetPasswordURL = 'http://localhost:8000/api/v1/reset-password';
export const logoutURL = 'http://localhost:8000/api/v1/logout';

export const fetchAPI = async (method, url, json = null, headers = {}) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      }
    };
  
    if (json) {
      options.body = JSON.stringify(json);
    }
  
    const response = await fetch(url, options);

    // Verificar si la respuesta es 'noContent'
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error en fetchAPI:', error.message);
    throw error;
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