import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import Alerts from '../../components/Alerts';
import Login from '../../components/Login';

import Home from '../../components/Home';

const Routing = () => {
	return (
		<Switch>
			<Route exact path="/" component={Home} />

			<PrivateRoute exact path="/alerts" component={Alerts} />
			<Route
				exact
				path="/login"
				render={(routeProps) => (
					<div className="LoginWrapper">
						<Login />
					</div>
				)}
			/>
		</Switch>
	);
};

export default Routing;
