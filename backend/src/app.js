const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const captainRoutes = require('./routes/captainRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/error');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 500 }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/captain', captainRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

module.exports = app;
