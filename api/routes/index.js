const express = require('express');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const Alert = require('../models/Alert');

const auth = require('../middleware/checkAuth');

const router = express.Router();

const mainController = require('../controllers/index');
const { getAvailableCampsites } = require('../helpers/recreationGovApi');

router.get('/alerts', auth, mainController.getAlerts);
router.post('/alert', mainController.addAlert);

router.get('/user/:id', auth, mainController.getUser);

router.get('/user', auth, (req, res) => {
	res.send(req.user);
});

router.get('/users', mainController.getUsers);
router.post('/user', mainController.addUser);

router.get('/authuser/alerts', auth, async (req, res) => {
	// fetch all alerts associated with authenticated user
	try {
		const alerts = await Alert.find({ userId: req.userId }); // should both be ObjectId types
		res.send(alerts);
	} catch (error) {
		console.log('/authuser/alerts: ', error);
		res.status(404).json({
			message: 'no alerts found',
			error,
		});
	}
});

router.post('/availableCampsites', async (req, res, next) => {
	const { campgroundId, checkinDate, checkoutDate } = req.body;

	try {
		const campsites = await getAvailableCampsites(
			campgroundId,
			checkinDate,
			checkoutDate
		);
		res.json(campsites);
	} catch (err) {
		console.log('err getAvailableCampsites: ', err);
		next(err);
	}
});

module.exports = router;
