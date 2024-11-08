const { Router } = require('express');
const {
    recentContracts,
    filteredAthletes,
    millionaireContractsAthletes,
    athletesCountByTeam,
    athletesByBirthDate,
    multinationalTeams,
    athletesWithoutContract,
    contractValuesByTeam,
    athletesWithAboveAverageContracts
} = require('../controllers/consultations');

const router = Router();

router.get('/recent-contracts', recentContracts);

router.get('/athletes', filteredAthletes);

router.get('/millionaire-contracts-athletes', millionaireContractsAthletes);

router.get('/athletes-count-by-team', athletesCountByTeam);

router.get('/athletes-by-birth-date', athletesByBirthDate);

router.get('/multinational-teams', multinationalTeams);

router.get('/athletes-without-contract', athletesWithoutContract);

router.get('/contract-values-by-team', contractValuesByTeam);

router.get('/athletes-with-above-average-contracts', athletesWithAboveAverageContracts);

module.exports = router;
