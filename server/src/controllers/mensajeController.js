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

    if (!nuevoMensaje) return res.status(500).json({ mensaje: 'Error al enviar el mensaje' });

    return res.status(200).json({ mensaje: nuevoMensaje });
  } catch (error) {
    return res.status(200).json({ mensaje: 'Error en el servidor' });
  }
}

module.exports = controller;