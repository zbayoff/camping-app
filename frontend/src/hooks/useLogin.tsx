import { useContext } from 'react';
import axios from 'axios';

import { useGoogleLogin } from 'react-google-login';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

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
			token: response.tokenId,
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

	const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
		? process.env.REACT_APP_GOOGLE_CLIENT_ID
		: '';

	const { signIn } = useGoogleLogin({
		clientId: clientId,
		onSuccess: onSuccessHandler,
		onFailure: onFailureHandler,
		cookiePolicy: 'single_host_origin',
	});

	return { signIn };
};

export default useLogin;
