const { Router } = require('express');
const { check } = require('express-validator');
const {
    getAthletes,
    getAthlete,
    addAthlete,
    updateAthlete,
    deleteAthlete
} = require('../controllers/athletes');

const { validateFields } = require('../middlewares/validate-fields');
const { athleteExistsById, noContractsForAthlete } = require('../middlewares/validateAthlete');

const router = Router();

router.get('/', getAthletes);

router.get('/:id', [
    check('id', 'Invalid ID').isInt(),
    check('id').custom(athleteExistsById),
    validateFields
], getAthlete);

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty(),
    check('number', 'Number is required and must be a number').isNumeric(),
    validateFields
], addAthlete);

router.put('/:id', [
    check('id', 'Invalid ID').isInt(),
    check('id').custom(athleteExistsById),
    validateFields
], updateAthlete);

router.delete('/:id', [
    check('id', 'Invalid ID').isInt(),
    check('id').custom(athleteExistsById),
    check('id').custom(noContractsForAthlete),
    validateFields
], deleteAthlete);

module.exports = router;
