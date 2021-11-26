/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const Aws = require('aws-sdk');
const moment = require('moment');
const mongoose = require('mongoose');
const fs = require('fs').promises;

const {
	findUser,
	// findAlerts,
	findEmailJobs,
	findAlertsById,
} = require('./api/helpers/index');

const EmailJob = require('./api/models/EmailJob');

const { getAvailableCampsites } = require('./api/helpers/recreationGovApi');

require('dotenv').config();

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

const Ses = new Aws.SES({
	accessKeyId: process.env.AWS_KEY,
	secretAccessKey: process.env.AWS_SECRET,
	region: 'us-east-1',
});

const sendEmail = async (availableCampgrounds, user, emailJob) => {
	let subject = '';
	let data = '';

	subject = 'Campsites Available!!';
	// data = `${campsites.length} available campsites found. GO -> ${campSiteUrl}`;

	data = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html>
    <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
	<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    </head>
    <body>
    
    ${availableCampgrounds
			.map((availableCampground) => {
				return `
				<h2 style="text-transform:capitalize; font-family: 'Roboto', sans-serif;">Available sites for campground: ${
					availableCampground.name
				}</h2>
				${availableCampground.availabilities
					.sort((a, b) =>
						moment(a.date, 'DD-MM-YYYY').diff(moment(b.date, 'DD-MM-YYYY'))
					)
					.map((availability) => {
						return `
						<h3 style="font-family: 'Roboto', sans-serif;">Date: ${moment
							.utc(availability.date)
							.format('MM-DD-YYYY')}</h3>
						
						<ul style="font-family: 'Roboto', sans-serif;">
						${availability.sites
							.slice(0, 5)
							.map((site) => {
								return `<li style="font-family: 'Roboto', sans-serif;"><a style="font-family: 'Roboto', sans-serif;" href="https://www.recreation.gov/camping/campsites/${site.siteId}#site-availability" target="_blank">Loop ${site.loop}, site ${site.site}</a></li>`;
							})
							.join('')}
							${
								availability.sites.length > 5
									? `<li style="font-family: 'Roboto', sans-serif;">See the rest of the campground availabilites <a href="https://www.recreation.gov/camping/campgrounds/${availableCampground.id}" target="_blank">here</a></li>`
									: ''
							}
							</ul>`;
					})

					.join('')}
     `;
			})
			.join('')}</body>
    </html>`;

	console.log('availableCampgrounds: ', availableCampgrounds);
	console.log('emailing user....', user.email);

	// await fs.writeFile(`${user.email}-test.html`, data);

	// console.log('emailJob: ', emailJob);

	return Ses.sendEmail({
		Source: process.env.FROM_EMAIL,
		Destination: {
			ToAddresses: [user.email],
		},
		Message: {
			Subject: {
				Data: subject,
			},
			Body: {
				Html: {
					Data: data,
					Charset: 'UTF-8',
				},
			},
		},
	})
		.promise()
		.then(async () => {
			console.log('email sent!');
			await EmailJob.findByIdAndUpdate(emailJob._id, {
				lastRunAt: Date.now(),
			});
			// update EmailJob last Finished At
		})
		.catch((err) => {
			console.error('error sending email:', err);
		});
};

const availability = async (event, context) => {
	// loop through emailJobs (which contain one or multiple alerts for a user)
	// run getAvailableCampsites for each alert and store in variable, then email all to user, and update the emailJob with LastFinshedAt...

	// to optimize mongo db connection reuse for Lambda
	context.callbackWaitsForEmptyEventLoop = false;

	try {
		const emailJobs = await findEmailJobs();

		for (const emailJob of emailJobs) {
			const user = await findUser(emailJob.userId);

			const availableCampgrounds = [];

			console.log('-------------------------------------------------');

			// don't query Rec API if last email sent to user is not past their specified frequency
			// but need to deal with case when user first creates EmailJob and emailJob.lastRunAt is ""
			if (
				!emailJob.lastRunAt ||
				(emailJob.lastRunAt &&
					moment
						.utc()
						.isAfter(
							moment
								.utc(emailJob.lastRunAt)
								.add(
									user.notificationSettings.frequencyNumber,
									user.notificationSettings.frequencyGranularity
								)
						))
			) {
				for (const alertId of emailJob.alerts) {
					const alert = await findAlertsById(alertId);

					if (alert.enabled) {
						console.log(
							`hit rec api for user: ${user.firstName} for campground: ${alert.campground.name} `
						);
						const campsites = await getAvailableCampsites(
							alert.campground.id,
							alert.checkinDate,
							alert.checkoutDate
						);

						if (campsites.length) {
							availableCampgrounds.push({
								id: alert.campground.id,
								name: alert.campground.name,
								availabilities: campsites,
							});
						} else {
							console.log('no campsites found for this alert');
						}
					} else {
						console.log('alert is not enabled. not fetching from Rec API.');
					}
				}

				if (availableCampgrounds.length) {
					await sendEmail(availableCampgrounds, user, emailJob);
				}
			} else {
				console.log('currently not past user frequency');
			}
		}
	} catch (err) {
		console.error('error running availability function: ', err);
	}
};

// (async () => {
// 	// IIFE to give access to async/await
// 	await availability();
// 	process.exit();
// })();

module.exports = {
	availability,
};
