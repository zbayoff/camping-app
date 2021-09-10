const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const { emailAgenda, recApiAgenda } = require('./api/agenda');

require('dotenv').config();

const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { MONGO_CONNECTION_STRING } = process.env;

// mongoose.set('debug', true);

mongoose
	.connect(MONGO_CONNECTION_STRING, {
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

(async function () {
	// IIFE to give access to async/await
	await emailAgenda.start();
	await recApiAgenda.start();
	await recApiAgenda.every('5 seconds', 'hit Rec Api');
})();

async function graceful() {
	await emailAgenda.stop();
	await recApiAgenda.stop();
	process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

app.use('/api', routes);

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.all('*', (req, resp, next) => {
	console.info(`${req.method} ${req.originalUrl}`);
	next();
});

app.listen(port, () => {
	console.log(`Example app listening at port:${port}`);
});
