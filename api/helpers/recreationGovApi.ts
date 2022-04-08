/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import Axios from 'axios';
import moment from 'moment';

require('dotenv').config();

interface Site {
	loop: string;
	site: string;
	siteId: string;
}

interface AvailableSites {
	date: string;
	sites: Site[];
}

interface Availability {
	Date: string;
}

interface RecGovCampsite {
	availabilities: any;
	campsite_id: string;
	campsite_reserve_type: string;
	campsite_rules: null;
	campsite_type: string;
	capacity_rating: string;
	loop: string;
	max_num_people: Number;
	min_num_people: Number;
	quantities: {};
	site: string;
	type_of_use: string;
}

const checkCampsites = (response: any, startDate: Date, endDate: Date) => {
	const availableSites: any[] = [];
	Object.values(response.data.campsites).forEach((site: any) => {
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

const getAvailableCampsites = async (
	campground: Number,
	startDate: Date,
	endDate: Date
) => {
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

const checkPermits = (response: any, startDate: Date, endDate: Date) => {
	const availablePermits = Object.values(
		Object.values<any>(response.data.payload.availability)[0].date_availability
	)
		.map((date: any, index) => {
			const keyDate = Object.keys(
				Object.values<any>(response.data.payload.availability)[0]
					.date_availability
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

const getAvailablePermits = async (
	permit: string,
	startDate: Date,
	endDate: Date
) => {
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

export { getAvailableCampsites, getAvailablePermits };
