const mongoosePagination = require('mongoose-pagination');

const path = require('path');

const Usuario = require('../models/usuario');
const Seguimiento = require('../models/seguimiento');
const controller = {};

controller.seguirUsuario = async (req, res) => {
  const seguimiento = new Seguimiento();

  seguimiento.usuario = req.usuario.sub;
  seguimiento.seguido = req.body.seguido;

  try {
    const seguimientoAlmacenado = await seguimiento.save();

    if (!seguimientoAlmacenado) return res.status(404).json({ mensaje: "¡No se ha podido seguir a este usuario!" });

    return res.status(200).json({ seguimiento: seguimientoAlmacenado });
  } catch (error) {
    return res.status(500).json({ mensaje: "¡Error al seguir a este usuario!" });
  }
}

controller.dejarSeguir = (req, res) => {
  Seguimiento.find({ 'usuario': req.usuario.sub, 'seguido': req.params.idSeguido }).remove(error => {
    if (error) return res.status(500).json({ mensaje: "¡Error al dejar de seguir a este usuario!" });

    return res.status(200).json({ mensaje: "¡Has dejado de seguir a este usuario!" });
  });
}

controller.obtenerSeguidos = (req, res) => {
  let { sub } = req.usuario.sub;
  let pagina = 1;
  let elementosPorPagina = 4;

  if (req.params.idUsuario && req.params.pagina) sub = req.params.idUsuario;

  if (req.params.pagina) {
    pagina = req.params.pagina;
  } else {
    pagina = req.params.idUsuario;
  }

  Seguimiento.find({ usuario: sub }).populate({ path: 'seguido' }).paginate(pagina, elementosPorPagina, (error, seguidos, total) => {
    if (error) return res.status(500).json({ mensaje: "¡Error en el servidor!" });

    if (!seguidos) return res.status(404).json({ mensaje: "¡No estás siguiendo a ningún usuario!" });

    return res.status(200).json({
      total,
      paginas: Math.ceil(total/elementosPorPagina),
      seguidos
    });
  });
}

controller.obtenerSeguidores = (req, res) => {
  let { sub } = req.usuario.sub;
  let pagina = 1;
  let elementosPorPagina = 4;

  if (req.params.idUsuario && req.params.pagina) sub = req.params.idUsuario;

  if (req.params.pagina) {
    pagina = req.params.pagina;
  } else {
    pagina = req.params.idUsuario;
  }

  Seguimiento.find({ seguido: sub }).populate('usuario seguido').paginate(pagina, elementosPorPagina, (error, seguidores, total) => {
    if (error) return res.status(500).json({ mensaje: "¡Error en el servidor!" });

    if (seguidores.length <= 0) return res.status(404).json({ mensaje: "¡No te sigue ningún usuario!" });

    return res.status(200).json({
      total,
      paginas: Math.ceil(total/elementosPorPagina),
      seguidores: seguidores
    });
  });
}

controller.obtenerSeguimientos = async (req, res) => {
  const { sub } = req.usuario;
  let seguimientos = Seguimiento.find({ usuario: sub });

  if (req.params.seguido) seguimientos = Seguimiento.find({ seguido: sub });

  try {
    const seguidos = await seguimientos.populate('usuario seguido').exec();

    if (!seguidos) return res.status(404).json({ mensaje: "¡No sigues a ningún usuario!" });

    return res.status(200).json({ seguidos });

  } catch (error) {
    return res.status(500).json({ mensaje: "¡Error en el servidor!" });
  }
}

module.exports = controller;