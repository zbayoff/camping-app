const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
// const helmet = require('helmet');

// const cors = require('cors');
const cookieParser = require('cookie-parser');

// configs
dotenv.config('./.env');
// mongoose.set('debug', true);

const webApp = express();
const webAppPort = process.env.PORT || 5000;

// webApp.use(helmet());
webApp.use(morgan('tiny'));
webApp.use(cookieParser());

// webApp.use(cors());

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

webApp.use(express.static(path.join(__dirname, 'frontend/build')));
webApp.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// webApp.get('/*', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'path/to/your/index.html'), (err) => {
// 		if (err) {
// 			res.status(500).send(err);
// 		}
// 	});
// });

webApp.listen(webAppPort, () => {
	console.log(`WebApp listening at port:${webAppPort}`);
});
