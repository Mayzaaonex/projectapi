export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    message: 'API is running smooth, wak!',
    timestamp: new Date().toLocaleString()
  });
}