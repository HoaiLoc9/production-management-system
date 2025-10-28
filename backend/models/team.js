const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Team extends Model {}
Team.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'team', tableName: 'teams', timestamps: false });

module.exports = Team;
