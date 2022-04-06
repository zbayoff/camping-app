import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

import { validateToken } from '../utils/auth';
import { Container, Grid } from '@mui/material';

interface PrivateRouteProps {
    path: string;
    exact?: boolean;
    component: React.ComponentType<any>;
}

export const PrivateRoute = ({ component, path, exact }: PrivateRouteProps) => {
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

interface PrivatePageProps {
    path: string;
    Component: React.ComponentType<any>;
    componentProps: any;
}

const PrivatePage = ({ Component, componentProps }: PrivatePageProps) => {
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
