import React from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AuthProvider } from '../../contexts/authContext';
import { SnackbarProvider } from '../../contexts/snackbarContext';

import Routing from './Routing';
import Navigation from '../../components/Navigation';

import '../../App.scss';

const theme = createTheme();

theme.typography.h1 = {
	// fontSize: '2rem',
	...theme.typography.h1,
	fontSize: '2rem',
	[theme.breakpoints.up('sm')]: {
		fontSize: '3.4rem',
	},
};

function App() {
	return (
		<AuthProvider>
			<ThemeProvider theme={theme}>
				<SnackbarProvider>
					<Navigation />
					<Routing />
				</SnackbarProvider>
			</ThemeProvider>
		</AuthProvider>
	);
}

export default App;
