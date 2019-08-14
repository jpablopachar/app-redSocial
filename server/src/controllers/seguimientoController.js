const mongoosePagination = require('mongoose-pagination');

const Seguimiento = require('../models/seguimiento');
const controller = {};

controller.seguirUsuario = async (req, res) => {
  const seguimiento = new Seguimiento();

  seguimiento.usuario = req.usuario.sub;
  seguimiento.seguido = req.body.seguido;

  try {
    const seguimientoAlmacenado = await seguimiento.save();

    if (!seguimientoAlmacenado) return res.status(404).json({ mensaje: "¡No se ha podido seguir a este usuario!" });

    return res.status(200).json({ seguimiento: seguimientoAlmacenado });
  } catch (error) {
    return res.status(500).json({ mensaje: "¡Error al seguir a este usuario!" });
  }
}

controller.dejarSeguir = (req, res) => {
  Seguimiento.find({ 'usuario': req.usuario.sub, 'seguido': req.params.idSeguido }).remove(error => {
    if (error) return res.status(500).json({ mensaje: "¡Error al dejar de seguir a este usuario!" });

    return res.status(200).json({ mensaje: "¡Has dejado de seguir a este usuario!" });
  });
}

async function idsUsuariosSeguimiento(idUsuario) {
  const seguidos = await Seguimiento.find({ usuario: idUsuario }).select({ '_id': 0, '__v': 0, 'usuario': 0 }).exec().then((seguidos) => {
    const limpiarSeguidos = [];

    seguidos.forEach((seguido) => {
      limpiarSeguidos.push(seguido.seguido);
    });

    return limpiarSeguidos;
  }).catch(error => { return handleerror(error) });

  const seguidores = await Seguimiento.find({ seguido: idUsuario }).select({ '_id': 0, '__v': 0, 'seguido': 0 }).exec().then((seguidores) => {
    const limpiarSeguidores = [];

    seguidores.forEach((seguidor) => {
      limpiarSeguidores.push(seguidor.usuario);
    });

    return limpiarSeguidores;
  }).catch(error => { return handleerror(error) });

  return {
    seguidos,
    seguidores
  }
}

controller.obtenerSeguidos = (req, res) => {
  let { sub } = req.usuario.sub;
  let pagina = 1;
  let elementosPorPagina = 4;

  if (req.params.idUsuario && req.params.pagina) sub = req.params.idUsuario;

  if (req.params.pagina) {
    pagina = req.params.pagina;
  } else {
    pagina = req.params.idUsuario;
  }

  Seguimiento.find({ usuario: sub }).populate({ path: 'seguido' }).paginate(pagina, elementosPorPagina, (error, seguimientos, total) => {
    if (error) return res.status(500).json({ mensaje: "¡Error en el servidor!" });

    if (!seguimientos) return res.status(404).json({ mensaje: "¡No estás siguiendo a ningún usuario!" });

    idsUsuariosSeguimiento(sub).then((valor) => {
      return res.status(200).json({
        total,
        paginas: Math.ceil(total/elementosPorPagina),
        seguimientos,
        usuariosSeguidos: valor.seguidos,
        usuariosSeguidores: valor.seguidores
      });
    })
  });
}

controller.obtenerSeguidores = (req, res) => {
  let { sub } = req.usuario.sub;
  let pagina = 1;
  let elementosPorPagina = 4;

  if (req.params.idUsuario && req.params.pagina) sub = req.params.idUsuario;

  if (req.params.pagina) {
    pagina = req.params.pagina;
  } else {
    pagina = req.params.idUsuario;
  }

  Seguimiento.find({ seguido: sub }).populate('usuario seguido').paginate(pagina, elementosPorPagina, (error, seguimientos, total) => {
    if (error) return res.status(500).json({ mensaje: "¡Error en el servidor!" });

    if (seguimientos.length <= 0) return res.status(404).json({ mensaje: "¡No te sigue ningún usuario!" });

    idsUsuariosSeguimiento(sub).then((valor) => {
      return res.status(200).json({
        total,
        paginas: Math.ceil(total/elementosPorPagina),
        seguimientos,
        usuariosSeguidos: valor.seguidos,
        usuariosSeguidores: valor.seguidores
      });
    })
  });
}

controller.obtenerSeguimientos = async (req, res) => {
  const { sub } = req.usuario;
  let seguimientos = Seguimiento.find({ usuario: sub });

  if (req.params.seguido) seguimientos = Seguimiento.find({ seguido: sub });

  try {
    const seguidos = await seguimientos.populate('usuario seguido').exec();

    if (!seguidos) return res.status(404).json({ mensaje: "¡No sigues a ningún usuario!" });

    return res.status(200).json({ seguidos });

  } catch (error) {
    return res.status(500).json({ mensaje: "¡Error en el servidor!" });
  }
}

module.exports = controller;