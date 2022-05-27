import React, { useContext } from 'react';

import axios, { AxiosError } from 'axios';

import Box from '@mui/material/Box';

import { Button, DialogActions, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';

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
			await axios.delete(`/api/alert/${alert._id}`, {
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
		<Dialog
			PaperProps={{
				style: { borderRadius: '15px' },
			}}
			maxWidth={'xs'}
			fullWidth={true}
			open={open}
			onClose={handleClose}
		>
			<Box p={0} component="form" autoComplete="off">
				<Box
					sx={{
						display: 'flex',

						padding: '2rem',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: 'rgba(117, 125, 103, 0.2)',
					}}
				>
					<Box sx={{ marginRight: '1rem' }}>
						<DeleteIcon sx={{ color: 'primary.main' }} />
					</Box>

					<Box>
						<Typography
							color={'primary.main'}
							sx={{
								textTransform: 'uppercase',
								fontWeight: 300,
								fontSize: '18px',
								letterSpacing: '.1rem',
							}}
						>
							delete alert for
						</Typography>
						<Typography
							color={'primary.main'}
							sx={{
								fontWeight: 700,
								fontSize: '18px',
								letterSpacing: '.1rem',
							}}
						>
							{alert ? alert.entity.name : null}
						</Typography>
					</Box>
				</Box>
				<DialogActions sx={{ padding: '2rem', backgroundColor: '#FCF7EE' }}>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						sx={{ bgcolor: '#7B3620', color: 'white' }}
						variant="contained"
						onClick={onSubmitHandler}
					>
						Delete
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default DeleteAlertModal;
