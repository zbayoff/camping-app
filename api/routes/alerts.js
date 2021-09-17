const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const auth = require('../middleware/checkAuth');
const Alert = require('../models/Alert');

const { ObjectId } = mongoose.Types;


router.get('/user/alerts', auth, async (res, req) => {
	// fetch all alerts associated with authenticated user

	console.log('user alerts req.user: ', req.user);
	try {
		// const alerts = await Alert.findById({ userId: ObjectId(req.user._id) }); // should both be ObjectId types
		// res.send(alerts);
	} catch (error) {
		res.status(404).json({
			message: 'no alerts found',
			error,
		});
	}
});

module.exports = router;
