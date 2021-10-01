import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import Login from './Login';
import Logout from './Logout';
import {Link} from 'react-router-dom';
import Alerts from './Alerts';
import { AuthContext } from '../contexts/authContext';

// import { UserContext } from '../contexts/userContext';
//
const Home = () => {
	// const [user, setUser] = useState(null);

	const { user } = useContext(AuthContext);



	// console.log('user: ', user);

	// useEffect(() => {
	// 	const fetchUser = async () => {
	// 		const { data } = await axios.get('http://localhost:5000/api/user', {
	// 			withCredentials: true,
				// headers: {
				// 	Accept: 'application/json',
				// 	'Content-Type': 'application/json',
				// 	'Access-Control-Allow-Credentials': true,
				// },
	// 		});
	// 		console.log('data: ', data);
	// 		if (data) {
	// 			setUser(data);
	// 		}
	// 	};

	// 	fetchUser();
	// }, []);

	console.log('user: ', user)

	return (
		<div>
			Home Page
			{user ? <div>
				Hello {user.firstName}
				<div><Logout /></div>
				
			</div> : <Login />}
		
			
			
			<Link  to="/alerts" underline="none">
				Alerts{' '}
			</Link>
			
			<div>
				{/* {user ? (
					<div>
						Welcome user: {user.firstName}
						<a href={'/alerts'}>Alerts</a>
					</div>
				) : (
					<Login />
				)} */}
			</div>
		</div>
	);
};

export default Home;
