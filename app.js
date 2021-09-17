const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');

// configs
dotenv.config('./.env');
require('./config/passport')(passport);
// mongoose.set('debug', true);

const app = express();
const port = process.env.PORT || 5000;

const { emailAgenda, recApiAgenda } = require('./api/agenda');

app.use(morgan('tiny'));
app.use(cors({ credentials: true, origin: true }));

app.use(
	cookieSession({
		maxAge: 300000, // session cookie age before user must log in again
		keys: [process.env.COOKIE_SESSION_KEY],
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

mongoose
	.connect(process.env.MONGO_CONNECTION_STRING, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('Successfully connected to the database');
	})
	.catch((err) => {
		console.log('Could not connect to the database. Exiting now...', err);
		process.exit();
	});

const routes = require('./api/routes/index');
// const alertRoutes = require('./api/routes/alerts');
const authRoute = require('./api/routes/auth');

(async function () {
	// IIFE to give access to async/await
	// await emailAgenda.start();
	// await recApiAgenda.start();
	// await recApiAgenda.every('5 seconds', 'hit Rec Api');
})();

async function graceful() {
	await emailAgenda.stop();
	await recApiAgenda.stop();
	process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

app.use('/api', routes);
// app.use('/', alertRoutes);
app.use('/auth', authRoute);

app.listen(port, () => {
	console.log(`Example app listening at port:${port}`);
});
