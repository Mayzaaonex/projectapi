const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const dbPath = path.join('/tmp', 'database.json');
    
    let db = { total: 0, credits: 0, history: [] };
    try {
        if (fs.existsSync(dbPath)) {
            db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }
    } catch (e) {}

    res.json(db);
};