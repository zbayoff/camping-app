import React, { useEffect, useState, useContext } from 'react';

import axios, { AxiosError } from 'axios';

import Box from '@mui/material/Box';

import { Button, DialogActions, Typography } from '@mui/material';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import EditIcon from '@mui/icons-material/Edit';

import { SnackbarContext } from '../contexts/snackbarContext';

export type Entity = {
	id: Number;
	name: String;
	type: 'campground' | 'permit';
};

export type Alert = {
	_id: string;
	userId: string;
	entity: Entity;
	checkinDate: Date;
	checkoutDate: Date;
	enabled: Boolean;
};

interface EditAlertModalProps {
	alert: Alert;
	handleClose: () => void;
	open: boolean;
}

const EditAlertModal = ({ alert, handleClose, open }: EditAlertModalProps) => {
	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);
	const [enabledValue, setEnabledValue] = useState(alert.enabled);

	useEffect(() => {
		setEnabledValue(alert.enabled);
	}, [alert.enabled]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value === 'true') {
			setEnabledValue(true);
		} else {
			setEnabledValue(false);
		}
	};

	const onSubmitHandler = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();

		const newObj = { ...alert, enabled: enabledValue };

		try {
			await axios.put(
				`/api/alert/${alert._id}`,
				{
					alert: newObj,
				},
				{
					withCredentials: true,
				}
			);

			setSeverity('success');
			setMessage('Success! Your alert has been updated.');
			setSnackOpen(true);

			handleClose();
		} catch (err) {
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
							edit alert for
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

				<Box
					sx={{
						padding: '2rem',
						display: 'flex',
						justifyContent: 'center',
						backgroundColor: '#FCF7EE',
					}}
				>
					<Box>
						<RadioGroup
							aria-label="gender"
							name="controlled-radio-buttons-group"
							value={enabledValue}
							onChange={handleChange}
						>
							<FormControlLabel
								sx={{
									color: 'secondary.main',
									'&.MuiFormControlLabel-root .Mui-checked': {
										color: 'secondary.main',
									},
								}}
								value={'true'}
								control={<Radio />}
								label={
									<Typography sx={{ fontWeight: 700, letterSpacing: '0.1rem' }}>
										Activate
									</Typography>
								}
							/>
							<FormControlLabel
								sx={{
									color: '#7B3620',
									'&.MuiFormControlLabel-root .Mui-checked': {
										color: '#7B3620',
									},
								}}
								value={'false'}
								control={<Radio />}
								label={
									<Typography sx={{ fontWeight: 700, letterSpacing: '0.1rem' }}>
										Disable
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
						onClick={onSubmitHandler}
					>
						Save
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default EditAlertModal;
