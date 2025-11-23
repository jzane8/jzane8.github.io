// State controller handles saving and loading user's political simulator state
const db = require('../config/database');

// Save or update user's state
// Uses UPSERT pattern (INSERT ... ON DUPLICATE KEY UPDATE)
const saveState = async (req, res, next) => {
    try {
        const userId = req.user.userId;  // From JWT token (set by auth middleware)
        const { parties, parliament } = req.body;
        
        // Validate that state data is provided
        if (!parties || !parliament) {
            return res.status(400).json({ error: 'Parties and parliament data required' });
        }
        
        // Validate data structure
        if (!Array.isArray(parties) || !Array.isArray(parliament.favoredParties) || !Array.isArray(parliament.factions)) {
            return res.status(400).json({ error: 'Invalid state data structure' });
        }
        
        // Convert JavaScript objects to JSON strings for database storage
        const partiesJson = JSON.stringify(parties);
        const parliamentJson = JSON.stringify(parliament);
        
        // UPSERT: Insert new state or update existing state for this user
        // ON DUPLICATE KEY UPDATE handles both insert and update in one query
        // https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html
        await db.query(`
            INSERT INTO user_states (user_id, parties_json, parliament_json)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                parties_json = VALUES(parties_json),
                parliament_json = VALUES(parliament_json),
                last_updated = CURRENT_TIMESTAMP
        `, [userId, partiesJson, parliamentJson]);
        
        res.json({ 
            message: 'State saved successfully',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        next(error);
    }
};

// Load user's saved state
// Returns empty default state if no saved state exists
const loadState = async (req, res, next) => {
    try {
        const userId = req.user.userId;  // From JWT token
        
        // Query user's saved state from database
        const [rows] = await db.query(
            'SELECT parties_json, parliament_json, last_updated FROM user_states WHERE user_id = ?',
            [userId]
        );
        
        if (rows.length === 0) {
            // No saved state - return empty default state
            return res.json({
                parties: [],
                parliament: {
                    favoredParties: [],
                    factions: []
                },
                lastUpdated: null
            });
        }
        
        // Parse JSON strings back to JavaScript objects
        const state = rows[0];
        res.json({
            parties: JSON.parse(state.parties_json),
            parliament: JSON.parse(state.parliament_json),
            lastUpdated: state.last_updated
        });
        
    } catch (error) {
        next(error);
    }
};

// Delete user's saved state
const deleteState = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        
        await db.query(
            'DELETE FROM user_states WHERE user_id = ?',
            [userId]
        );
        
        res.json({ message: 'State deleted successfully' });
        
    } catch (error) {
        next(error);
    }
};

module.exports = { saveState, loadState, deleteState };
