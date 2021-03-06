import React, { useContext } from 'react';
import axios from 'axios';
import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router-dom';

import Cookies from 'js-cookie';
import { AuthContext } from '../contexts/authContext';
import { SxProps } from '@mui/system';

import Box from '@mui/material/Box';

interface LogoutProps {
	sx?: SxProps;
}

const Logout = ({ sx }: LogoutProps) => {
	const history = useHistory();
	const { setUser } = useContext(AuthContext);

	const onLogoutSuccessHandler = async () => {
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
			clientId={
				process.env.REACT_APP_GOOGLE_CLIENT_ID
					? process.env.REACT_APP_GOOGLE_CLIENT_ID
					: ''
			}
			buttonText="Logout"
			onLogoutSuccess={onLogoutSuccessHandler}
			onFailure={onFailureHandler}
			render={(renderProps) => (
				<Box
					sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					onClick={renderProps.onClick}
				>
					<Box
						sx={sx}
						style={{
							display: 'inline',
						}}
					>
						Logout
					</Box>
				</Box>
			)}
		/>
	);
};

export default Logout;
