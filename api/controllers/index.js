const User = require('../models/User');
const Alert = require('../models/Alert');

const { findUser, findAlerts } = require('../helpers/index');
const { emailAgenda } = require('../agenda');

const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

async function getUser(req, res) {
	const { id } = req.params;
	const user = await findUser(id);
	res.send(user);
}

async function getUsers(req, res) {
	const results = await User.find({});
	res.send(results);
}

async function getAlerts(req, res) {
	console.log('getAlerts req.user: ', req.user)
	const results = await findAlerts();
	res.send(results);
}

async function addUser(req, res) {
	const { name, email, notificationSettings } = req.body;
	const user = new User({
		name,
		email,
		notificationSettings,
	});
	await user.save();
	res.send(user);
}

async function addAlert(req, res) {
	const { userId, campground, checkinDate, checkoutDate, enabled } = req.body;
	const alert = new Alert({
		userId: ObjectId(userId),
		campground,
		checkinDate,
		checkoutDate,
		enabled,
	});
	await alert.save();

	const user = await findUser(userId);

	const job = emailAgenda.create('email user', {
		to: user.email,
		campsites: [],
	});

	const newJob = await job.save();

	await User.findByIdAndUpdate(userId, { alertJobId: newJob.attrs._id });

	res.send(alert);
}

module.exports = {
	addUser,
	getUser,
	getUsers,
	addAlert,
	getAlerts,
};
