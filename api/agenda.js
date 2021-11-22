/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const moment = require('moment');
const mongoose = require('mongoose');
const Agenda = require('agenda');

const { findUser, findAlerts } = require('./helpers/index');
const { getAvailableCampsites } = require('./helpers/recreationGovApi');

const { ObjectId } = mongoose.Types;

const { MONGO_CONNECTION_STRING } = process.env;

const emailAgenda = new Agenda({
	db: { address: MONGO_CONNECTION_STRING, collection: 'emailJobs' },
});

const recApiAgenda = new Agenda({
	db: { address: MONGO_CONNECTION_STRING, collection: 'recApiJobs' },
});

emailAgenda.define('email user', async (job) => {
	const { to } = job.attrs.data;

	console.log(`emailing user.... ${to}`);

	// await emailClient.send({
	//   to,
	//   from: "example@example.com",
	//   subject: "Email Report",
	//   body: "...",
	// });
	// nodemailer send email...
});

recApiAgenda.define('hit Rec Api', async (job) => {
	const alerts = await findAlerts();

	for (const alert of alerts) {
		const user = await findUser(alert.userId);

		if (alert.enabled) {
			console.log(
				`hit rec api for user: ${user.firstName} for campground: ${alert.campground} `
			);
			const campsites = await getAvailableCampsites(
				alert.campground.id,
				alert.checkinDate,
				alert.checkoutDate
			);

			// fake campsites promise api hit: start
			// const campsites = await new Promise((resolve) =>
			// 	setTimeout(resolve, 200, [])
			// );
			// fake campsites promise api hit: end

			console.log('campsites: ', campsites);

			const [emailJob] = await emailAgenda.jobs({
				_id: ObjectId(user.alertJobId),
			});

			if (
				campsites.length > 0 &&
				moment
					.utc()
					.isAfter(
						moment
							.utc(emailJob.attrs.lastFinishedAt)
							.add(
								user.notificationSettings.frequencyNumber,
								user.notificationSettings.frequencyGranularity
							)
					)
			) {
				// trigger the email Job
				emailJob.attrs.data.campsites = campsites;
				await emailJob.save();
			}
		}
	}
});

module.exports = {
	emailAgenda,
	recApiAgenda,
};
