import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Login from './Login';
import Logout from './Logout';

//
const Home = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			const {data} = await axios.get(
				'http://localhost:5000/api/user',
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
				setUser(data);
			}
		};

		fetchUser();
	}, []);

	return (
		<div>
			Home Page
			<Login />
			<Logout />
			<div>{user ? <div>Welcome user: {user.firstName}
			<a href={"/alerts"}>Alerts</a>
			</div> : null}</div>
			
		</div>
	);
};

export default Home;
