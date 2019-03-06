const Usuario = require('../models/usuario');
const helpers = require('../libs/helpers');
const jwt = require('../libs/jwt');
const controller = {};

controller.guardarUsuario = async (req, res) => {
  const { nombres, apellidos, nombreUsuario, correo, contrasena } = req.body;
  const usuario = new Usuario();

  if (nombres && apellidos && nombreUsuario && correo && contrasena) {
    // Cifrar la contraseña
    const hash = await helpers.encriptarContrasena(contrasena);

    usuario.nombres = nombres;
    usuario.apellidos = apellidos;
    usuario.nombreUsuario = nombreUsuario;
    usuario.correo = correo;
    usuario.contrasena = hash;
    usuario.cargo = 'ROLE_USER';
    usuario.imagen = null;

    const usuarioDuplicado = await Usuario.find({ $or: [{correo: usuario.correo.toLowerCase()}, {nombreUsuario: usuario.nombreUsuario.toLowerCase()}] });

    // Control de usuarios duplicados
    if (usuarioDuplicado.length >= 1 ) {
      return res.status(200).json({ mensaje: "¡El usuario ya existe!" });
    } else {
      await usuario.save();
      res.status(200).json({ usuario });
    }
  } else {
    res.status(200).json({ mensaje: "¡Debe enviar todos los campos necesarios!" });
  }
}

controller.iniciarSesion = async (req, res) => {
  const { correo, contrasena, obtenerToken } = req.body;
  const usuario = await Usuario.findOne({ correo });

  if (usuario) {
    const verificar = await helpers.validarContrasena(contrasena, usuario.contrasena);

    if (verificar) {
      if (obtenerToken) {
        // Generar y devolver token
        return res.status(200).send({ token: jwt.crearToken(usuario) });
      } else {
        // Oculta la contraseña al devolver los datos
        usuario.contrasena = undefined;
        // Devuelve los datos del usuario
        res.status(200).json({ usuario });
      }
    } else {
      return res.status(200).json({ mensaje: "¡El usuario no se ha podido identificar!" });
    }
  } else {
    return res.status(200).json({ mensaje: "¡El usuario no se ha podido identificar!" });
  }
}

module.exports = controller;