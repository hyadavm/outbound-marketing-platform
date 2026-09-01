import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import campaignRoutes from './routes/campaign.routes';
import emailRoutes from './routes/email.routes';
import analyticsRoutes from './routes/analytics.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

export default app;
