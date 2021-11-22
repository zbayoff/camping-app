const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// configs
dotenv.config('./.env');
// require('./config/passport')(passport);
// mongoose.set('debug', true);

const webApp = express();
const webAppPort = process.env.PORT || 5000;

webApp.use(morgan('tiny'));
webApp.use(cookieParser());

webApp.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.json());

webApp.use(express.static(path.join(__dirname, 'frontend/build')));

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
const authRoute = require('./api/routes/auth');

webApp.use('/api', routes);
webApp.use('/auth', authRoute);

// webApp.get('*', (req, res) => {
// 	res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
// });

// webApp.get('/', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
// });

async function graceful() {
	// await emailAgenda.stop();
	// await recApiAgenda.stop();
	process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

webApp.listen(webAppPort, () => {
	console.log(`Example webApp listening at port:${webAppPort}`);
});
