const mongoosePagination = require('mongoose-pagination');
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');

const Mensaje = require('../models/mensaje');
const Publicacion = require('../models/publicacion');
const Seguimiento = require('../models/seguimiento');
const controller = {};

controller.guardarMensaje = async (req, res) => {
  const { texto, recibido } = req.body;

  if (!texto || !recibido) return res.status(200).json({ mensaje: 'Debes enviar los datos necesarios' });

  const mensaje = new Mensaje();

  mensaje.emitido = req.usuario.sub;
  mensaje.recibido = recibido;
  mensaje.texto = texto;
  mensaje.creadoEn = moment().unix();

  try {
    const nuevoMensaje = await mensaje.save();

    if (!nuevoMensaje) return res.status(404).json({ mensaje: 'Error al enviar el mensaje' });

    return res.status(200).json({ mensaje: nuevoMensaje });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

controller.obtenerMensajesRecibidos = async (req, res) => {
  let pagina = 1;
  let elementosPorPagina = 4;

  if (req.params.pagina) pagina = req.params.pagina;

  Mensaje.find({ recibido: req.usuario.sub }).populate('emitido').paginate(pagina, elementosPorPagina, (error, mensajes, total) => {
    if (error) return res.status(500).json({ mensaje: 'Error en el servidor' });

    if (!mensajes) return res.status(404).json({ mensaje: 'No existen mensajes' });

    return res.status(200).json({
      total,
      paginas: Math.ceil(total/elementosPorPagina),
      mensajes
    });
  });
}

module.exports = controller;