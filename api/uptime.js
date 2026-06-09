const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const dbPath = path.join('/tmp', 'uptime.json');

    // POST — Set/reset uptime
    if (req.method === 'POST') {
        const data = { startTime: Date.now() };
        try {
            fs.writeFileSync(dbPath, JSON.stringify(data));
        } catch (e) {
            return res.status(500).json({ error: 'Write failed' });
        }
        return res.json(data);
    }

    // GET — Baca uptime
    let data = { startTime: Date.now() };
    try {
        if (fs.existsSync(dbPath)) {
            data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }
    } catch (e) {}
    
    return res.json(data);
};