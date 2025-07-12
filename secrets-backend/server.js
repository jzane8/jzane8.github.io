const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SETTINGS_FILE = 'settings.json';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Default settings
const defaultSettings = {
    message: false,
    buttonText: '💝 for Sonia',
    messageContent: '💕 This special message is just for you, Sonia! 💕',
    darkTheme: false,
    lightBgColor1: '#667eea',
    lightBgColor2: '#764ba2',
    darkBgColor1: '#2d3748',
    darkBgColor2: '#1a202c'
};

// Load settings from file
async function loadSettings() {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log('Settings file not found, using defaults');
        // Create the file with defaults if it doesn't exist
        await saveSettings(defaultSettings);
        return defaultSettings;
    }
}

// Save settings to file
async function saveSettings(settings) {
    try {
        await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

// Validate settings
function validateSettings(settings) {
    const errors = [];
    
    // Check required fields
    if (typeof settings.message !== 'boolean') {
        errors.push('message must be a boolean');
    }
    if (typeof settings.darkTheme !== 'boolean') {
        errors.push('darkTheme must be a boolean');
    }
    if (!settings.buttonText || settings.buttonText.trim() === '') {
        errors.push('buttonText cannot be empty');
    }
    if (!settings.messageContent || settings.messageContent.trim() === '') {
        errors.push('messageContent cannot be empty');
    }
    
    // Validate color formats (basic hex validation)
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    const colorFields = ['lightBgColor1', 'lightBgColor2', 'darkBgColor1', 'darkBgColor2'];
    
    colorFields.forEach(field => {
        if (!hexColorRegex.test(settings[field])) {
            errors.push(`${field} must be a valid hex color`);
        }
    });
    
    return errors;
}

// API Routes
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await loadSettings();
        res.json(settings);
    } catch (error) {
        console.error('Error loading settings:', error);
        res.status(500).json({ error: 'Failed to load settings' });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const settings = req.body;
        
        // Validate settings
        const errors = validateSettings(settings);
        if (errors.length > 0) {
            return res.status(400).json({ 
                error: 'Invalid settings', 
                details: errors 
            });
        }
        
        // Save settings
        const success = await saveSettings(settings);
        
        if (success) {
            res.json({ 
                message: 'Settings saved successfully',
                settings: settings 
            });
        } else {
            res.status(500).json({ error: 'Failed to save settings' });
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'secrets-backend'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Secrets Backend API',
        endpoints: {
            'GET /api/settings': 'Get current settings',
            'POST /api/settings': 'Update settings',
            'GET /api/health': 'Health check'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
