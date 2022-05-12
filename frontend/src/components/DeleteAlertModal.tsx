import React, { useContext } from 'react';

import axios, { AxiosError } from 'axios';

import Box from '@mui/material/Box';

import {
	Button,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';

import { SnackbarContext } from '../contexts/snackbarContext';
import { Alert } from './EditAlertModal';

export type Entity = {
	id: Number;
	name: String;
	type: 'campground' | 'permit';
};

interface DeleteAlertModalProps {
	alert: Alert;
	handleClose: () => void;
	open: boolean;
}

const DeleteAlertModal = ({
	alert,
	handleClose,
	open,
}: DeleteAlertModalProps) => {
	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);

	const onSubmitHandler = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();

		try {
			const response = await axios.delete(`/api/alert/${alert._id}`, {
				withCredentials: true,
			});
			setSeverity('success');
			setMessage('Success! Your alert has been deleted.');
			setSnackOpen(true);

			handleClose();
		} catch (err) {
			console.error('err deleting alert: ', err);
			if (axios.isAxiosError(err)) {
				const axiosError = err as AxiosError;

				console.error('Axios error: ', axiosError.response);

				setMessage(
					'Error deleting user alert: ' +
						' ' +
						axiosError.response?.status +
						' ' +
						axiosError.response?.statusText
				);
			}

			// show custom snackbar error
			setSeverity('error');

			setSnackOpen(true);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<Box
				px={0}
				py={0}
				component="form"
				className=""
				sx={{
					'& > :not(style)': { m: 1 },
				}}
				autoComplete="off"
			>
				<DialogTitle>Delete Alert</DialogTitle>

				<DialogContent>
					<DialogContentText>
						Delete alert for campground: {alert ? alert.entity.name : null}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button color="error" variant="contained" onClick={onSubmitHandler}>
						Delete
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default DeleteAlertModal;
