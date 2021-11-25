const User = require('../models/User');
const Alert = require('../models/Alert');
const EmailJob = require('../models/EmailJob');

function findUser(userId) {
	return User.findById(userId);
}

function findAlerts() {
	return Alert.find({});
}

function findAlertsById(alertId) {
	return Alert.findById(alertId);
}

function findEmailJobs() {
	return EmailJob.find({});
}

module.exports = {
	findUser,
	findAlerts,
	findAlertsById,
	findEmailJobs,
};
