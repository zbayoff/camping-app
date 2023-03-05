import React, { useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import Cookies from 'js-cookie';
import { AuthContext } from '../contexts/authContext';
import { SxProps } from '@mui/system';

import Box from '@mui/material/Box';
import { googleLogout } from '@react-oauth/google';

interface LogoutProps {
	sx?: SxProps;
}

const Logout = ({ sx }: LogoutProps) => {
	const history = useHistory();
	const { setUser } = useContext(AuthContext);

	const onLogoutHandler = async () => {
		googleLogout();
		history.replace('/');

		await axios.delete('/auth/google');

		// save user data and jwt in localStorage
		localStorage.removeItem('user');
		localStorage.removeItem('jwtToken');
		Cookies.remove('secondToken');

		setUser(null);
		// refresh the page
		window.location.reload();
	};

	return (
		<Box
			sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
			onClick={onLogoutHandler}
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
	);
};

export default Logout;
