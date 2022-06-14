import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import { Button, DialogActions, Typography } from '@mui/material';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import EditIcon from '@mui/icons-material/Edit';

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
	enabled: boolean;
};

interface EditAlertModalProps {
	alert: Alert;
	handleClose: () => void;
	open: boolean;
	onEdit: (alert: Alert, enabledValue: boolean) => void;
}

const EditAlertModal = ({
	alert,
	handleClose,
	open,
	onEdit,
}: EditAlertModalProps) => {
	const [enabledValue, setEnabledValue] = useState(alert.enabled);

	useEffect(() => {
		setEnabledValue(alert.enabled);
	}, [open, alert.enabled]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value === 'true') {
			setEnabledValue(true);
		} else {
			setEnabledValue(false);
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
						onClick={() => onEdit(alert, enabledValue)}
					>
						Save
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default EditAlertModal;
