const express = require('express');
const router = express.Router();
const {
  getQuests,
  createQuest,
  updateQuest,
  completeQuest,
  deleteQuest,
} = require('../controllers/questController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getQuests).post(createQuest);
router.route('/:id').put(updateQuest).delete(deleteQuest);
router.route('/:id/complete').patch(completeQuest);

module.exports = router;
