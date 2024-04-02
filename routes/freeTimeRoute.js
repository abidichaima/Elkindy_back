const express = require('express');
const { createFreeTime, getFreeTime, updateFreeTime, deleteFreeTime, deleteAllFreeTimes } = require("../controllers/freeTimeControllers.js");

const router = express.Router();

router.post('/:userId', createFreeTime);
router.get('/:userId', getFreeTime);
router.put('/:userId/:freeTimeId', updateFreeTime);
router.delete('/:userId/:freeTimeId', deleteFreeTime);
router.delete('/:userId', deleteAllFreeTimes);


module.exports = router;
