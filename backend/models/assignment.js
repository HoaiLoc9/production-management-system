const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Assignment extends Model {}
Assignment.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  planCode: { type: DataTypes.STRING, allowNull: false },
  orderCode: { type: DataTypes.STRING },
  product: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER },
  stepIndex: { type: DataTypes.INTEGER, allowNull: false },
  stepName: { type: DataTypes.STRING, allowNull: false },
  teamId: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'assignment', tableName: 'assignments', timestamps: true });

module.exports = Assignment;
