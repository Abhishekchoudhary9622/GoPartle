require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[GoPratle Server] Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
      console.log(`[GoPratle Server] Health check available at: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[GoPratle Server] Startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
