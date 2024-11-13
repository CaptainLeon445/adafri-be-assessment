import app from './app';
import logger from './utilities/logger';

const server = app.listen(process.env.PORT || 3001, () => {
  console.log('Digit-tally API endpoints. 💻');
  console.log(`Server is running on the port ${process.env.PORT || 3001}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION 💥 Shutting down...', err.name, ':', err.message);
  logger.error('UNHANDLED REJECTION 💥 Shutting down...', err.name, ':', err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION 💥 Shutting down...,', err.name, ':', err.message);
  logger.error('UNCAUGHT EXCEPTION 💥 Shutting down...,', err.name, ':', err.message);
  server.close(() => {
    process.exit(1);
  });
});
