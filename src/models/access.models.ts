import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../config/database/connection';

export interface AccessAttributes {
  id?: number;
  live_admin_key: string;
  test_admin_key: string;
  live_user_key: string;
  test_user_key: string;
  createdAt?: Date;
}

class Access extends Model<AccessAttributes> implements AccessAttributes {
  public id!: number;
  public live_admin_key!: string;
  public test_admin_key!: string;
  public live_user_key!: string;
  public test_user_key!: string;
  public createdAt: Date;
}

Access.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    live_admin_key: { type: DataTypes.STRING, allowNull: false },
    live_user_key: { type: DataTypes.STRING, allowNull: false },
    test_admin_key: { type: DataTypes.STRING, allowNull: false },
    test_user_key: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn('now') },
  },
  {
    sequelize,
    tableName: 'access',
    modelName: 'Access',
  }
);

export default Access;
