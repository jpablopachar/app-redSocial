const router = require('express').Router();

const UsuarioController = require('../controllers/usuarioController');
// const autenticacion = require('../libs/jwt');

router.post('/registrarse', UsuarioController.guardarUsuario);
router.post('/iniciarSesion', UsuarioController.iniciarSesion);

module.exports = router;