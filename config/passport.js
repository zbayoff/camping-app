const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../api/models/User');

module.exports = (passport) => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback',
				// passReqToCallback: true,

				// proxy: true,
			},
			async (accessToken, refreshToken, profile, done) => {
				console.log('profile, ', profile);

				try {
					const user = await User.findOne({ googleId: profile.id });
					if (user) {
						done(null, user);
					} else {
						const newUser = new User({
							googleId: profile.id,
							email: profile._json.email,
							firstName: profile.name.givenName,
							lastName: profile.name.familyName,
							picture: profile._json.picture,
						});

						const createdUser = await User.create(newUser);

						done(null, createdUser);
					}
				} catch (error) {
					console.log('error logging in user: ', error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});
};
