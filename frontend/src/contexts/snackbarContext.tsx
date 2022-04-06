import React, { createContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import type { AlertColor } from '@material-ui/lab/Alert';

export const SnackbarContext = createContext<any>(null);

export interface SnackbarProviderProps {
	children: React.ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
	// Snackbar State
	const [snackOpen, setSnackOpen] = useState(false);
	const [severity, setSeverity] = useState<AlertColor>('info');
	const [message, setMessage] = useState('');

	const handleSnackClose = (event: React.SyntheticEvent<any> | Event) => {
		setSnackOpen(false);
	};

	return (
		<SnackbarContext.Provider
			value={{
				snackOpen,
				setSnackOpen,
				severity,
				setSeverity,
				message,
				setMessage,
				handleSnackClose,
			}}
		>
			<Snackbar
				open={snackOpen}
				autoHideDuration={4000}
				onClose={handleSnackClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={handleSnackClose}
					severity={severity}
					sx={{ width: '100%' }}
				>
					{message}
				</Alert>
			</Snackbar>
			{children}
		</SnackbarContext.Provider>
	);
};
