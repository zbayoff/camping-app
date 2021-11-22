import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

import { validateToken } from '../utils/auth';
import { Container, Grid } from '@mui/material';

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
			<div className="PrivatePage">
				<Container fixed>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Route
								{...componentProps}
								render={(props) => <Component {...props} />}
							/>
						</Grid>
					</Grid>
				</Container>
			</div>
		);
	}
};

export default PrivateRoute;
