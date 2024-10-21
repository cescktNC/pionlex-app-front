const urlLogins = "http://localhost:4000/logins";
const urlUsers = "http://localhost:4000/users";
const urlOffices = "http://localhost:4000/offices";
const urlDepartments = "http://localhost:4000/departments";

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
    console.log(error);
  }
}

export const createRecord = async (record, url) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(record),
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

export const getRecords = async url => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
