const express = require('express');
const dotenv = require('dotenv');

const agendaApp = express();
const agendaAppPort = process.env.PORT || 4000;

dotenv.config({ path: './.env' });

const mongoose = require('mongoose');

const { emailAgenda, recApiAgenda } = require('./api/agenda');

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

(async function () {
	// IIFE to give access to async/await
	await emailAgenda.start();
	await recApiAgenda.start();
	await recApiAgenda.every('10 seconds', 'hit Rec Api');
})();

async function graceful() {
	await emailAgenda.stop();
	await recApiAgenda.stop();
	process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

agendaApp.listen(agendaAppPort, () => {
	console.log(`Agenda.js app listening at port:${agendaAppPort}`);
});

module.exports = {
	emailAgenda,
	recApiAgenda,
};
