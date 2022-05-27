import React, { useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';

import Box from '@mui/material/Box';

import { Button, Dialog, DialogActions, TextField } from '@mui/material';

import FormControlLabel from '@mui/material/FormControlLabel';

import EditIcon from '@mui/icons-material/Edit';

import { AuthContext } from '../contexts/authContext';
import { Typography } from '@mui/material';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { SnackbarContext } from '../contexts/snackbarContext';

interface EditUserSettingsProps {
	handleClose: () => void;
	open: boolean;
}

const EditUserSettings = ({ open, handleClose }: EditUserSettingsProps) => {
	const { user, setUser } = useContext(AuthContext);

	const [frequencyNumberValue, setFrequencyNumberValue] = useState(
		user.notificationSettings.frequencyNumber
	);

	const [frequencyGranularityValue, setFrequencyGranularityValue] = useState(
		user.notificationSettings.frequencyGranularity
	);

	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);

	const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		const updatedUser = {
			...user,
			notificationSettings: {
				frequencyNumber: parseInt(frequencyNumberValue),
				frequencyGranularity: frequencyGranularityValue,
			},
		};

		try {
			await axios.put(
				'/api/user',
				{
					user: updatedUser,
				},
				{
					withCredentials: true,
				}
			);

			setSeverity('success');
			setMessage('Success! Your settings have been updated.');
			setSnackOpen(true);
			setUser(updatedUser);
			// need to update localstorage here? why doesn't setUser handle this...
			localStorage.setItem('user', JSON.stringify(updatedUser));

			handleClose();

			// need to update "user" Context
		} catch (err) {
			console.error('err updating settings: ', err);
			if (axios.isAxiosError(err)) {
				const axiosError = err as AxiosError;

				console.error('Axios error: ', axiosError.response);

				setMessage(
					'Error updating user settings: ' + axiosError.response?.data?.message
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
						<EditIcon sx={{ color: 'primary.main' }} />
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
							edit alert frequency
						</Typography>
						<Typography
							color={'primary.main'}
							sx={{
								fontWeight: 700,
								fontSize: '18px',
								letterSpacing: '.1rem',
							}}
						>
							notification every:
						</Typography>
					</Box>
				</Box>

				<Box
					sx={{
						padding: '2rem',
						display: 'flex',
						justifyContent: 'center',
						backgroundColor: '#FCF7EE',
					}}
				>
					<TextField
						id="standard-basic"
						type={'number'}
						variant="standard"
						placeholder="Enter #"
						label="Enter #"
						value={frequencyNumberValue}
						onChange={(event) => {
							setFrequencyNumberValue(event.target.value);
						}}
						InputProps={{ disableUnderline: true }}
						sx={{ width: '100px', marginRight: '2rem', fontSize: '18px' }}
						inputProps={{
							min: 0,

							style: {
								backgroundColor: 'rgba(65, 93, 110, 0.2)',
								marginTop: '0.5rem',
								fontWeight: 300,
								letterSpacing: '0.1rem',
								fontSize: '18px',
								borderRadius: '15px',
								height: '40px',
								paddingLeft: '1rem',
								paddingRight: '1rem',
							},
						}}
						InputLabelProps={{
							shrink: true,
							style: {
								fontWeight: 300,
								letterSpacing: '0.1rem',
								fontSize: '18px',
							},
						}}
					/>
					<Box>
						<RadioGroup
							aria-label="gender"
							name="controlled-radio-buttons-group"
							value={frequencyGranularityValue}
							onChange={(event) => {
								setFrequencyGranularityValue(event.target.value);
							}}
						>
							<FormControlLabel
								value={'minutes'}
								control={
									<Radio
										sx={{
											'&.Mui-checked + .MuiTypography-root': {
												color: 'primary.main',
												fontWeight: 700,
											},
										}}
									/>
								}
								label={
									<Typography
										sx={{
											fontWeight: 400,
											letterSpacing: '0.1rem',
											fontSize: '18px',
										}}
									>
										Minutes
									</Typography>
								}
							/>
							<FormControlLabel
								value={'hours'}
								control={
									<Radio
										sx={{
											'&.Mui-checked + .MuiTypography-root': {
												color: 'primary.main',
												fontWeight: 700,
											},
										}}
									/>
								}
								label={
									<Typography
										sx={{
											fontWeight: 400,
											letterSpacing: '0.1rem',
											fontSize: '18px',
										}}
									>
										Hours
									</Typography>
								}
							/>
							<FormControlLabel
								sx={{
									fontWeight: 400,
									letterSpacing: '1rem',
									fontSize: '18px',
								}}
								value={'days'}
								control={
									<Radio
										sx={{
											'&.Mui-checked + .MuiTypography-root': {
												color: 'primary.main',
												fontWeight: 700,
											},
										}}
									/>
								}
								label={
									<Typography
										sx={{
											fontWeight: 400,
											letterSpacing: '0.1rem',
											fontSize: '18px',
										}}
									>
										Days
									</Typography>
								}
							/>
						</RadioGroup>
					</Box>
				</Box>

				<DialogActions sx={{ padding: '2rem', backgroundColor: '#FCF7EE' }}>
					<Button sx={{ fontWeight: '700' }} onClick={handleClose}>
						Cancel
					</Button>
					<Button
						sx={{ fontWeight: '700' }}
						variant="contained"
						onClick={onSubmit}
					>
						Save
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default EditUserSettings;
