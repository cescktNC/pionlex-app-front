const urlLogins = "http://localhost:4000/logins";
const urlUsers = "http://localhost:4000/users";
const urlOffices = "http://localhost:4000/offices";
const urlDepartments = "http://localhost:4000/departments";

// Inicio de sesion de un cliente
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
    const dataTemp = {
      token: 'jus5648sanm546123lo8iuysdaaAsU5ghj151Z65',
      modules: [3, 4, 5]
    };
    return dataTemp;
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