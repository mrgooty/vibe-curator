const userDao = require('../daos/userDao');

exports.savePreferences = (userId, preferences) => {
  return userDao.save(userId, preferences);
};

exports.getPreferences = (userId) => {
  return userDao.get(userId);
};
