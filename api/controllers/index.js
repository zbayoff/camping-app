/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const mongoose = require('mongoose');

const User = require('../models/User');
const Alert = require('../models/Alert');
const EmailJob = require('../models/EmailJob');

const { findUser, findAlerts } = require('../helpers/index');

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
	const { userId } = req;
	const { entity, checkinDate, checkoutDate, enabled } = req.body;

	const numExistingAlerts = await Alert.countDocuments({
		userId: ObjectId(userId),
	});

	console.log('entity: ', entity);

	const existingAlert = await Alert.countDocuments({
		'entity.id': entity.id,
		userId: ObjectId(userId),
	});

	if (numExistingAlerts > 7) {
		res.status(500).send({
			status: 500,
			message: 'You may only create 8 alerts max.',
		});
	} else if (existingAlert > 0) {
		res.status(500).send({
			status: 500,
			message: 'You already have an alert for this entity.',
		});
	} else {
		const alert = new Alert({
			userId: ObjectId(userId),
			entity: {
				id: entity.id,
				name: entity.name,
				type: entity.type,
			},
			checkinDate,
			checkoutDate,
			enabled,
		});
		const newAlert = await alert.save();

		const emailJob = await EmailJob.findOne({ userId });

		if (emailJob) {
			console.log('emailJob already exists for this user. Updating...');
			await EmailJob.findOneAndUpdate(
				{ _id: emailJob._id },
				{ alerts: [...emailJob.alerts, newAlert._id] },
				{
					new: true,
				}
			);
		} else {
			const newEmailJobToSave = new EmailJob({
				userId: ObjectId(userId),
				alerts: [alert],
				// lastRunAt: { $date: '2021-11-22T10:24:18.092Z' },
			});

			const newEmailJob = await newEmailJobToSave.save();

			await User.findByIdAndUpdate(userId, { emailJobId: newEmailJob._id });
		}

		res.send(alert);
	}
}

async function deleteAlert(req, res) {
	try {
		const { id } = req.params;
		const { userId } = req;

		await Alert.deleteOne({ _id: id });

		// remove alert from emailJob
		const emailJob = await EmailJob.findOne({
			userId: ObjectId(userId),
		});

		const newAlerts = emailJob.alerts.filter((alertId) => {
			return !alertId.equals(ObjectId(id));
		});

		// update and save
		await EmailJob.findOneAndUpdate(
			{
				userId,
			},
			{ alerts: newAlerts }
		);

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
