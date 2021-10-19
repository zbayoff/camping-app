import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';
// import { DataGrid } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditAlertModal from './EditAlertModal';
import DeleteAlertModal from './DeleteAlertModal';

const columns = [
	// { field: '_id', headerName: 'ID', width: 90 },
	{
		field: 'campground',
		headerName: 'Campground',
		width: 200,
		type: 'string',
		// editable: false,
	},
	{
		field: 'checkinDate',
		headerName: 'Checkin',
		width: 200,
		type: 'date',
		// editable: false,
	},
	{
		field: 'checkoutDate',
		headerName: 'Checkout',
		width: 200,
		type: 'date',
		// editable: false,
	},
	{
		field: 'enabled',
		headerName: 'Enabled',
		width: 150,
		type: 'boolean',
		editable: true,
	},
];

const Alerts = () => {
	const [rows, setRows] = useState([]);

	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedAlert, setSelectedAlert] = useState(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const handleEditModalClose = () => setEditModalOpen(false);
	const handleDeleteModalClose = () => setDeleteModalOpen(false);

	// const { user } = useContext(AuthContext);

	useEffect(() => {
		const fetchUserAlerts = async () => {
			try {
				const { data } = await axios.get(
					'http://localhost:5000/api/authuser/alerts',
					{
						withCredentials: true,
					}
				);
				if (data) {
					const rows = data.map((row) => {
						return {
							id: row._id,
							campground: row.campground,
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
				// console.log('error.response.data: ', error.response.status)
				// if (error.response.status === 401) {
				// 	<Redirect
				// 		to={{
				// 			pathname: '/login',
				// 		}}
				// 	/>;
				// }
				// console.log('fetchUserAlerts error: ', error);
			}
		};

		fetchUserAlerts();
	}, []);

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
			{/* <ul> */}
			<div style={{ height: 400, width: '100%' }}>
				{/* <DataGrid
						rows={rows}
						columns={columns}
						pageSize={5}
						rowsPerPageOptions={[5]}
						// checkboxSelection
						disableSelectionOnClick
					/> */}
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
								// console.log('row: ', row);

								return (
									<TableRow key={row.id}>
										<TableCell>{row.campground}</TableCell>
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
				<EditAlertModal
					open={editModalOpen}
					handleClose={handleEditModalClose}
					alert={selectedAlert}
				/>
				<DeleteAlertModal
					open={deleteModalOpen}
					handleClose={handleDeleteModalClose}
					alert={selectedAlert}
				/>
			</div>
			{/* </ul> */}
		</div>
	);
};

export default Alerts;
