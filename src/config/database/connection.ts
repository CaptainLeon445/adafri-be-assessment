import { Sequelize } from 'sequelize';
import { config, sequelizeConfigOptions } from './config';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config;

let databaseUrl: string;
if (env === 'test')
  databaseUrl = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;
else
  databaseUrl = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}?sslmode=no-verify`;

const sequelize = new Sequelize(databaseUrl, sequelizeConfigOptions);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err.stack);
    process.exit(1);
  });

export default sequelize;
