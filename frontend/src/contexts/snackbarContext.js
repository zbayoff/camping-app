import React, { createContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
	// Snackbar State
	const [snackOpen, setSnackOpen] = useState(false);
	const [severity, setSeverity] = useState('info');
	const [message, setMessage] = useState('');

	const handleSnackClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

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
