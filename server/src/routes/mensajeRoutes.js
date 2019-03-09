const router = require('express').Router();

const MensajeController = require('../controllers/mensajeController');
const { asegurarAutenticacion } = require('../libs/jwt');

router.post('/mensaje', asegurarAutenticacion, MensajeController.guardarMensaje);

module.exports = router;