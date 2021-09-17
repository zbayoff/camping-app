const express = require('express');
const passport = require('passport');

// const authController = require('../controllers/auth');

const router = express.Router();

const auth = require('../middleware/checkAuth');

// router.post('/api/v1/auth/google', authController.auth);

router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		console.log('req.user', req.user);


		res.redirect('http://localhost:3000');
	}
);

router.get('/logout', (req, res) => {
	// console.log('req.user: ', req.user);
	// if (req.user) {
	req.logout();
	res.redirect('http://localhost:3000');
	// }
});

module.exports = router;
