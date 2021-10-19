import React, { useState, useMemo, useEffect, useRef } from 'react';
import _ from 'lodash';

import axios from 'axios';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import {
	Avatar,
	Button,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import { SvgIcon } from '@mui/material';
import { grey } from '@mui/material/colors';
import moment from 'moment';

// import { useTheme } from '@mui/styles';

const Home = () => {
	const [campgroundValue, setCampgroundValue] = useState({
		displayName: '',
		entityId: '',
	});
	const [campgroundSuggestions, setCampgroundSuggestions] = useState([]);
	const [availableCampsites, setAvalableCampsites] = useState([]);
	const [openSuggestions, setOpenSuggestions] = useState(false);
	const [openAvailabilities, setOpenAvailabilities] = useState(false);

	const [error, setError] = useState(null);

	const inputEl = useRef(null);


	const fetchCampgrounds = async (event) => {
		console.log('fetching from rec api');
		if (event.target.value) {
			try {
				const { data } = await axios.get(
					`https://www.recreation.gov/api/search/suggest?q=${event.target.value}&geocoder=true&inventory_type=campground`
				);
				if (data.inventory_suggestions && data.inventory_suggestions.length) {
					setCampgroundSuggestions(data.inventory_suggestions);
				}
			} catch (err) {
				console.log('error fetching campgrounds: ', err);
				console.log('err.data', err.data);
			}
		}
	};

	const onCampgroundChangeHandler = (event) => {
		setCampgroundValue({ displayName: event.target.value, entityId: '' });
		setOpenSuggestions(true);
		setOpenAvailabilities(false);
		delayedQuery(event);
	};

	const delayedQuery = useMemo(() => _.throttle(fetchCampgrounds, 1000), []);

	const onSubmitHandler = async (event) => {
		event.preventDefault();
		console.log('campgroundValue: ', campgroundValue);
		console.log('checkInOutDates: ', checkInOutDates);
		// fetch availabilites

		try {
			const { data } = await axios.post(
				'http://localhost:5000/api/availableCampsites',
				{
					campgroundId: campgroundValue.entityId,
					checkinDate: checkInOutDates[0],
					checkoutDate: checkInOutDates[1],
				}
			);
			console.log('available campsites: ', data);
			setOpenAvailabilities(true);
			if (data.length) {
				setAvalableCampsites(data);
			} else {
				setAvalableCampsites([]);
			}
		} catch (err) {
			console.log('err fetching available campsites: ', err);
			setError(err);
			// TODO display Error message
		}
	};

	const [checkInOutDates, setCheckInOutDates] = React.useState([null, null]);

	const onBlurField = () => {
		setOpenSuggestions(false);
	};

	const onFocusFieldFirstName = () => {
		setOpenSuggestions(true);
	};

	return (
		<div className="Home">
			<div style={{ padding: '0 15px', width: '100%', height: '100%' }}>
				<Box className="form-wrapper" style={{ position: 'relative' }}>
					<Box
						component="form"
						className="search-form-container"
						sx={{
							'& > :not(style)': { m: 1 },
						}}
						autoComplete="off"
						onSubmit={onSubmitHandler}
					>
						<TextField
							id="standard-basic"
							required
							variant="standard"
							placeholder="Campground Name"
							label="Campground"
							size="small"
							value={campgroundValue.displayName}
							onChange={onCampgroundChangeHandler}
							InputProps={{ disableUnderline: true }}
							inputProps={{ style: { textTransform: 'capitalize' } }}
							InputLabelProps={{
								shrink: true,
							}}
							ref={inputEl}
							style={{ margin: '10px 0 0 0', minWidth: '200px' }}
							onBlur={() => onBlurField()}
							onFocus={() => onFocusFieldFirstName()}
						/>
						<div
							style={{
								alignSelf: 'center',
								borderRight: '1px solid #DDDDDD',
								flex: '0 0 0px !important',
								height: '32px',
							}}
						></div>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateRangePicker
								calendars={1}
								value={checkInOutDates}
								onChange={(newValue) => {
									setCheckInOutDates(newValue);
								}}
								renderInput={(startProps, endProps) => (
									<React.Fragment>
										<TextField
											{...startProps}
											id="standard-basic"
											label="Checkin"
											variant="standard"
											size="small"
											InputProps={{ disableUnderline: true }}
											InputLabelProps={{
												shrink: true,
											}}
											style={{ margin: '10px 0 0 0' }}
											required
										/>
										<div
											style={{
												alignSelf: 'center',
												borderRight: '1px solid #DDDDDD',
												flex: '0 0 0px !important',
												height: '32px',
												marginRight: '15px',
											}}
										></div>
										<TextField
											{...endProps}
											id="standard-basic"
											label="Checkout"
											variant="standard"
											size="small"
											InputProps={{ disableUnderline: true }}
											InputLabelProps={{
												shrink: true,
											}}
											style={{ margin: '10px 0 0 0' }}
											required
										/>
									</React.Fragment>
								)}
							/>
						</LocalizationProvider>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							startIcon={<SearchIcon />}
						>
							Search
						</Button>
					</Box>
					{campgroundSuggestions.length && openSuggestions ? (
						<Box className="suggestions-wrapper">
							<List
							// sx={{
							// 	width: '100%',
							// 	maxWidth: 360,
							// 	bgcolor: 'background.paper',
							// }}
							>
								{campgroundSuggestions.map((suggestion) => {
									return (
										<ListItem
											key={suggestion.entity_id}
											style={{ cursor: 'pointer' }}
											onMouseDown={(e) => e.preventDefault()} // to allow onClick to fire before onBlur
											onClick={() => {
												// setCampgroundSuggestions([]);
												// need to trigger onCampgroundChangeHandler
												// setOpenSuggestions(true);

												setCampgroundValue({
													displayName: suggestion.name.toLowerCase(),
													entityId: suggestion.entity_id,
												});
												setOpenSuggestions(false);
												setOpenAvailabilities(false);
												// setCampgroundName(suggestion.entity_id);
											}}
											sx={{
												// some styles
												':hover': {
													bgcolor: grey['200'],
												},
											}}
										>
											{/* <a
												target="_blank"
												rel="noreferrer"
												href={`https://www.recreation.gov/camping/campgrounds/${suggestion.entity_id}`}
											> */}
											<ListItemAvatar>
												<Avatar sx={{ bgcolor: 'primary.main' }}>
													<SvgIcon
														color="white"
														viewBox={'0 0 24 24'}
														style={{ width: '60px' }}
													>
														<path d="M6.17 6.045L1 18h3.795l1.547-7.756L7.876 18h3.91L6.718 6.041M17.726 6l-9.348.036L13.453 18H23"></path>
													</SvgIcon>
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={
													<Typography style={{ textTransform: 'capitalize' }}>
														{suggestion.name.toLowerCase()}
													</Typography>
												}
												secondary={
													<Typography variant="caption">
														{suggestion.parent_name}{' '}
														{suggestion.city
															? ` | Near ${suggestion.city}`
															: null}
													</Typography>
												}

												// {`${suggestion.parent_name} ${
												// 	suggestion.city ? `| Near ${suggestion.city} ` : null
												// }`}
											/>

											{/* </a> */}
										</ListItem>
									);
								})}
							</List>
						</Box>
					) : null}

					{error ? (
						<div>{error.data}</div>
					) : availableCampsites.length && openAvailabilities ? (
						<Box className="search-results" p={2}>
							<List
							// sx={{
							// 	width: '100%',
							// 	maxWidth: 360,
							// 	bgcolor: 'background.paper',
							// }}
							>
								<p>Availabilities: </p>
								{availableCampsites
									.sort(
										(a, b) =>
											moment(a.date).valueOf() - moment(b.date).valueOf()
									)
									.map((campsite) => {
										return (
											<a
												href={`https://www.recreation.gov/camping/campgrounds/${campgroundValue.entityId}`}
												style={{ display: 'block' }}
												target="_blank"
												rel="noreferrer"
											>
												{campsite.sites.length}{' '}
												{campsite.sites.length > 1
													? 'availabilities'
													: 'available'}{' '}
												for: {moment(campsite.date).format('MM-DD-YYYY')}
											</a>
										);
									})}
							</List>
						</Box>
					) : !availableCampsites.length && openAvailabilities ? (
						<Box className="search-results" p={2} style={{display: 'flex', alignItems: 'center'}}>
							<Typography>
								No available campsites for the selected dates.
							</Typography>
							<Button
								variant="contained"
								startIcon={<AddAlertIcon />}
								style={{marginLeft: 'auto'}}
								// onClick={handleClick}
							>
								Create an alert
							</Button>
						</Box>
					) : null}
				</Box>
			</div>
		</div>
	);
};

export default Home;
