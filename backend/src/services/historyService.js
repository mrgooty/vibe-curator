const historyDao = require('../daos/historyDao');

exports.getHistory = async (userId) => {
  return await historyDao.fetch(userId);
};
