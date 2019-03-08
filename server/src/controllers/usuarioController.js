const mongoosePagination = require('mongoose-pagination');
const fs = require('fs-extra');
const path = require('path');

const Usuario = require('../models/usuario');
const Seguimiento = require('../models/seguimiento');
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

    const usuarioDuplicado = await Usuario.find({ $or: [{ correo: usuario.correo.toLowerCase() }, { nombreUsuario: usuario.nombreUsuario.toLowerCase() }] });

    // Control de usuarios duplicados
    if (usuarioDuplicado.length >= 1 ) {
      return res.status(200).json({ mensaje: "¡El usuario ya existe!" });
    } else {
      await usuario.save();
      res.status(200).json({ usuario });
    }
  } else {
    res.status(200).json({ mensaje: "¡Debes enviar todos los campos necesarios!" });
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

controller.obtenerUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const usuario = await Usuario.findById(idUsuario);

    // Cuando no existe el usuario
    if (!usuario) return res.status(404).json({ mensaje: 'El usuario no existe' });

    const valor = await usuarioSeguido(req.usuario.sub, idUsuario);

    // Elimina la propiedad contrasena
    usuario.contrasena = undefined;

    res.status(200).json({
      usuario,
      seguido: valor.seguido,
      seguidor: valor.seguidor
    });
  } catch (ex) {
    res.status(505).json({ mensaje: 'Error en la petición' });
  }
}

async function usuarioSeguido(identidad, idUsuario) {
  const seguido = await Seguimiento.findOne({ 'usuario': identidad, 'seguido': idUsuario });

  const seguidor = await Seguimiento.findOne({ 'usuario': idUsuario, 'seguido': identidad });

  return {
    seguido,
    seguidor
  }
}

controller.obtenerUsuarios = (req, res) => {
  // const { sub } = req.usuario;
  let pagina = 1;
  let elementosPorPagina = 5;

  if (req.params.pagina) pagina = req.params.pagina;

  Usuario.find().sort('_id').paginate(pagina, elementosPorPagina, (error, usuarios, total) => {
    if (error) return res.status(500).json({ mensaje: 'Error en la petición' });

    if (!usuarios) return res.status(404).json({ mensaje: '¡No existen usuarios disponibles!' });

    idUsuariosSeguidos(req.usuario.sub).then((valor) => {
      res.status(200).json({
        usuarios,
        seguidos: valor.seguidos,
        seguidores: valor.seguidores,
        total,
        paginas: Math.ceil(total/elementosPorPagina)
      });
    });
  });
}

async function idUsuariosSeguidos(idUsuario) {
  const seguidos = await Seguimiento.find({ 'usuario': idUsuario }).select({ '_id': 0, '__v': 0, 'usuario': 0 }).exec().then((seguidos) => {
    const limpiarSeguidos = [];

    seguidos.forEach(seguidos => limpiarSeguidos.push(seguidos.seguido));

    return limpiarSeguidos;
  });

  const seguidores = await Seguimiento.find({ 'seguido': idUsuario }).select({ '_id': 0, '__v': 0, 'seguido': 0 }).exec().then((seguidores) => {
    const limpiarSeguidores = [];

    seguidores.forEach(seguidores => limpiarSeguidores.push(seguidores.usuario));

    return limpiarSeguidores;
  });

  return {
    seguidos,
    seguidores
  }
}

controller.obtenerContadores = async (req, res) => {
  let { sub } = req.usuario;

  if (req.params.idUsuario) sub = req.params.idUsuario;

  const valor = await obtenerContadorSeguimiento(sub);

  return res.status(200).json(valor);
}

async function obtenerContadorSeguimiento(idUsuario) {
  const contadorSeguidos = await Seguimiento.count({ 'usuario': idUsuario });
  const contadorSeguidores = await Seguimiento.count({ 'seguido': idUsuario });

  return {
    seguidos: contadorSeguidos,
    seguidores: contadorSeguidores
  }
}

controller.actualizarUsuario = async(req, res) => {
  const { idUsuario } = req.params;

  // Elimina la propiedad password
  delete req.body.contrasena;

  // Controla que no se pueda editar los datos de otro usuario
  if (idUsuario != req.usuario.sub) return res.status(500).json({ mensaje: '¡No tienes permisos para actualizar los datos de este usuario!' });

  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(idUsuario, req.body, {new:true});

    if (!usuarioActualizado) return res.status(404).json({ mensaje: '¡No se ha podido actualizar el usuario!' });

    return res.status(200).json({ usuario: usuarioActualizado });
  } catch (error) {
    return res.status(505).json({ mensaje: 'Error en la petición' });
  }
}

controller.subirImagenUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  // Dirección donde se encuentra la imágen
  const imagenTempPath = req.file.path;
  // Extensión de la imágen
  const ext = path.extname(req.file.originalname).toLowerCase();
  // Dirección donde se desea ubicar la imágen para obtener y mostrar
  const objetivoPath = path.resolve(`src/public/uploads/usuarios/${req.file.originalname}`);

  // Controla que no se pueda editar los datos de otro usuario
  if (idUsuario != req.usuario.sub) return eliminarArchivosSubidos(res, imagenTempPath, 'No tienes permisos para actualizar los datos de este usuario!');

  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
    await fs.rename(imagenTempPath, objetivoPath);

    const usuarioActualizado = await Usuario.findByIdAndUpdate(idUsuario, { imagen: req.file.originalname }, { new: true });

    if (!usuarioActualizado) return res.status(404).json({ mensaje: '¡No se ha podido actualizar el usuario!' });

    return res.status(200).json({ usuario: usuarioActualizado });
  } else {
    return eliminarArchivosSubidos(res, imagenTempPath, '¡Extensión no válida!');
  }
}

async function eliminarArchivosSubidos(res, imagenPath, mensaje) {
  await fs.unlink(imagenPath);
  res.status(500).json({ mensaje });
}

controller.obtenerImagenUsuario = async (req, res) => {
  const { imagen } = req.params;
  // Dirección donde se desea ubicar la imágen para obtener y mostrar
  const imagenPath = path.resolve(`src/public/uploads/usuarios/${imagen}`);

  // Devuelve true si la imágen existe o false si no existe
  const existe = await fs.exists(imagenPath);

  if (existe) {
    res.sendFile(imagenPath);
  } else {
    return res.status(200).json({ mensaje: '¡La imágen no existe!' });
  }
}

module.exports = controller;