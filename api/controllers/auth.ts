import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	'postmessage'
);

import User, { UserSchema } from '../models/User';

const signJwtToken = (user: UserSchema, res: any) => {
	const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
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
const authController = async (req: any, res: any) => {
	let payload;

	try {
		const { tokens } = await client.getToken(req.body.code); // exchange code for tokens

		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token!,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		payload = ticket.getPayload();
	} catch (error) {
		console.error('error validating token: ', error);
		res.status(403).json({
			data: 'error validating token',
		});
	}
	if (payload) {
		const { sub, email_verified, email, given_name, family_name, picture } =
			payload;

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
	}
};

export default authController;
