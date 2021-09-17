const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// require('dotenv').config();

const User = require('../models/User');

const auth = async (req, res) => {
	const { token } = req.body;
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID,
	});

	const { sub, email_verified, email, given_name, family_name, picture } =
		ticket.getPayload();
	// console.log('ticket.getPayload();: ', ticket.getPayload());

	if (email_verified) {
		try {
			const user = await User.findOne({ email });
			if (user) {
				console.log('user exists!');
				// generate JSON Web Token
				const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
					expiresIn: '30 seconds',
				});

				res
					.cookie('token', jwtToken, {
						httpOnly: true,
						maxAge: 600000, // 10 minutes
					})
					.send({
						jwtToken,
						user,
					});
			} else {
				console.log('create user');
				const newUser = new User({
					googleId: sub,
					email,
					firstName: given_name,
					lastName: family_name,
					picture,
				});

				const createdUser = await User.create(newUser);
				const jwtToken = jwt.sign(
					{ _id: createdUser._id },
					process.env.JWT_SECRET,
					{
						expiresIn: '30 seconds',
					}
				);
				console.log('createdUser: ', createdUser);
				res
					.cookie('token', jwtToken, {
						httpOnly: true,
						maxAge: 600000, // 10 minutes
					})
					.send({
						jwtToken,
						user: createdUser,
					});
			}
		} catch (error) {
			console.log('error fetching user: ', error);
		}
	}

	// check if user is in DB, if not add them/update them with new token

	// const user = await db.user.upsert({
	// 	where: { email: email },
	// 	update: { name, picture },
	// 	create: { name, email, picture },
	// });
	// res.status(201);
	// res.json(ticket.getPayload());
};

module.exports = {
	auth,
};
