import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import CircularProgress from '@mui/material/CircularProgress';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditAlertModal, { Alert } from './EditAlertModal';
import DeleteAlertModal from './DeleteAlertModal';

import moment from 'moment';
import { Button, Tooltip, Typography } from '@mui/material';

import { SxProps } from '@material-ui/system';
import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import EditUserSettings from './EditUserSettings';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { SnackbarContext } from '../contexts/snackbarContext';

const Alerts = () => {
	const { user } = useContext(AuthContext);

	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const [editUserSettingsOpen, setEditUserSettingsOpen] = useState(false);

	const handleEditModalClose = () => setEditModalOpen(false);
	const handleDeleteModalClose = () => setDeleteModalOpen(false);
	const handleEditUserSettingsClose = () => setEditUserSettingsOpen(false);

	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);

	const queryClient = useQueryClient();

	const deleteMutation = useMutation(
		(id: string) =>
			axios.delete(`/api/alert/${id}`, {
				withCredentials: true,
			}),
		{
			onSuccess: () => {
				queryClient.invalidateQueries();

				setDeleteModalOpen(false);
				setSeverity('success');
				setMessage('Success! Your alert has been deleted.');
				setSnackOpen(true);
			},
			onError: (err) => {
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
			},
		}
	);

	const editMutation = useMutation(
		(newAlert: Alert) => {
			console.log('newAlert: ', newAlert);
			return axios.put(
				`/api/alert/${newAlert._id}`,
				{
					alert: newAlert,
				},
				{
					withCredentials: true,
				}
			);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries();

				setEditModalOpen(false);
				setSeverity('success');
				setMessage('Success! Your alert has been updated.');
				setSnackOpen(true);
			},
			onError: (err) => {
				console.error('err updating alert: ', err);

				if (axios.isAxiosError(err)) {
					const axiosError = err as AxiosError;

					console.error('Axios error: ', axiosError.response);

					setMessage(
						'Error updating user alert: ' +
							' ' +
							axiosError.response?.status +
							' ' +
							axiosError.response?.statusText
					);
				}

				// show custom snackbar error
				setSeverity('error');
				setSnackOpen(true);
			},
		}
	);

	const {
		data: alerts,
		error,
		isLoading,
	} = useQuery('fetchAlerts', async () => {
		const { data }: { data: Alert[] } = await axios.get('/api/user/alerts');

		return data;
	});

	const onDelete = async (id: string) => {
		deleteMutation.mutate(id);
	};

	const onEdit = async (alert: Alert, enabled: boolean) => {
		const newAlert: Alert = {
			...alert,
			enabled,
		};
		editMutation.mutate(newAlert);
	};

	const handleEditModalOpen = (alert: Alert) => {
		// trigger edit alert modal
		setEditModalOpen(true);
		setSelectedAlert(alert);
	};

	const handleDeleteModalOpen = (alert: Alert) => {
		setDeleteModalOpen(true);
		setSelectedAlert(alert);
	};

	const tableHeadStyles: SxProps = {
		fontWeight: 600,
		fontSize: '18px',
		letterSpacing: '.1rem',
		color: 'primary.main',
		textTransform: 'uppercase',
		padding: '1rem 2rem',
	};

	const tableCellStyles: SxProps = {
		fontSize: '18px',
		letterSpacing: '.1rem',
		padding: '0.5rem 2rem',
	};

	return (
		<div className="Alerts">
			<div className="bg-image"></div>
			<Box mt={7} mb={2}>
				<Box
					mx={'2rem'}
					px={2}
					py={1}
					sx={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
					bgcolor={'secondary.main'}
				>
					<Typography
						color={'white'}
						textAlign={'center'}
						sx={{
							fontWeight: 300,
							fontSize: '18px',
							letterSpacing: '0.1rem',
						}}
					>
						You may create a{' '}
						<span style={{ fontWeight: 600 }}>maximum of 8 alerts</span>. Delete
						old alerts to make room for new!
					</Typography>
				</Box>
				<Box
					sx={{
						width: '100%',
					}}
				>
					<TableContainer
						component={Paper}
						sx={{
							borderRadius: '15px',
							background: 'transparent',
						}}
					>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead sx={{ background: 'rgba(252, 247, 238, 0.85)' }}>
								<TableRow>
									<TableCell sx={tableHeadStyles} align="left">
										Location
									</TableCell>
									<TableCell sx={tableHeadStyles} align="left">
										Type
									</TableCell>
									<TableCell sx={tableHeadStyles} align="left">
										Check-in
									</TableCell>
									<TableCell sx={tableHeadStyles} align="left">
										Check-out
									</TableCell>
									<TableCell sx={tableHeadStyles} align="left">
										Alerts
									</TableCell>
									<TableCell sx={tableHeadStyles} align="left"></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading ? (
									<TableRow
										sx={{
											backgroundColor: 'rgba(252, 247, 238, 0.85)',
										}}
									>
										<TableCell colSpan={6} align={'center'}>
											<CircularProgress />
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow
										sx={{
											backgroundColor: 'rgba(252, 247, 238, 0.85)',
										}}
									>
										<TableCell colSpan={6} align={'center'}>
											Error fetching alerts
										</TableCell>
									</TableRow>
								) : alerts ? (
									alerts
										.sort((a: Alert, b: Alert) =>
											moment.utc(b.checkinDate).diff(moment.utc(a.checkinDate))
										)
										.map((row: Alert) => {
											return (
												<Tooltip
													placement="top"
													arrow
													title={
														moment.utc(row.checkoutDate).isBefore(moment.utc())
															? 'Alert has expired'
															: ''
													}
													key={row._id}
												>
													<TableRow
														sx={{
															backgroundColor: 'rgba(252, 247, 238, 0.85)',
														}}
													>
														<TableCell
															sx={{
																textTransform: 'capitalize',
																...tableCellStyles,
																...(moment
																	.utc(row.checkoutDate)
																	.isBefore(moment.utc())
																	? { color: '#757D67', fontWeight: 300 }
																	: { color: 'primary.main', fontWeight: 500 }),
															}}
														>
															{row.entity.name}
														</TableCell>
														<TableCell
															align="left"
															sx={{
																textTransform: 'capitalize',
																...tableCellStyles,
																...(moment
																	.utc(row.checkoutDate)
																	.isBefore(moment.utc())
																	? { color: '#757D67', fontWeight: 300 }
																	: { color: 'primary.main', fontWeight: 500 }),
															}}
														>
															{row.entity.type}
														</TableCell>
														<TableCell
															align="left"
															sx={{
																...tableCellStyles,
																...(moment
																	.utc(row.checkoutDate)
																	.isBefore(moment.utc())
																	? { color: '#757D67', fontWeight: 300 }
																	: { color: 'primary.main', fontWeight: 500 }),
															}}
														>
															{moment.utc(row.checkinDate).format('MM/DD/YYYY')}
														</TableCell>
														<TableCell
															align="left"
															sx={{
																...tableCellStyles,
																...(moment
																	.utc(row.checkoutDate)
																	.isBefore(moment.utc())
																	? { color: '#757D67', fontWeight: 300 }
																	: { color: 'primary.main', fontWeight: 500 }),
															}}
														>
															{moment
																.utc(row.checkoutDate)
																.format('MM/DD/YYYY')}
														</TableCell>
														<TableCell
															align="left"
															scope="row"
															sx={{
																...tableCellStyles,
																...(moment
																	.utc(row.checkoutDate)
																	.isBefore(moment.utc())
																	? { color: '#757D67', fontWeight: 300 }
																	: { color: 'primary.main', fontWeight: 500 }),
															}}
														>
															{moment
																.utc(row.checkoutDate)
																.isBefore(moment.utc())
																? 'Expired'
																: row.enabled
																? 'Active'
																: 'Disabled'}
														</TableCell>
														<TableCell
															align="left"
															scope="row"
															sx={tableCellStyles}
														>
															<Tooltip title="Edit alert" arrow>
																<EditIcon
																	sx={{
																		cursor: 'pointer',
																		color: 'primary.main',
																	}}
																	onClick={() => handleEditModalOpen(row)}
																/>
															</Tooltip>
															<Tooltip title="Delete alert" arrow>
																<DeleteIcon
																	sx={{
																		cursor: 'pointer',
																		color: 'primary.main',
																	}}
																	onClick={() => handleDeleteModalOpen(row)}
																/>
															</Tooltip>
														</TableCell>
													</TableRow>
												</Tooltip>
											);
										})
								) : (
									<div>no alerts found</div>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					{selectedAlert ? (
						<EditAlertModal
							onEdit={onEdit}
							open={editModalOpen}
							handleClose={handleEditModalClose}
							alert={selectedAlert}
						/>
					) : null}
					{selectedAlert ? (
						<DeleteAlertModal
							onDelete={onDelete}
							open={deleteModalOpen}
							handleClose={handleDeleteModalClose}
							alert={selectedAlert}
						/>
					) : null}
				</Box>
				<Box
					display={'flex'}
					flexDirection={'column'}
					alignItems={'start'}
					mx={'2rem'}
					px={2}
					py={1}
					sx={{
						borderBottomLeftRadius: '15px',
						borderBottomRightRadius: '15px',
						'@media (min-width: 780px)': {
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
						},
					}}
					bgcolor={'primary.main'}
				>
					<Typography
						color={'white'}
						sx={{
							display: 'flex',
							alignItems: 'center',
							fontWeight: 300,
							fontSize: '18px',
							letterSpacing: '0.1rem',
						}}
					>
						<NotificationAddIcon
							sx={{ marginRight: '1rem', width: '35px', height: '35px' }}
						/>
						<span style={{ textTransform: 'uppercase', marginRight: '0.5rem' }}>
							Alert frequency:
						</span>
						<span>
							Email every:{' '}
							<span style={{ fontWeight: 700 }}>
								{user.notificationSettings.frequencyNumber}{' '}
								{user.notificationSettings.frequencyGranularity}
							</span>
						</span>
					</Typography>

					<Button
						onClick={() => setEditUserSettingsOpen(true)}
						sx={{ color: 'white' }}
					>
						<Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
							<span>change alert</span>
							<br />
							<span>frequency</span>
						</Box>

						<EditIcon sx={{ marginLeft: '1rem' }} />
					</Button>
					<EditUserSettings
						open={editUserSettingsOpen}
						handleClose={handleEditUserSettingsClose}
					/>
				</Box>
			</Box>
		</div>
	);
};

export default Alerts;
