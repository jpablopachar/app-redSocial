const mongoosePagination = require('mongoose-pagination');
const moment = require('moment');
const path = require('path');

const Usuario = require('../models/usuario');
const Publicacion = require('../models/publicacion');
const Seguimiento = require('../models/seguimiento');
const controller = {};

controller.guardarPublicacion = async (req, res) => {
  if (!req.body.texto) return res.status(200).json({ mensaje: '¡Debes enviar un texto!' });

  const publicacion = new Publicacion();

  publicacion.texto = req.body.texto;
  publicacion.archivo = 'null';
  publicacion.usuario = req.usuario.sub;
  publicacion.creadoEn = moment().unix();

  try {
    const nuevaPublicacion = await publicacion.save();

    if (!nuevaPublicacion) return res.status(500).json({ mensaje: "¡No se ha guardado la publicación!" });

    return res.status(200).json({ publicacion: nuevaPublicacion });
  } catch (error) {
    return res.status(500).json({ mensaje: "¡Error en el servidor!" });
  }
}

controller.obtenerPublicacionesSeguidos = async (req, res) => {
  let pagina = 1;
  let elementosPorPagina = 4;

  if (req.params.pagina) pagina = req.params.pagina;

  // Busca los usuarios que sigues
  const seguimientos = await Seguimiento.find({ usuario: req.usuario.sub }).populate('seguido');

  let limpiarSeguimientos = [];

  // Almacena los usuarios que sigues dentro de un array
  seguimientos.forEach((seguimiento) => limpiarSeguimientos.push(seguimiento.seguido));

  // Busca las publicaciones de los usuarios almacenados en el array
  Publicacion.find({ usuario: { '$in': limpiarSeguimientos }}).sort('-creadoEn').populate('usuario').paginate(pagina, elementosPorPagina, (error, publicaciones, total) => {
    if (error) return res.status(500).json({ mensaje: "¡Error en el servidor!" });

    if (!publicaciones) return res.status(404).json({ mensaje: "¡No existen publicaciones!" });

    return res.status(200).json({
      totalElementos: total,
      paginas: Math.ceil(total/elementosPorPagina),
      pagina,
      publicaciones
    })
  });
}

module.exports = controller;