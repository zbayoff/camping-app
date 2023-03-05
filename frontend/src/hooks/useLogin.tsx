import { useContext } from 'react';
import axios from 'axios';

// import { useGoogleLogin }s from 'react-google-login';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { useGoogleLogin } from '@react-oauth/google';

export interface LocationState {
	from: {
		pathname: string;
	};
}

const useLogin = () => {
	const history = useHistory();
	const location = useLocation<LocationState>();
	const { setUser } = useContext(AuthContext);

	const onSuccessHandler = async (response: any) => {
		const { data } = await axios.post('/auth/google', {
			code: response.code,
		});

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

	const onFailureHandler = (reason: any) => {
		console.log('failed: ', reason);
		history.replace('/');
	};

	const login = useGoogleLogin({
		onSuccess: onSuccessHandler,
		onError: onFailureHandler,
		flow: 'auth-code',
	});

	return {
		login,
	};
};

export default useLogin;
