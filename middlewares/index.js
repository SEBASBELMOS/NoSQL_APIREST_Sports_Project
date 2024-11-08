const validarCampos = require('./validar-campos');
const validarEquipo = require('./validarEquipo');
const validarDeportista = require('./validarDeportista');
const validarContratacion = require('./validarContratacion');

module.exports = {
    ...validarCampos,
    ...validarEquipo,
    ...validarDeportista,
    ...validarContratacion
};
