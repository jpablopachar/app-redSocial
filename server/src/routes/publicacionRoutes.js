const router = require('express').Router();

const PublicacionController = require('../controllers/publicacionController');
const { asegurarAutenticacion } = require('../libs/jwt');

router.post('/publicacion', asegurarAutenticacion, PublicacionController.guardarPublicacion);
router.get('/publicaciones/:pagina?', asegurarAutenticacion, PublicacionController.obtenerPublicacionesSeguidos);
router.get('/publicacion/:idPublicacion', asegurarAutenticacion, PublicacionController.obtenerPublicacion);
router.delete('/publicacion/:idPublicacion', asegurarAutenticacion, PublicacionController.eliminarPublicacion);

module.exports = router;