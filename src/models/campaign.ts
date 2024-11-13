import sequelize from '../config/database/connection';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface CampaignAttributes {
  id: string;
  title: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

class Campaign extends Model<CampaignAttributes> implements CampaignAttributes {
  public id!: string;
  public title!: string;
  public budget!: number;
  public startDate!: Date;
  public endDate!: Date;
  public status!: string;
  public createdAt: Date;
  public updatedAt: Date;

}

Campaign.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn('now') },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn('now') },
  },
  {
    sequelize,
    modelName: 'Campaign',
    tableName: 'Campaigns',
  }
);

export default Campaign;
