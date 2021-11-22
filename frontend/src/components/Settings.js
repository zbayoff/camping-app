import React, { useContext, useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { AuthContext } from '../contexts/authContext';
import {
	Button,
	FormControl,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';

import { SnackbarContext } from '../contexts/snackbarContext';

const Settings = () => {
	const { user, setUser } = useContext(AuthContext);

	const [isEditing, setIsEditing] = useState(false);

	const [frequencyNumberValue, setFrequencyNumberValue] = useState(
		user.notificationSettings.frequencyNumber
	);

	const [frequencyGranularityValue, setFrequencyGranularityValue] = useState(
		user.notificationSettings.frequencyGranularity
	);

	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);

	const onSubmit = async (event) => {
		event.preventDefault();

		const updatedUser = {
			...user,
			notificationSettings: {
				frequencyNumber: frequencyNumberValue,
				frequencyGranularity: frequencyGranularityValue,
			},
		};

		try {
			const response = await axios.put(
				'http://localhost:5000/api/user',
				{
					user: updatedUser,
				},
				{
					withCredentials: true,
				}
			);

			console.log('response: ', response);
			setSeverity('success');
			setMessage('Success! Your settings have been created.');
			setSnackOpen(true);
			setIsEditing(false);
			setUser(updatedUser);
			// need to update localstorage here? why doesn't setUser handle this...
			localStorage.setItem('user', JSON.stringify(updatedUser));

			// need to update "user" Context
		} catch (err) {
			console.log('err updating alert: ', err.response);

			// show custom snackbar error
			setSeverity('error');
			setMessage(
				'Error updating user settings: ' +
					' ' +
					err.response.status +
					' ' +
					err.response.statusText
			);
		}
	};

	console.log('user: ', user);

	return (
		<div>
			<h1>Settings</h1>
			<Grid container spacing={2}>
				<Grid item xs={8}>
					<form onSubmit={onSubmit}>
						<Box mb={2}>
							<Box mb={1}>
								<Typography sx={{ fontWeight: 'bold' }}>
									Frequency of Notifications
								</Typography>
							</Box>
							{isEditing ? (
								<Box>
									<FormControl size="small" sx={{ mr: 2 }}>
										<Select
											labelId="Frequency Number"
											id="frequency-number"
											value={frequencyNumberValue}
											label="Frequency Number"
											onChange={(event) => {
												setFrequencyNumberValue(event.target.value);
											}}
										>
											<MenuItem value={10}>10</MenuItem>
											<MenuItem value={20}>20</MenuItem>
											<MenuItem value={30}>30</MenuItem>
										</Select>
									</FormControl>
									<FormControl size="small">
										<Select
											labelId="Frequency Granularity"
											id="frequency-granularity"
											value={frequencyGranularityValue}
											label="Frequency Granularity"
											onChange={(event) => {
												setFrequencyGranularityValue(event.target.value);
											}}
										>
											<MenuItem value={'seconds'}>seconds</MenuItem>
											<MenuItem value={'minutes'}>minutes</MenuItem>
											<MenuItem value={'hours'}>hours</MenuItem>
											<MenuItem value={'days'}>days</MenuItem>
										</Select>
									</FormControl>
								</Box>
							) : (
								<Box mb={1}>
									{user.notificationSettings.frequencyNumber}{' '}
									{user.notificationSettings.frequencyGranularity}
								</Box>
							)}
						</Box>

						{isEditing ? (
							<>
								<Button type="submit" variant="contained" sx={{ mr: 2 }}>
									Save
								</Button>
								<Button
									onClick={() => {
										setIsEditing(false);
									}}
								>
									Cancel
								</Button>
							</>
						) : null}
					</form>
				</Grid>
				<Grid item xs={4} align="end">
					{isEditing ? null : (
						<Button
							variant="contained"
							onClick={() => {
								setIsEditing(true);
							}}
						>
							Edit
						</Button>
					)}
				</Grid>
			</Grid>
		</div>
	);
};

export default Settings;
