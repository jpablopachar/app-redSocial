if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const multer = require('multer');

const path = require('path');

require('./db/database');

const app = express();

/*                  Ajustes                     */
// Usa el puerto establecido o usa el puerto 3000
app.set('port', process.env.PORT || 3000);

/*                 Middleware                   */
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

app.use(multer({ storage }).single('imagen'));

/*                    Rutas                      */
app.use('/api', require('./routes/usuarioRoutes'));
app.use('/api', require('./routes/seguimientoRoutes'));
app.use('/api', require('./routes/publicacionRoutes'));
app.use('/api', require('./routes/mensajeRoutes'));

// Escucha en el puerto establecido
app.listen(app.get('port'), () => {
  console.log('Entorno: ', process.env.NODE_ENV);
  console.log(`Servidor en puerto ${app.get('port')}`);
});