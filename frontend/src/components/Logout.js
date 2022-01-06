import React, { useContext } from 'react';
import axios from 'axios';
import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../contexts/authContext';

const Logout = () => {
	const history = useHistory();
	const { setUser } = useContext(AuthContext);

	const onLogoutSuccessHandler = async (response) => {
		history.replace('/');
		
		const res = await axios.delete('/auth/google');
		console.log('res: ', res);

		// save user data and jwt in localStorage
		localStorage.removeItem('user');
		localStorage.removeItem('jwtToken');
		Cookies.remove('secondToken');

		setUser(null);
		// refresh the page
		window.location.reload();

		
	};

	const onFailureHandler = () => {
		console.log('failed: ');
	};

	return (
		<GoogleLogout
			clientId="233067414245-il4rkpad53ot27kgln3pe3qbimuu6gvj.apps.googleusercontent.com"
			buttonText="Logout"
			onLogoutSuccess={onLogoutSuccessHandler}
			onLogoutFailure={onFailureHandler}
		/>
	);
};

export default Logout;
