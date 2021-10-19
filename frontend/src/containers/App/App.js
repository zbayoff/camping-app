import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from '../../components/PrivateRoute';
import Alerts from '../../components/Alerts';
import Login from '../../components/Login';

import Home from '../../components/Home';

import { AuthProvider } from '../../contexts/authContext';
import Routing from "./Routing";
import Navigation from "../../components/Navigation";

import '../../App.scss';


function App() {
	return (
		<AuthProvider>

			{/* <div className="Wrapper"> */}
			<Navigation />
			<Routing />
			{/* </div> */}

		</AuthProvider>
	);
}

export default App;
