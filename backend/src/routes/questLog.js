const express = require('express');
const router = express.Router();
const { getLogByDate } = require('../controllers/questLogController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getLogByDate);

module.exports = router;
