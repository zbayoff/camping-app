const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require('../models/User');

const signJwtToken = (user, res) => {
	const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '7 days',
	});

	res.cookie('token', jwtToken, {
		httpOnly: true,
		maxAge: 600000000, // 7 days
		path: '/',
		secure: process.env.NODE_ENV === 'production',
	});
	res.cookie('secondToken', jwtToken, {
		httpOnly: false,
		maxAge: 600000000, // 7 days
		path: '/',
		secure: process.env.NODE_ENV === 'production',
	});
	res.send({
		jwtToken,
		user,
	});
};

// register/login user
const auth = async (req, res) => {
	const { token } = req.body;
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID,
	});

	const { sub, email_verified, email, given_name, family_name, picture } =
		ticket.getPayload();

	if (email_verified) {
		try {
			const user = await User.findOne({ email });
			// login user
			// create a jwt
			if (user) {
				console.log('user exists!');
				// generate JSON Web Token

				signJwtToken(user, res);

				// set an http Only cookie and send it back to the user to use for future api access attempts.
			} else {
				console.log('create user');
				const newUser = new User({
					googleId: sub,
					email,
					firstName: given_name,
					lastName: family_name,
					picture,
					notificationSettings: {
						frequencyNumber: 10,
						frequencyGranularity: 'minutes',
					},
				});

				const createdUser = await User.create(newUser);
				signJwtToken(createdUser, res);
			}
		} catch (error) {
			console.log('error fetching user: ', error);
		}
	} else {
		res.status(403).json({
			data: 'google email not verified, try creating a valid google email',
		});
	}
};

module.exports = {
	auth,
};
