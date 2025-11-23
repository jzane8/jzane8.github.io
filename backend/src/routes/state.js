// State management routes (protected by authentication)
const express = require('express');
const router = express.Router();
const { saveState, loadState, deleteState } = require('../controllers/stateController');
const { authenticateToken } = require('../middleware/auth');

// All state routes require authentication
// authenticateToken middleware runs before route handlers

// POST /api/state - Save user's state
router.post('/', authenticateToken, saveState);

// GET /api/state - Load user's state
router.get('/', authenticateToken, loadState);

// DELETE /api/state - Delete user's state
router.delete('/', authenticateToken, deleteState);

module.exports = router;
