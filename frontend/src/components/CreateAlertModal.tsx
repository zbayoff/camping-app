import React, { useContext } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import axios, { AxiosError } from 'axios';
import moment from 'moment';

import { Box } from '@mui/system';
import { Button, SvgIcon, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';

import Link from '@mui/material/Link';

import { SnackbarContext } from '../contexts/snackbarContext';

import { DateRange } from '@mui/lab/DateRangePicker';

import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import { TentIconPath } from './SVGIconPaths';

export type campgroundValue = {
	displayName: string;
	entityId: string;
	entityType: string;
};

interface CreateAlertModalProps {
	handleClose: () => void;
	open: boolean;
	campgroundValue: campgroundValue;
	checkInOutDates: DateRange<moment.Moment>;
}

const CreateAlertModal = ({
	open,
	handleClose,
	campgroundValue,
	checkInOutDates,
}: CreateAlertModalProps) => {
	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);

	let history = useHistory();

	const onSubmitHandler = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();

		// restrict alerts to 2 week period MAX
		if (checkInOutDates[0] && checkInOutDates[1]) {
			if (
				Math.abs(checkInOutDates[0].diff(checkInOutDates[1], 'days')) + 1 >
				15
			) {
				setSeverity('error');
				setMessage('Error. An alert may be created only for a 14 day period.');
				setSnackOpen(true);
			} else {
				try {
					await axios.post(
						'/api/alert',
						{
							entity: {
								id: campgroundValue.entityId,
								name: campgroundValue.displayName,
								type: campgroundValue.entityType,
							},
							checkinDate: checkInOutDates[0].format('YYYY-MM-DD'),
							checkoutDate: checkInOutDates[1].format('YYYY-MM-DD'),
							enabled: true,
						},
						{
							withCredentials: true,
						}
					);

					setSeverity('success');
					setMessage('Success! Your alert has been created.');
					setSnackOpen(true);

					handleClose();
					history.push('/alerts');
				} catch (err) {
					console.error('err adding alert: ', err);

					if (axios.isAxiosError(err)) {
						const axiosError = err as AxiosError;

						console.error('Axios error: ', axiosError.response);

						setMessage(
							'Error adding alert: ' + axiosError.response?.data.message + ' '
						);
					}

					// show custom snackbar error
					setSeverity('error');
					setSnackOpen(true);
				}
			}
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				style: { borderRadius: '15px' },
			}}
			maxWidth={'xs'}
			fullWidth={true}
			sx={{ padding: '2rem' }}
		>
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
					<SvgIcon
						sx={{ width: '50px', height: '50px' }}
						color="primary"
						viewBox="0 0 79 75"
					>
						<TentIconPath />
					</SvgIcon>
				</Box>

				<Box>
					<Typography
						color={'primary'}
						sx={{
							textTransform: 'uppercase',
							fontWeight: 300,
							fontSize: '18px',
							letterSpacing: '.1rem',
						}}
					>
						Creating an alert for:
					</Typography>
					<Typography
						color={'primary'}
						sx={{
							fontWeight: 700,
							fontSize: '18px',
							letterSpacing: '.1rem',
							textTransform: 'capitalize',
						}}
					>
						{campgroundValue.displayName}
					</Typography>
					<Typography
						color={'primary'}
						sx={{
							fontWeight: 700,
							fontSize: '18px',
							letterSpacing: '.1rem',
						}}
					>
						{checkInOutDates[0]?.format('MM/DD/YYYY')} -{' '}
						{checkInOutDates[1]?.format('MM/DD/YYYY')}
					</Typography>
				</Box>
			</Box>
			<Box
				sx={{
					backgroundColor: '#FCF7EE',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					padding: '2rem',
				}}
			>
				<Button
					variant="contained"
					startIcon={<NotificationAddIcon />}
					onClick={onSubmitHandler}
					sx={{
						padding: '15px',
						borderRadius: '15px',
						fontWeight: 600,
						fontSize: '14px',
					}}
				>
					Create an alert
				</Button>
				<Typography
					color={'primary'}
					textAlign={'center'}
					sx={{
						paddingTop: '2rem',

						fontWeight: 300,
						fontSize: '16px',
						letterSpacing: '.05rem',
					}}
				>
					You will be alerted of availablities by email. Frequency of
					notifications can be modified in{' '}
					<Link
						sx={{ fontWeight: 600, textDecoration: 'none' }}
						component={RouterLink}
						to="/alerts"
					>
						your alert
					</Link>{' '}
					preferences.
				</Typography>
			</Box>
		</Dialog>
	);
};

export default CreateAlertModal;
