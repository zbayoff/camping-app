import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditAlertModal from './EditAlertModal';
import DeleteAlertModal from './DeleteAlertModal';

const Alerts = () => {
	const [rows, setRows] = useState([]);

	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedAlert, setSelectedAlert] = useState(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const handleEditModalClose = () => setEditModalOpen(false);
	const handleDeleteModalClose = () => setDeleteModalOpen(false);

	// need to re-render component when handleDeleteModalClose is fired
	useEffect(() => {
		const fetchUserAlerts = async () => {
			console.log('fetching userAlerts...');
			try {
				const response = await axios.get(
					'/api/user/alerts',
					{
						withCredentials: true,
					}
				);
				console.log('response: ', response)
				if (response.data) {
					const rows = response.data.map((row) => {
						return {
							id: row._id,
							campground: { id: row.campground.id, name: row.campground.name },
							checkinDate: row.checkinDate,
							checkoutDate: row.checkoutDate,
							enabled: row.enabled,
						};
					});

					setRows(rows);
				} else {
					setRows([]);
				}
			} catch (error) {
				console.log('error  fetching alerts response', error.response);
			}
		};

		fetchUserAlerts();
	}, [deleteModalOpen, editModalOpen]);

	const handleEditModalOpen = (alert) => {
		// trigger edit alert modal
		setEditModalOpen(true);
		setSelectedAlert(alert);
	};

	const handleDeleteModalOpen = (alert) => {
		setDeleteModalOpen(true);
		setSelectedAlert(alert);
	};

	return (
		<div>
			<h1>Alerts</h1>
			<div style={{ height: 400, width: '100%' }}>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="left">Campground</TableCell>
								<TableCell align="right">Checkin</TableCell>
								<TableCell align="right">Checkout</TableCell>
								<TableCell align="right">Enabled</TableCell>
								<TableCell align="right"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => {
								return (
									<TableRow key={row.id}>
										<TableCell style={{ textTransform: 'capitalize' }}>
											{row.campground.name}
										</TableCell>
										<TableCell align="right">{row.checkinDate}</TableCell>
										<TableCell align="right">{row.checkoutDate}</TableCell>
										<TableCell align="right" scope="row">
											{row.enabled ? 'Yes' : 'No'}
										</TableCell>
										<TableCell align="right" scope="row">
											<EditIcon
												style={{ cursor: 'pointer' }}
												onClick={() => handleEditModalOpen(row)}
											/>
											<DeleteIcon
												style={{ cursor: 'pointer' }}
												onClick={() => handleDeleteModalOpen(row)}
											/>
										</TableCell>
									</TableRow>
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
						setSelectedAlert
					/>
				) : null}
			</div>
		</div>
	);
};

export default Alerts;
