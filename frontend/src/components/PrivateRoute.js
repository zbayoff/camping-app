import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useGoogleLogin } from 'react-google-login';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

// import { isLogin } from '../utils';
import { AuthContext } from '../contexts/authContext';
import { validateToken } from '../utils/auth';

export const PrivateRoute = ({ component, path, exact }) => {
	return (
		<Route
			path={path}
			exact={exact}
			render={(routeProps) => {
				return (
					<PrivatePage
						path={path}
						Component={component}
						componentProps={routeProps}
					/>
				);
			}}
		/>
	);
};

const PrivatePage = ({ Component, componentProps }) => {
	if (
		!validateToken(localStorage.getItem('jwtToken')) ||
		!Cookies.get('secondToken')
	) {
		return (
			<Redirect
				to={{
					pathname: '/login',
					state: { from: componentProps.location },
				}}
			/>
		);
	} else {
		return (
			<Route {...componentProps} render={(props) => <Component {...props} />} />
		);
	}
};

export default PrivateRoute;
