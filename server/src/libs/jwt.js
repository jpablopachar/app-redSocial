const jwt = require('jwt-simple');
const moment = require('moment');

const autenticacion = {};

autenticacion.crearToken = (usuario) => {
  const payload = {
    sub: usuario._id,
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    nombreUsurio: usuario.nombreUsurio,
    correo: usuario.correo,
    cargo: usuario.cargo,
    imagen: usuario.imagen,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };

  return jwt.encode(payload, process.env.CLAVE_SECRETA);
};

autenticacion.asegurarAutenticacion = (req, res, next) => {
  // Si no llega la cabecera authorization
  if (!req.headers.authorization) return res.status(403).send({ mensaje: "¡La petición no tiene la cabecera de autenticación!" });

  // Contiene el valor de authorization
  const token = req.headers.authorization.replace(/['"]+/g, '');

  try {
    // Decodifica el token
    var payload = jwt.decode(token, process.env.CLAVE_SECRETA);

    // Cuando el token ha expirado
    if (payload.exp <= moment().unix()) return res.status(401).send({ mensaje: "El token ha expirado" });
  } catch (ex) {
    return res.status(401).send({ mensaje: "El token no es válido" });
  }

  req.usuario = payload;

  next();
}

module.exports = autenticacion;