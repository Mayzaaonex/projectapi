const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const dbPath = path.join('/tmp', 'uptime.json');

    // GET — Baca uptime
    if (req.method === 'GET') {
        let data = { startTime: Date.now() };
        try {
            if (fs.existsSync(dbPath)) {
                data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            }
            if (!data.startTime) {
                data.startTime = Date.now();
                fs.writeFileSync(dbPath, JSON.stringify(data));
            }
        } catch (e) {}
        return res.json(data);
    }

    // POST — Set uptime (reset)
    if (req.method === 'POST') {
        const data = { startTime: Date.now() };
        try {
            fs.writeFileSync(dbPath, JSON.stringify(data));
        } catch (e) {
            return res.status(500).json({ error: 'Write failed' });
        }
        return res.json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
};