const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const Sentry = require('@sentry/node');

const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const configureSocket = require('./socket/socketHandler');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express(); // Initialize Express app before Sentry
const server = http.createServer(app);

// --- Sentry Initialization ---
Sentry.init({
  app: app, // Pass the Express app instance
  dsn: process.env.SENTRY_DSN,
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// --- CORS Configuration ---
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
};

// --- Core Middleware ---
// Sentry handlers are now added automatically by passing `app` to Sentry.init()
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// --- Socket.io Configuration ---
const io = new Server(server, {
  cors: corsOptions,
});
configureSocket(io);

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);

// --- Root Route ---
app.get('/', (req, res) => {
  res.send('Chat Server is running.');
});

// --- Error Handling ---
// The Sentry error handler is automatically added as the last error handler
app.use(errorHandler);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});