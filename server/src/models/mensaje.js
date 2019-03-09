const mongoose = require('mongoose');

const { Schema } = mongoose;

const MensajeSchema = new Schema({
  emitido: { type: Schema.ObjectId, ref: 'Usuario', required: true },
  recibido: { type: Schema.ObjectId, ref: 'Usuario', required: true },
  texto: { type: String, required: true },
  visto: String,
  creadoEn: { type: String, required: true }
});

module.exports = mongoose.model('Mensaje', MensajeSchema);