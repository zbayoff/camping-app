const express = require('express');

const Alert = require('../models/Alert');

const auth = require('../middleware/checkAuth');

const router = express.Router();

const mainController = require('../controllers/index');
const {
	getAvailableCampsites,
	getAvailablePermits,
} = require('../helpers/recreationGovApi');
const User = require('../models/User');

router.get('/alerts', auth, mainController.getAlerts);
router.post('/alert', auth, mainController.addAlert);
router.delete('/alert/:id', auth, mainController.deleteAlert);
router.put('/alert/:id', auth, mainController.updateAlert);

router.get('/user', auth, (req, res) => {
	res.send(req.user);
});
router.get('/users', mainController.getUsers);
router.post('/user', mainController.addUser);
router.put('/user', auth, async (req, res) => {
	const { user } = req.body;
	try {
		const updatedUser = await User.findByIdAndUpdate(
			{ _id: req.userId },
			user,
			{ new: true }
		);
		res.send(updatedUser);
	} catch (err) {
		console.log('error updating user: ', err);
		res.status(err.status || 500).send({
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		});
	}
});
router.get('/user/alerts', auth, async (req, res) => {
	// fetch all alerts associated with authenticated user
	try {
		const alerts = await Alert.find({ userId: req.userId }); // should both be ObjectId types
		console.log('alerts: ', alerts)
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

	console.log('id: ', id);

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
	} catch (err) {
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
	} catch (err) {
		console.log('err getAvailablePermits: ', err);
		res.status(err.status || 500).send({
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		});
		// next(err);
	}
});

module.exports = router;
