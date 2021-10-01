const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const { createProxyMiddleware } = require('http-proxy-middleware');

// configs
dotenv.config('./.env');
require('./config/passport')(passport);
// mongoose.set('debug', true);

const app = express();
const port = process.env.PORT || 5000;

const { emailAgenda, recApiAgenda } = require('./api/agenda');

app.use(morgan('tiny'));
app.use(cookieParser());
// app.use(function (req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
// 	next();
// });
// app.use(
// 	cors({
// 		credentials: true,
// 		origin: "http://localhost:3000",
// 		// methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// 	})
// );
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// app.use(function (req, res, next) {
// 	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
// 	res.header('Access-Control-Allow-Credentials', true);
// 	next();
// });

// app.use(
// 	createProxyMiddleware('/auth/google', { target: 'http://localhost:5000' })
// );
// app.use(createProxyMiddleware('/api/**', { target: 'http://localhost:5000' }));

// app.use(
// 	cookieSession({
// 		maxAge: 300000, // session cookie age before user must log in again
// 		keys: [process.env.COOKIE_SESSION_KEY],
// 	})
// );

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'frontend/build')));

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

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
// });



// app.get('/', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
// });
app.listen(port, () => {
	console.log(`Example app listening at port:${port}`);
});
