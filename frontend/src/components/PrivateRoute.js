import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { isLogin } from '../utils';
import { useAuth } from '../contexts/useAuth';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { user } = useAuth();

    console.log('user: ', user)

	return (
		// Show the component only when the user is logged in
		// Otherwise, redirect the user to /signin page

		<Route
			{...rest}
			render={(props) =>
				user ? <Component {...props} /> : null
			}
		/>
	);
};

export default PrivateRoute;
