const express = require('express');
const router = express.Router();

// @desc   Health check endpoint
// @route  GET /api/health
// @access Public
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

module.exports = router;