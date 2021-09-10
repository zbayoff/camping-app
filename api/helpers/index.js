const User = require('../models/User');
const Alert = require('../models/Alert');

function findUser(userId) {
	return User.findById(userId);
}

function findAlerts() {
	return Alert.find({});
}

module.exports = {
	findUser,
	findAlerts,
};
