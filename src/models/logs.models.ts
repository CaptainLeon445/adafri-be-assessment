import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../config/database/connection';

interface LogsAttributes {
  id: number;
  server: object;
  request: object;
  response: object;
  userDetails: object;
  createdAt: Date;
  updatedAt: Date;
}

class Logs extends Model<LogsAttributes> implements LogsAttributes {
  public id!: number;
  public server: object;
  public request: object;
  public response: object;
  public userDetails: object;
  public createdAt: Date;
  public updatedAt: Date;
}

Logs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    userDetails: { type: DataTypes.JSON, allowNull: true },
    server: { type: DataTypes.JSON, allowNull: true },
    request: { type: DataTypes.JSON, allowNull: true },
    response: { type: DataTypes.JSON, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn('now') },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn('now') },
  },
  {
    sequelize,
    tableName: 'Logs',
    modelName: 'Logs',
  }
);

export default Logs;
