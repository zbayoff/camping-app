import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';

import './App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Navbar from './components/Navbar';
// import PrivatePage from './components/PrivatePage';
// import PublicPage from './components/PublicPage';
import PrivateRoute from './components/PrivateRoute';
import Alerts from './components/Alerts';
import Login from './components/Login';

// import { AuthProvider, useAuth  } from './contexts/authContext';
// import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import Home from './components/Home';

// import { UserContext } from './contexts/userContext';
import {AuthProvider} from './contexts/authContext';

// const queryClient = new QueryClient()

function App() {
	// const { user, setUser, isLoading } = useFindUser();

	// console.log('App user: ', user)

	return (
		// <div className="App">
		// <QueryClientProvider client={queryClient}>
		<AuthProvider>
			<Switch>
				<Route exact path="/" component={Home} />
				{/* <Route exact path="/loginRedirect" component={LoginRedirect} /> */}
				{/* <Route exact path="/alerts" component={Alerts} /> */}
				<PrivateRoute exact path="/alerts" component={Alerts} />
				<Route exact path="/login" component={Login} />
				{/* <UserContext.Provider value={providerValue}>
				<Route exact path="/" component={Home} />
				<Route exact path="/login" component={LoginRedirect} />

				<Route exact path="/alerts">
					<Redirect to={'/login'} />
				</Route>
			</UserContext.Provider> */}
			</Switch>
		</AuthProvider>
		// </QueryClientProvider>
		// </div>
	);
}

export default App;
