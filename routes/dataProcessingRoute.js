const express = require('express');
const router = express.Router();
// Use require if you're not using ES Modules
const { processData } = require('../controllers/dataProcessingController');

router.post('/process-data', processData);

module.exports = router;