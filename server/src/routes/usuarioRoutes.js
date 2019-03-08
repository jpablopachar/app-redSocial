const router = require('express').Router();

const UsuarioController = require('../controllers/usuarioController');
const { asegurarAutenticacion } = require('../libs/jwt');

router.post('/registrarse', UsuarioController.guardarUsuario);
router.post('/iniciarSesion', UsuarioController.iniciarSesion);
router.get('/usuario/:idUsuario', asegurarAutenticacion, UsuarioController.obtenerUsuario);
router.get('/usuarios/:pagina?', asegurarAutenticacion, UsuarioController.obtenerUsuarios);
router.get('/contadores/:idUsuario?', asegurarAutenticacion, UsuarioController.obtenerContadores);
router.put('/actualizarUsuario/:idUsuario', asegurarAutenticacion, UsuarioController.actualizarUsuario);
router.post('/subirImagenUsuario/:idUsuario', asegurarAutenticacion, UsuarioController.subirImagenUsuario);
router.get('/obtenerImagenUsuario/:imagen', asegurarAutenticacion, UsuarioController.obtenerImagenUsuario);

module.exports = router;