const express = require('express');
// const passport = require('passport');

const authController = require('../controllers/auth');

const router = express.Router();

const auth = require('../middleware/checkAuth');

router.post('/google', authController.auth);
router.delete('/google', auth, (req, res) => {
	res.clearCookie('token', { httpOnly: true, path: '/' });
	res.status('200').json({ deleted: true });
});

// router.get(
// 	'/google',
// 	passport.authenticate('google', { scope: ['profile', 'email'] }),
// 	(req, res) => {
// 		req.session.returnTo = req.originalUrl;
// 	}
// );

// router.get(
// 	'/google/callback',
// 	passport.authenticate('google', {
// 		failureRedirect: '/',
// 		successReturnToOrRedirect: 'http://localhost:3000',
// 	}),
// 	(req, res) => {
// 		// console.log('req.session.returnTo: ', req.session.returnTo);
// 		// console.log('req.query', req.query);
// 		// console.log('req.originalUrl: ', req.originalUrl);
// 		// console.log('req.user', req.user);

// 		// res.redirect('http://localhost:3000');
// 		// res.json(req.user)
// 	}
// );

// router.get('/logout', (req, res) => {
// 	// console.log('req.user: ', req.user);
// 	// if (req.user) {
// 	req.logout();
// 	res.redirect('http://localhost:3000');
// 	// }
// });

module.exports = router;
