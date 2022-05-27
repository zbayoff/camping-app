/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const mongoose = require('mongoose');

import User from '../models/User';
import Alert from '../models/Alert';
import EmailJob from '../models/EmailJob';

const { findUser, findAlerts } = require('../helpers/index');

const { ObjectId } = mongoose.Types;

async function getUser(req: any, res: any) {
	const { id } = req.params;
	const user = await findUser(id);
	res.send(user);
}

async function getUsers(req: any, res: any) {
	const results = await User.find({});
	res.send(results);
}

async function getAlerts(req: any, res: any) {
	const results = await findAlerts();
	console.log('results: ', results);
	res.send(results);
}

async function addUser(req: any, res: any) {
	const { name, email, notificationSettings } = req.body;
	const user = new User({
		name,
		email,
		notificationSettings,
	});
	await user.save();
	res.send(user);
}

async function addAlert(req: any, res: any) {
	const { userId } = req;
	const { entity, checkinDate, checkoutDate, enabled } = req.body;

	const numExistingAlerts = await Alert.countDocuments({
		userId: ObjectId(userId),
	});

	if (numExistingAlerts > 7) {
		res.status(500).send({
			status: 500,
			message: 'You may only create 8 alerts max.',
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

async function deleteAlert(req: any, res: any) {
	try {
		const { id } = req.params;
		const { userId } = req;

		await Alert.deleteOne({ _id: id });

		// remove alert from emailJob
		const emailJob = await EmailJob.findOne({
			userId: ObjectId(userId),
		});

		const newAlerts = emailJob?.alerts.filter((alertId: any) => {
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
	} catch (err: any) {
		console.log('error deleting alert: ', err);
		res.status(err.status || 500).send({
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		});
	}
}

async function updateAlert(req: any, res: any) {
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
	} catch (err: any) {
		console.log('error updating alert: ', err);
		res.status(err.status || 500).send({
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		});
	}
}

export {
	addUser,
	getUser,
	getUsers,
	addAlert,
	getAlerts,
	deleteAlert,
	updateAlert,
};
