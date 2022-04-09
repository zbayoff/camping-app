import express from 'express';
// import dotenv from 'dotenv';

import path from 'path';

import mongoose from 'mongoose';

import morgan from 'morgan';

import helmet from 'helmet';

import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

// console.log(__dirname + '/.env')

dotenv.config({ path: __dirname + '/.env' });

// dotenv.config();

// console.log('process.env: ', process.env)

// mongoose.set('debug', true);

const webApp = express();
const webAppPort = process.env.PORT || 5000;

webApp.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
webApp.use(morgan('tiny'));
webApp.use(cookieParser());

// webApp.use(cors());

webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.json());

mongoose
	.connect(
		process.env.MONGO_CONNECTION_STRING as string

		// 	, {
		// 	useNewUrlParser: true,
		// }
	)
	.then(() => {
		console.log('Successfully connected to the database');
	})
	.catch((err) => {
		console.log('Could not connect to the database. Exiting now...', err);
		process.exit();
	});

const routes = require('./routes/index');
const authRoute = require('./routes/auth');

webApp.use('/api', routes);
webApp.use('/auth', authRoute);

console.log(path.join(__dirname, '../../frontend/build'))

webApp.use(express.static(path.join(__dirname, '../../frontend/build')));
webApp.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
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
