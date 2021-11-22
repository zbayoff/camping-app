const mongoose = require('mongoose');

const User = require('../models/User');
const Alert = require('../models/Alert');

const { findUser, findAlerts } = require('../helpers/index');
console.log('here!')
const { emailAgenda } = require('../agenda');

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
	// TODO: user only allowed to add up to 7 alerts. So must query DB to check how many alerts this user has.
	// if > 7, send http error code, else, proceed to insert into DB
	// TODO: check that user has already created an alert for this campground ID.
	const { userId } = req;
	const { campground, checkinDate, checkoutDate, enabled } = req.body;
	console.log('checkinDate: ', checkinDate);
	const alert = new Alert({
		userId: ObjectId(userId),
		campground: {
			id: campground.id,
			name: campground.name,
		},
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

async function deleteAlert(req, res) {
	try {
		const { id } = req.params;

		await Alert.deleteOne({ _id: id });

		res.status(200).send();
	} catch (err) {
		console.log('error deleting alert: ', err);
		res.status(err.status || 500).send({
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		});
	}
}

async function updateAlert(req, res) {
	try {
		const { alert } = req.body;
		const updatedAlert = await Alert.findOneAndUpdate(
			{ _id: req.params.id },
			alert,
			{
				new: true,
			}
		);

		res.send(updatedAlert);
	} catch (err) {
		console.log('error updating alert: ', err);
		res.status(err.status || 500).send({
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		});
	}
}

module.exports = {
	addUser,
	getUser,
	getUsers,
	addAlert,
	getAlerts,
	deleteAlert,
	updateAlert,
};
