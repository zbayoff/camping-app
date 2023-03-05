import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { AuthContext } from '../contexts/authContext';
import useLogin from '../hooks/useLogin';
export interface LocationState {
	from: {
		pathname: string;
	};
}

const Login = () => {
	const history = useHistory();
	const { user } = useContext(AuthContext);

	const { login } = useLogin();

	useEffect(() => {
		if (user) {
			history.replace('/');
		} else {
			login();
		}
	}, [user, login, history]);

	return (
		<div>
			<div className="bg-image"></div>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					height: 'calc(100vh - 65px)',
				}}
			>
				<Typography
					sx={{
						fontWeight: 600,
						letterSpacing: '0.1rem',
						fontSize: '20px',
						marginTop: '3rem',
					}}
					color={'white'}
				>
					Sit tight while we log you in...
				</Typography>
			</Box>
		</div>
	);
};

export default Login;
