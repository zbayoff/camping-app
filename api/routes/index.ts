import Alert from '../models/Alert';
import User from '../models/User';

import express, { Request, Response } from 'express';

import checkAuth from '../middleware/checkAuth';

const router = express.Router();

import {getAlerts, addAlert, deleteAlert, updateAlert, getUsers, addUser } from '../controllers/index'
const {
	getAvailableCampsites,
	getAvailablePermits,
} = require('../helpers/recreationGovApi');

router.get('/alerts', checkAuth, getAlerts);
router.post('/alert', checkAuth, addAlert);
router.delete('/alert/:id', checkAuth, deleteAlert);
router.put('/alert/:id', checkAuth, updateAlert);

router.get('/user', checkAuth, (req: Request, res) => {
	res.send(req.user);
});
router.get('/users', getUsers);
router.post('/user', addUser);
router.put('/user', checkAuth, async (req: Request, res) => {
	const { user } = req.body;
	try {
		const updatedUser = await User.findByIdAndUpdate(
			{ _id: req.userId },
			user,
			{ new: true }
		);
		res.send(updatedUser);
	} catch (err: any) {
		console.log('error updating user: ', err);
		res.status(err.status || 500).send({
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		});
	}
});
router.get('/user/alerts', checkAuth, async (req: Request, res) => {
	// fetch all alerts associated with authenticated user
	try {
		const alerts = await Alert.find({ userId: req.userId }); // should both be ObjectId types
		res.send(alerts);
	} catch (error) {
		console.log('/user/alerts: ', error);
		res.status(404).json({
			message: 'no alerts found',
			error,
		});
	}
});

router.post('/availableCampsites', async (req, res) => {
	const { id, checkinDate, checkoutDate } = req.body;

	try {
		if (id) {
			const campsites = await getAvailableCampsites(
				id,
				checkinDate,
				checkoutDate
			);
			res.json(campsites);
		} else {
			throw new Error(
				'Entity not found. Please choose an entity from the selected list.'
			);
		}
	} catch (err: any) {
		console.log('err getAvailableCampsites: ', err);
		res.status(err.status || 500).send({
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		});
		// next(err);
	}
});

router.post('/availablePermits', async (req, res) => {
	const { id, checkinDate, checkoutDate } = req.body;

	try {
		if (id) {
			const permits = await getAvailablePermits(id, checkinDate, checkoutDate);
			res.json(permits);
		} else {
			throw new Error(
				'Campground not found. Please choose a campground from the selected list.'
			);
		}
	} catch (err: any) {
		console.log('err getAvailablePermits: ', err);
		res.status(err.status || 500).send({
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		});
		// next(err);
	}
});

module.exports = router;
