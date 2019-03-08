const router = require('express').Router();

const SeguimientoController = require('../controllers/seguimientoController');
const { asegurarAutenticacion } = require('../libs/jwt');

router.post('/seguir', asegurarAutenticacion, SeguimientoController.seguirUsuario);
router.delete('/seguir/:idSeguido', asegurarAutenticacion, SeguimientoController.dejarSeguir);
router.get('/siguiendo/:idUsuario?/:pagina?', asegurarAutenticacion, SeguimientoController.obtenerSeguidos);
router.get('/seguidores/:idUsuario?/:pagina?', asegurarAutenticacion, SeguimientoController.obtenerSeguidores);
router.get('/obtenerSeguimientos/:seguido?', asegurarAutenticacion, SeguimientoController.obtenerSeguimientos);

module.exports = router;