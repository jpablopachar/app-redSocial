const router = require('express').Router();

const MensajeController = require('../controllers/mensajeController');
const { asegurarAutenticacion } = require('../libs/jwt');

router.post('/mensaje', asegurarAutenticacion, MensajeController.guardarMensaje);
router.get('/misMensajes/:pagina?', asegurarAutenticacion, MensajeController.obtenerMensajesRecibidos);
router.get('/mensajes/:pagina?', asegurarAutenticacion, MensajeController.obtenerMensajesEnviados);
router.get('/mensajesNoVistos', asegurarAutenticacion, MensajeController.obtenerMensajesNoVistos);
router.get('/mensajesVistos', asegurarAutenticacion, MensajeController.verMensajes);

module.exports = router;