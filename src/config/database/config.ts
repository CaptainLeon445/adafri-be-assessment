import { SequelizeConfig } from '.';
import { isTestENV } from '../../utilities/guards';

const dbConfig = {
  development: {
    name: process.env.DEV_DATABASE_NAME,
    user: process.env.DEV_DATABASE_USER,
    password: process.env.DEV_DATABASE_PASSWORD,
    host: process.env.DEV_DATABASE_HOST,
    port: process.env.DEV_DATABASE_PORT,
  },
  production: {
    name: process.env.PROD_DATABASE_NAME,
    user: process.env.PROD_DATABASE_USER,
    password: process.env.PROD_DATABASE_PASSWORD,
    host: process.env.PROD_DATABASE_HOST,
    port: process.env.PROD_DATABASE_PORT,
  },
  test: {
    name: process.env.LOCAL_DATABASE_NAME,
    user: process.env.LOCAL_DATABASE_USER,
    password: process.env.LOCAL_DATABASE_PASSWORD,
    host: process.env.LOCAL_DATABASE_HOST,
    port: process.env.LOCAL_DATABASE_PORT,
  },
};

const env = process.env.NODE_ENV || 'development';
export const config = dbConfig[env];

const sequelizeOptions: SequelizeConfig = {
  logging: false,
  dialect: 'postgres',
  sync: { alter: false },
  define: {
    underscored: true,
    freezeTableName: false,
    charset: 'utf8',
    timestamps: true,
  },
  pool: {
    max: 50,
    min: 10,
    acquire: 2_000,
    idle: 1_000,
    evict: 1_000,
  },
  dialectOptions: {
    connectTimeout: 3_000,
  },
};
if (!isTestENV) {
  sequelizeOptions['dialectOptions']['ssl'] = {
    require: !isTestENV,
    rejectUnauthorized: false,
  };
}

export const sequelizeConfigOptions = sequelizeOptions;
