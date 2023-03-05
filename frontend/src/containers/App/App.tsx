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
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					letterSpacing: '.1rem',
					borderRadius: '15px',
				},
			},
		},
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
