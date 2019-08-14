const mongoosePagination = require('mongoose-pagination');
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');

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
  // Añadir las publicaciones del usuario
  limpiarSeguimientos.push(req.usuario.sub);

  // Busca las publicaciones de los usuarios almacenados en el array
  Publicacion.find({ usuario: { '$in': limpiarSeguimientos }}).sort('-creadoEn').populate('usuario').paginate(pagina, elementosPorPagina, (error, publicaciones, total) => {
    if (error) return res.status(500).json({ mensaje: "¡Error en el servidor!" });

    if (!publicaciones) return res.status(404).json({ mensaje: "¡No existen publicaciones!" });

    return res.status(200).json({
      totalElementos: total,
      paginas: Math.ceil(total/elementosPorPagina),
      pagina,
      elementosPorPagina,
      publicaciones
    })
  });
}

controller.obtenerPublicacionesUsuario = async (req, res) => {
  let pagina = 1;
  let elementosPorPagina = 4;

  if (req.params.pagina) pagina = req.params.pagina;

  if (req.params.idUsuario) req.usuario.sub = req.params.idUsuario;

  // Busca las publicaciones de un usuario
  Publicacion.find({ usuario: req.usuario.sub }).sort('-creadoEn').populate('usuario').paginate(pagina, elementosPorPagina, (error, publicaciones, total) => {
    if (error) return res.status(500).json({ mensaje: "¡Error en el servidor!" });

    if (!publicaciones) return res.status(404).json({ mensaje: "¡No existen publicaciones!" });

    return res.status(200).json({
      totalElementos: total,
      paginas: Math.ceil(total/elementosPorPagina),
      pagina,
      elementosPorPagina,
      publicaciones
    })
  });
}

controller.obtenerPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.idPublicacion);

    if(!publicacion) return res.status(404).json({ mensaje: "¡No existe la publicación!" });

    return res.status(200).json({ publicacion });

  } catch (error) {
    return res.status(500).json({ mensaje: "¡Error en el servidor!" });
  }
}

controller.eliminarPublicacion = async (req, res) => {
  try {
    const publicacionEliminada = await Publicacion.find({ 'usuario': req.usuario.sub, '_id': req.params.idPublicacion }).remove();

    // if(!publicacionEliminada) return res.status(404).json({ mensaje: "¡No se ha eliminado la publicación!" });

    return res.status(200).json({ mensaje: 'Publicación eliminada correctamente' });

  } catch (error) {
    return res.status(500).json({ mensaje: "¡Error en el servidor!" });
  }
}

controller.subirImagenPublicacion = async (req, res) => {
  const { idPublicacion } = req.params;

  // Dirección donde se encuentra la imágen
  const imagenTempPath = req.file.path;
  // Extensión de la imágen
  const ext = path.extname(req.file.originalname).toLowerCase();
  // Dirección donde se desea ubicar la imágen para obtener y mostrar
  const objetivoPath = path.resolve(`src/public/uploads/publicaciones/${req.file.originalname}`);

  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
    await fs.rename(imagenTempPath, objetivoPath);

    const publicacion = await Publicacion.findOne({ 'usuario': req.usuario.sub, '_id': idPublicacion }).exec();

    if (publicacion) {
      const publicacionActualizada = await Publicacion.findByIdAndUpdate(idPublicacion, { archivo: req.file.originalname }, { new: true });

      if (!publicacionActualizada) return res.status(404).json({ mensaje: '¡No se ha podido actualizar la publicación!' });

      return res.status(200).json({ publicacion: publicacionActualizada });
    } else {
      return eliminarArchivosSubidos(res, imagenTempPath, '¡No tienes permisos para actualizar la publicación!');
    }
  } else {
    return eliminarArchivosSubidos(res, imagenTempPath, '¡Extensión no válida!');
  }
}

function eliminarArchivosSubidos(res, imagenPath, mensaje) {
  fs.unlink(imagenPath, (error) => {
    res.status(200).json({ mensaje });
  });
}

controller.obtenerImagenPublicacion = async (req, res) => {
  const { imagenPublicacion } = req.params;
  // Dirección donde se desea ubicar la imágen para obtener y mostrar
  const imagenPath = path.resolve(`src/public/uploads/publicaciones/${imagenPublicacion}`);

  // Devuelve true si la imágen existe o false si no existe
  const existe = await fs.exists(imagenPath);

  if (existe) {
    res.sendFile(imagenPath);
  } else {
    return res.status(200).json({ mensaje: '¡La imágen no existe!' });
  }
}

module.exports = controller;