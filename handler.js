/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const Aws = require('aws-sdk');
const moment = require('moment');
const mongoose = require('mongoose');

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
		console.error('Could not connect to the database. Exiting now...', err);
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

	const emailJobs = await findEmailJobs();

	for (const emailJob of emailJobs) {
		const user = await findUser(emailJob.userId);

		const availableCampgrounds = [];

		console.log(
			`---- Email Job ${emailJob._id} -------------------------------------------------`
		);

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

				if (
					alert.enabled &&
					moment.utc().isBefore(moment.utc(alert.checkoutDate))
				) {
					console.log(
						`hit Rec.gov API for user: ${user.firstName} (${user.email}) for ${alert.entity.type}: ${alert.entity.name} `
					);
					try {
						const campsites = await getAvailableCampsites(
							alert.entity.id,
							alert.checkinDate,
							alert.checkoutDate
						);

						if (campsites.length) {
							availableCampgrounds.push({
								id: alert.entity.id,
								name: alert.entity.name,
								availabilities: campsites,
							});
						} else {
							console.log(
								`no available ${alert.entity.type}s found for this alert`
							);
						}
					} catch (err) {
						console.log('err getAvailableCampsites: ', err);
					}
				} else {
					console.log(
						'alert is not enabled or alert checkout date has passed. not fetching from Rec API.'
					);
				}
			}

			if (availableCampgrounds.length) {
				try {
					await sendEmail(availableCampgrounds, user, emailJob);
				} catch (e) {
					console.log('error sending email: ', e);
				}
			}
		} else {
			console.log('currently not past user frequency');
		}
	}
};

// (async () => {
// 	// IIFE to give access to async/await
// 	await availability(null, {});
// 	process.exit();
// })();

module.exports = {
	availability,
};
