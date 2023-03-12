import { QueryClient, QueryClientProvider } from 'react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AuthProvider } from '../../contexts/authContext';
import { SnackbarProvider } from '../../contexts/snackbarContext';

import Routing from './Routing';
import Navigation from '../../components/Navigation';

import '../../App.scss';

const theme = createTheme({
	palette: {
		primary: {
			main: '#415D6E',
		},
		secondary: {
			main: '#757D67',
		},
		cream: {
			main: '#FCF7EE',
		},
		brown: {
			main: '#693B06',
		},
		yellow: {
			main: '#E58B31',
		},
		green: {
			main: '#5F5F08',
		},
		teal: {
			main: '#174C49',
		},
		greyBlue: {
			main: '#788186',
		},
		greyBlue2: {
			main: '#4A5860',
		},
		venmoBlue: {
			main: '#008CFF',
		},
		payPalBlue: {
			main: '#00457C',
		},
	},
	typography: {
		fontFamily: ['Karla'].join(','),
	},
});

// Create a client
const queryClient = new QueryClient();

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
	? process.env.REACT_APP_GOOGLE_CLIENT_ID
	: '';

function App() {
	return (
		<AuthProvider>
			<GoogleOAuthProvider clientId={clientId}>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<SnackbarProvider>
							<Navigation />
							<Routing />
						</SnackbarProvider>
					</ThemeProvider>
				</QueryClientProvider>
			</GoogleOAuthProvider>
		</AuthProvider>
	);
}

export default App;
