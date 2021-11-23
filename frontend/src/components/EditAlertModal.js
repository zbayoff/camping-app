import React, { useEffect, useState, useContext } from 'react';

import axios from 'axios';

import Box from '@mui/material/Box';

import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Dialog from '@mui/material/Dialog';

import { SnackbarContext } from '../contexts/snackbarContext';

const EditAlertModal = ({ alert, handleOpen, handleClose, open }) => {
	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);
	const [enabledValue, setEnabledValue] = useState(alert.enabled);

	useEffect(() => {
		setEnabledValue(alert.enabled);
	}, [alert.enabled]);

	const handleChange = (event) => {
		if (event.target.value === 'true') {
			setEnabledValue(true);
		} else {
			setEnabledValue(false);
		}
	};

	const onSubmitHandler = async (event) => {
		event.preventDefault();

		const newObj = { ...alert, enabled: enabledValue };

		try {
			const response = await axios.put(
				`/api/alert/${alert.id}`,
				{
					alert: newObj,
				},
				{
					withCredentials: true,
				}
			);

			console.log('response: ', response);
			setSeverity('success');
			setMessage('Success! Your alert has been updated.');
			setSnackOpen(true);

			handleClose();
		} catch (err) {
			console.log('err updating alert: ', err.response);

			// show custom snackbar error
			setSeverity('error');
			setMessage(
				'Error updating alert: ' +
					' ' +
					err.response.status +
					' ' +
					err.response.statusText
			);
			setSnackOpen(true);
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
				<DialogTitle>
					Edit Alert for {alert ? alert.campground.name : null}
				</DialogTitle>

				<DialogContent>
					<FormControl component="fieldset">
						<FormLabel component="legend">Enabled?</FormLabel>
						<RadioGroup
							aria-label="gender"
							name="controlled-radio-buttons-group"
							value={enabledValue}
							onChange={handleChange}
						>
							<FormControlLabel
								value={'true'}
								control={<Radio />}
								label="True"
							/>
							<FormControlLabel
								value={'false'}
								control={<Radio />}
								label="False"
							/>
						</RadioGroup>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button variant="contained" onClick={onSubmitHandler}>
						Save
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default EditAlertModal;
