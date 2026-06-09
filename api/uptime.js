const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const dbPath = path.join('/tmp', 'uptime.json');

    // Baca data
    let data = { seconds: 0 };
    try {
        if (fs.existsSync(dbPath)) {
            data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }
    } catch (e) {}

    // POST — tambah 10 detik
    if (req.method === 'POST') {
        data.seconds = (data.seconds || 0) + 10;
        try {
            fs.writeFileSync(dbPath, JSON.stringify(data));
        } catch (e) {
            return res.status(500).json({ error: 'Write failed' });
        }
        return res.json(data);
    }

    // GET — balikin total detik
    return res.json(data);
};