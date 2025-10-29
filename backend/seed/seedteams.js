const sequelize = require('../config/db');
const Team = require('../models/team');

const teams = [
  { code: 'to_1', name: 'Tổ 1' },
  { code: 'to_2', name: 'Tổ 2' },
  { code: 'to_3', name: 'Tổ 3' },
  { code: 'to_4', name: 'Tổ 4' },
  { code: 'to_5', name: 'Tổ 5' },
  { code: 'to_6', name: 'Tổ 6' },
  { code: 'to_7', name: 'Tổ 7' },
  { code: 'to_8', name: 'Tổ 8' },
  { code: 'to_9', name: 'Tổ 9' },
  { code: 'to_10', name: 'Tổ 10' }
];

(async () => {
  try {
    await sequelize.authenticate();
    await Team.sync({ force: true });
    await Team.bulkCreate(teams);
    console.log('Seed teams done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
