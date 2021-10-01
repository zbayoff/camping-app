import React, {useContext} from 'react';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const Login = () => {
	const history = useHistory();
	const location = useLocation();
	const { setUser } = useContext(AuthContext);

	const onSuccessHandler = async (response) => {
		console.log('response: ', response);
		const { data } = await axios.post('/auth/google', {
			token: response.tokenId,
		});
		// const data = await res.json();
		console.log('data: ', data);

		// save user data and jwt in localStorage
		localStorage.setItem('user', JSON.stringify(data.user));
		localStorage.setItem('jwtToken', data.jwtToken);

		setUser(data.user);


		if (location.state && location.state.from) {
			history.replace(location.state.from.pathname);
		}
		// else go to home
		else {
			history.replace('/');
		}
	};

	const onFailureHandler = (reason) => {
		console.log('failed: ', reason);
	};

	return (
		<GoogleLogin
			clientId="233067414245-il4rkpad53ot27kgln3pe3qbimuu6gvj.apps.googleusercontent.com"
			buttonText="Login"
			onSuccess={onSuccessHandler}
			onFailure={onFailureHandler}
			cookiePolicy={'single_host_origin'}
		/>
		// <a href="http://localhost:5000/auth/google">
		// 	<button>Login With Google</button>
		// </a>
	);
};

export default Login;
