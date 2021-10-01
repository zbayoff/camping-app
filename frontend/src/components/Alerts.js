import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';

const Alerts = () => {
	const [alerts, setAlerts] = useState([]);

	const { user } = useContext(AuthContext);

	useEffect(() => {
		const fetchUserAlerts = async () => {
			try {
				// console.log('token: ', localStorage.getItem('jwtToken'))
				const { data } = await axios.get(
					'http://localhost:5000/api/authuser/alerts',
					{
						withCredentials: true,
						// headers: {
						// 	Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
						// },
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
				} else {
					setAlerts([])
				}
			} catch (error) {
				console.log('error.response', error.response);
				// console.log('error.response.data: ', error.response.status)
				// if (error.response.status === 401) {
				// 	<Redirect
				// 		to={{
				// 			pathname: '/login',
				// 		}}
				// 	/>;
				// }
				// console.log('fetchUserAlerts error: ', error);
			}
		};

		fetchUserAlerts();
	}, []);

	return (
		<div>
			<h1>{user.firstName}'s Alerts</h1>
			<ul>
				{alerts.length
					? alerts.map((alert) => {
							return (
								<li key={alert._id}>
									<p>Campground: {alert.campground}</p>
									<p>Checkin: {alert.checkinDate}</p>
									<p>Checkout: {alert.checkoutDate}</p>
								</li>
							);
					  })
					: <div>You have no alerts</div>}
			</ul>
		</div>
	);
};

export default Alerts;
