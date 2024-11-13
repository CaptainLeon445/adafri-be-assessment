export interface SequelizeConfig {
  logging: boolean;
  dialect: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql';
  sync: {
    alter: boolean;
  };
  define: {
    underscored: boolean;
    freezeTableName: boolean;
    charset: string;
    timestamps: boolean;
  };
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
    evict: number;
  };
  dialectOptions: {
    connectTimeout: number;
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}
