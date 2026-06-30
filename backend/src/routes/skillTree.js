const express = require('express');
const router = express.Router();
const { getSkillTree } = require('../controllers/skillTreeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getSkillTree);

module.exports = router;
