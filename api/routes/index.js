const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const Alert = require('../models/Alert');

const auth = require('../middleware/checkAuth');

const router = express.Router();

/* GET home page. */
// router.get("/", async (req, res) => {
//   res.render("index", { title: "Campground checker" });
// });

const mainController = require('../controllers/index');

router.get('/alerts', auth, mainController.getAlerts);
router.post('/alert', mainController.addAlert);

router.get('/user/:id', auth, mainController.getUser);

router.get('/user', auth, (req, res) => {
	console.log('authenticated req.user: ', req.user);
	res.send(req.user);
});

router.get('/users', mainController.getUsers);
router.post('/user', mainController.addUser);

router.get('/authuser/alerts', auth, async (req, res) => {
	// fetch all alerts associated with authenticated user
	try {
		const alerts = await Alert.find({ userId: req.user._id }); // should both be ObjectId types
		res.send(alerts);
	} catch (error) {
		console.log('/authuser/alerts: ', error)
		res.status(404).json({
			message: 'no alerts found',
			error,
		});
	}
});

module.exports = router;
