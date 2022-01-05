import React, { useContext } from 'react';

import axios from 'axios';

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

const DeleteAlertModal = ({ alert, handleClose, open, setSelectedAlert }) => {
	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);

	const onSubmitHandler = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.delete(
				`/api/alert/${alert.id}`,
				{
					withCredentials: true,
				}
			);
			setSeverity('success');
			setMessage('Success! Your alert has been deleted.');
			setSnackOpen(true);

			handleClose();
		} catch (err) {
			console.log('err deleting alert: ', err.response);

			// show custom snackbar error
			setSeverity('error');
			setMessage(
				'Error deleting alert: ' +
					' ' +
					err.response.status +
					' ' +
					err.response.statusText
			);
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
				onSubmit={onSubmitHandler}
			>
				<DialogTitle>Delete Alert</DialogTitle>

				<DialogContent>
					<DialogContentText>
						Delete alert for campground: {alert ? alert.campground.name : null}
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
