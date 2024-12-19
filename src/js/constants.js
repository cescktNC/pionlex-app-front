export const passwordMinLength = 8;

// Hace referencia a los id's de los campos del formulario de registro de un usuario de la pantalla de login
// Además coinciden con los nombres de los atributos del modal de Usuario del Backend.
export const userFieldLabels = {
  officeName: 'Nombre Despacho',
  cif: 'CIF',
  invitationCode: 'Código de Invitacion',
  name: 'Nombre',
  lastname: 'Apellidos',
  email: 'Email',
  password: 'Contraseña',
};

export const errorMessages = {
  required: 'El campo :field es requerido.',
  email: 'El formato del :field no es válido.',
  min: {
    string: 'El campo :field debe tener al menos :min caracteres.',
  },
  confirmed: 'El campo de confirmación de :field no coincide.',
  policiesAndTerms: 'Tienes que aceptar las Políticas y los Términos.',
};