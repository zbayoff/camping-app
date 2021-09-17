// require('dotenv').config();

module.exports = (req, res, next) => {
	if (!req.user) {
		// user not logged
		// res.redirect('/auth/google');
		res.status(401).json({
			authenticated: false,
			message: 'user has not been authenticated',
		});



		// should head back to /auth/google for user login?

	} else {
		next();
	}
};
