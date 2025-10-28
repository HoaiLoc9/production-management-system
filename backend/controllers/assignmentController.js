const { Assignment, Team } = require('../models');

const getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  }
};

const saveAssignments = async (req, res) => {
  // Expect body: { planCode, orderCode, product, quantity, steps: [{stepIndex, stepName, teamId}, ...] }
  const { planCode, orderCode, product, quantity, steps } = req.body;
  if (!planCode || !steps || !Array.isArray(steps)) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }

  try {
    const created = [];
    for (const s of steps) {
      const a = await Assignment.create({
        planCode,
        orderCode,
        product,
        quantity,
        stepIndex: s.stepIndex,
        stepName: s.stepName,
        teamId: s.teamId
      });
      created.push(a);
    }
    res.json({ message: 'Lưu thành công', created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getTeams, saveAssignments };
