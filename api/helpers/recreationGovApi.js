/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const Axios = require('axios');
// const Aws = require('aws-sdk');
const moment = require('moment');

require('dotenv').config();

// const Ses = new Aws.SES({
// 	accessKeyId: process.env.AWS_KEY,
// 	secretAccessKey: process.env.AWS_SECRET,
// 	region: 'us-east-1',
// });

const sendEmail = (
	campsites,
	campgroundName,
	campSiteUrl,
	startDate,
	permit = '',
	permitName,
	permitResponse
) => {
	let subject = '';
	let data = '';

	if (permit) {
		subject = 'Permits Available!!';
		data = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html>
    <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    </head>
    <body>
    <h2>Permits available for ${permitName}</h2>
    ${permitResponse
			.map((permitOpening) => {
				return `
      <p>${moment.utc(permitOpening.date).format('MM-DD-YYYY')} [${
					permitOpening.remaining
				} permits] <a href="${campSiteUrl}${
					permitOpening.date
				}" target="_blank">${campSiteUrl}${permitOpening.date}</a></p>`;
			})
			.join('')}</body>
    </html>`;
	} else {
		subject = 'Campsites Available!!';
		data = `${campsites.length} available campsites found. GO -> ${campSiteUrl}`;

		data = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html>
    <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    </head>
    <body>
    <h2>Campsites available for ${campgroundName}</h2>
    <a href="${campSiteUrl}" target="_blank">${campSiteUrl}</a>
    ${campsites
			.map((campsite) => {
				return `
      <div>${moment.utc(campsite.date).format('MM-DD-YYYY')} [${
					campsite.sites.length
				} campsites]
        <ul style="list-style-type: circle;">
        ${campsite.sites
					.map((site) => {
						return `<li>${site.loop}, site ${site.site} <a href="https://www.recreation.gov/camping/campsites/${site.siteId}#site-availability" target="_blank">https://www.recreation.gov/camping/campsites/${site.siteId}#site-availability</a></li>`;
					})
					.join('')}
        </ul>
        </div>`;
			})
			.join('')}</body>
    </html>`;
	}

	return Ses.sendEmail({
		Source: process.env.FROM_EMAIL,
		Destination: {
			ToAddresses: process.env.TO_EMAILS.split(' '),
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
		.then(() => {
			console.log('send email');
		})
		.catch((err) => {
			console.log(`error sending email:${err}`);
		});
};

const checkPermits = (response, startDate, endDate) => {
	const availablePermits = Object.values(
		Object.values(response.data.payload.availability)[0].date_availability
	)
		.map((date, index) => {
			const keyDate = Object.keys(
				Object.values(response.data.payload.availability)[0].date_availability
			);

			return {
				...date,
				date: keyDate[index],
			};
		})
		.filter((date) => {
			return date.remaining > 0 &&
				moment(date.date).isBetween(startDate, endDate, undefined, '[]')
				? date
				: null;
		});

	return availablePermits;
};

const checkCampsites = (response, startDate, endDate) => {
	const availableSites = [];
	Object.values(response.data.campsites).forEach((site, index) => {
		for (const [key, value] of Object.entries(site.availabilities)) {
			if (
				value === 'Available' &&
				moment(key).isBetween(startDate, endDate, undefined, '[]')
			) {
				availableSites.push({
					date: key,
					loop: site.loop,
					site: site.site,
					siteId: site.campsite_id,
				});
			}
		}
	});

	const group_to_values = availableSites.reduce(function (obj, item) {
		obj[item.date] = obj[item.date] || [];
		obj[item.date].push({
			loop: item.loop,
			site: item.site,
			siteId: item.siteId,
		});
		return obj;
	}, {});

	const availableSitesArray = Object.keys(group_to_values).map(function (key) {
		return { date: key, sites: group_to_values[key] };
	});

	return availableSitesArray;
};

const getPermits = (permit, start, startDate, endDate) => {
	const apiURL = `https://www.recreation.gov/api/permits/${permit}/availability/month?start_date=${start}T00%3A00%3A00.000Z`;

	return new Promise((resolve, reject) => {
		Axios.get(apiURL)
			.then((response) => {
				resolve(checkPermits(response, startDate, endDate));
			})
			.catch(function (error) {
				console.log(error);
				reject(error);
			});
	});
};

const getAvailableCampsites = (campground, startDate, endDate) => {
	const startMonth = moment(startDate)
		.startOf('month')
		.format('YYYY-MM-DD');

	const apiURL = `https://www.recreation.gov/api/camps/availability/campground/${campground}/month?start_date=${startMonth}T00%3A00%3A00.000Z`;

	return new Promise((resolve, reject) => {
		Axios.get(apiURL)
			.then((response) => {
				resolve(checkCampsites(response, startDate, endDate));
			})
			.catch(function (error) {
				console.log(error);
				reject(error);
			});
	});
};

const availability = async (event) => {
	if (event.campground) {
		const campsiteOpenings = await getAvailableCampsites(
			event.campground,
			event.start,
			event.startDate,
			event.endDate
		);

		if (campsiteOpenings.length) {
			const url = `https://www.recreation.gov/camping/campgrounds/${event.campground}`;

			// await sendEmail(campsiteOpenings, event.campgroundName, url, event.start);
			console.log(
				`Found openings for ${event.campgroundName} between ${event.startDate} and ${event.endDate}`
			);
		} else {
			console.log(
				`No opening found for ${event.campgroundName} between ${event.startDate} and ${event.endDate}`
			);
		}
	} else if (event.permit) {
		const permitOpenings = await getPermits(
			event.permit,
			event.start,
			event.startDate,
			event.endDate
		);

		// console.log("permitOpenings: ", permitOpenings);

		if (permitOpenings.length) {
			const url = `https://www.recreation.gov/permits/${event.permit}/registration/detailed-availability?date=`;

			// await sendEmail(
			// 	null,
			// 	url,
			// 	null,
			// 	event.start,
			// 	event.permit,
			// 	event.permitName,
			// 	permitOpenings
			// );
			console.log(
				`Found openings for ${event.permitName} between ${event.startDate} and ${event.endDate}`
			);
		} else {
			console.log(
				`No opening found for ${event.permitName} between ${event.startDate} and ${event.endDate}`
			);
		}
	}
};

module.exports = {
	availability,
	checkPermits,
	getAvailableCampsites,
};
