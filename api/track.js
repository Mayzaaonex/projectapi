const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const dbPath = path.join('/tmp', 'database.json');
    
    let db = { total: 0, credits: 0, history: [] };
    try {
        if (fs.existsSync(dbPath)) {
            db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }
    } catch (e) {}

    const { type } = req.body || {};
    db.total++;
    db.credits++;
    db.history.push({
        time: new Date().toISOString(),
        type: type || 'api'
    });

    if (db.history.length > 100) {
        db.history = db.history.slice(-100);
    }

    try {
        fs.writeFileSync(dbPath, JSON.stringify(db));
    } catch (e) {
        return res.status(500).json({ error: 'Write failed' });
    }

    res.json({ success: true, total: db.total });
};