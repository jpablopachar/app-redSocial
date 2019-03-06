const bcrypt = require('bcrypt');

const helpers = {};

helpers.encriptarContrasena = async (contrasena) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(contrasena, salt);

  return hash;
};

helpers.validarContrasena = async (contrasena, contrasenaGuardada) => {
  try {
    return await bcrypt.compare(contrasena, contrasenaGuardada);
  } catch (e) {
    console.log(e);
  }
};

module.exports = helpers;