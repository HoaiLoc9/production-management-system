const sequelize = require('../config/db');
const Team = require('./team');
const Assignment = require('./assignment');

// associate (if needs)
Team.hasMany(Assignment, { foreignKey: 'teamId' });
Assignment.belongsTo(Team, { foreignKey: 'teamId' });

module.exports = {
  sequelize,
  Team,
  Assignment
};
