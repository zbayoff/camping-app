import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditAlertModal, { Alert } from './EditAlertModal';
import DeleteAlertModal from './DeleteAlertModal';
import { grey } from '@mui/material/colors';

import moment from 'moment';
import { Tooltip } from '@mui/material';

import Settings from './Settings';

const Alerts = () => {
	const [rows, setRows] = useState([]);

	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const handleEditModalClose = () => setEditModalOpen(false);
	const handleDeleteModalClose = () => setDeleteModalOpen(false);

	// need to re-render component when handleDeleteModalClose is fired
	useEffect(() => {
		const fetchUserAlerts = async () => {
			// TODO: check for alerts with Checkout Date past current Date. If so, 'archive' them somehow.
			try {
				const response = await axios.get('/api/user/alerts', {
					withCredentials: true,
				});
				if (response.data) {
					setRows(response.data);
				} else {
					setRows([]);
				}
			} catch (err) {
				console.log('error  fetching alerts response', err);
				if (axios.isAxiosError(err)) {
					const axiosError = err as AxiosError;

					console.log('Axios error: ', axiosError.response);
				}
			}
		};

		fetchUserAlerts();
	}, [deleteModalOpen, editModalOpen]);

	const handleEditModalOpen = (alert: Alert) => {
		// trigger edit alert modal
		setEditModalOpen(true);
		setSelectedAlert(alert);
	};

	const handleDeleteModalOpen = (alert: Alert) => {
		setDeleteModalOpen(true);
		setSelectedAlert(alert);
	};

	return (
		<div>
			<h1>Campsite Alerts</h1>
			<h4>
				You may only create 8 alerts, max. Delete old alerts to make room.
			</h4>

			<Settings />

			<div style={{ height: 400, width: '100%' }}>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="left">Entity</TableCell>
								<TableCell align="right">Type</TableCell>
								<TableCell align="right">Checkin</TableCell>
								<TableCell align="right">Checkout</TableCell>
								<TableCell align="right">Enabled</TableCell>
								<TableCell align="right"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows
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
													bgcolor: moment
														.utc(row.checkoutDate)
														.isBefore(moment.utc())
														? grey[300]
														: '',
												}}
											>
												<TableCell style={{ textTransform: 'capitalize' }}>
													{row.entity.name}
												</TableCell>
												<TableCell
													align="right"
													style={{ textTransform: 'capitalize' }}
												>
													{row.entity.type}
												</TableCell>
												<TableCell align="right">
													{moment
														.utc(row.checkinDate)
														.format('ddd, MMM D, YYYY')}
												</TableCell>
												<TableCell align="right">
													{moment
														.utc(row.checkoutDate)
														.format('ddd, MMM D, YYYY')}
												</TableCell>
												<TableCell align="right" scope="row">
													{row.enabled ? 'Yes' : 'No'}
												</TableCell>
												<TableCell align="right" scope="row">
													<Tooltip title="Edit alert" arrow>
														<EditIcon
															style={{ cursor: 'pointer' }}
															onClick={() => handleEditModalOpen(row)}
														/>
													</Tooltip>
													<Tooltip title="Delete alert" arrow>
														<DeleteIcon
															style={{ cursor: 'pointer' }}
															onClick={() => handleDeleteModalOpen(row)}
														/>
													</Tooltip>
												</TableCell>
											</TableRow>
										</Tooltip>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				{selectedAlert ? (
					<EditAlertModal
						open={editModalOpen}
						handleClose={handleEditModalClose}
						alert={selectedAlert}
					/>
				) : null}
				{selectedAlert ? (
					<DeleteAlertModal
						open={deleteModalOpen}
						handleClose={handleDeleteModalClose}
						alert={selectedAlert}
					/>
				) : null}
			</div>
		</div>
	);
};

export default Alerts;