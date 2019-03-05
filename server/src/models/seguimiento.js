const mongoose = require('mongoose');

const { Schema } = mongoose;

const SeguimientoSchema = new Schema({
  usuario: { type: Schema.ObjectId, ref: 'Usuario', required: true },
  seguido: { type: Schema.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Seguimiento', SeguimientoSchema);