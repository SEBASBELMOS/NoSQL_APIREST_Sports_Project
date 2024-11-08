const Joi = require('joi');
const { check } = require('express-validator');
const { athleteExistsById, noContractsForAthlete } = require('../middlewares/validateAthlete');

const deportistaSchema = Joi.object({
    nombre: Joi.string().required(),
    pais: Joi.string().required(),
    posicion: Joi.string().required(),
    numero: Joi.number().integer().required(),
    sexo: Joi.string().valid('Masculino', 'Femenino', 'Otro').required(),
    equipoId: Joi.number().integer().required()
});

const validateAthlete = [
    check('name', 'Name is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty(),
    check('number', 'Number is required and must be a number').isNumeric(),
    check('id').custom(athleteExistsById),
    check('id').custom(noContractsForAthlete)
];

module.exports = { 
    deportistaSchema,
    validateAthlete
};
