const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/assignmentController');

router.get('/teams', ctrl.getTeams);
router.post('/assignments', ctrl.saveAssignments);

module.exports = router;
