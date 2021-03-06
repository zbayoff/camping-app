import { QueryClient, QueryClientProvider } from 'react-query';
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

function App() {
	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<SnackbarProvider>
						<Navigation />
						<Routing />
					</SnackbarProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</AuthProvider>
	);
}

export default App;
