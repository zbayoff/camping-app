import React from 'react';

import { AuthProvider } from '../../contexts/authContext';
import { SnackbarProvider } from '../../contexts/snackbarContext';

import Routing from './Routing';
import Navigation from '../../components/Navigation';

import '../../App.scss';

function App() {
	return (
		<AuthProvider>
			<SnackbarProvider>
				<Navigation />
				<Routing />
			</SnackbarProvider>
		</AuthProvider>
	);
}

export default App;
