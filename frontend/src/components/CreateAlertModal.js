import React, { useContext } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import axios from 'axios';

import { Box } from '@mui/system';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';

import DatePicker from '@mui/lab/DatePicker';

import AdapterDateFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import Link from '@mui/material/Link';

import { SnackbarContext } from '../contexts/snackbarContext';

const CreateAlertModal = ({
	open,
	handleClose,
	campgroundValue,
	checkInOutDates,
}) => {
	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);

	let history = useHistory();

	const onSubmitHandler = async (event) => {
		event.preventDefault();

		// restrict alerts to 2 week period MAX
		if (
			Math.abs(checkInOutDates[0].diff(checkInOutDates[1], 'days')) + 1 >
			14
		) {
			setSeverity('error');
			setMessage('Error. An alert may be created only for a 14 day period.');
			setSnackOpen(true);
		} else {
			try {
				const response = await axios.post(
					'/api/alert',
					{
						campground: {
							id: campgroundValue.entityId,
							name: campgroundValue.displayName,
						},
						checkinDate: checkInOutDates[0].format('YYYY-MM-DD'),
						checkoutDate: checkInOutDates[1].format('YYYY-MM-DD'),
						enabled: true,
					},
					{
						withCredentials: true,
					}
				);

				console.log('response: ', response);
				setSeverity('success');
				setMessage('Success! Your alert has been created.');
				setSnackOpen(true);

				handleClose();
				history.push('/alerts');
			} catch (err) {
				console.log('err adding alert: ', err.response);

				// show custom snackbar error
				setSeverity('error');
				setMessage(err.response.status + ' ' + err.response.statusText);
				setSnackOpen(true);
			}
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
				<DialogTitle>Create Alert</DialogTitle>

				<DialogContent>
					<DialogContentText>
						You will be alerted by email for this campground at the frequency
						according to your preferences in Settings. Modify them{' '}
						<Link component={RouterLink} to="/settings">
							here
						</Link>
						.
					</DialogContentText>
					<TextField
						required
						id="filled-basic"
						variant="filled"
						placeholder="Campground Name"
						label="Campground"
						disabled
						size="small"
						margin="dense"
						value={campgroundValue.displayName}
						inputProps={{ style: { textTransform: 'capitalize' } }}
						InputLabelProps={{
							shrink: true,
						}}
						fullWidth
					/>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Checkin"
							value={checkInOutDates[0]}
							onChange={(newValue) => {}}
							disabled
							renderInput={(params) => (
								<TextField
									sx={{ mr: 2 }}
									size="small"
									margin="dense"
									variant="filled"
									{...params}
								/>
							)}
						/>
					</LocalizationProvider>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Checkout"
							value={checkInOutDates[1]}
							onChange={(newValue) => {}}
							disabled
							renderInput={(params) => (
								<TextField
									size="small"
									margin="dense"
									variant="filled"
									{...params}
								/>
							)}
						/>
					</LocalizationProvider>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button variant="contained" onClick={onSubmitHandler}>
						Create
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default CreateAlertModal;
