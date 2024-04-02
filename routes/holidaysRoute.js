const express = require('express');
const { createHoliday, getHolidays, updateHolidays, deleteHolidays, deleteAllHolidayss } = require("../controllers/holidaysController.js");

const router = express.Router();

router.post('/', createHoliday);
router.get('/', getHolidays);
router.put('/:holidaysId', updateHolidays);
router.delete('/:holidaysId', deleteHolidays);
router.delete('/', deleteAllHolidayss);
router.get('/:holidaysId', getHolidays)

module.exports = router;