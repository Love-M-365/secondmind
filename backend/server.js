import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import memoryRoutes from './routes/memory.routes.js';
import twinRoutes from './routes/twin.routes.js';
import agentRoutes from './routes/agent.routes.js';


// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SecondMind API is running successfully' });
});

// App Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/twin', twinRoutes);
app.use('/api/agents', agentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SecondMind Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
