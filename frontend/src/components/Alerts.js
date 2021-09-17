import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Alerts = () => {
	const [alerts, setAlerts] = useState(null);

	useEffect(() => {
		const fetchUserAlerts = async () => {
			try {
				const { data } = await axios.get(
					'http://localhost:5000/api/authuser/alerts',
					{
						withCredentials: true,
						// headers: {
						// 	Accept: 'application/json',
						// 	'Content-Type': 'application/json',
						// 	'Access-Control-Allow-Credentials': true,
						// },
					}
				);
				console.log('data: ', data);
				if (data) {
					setAlerts(data);
				}
			} catch (error) {
				console.log('fetchUserAlerts error: ', error);
			}
		};

		fetchUserAlerts();
	}, []);

	return (
		<div>
			<h1>Your Alerts</h1>
			<ul>
				{alerts ? alerts.map((alert) => {
					return (
						<li key={alert._id}>
							<p>Campground: {alert.campground}</p>
							<p>Checkin: {alert.checkinDate}</p>
							<p>Checkout: {alert.checkoutDate}</p>
						</li>
					);
				}) : null}
			</ul>
		</div>
	);
};

export default Alerts;
