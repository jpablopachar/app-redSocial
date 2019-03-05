const mongoose = require('mongoose');

const { Schema } = mongoose;

const PublicacionSchema = new Schema({
  usuario: { type: Schema.ObjectId, ref: 'Usuario', required: true },
  texto: String,
  archivo: String,
  creadoEn: { type: String, required: true }
});

module.exports = mongoose.model('Publicacion', PublicacionSchema);