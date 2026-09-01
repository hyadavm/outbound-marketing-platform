import app from './app';
import { config } from './config/environment';
import { initDatabase } from './config/database';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(config.port, () => {
      logger.info(`Outbound Marketing API Backend server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
