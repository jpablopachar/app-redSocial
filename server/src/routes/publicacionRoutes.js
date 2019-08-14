const router = require('express').Router();

const PublicacionController = require('../controllers/publicacionController');
const { asegurarAutenticacion } = require('../libs/jwt');

router.post('/publicacion', asegurarAutenticacion, PublicacionController.guardarPublicacion);
router.get('/publicaciones/:pagina?', asegurarAutenticacion, PublicacionController.obtenerPublicacionesSeguidos);
router.get('/publicacionesUsuario/:idUsuario/:pagina?', asegurarAutenticacion, PublicacionController.obtenerPublicacionesUsuario);
router.get('/publicacion/:idPublicacion', asegurarAutenticacion, PublicacionController.obtenerPublicacion);
router.delete('/publicacion/:idPublicacion', asegurarAutenticacion, PublicacionController.eliminarPublicacion);
router.post('/subirImagenPublicacion/:idPublicacion', asegurarAutenticacion, PublicacionController.subirImagenPublicacion);
router.get('/obtenerImagenPublicacion/:imagenPublicacion', PublicacionController.obtenerImagenPublicacion);

module.exports = router;