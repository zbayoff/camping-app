/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const Axios = require('axios');
const moment = require('moment');

require('dotenv').config();

const checkCampsites = (response, startDate, endDate) => {
	const availableSites = [];
	Object.values(response.data.campsites).forEach((site) => {
		for (const [key, value] of Object.entries(site.availabilities)) {
			if (
				value === 'Available' &&
				moment(key).isBetween(startDate, endDate, undefined, '[)')
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

	const groupToValues = availableSites.reduce((obj, item) => {
		obj[item.date] = obj[item.date] || [];
		obj[item.date].push({
			loop: item.loop,
			site: item.site,
			siteId: item.siteId,
		});
		return obj;
	}, {});

	const availableSitesArray = Object.keys(groupToValues).map((key) => {
		return { date: key, sites: groupToValues[key] };
	});

	return availableSitesArray;
};

const getAvailableCampsites = async (campground, startDate, endDate) => {
	const format = 'YYYY-MM-DD';

	const start = moment(startDate);
	const end = moment(endDate);

	const startMonths = [];
	// get the start of every month between and including startDate and endDate
	while (
		start.isBefore(end) ||
		start.clone().format('M') === end.clone().format('M')
	) {
		startMonths.push(moment(start).startOf('month').format(format));
		start.add(1, 'month');
	}

	// need to fetch campsites for each month, if startDate and endDate fall on different months

	// Promise.all to loop through each 'startMonth' and combine all available sites into one array
	const promises = startMonths.map((month) => {
		const apiURL = `https://www.recreation.gov/api/camps/availability/campground/${campground}/month?start_date=${month}T00%3A00%3A00.000Z`;
		return new Promise((resolve, reject) => {
			Axios.get(apiURL)
				.then((response) => {
					resolve(checkCampsites(response, startDate, endDate));
				})
				.catch((error) => {
					console.log(
						'Error fetching available campsites from Rec.gov: ',
						error
					);
					reject(error);
				});
		});
	});

	const allCampsites = await Promise.all(promises);

	return allCampsites.flat(Infinity);
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

const getAvailablePermits = async (permit, startDate, endDate) => {
	const format = 'YYYY-MM-DD';

	const start = moment(startDate);
	const end = moment(endDate);

	const startMonths = [];
	// get the start of every month between and including startDate and endDate
	while (
		start.isBefore(end) ||
		start.clone().format('M') === end.clone().format('M')
	) {
		startMonths.push(moment(start).startOf('month').format(format));
		start.add(1, 'month');
	}

	const promises = startMonths.map((month) => {
		const apiURL = `https://www.recreation.gov/api/permits/${permit}/availability/month?start_date=${month}T00%3A00%3A00.000Z`;

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
	});

	const allPermits = await Promise.all(promises);

	return allPermits.flat(Infinity);
};

module.exports = {
	getAvailableCampsites,
	getAvailablePermits,
};
