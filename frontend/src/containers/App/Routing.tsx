import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import Alerts from '../../components/Alerts';
import Login from '../../components/Login';

import Home from '../../components/Home';
import Donate from '../../components/Donate';

const Routing = () => {
	return (
		<Switch>
			<Route exact path="/" component={Home} />
			<PrivateRoute exact path="/alerts" component={Alerts} />
			<Route exact path="/login" component={Login} />
			<Route exact path="/donate" component={Donate} />
		</Switch>
	);
};

export default Routing;
