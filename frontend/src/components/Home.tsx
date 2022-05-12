import React, { useState, useMemo, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/authContext';

import _ from 'lodash';

import axios, { AxiosError } from 'axios';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterMoment';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';

import {
	Avatar,
	Button,
	Grid,
	IconButton,
	Link,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import { SvgIcon } from '@mui/material';
import { grey } from '@mui/material/colors';
import moment from 'moment';
import Login from './Login';
import CreateAlertModal from './CreateAlertModal';

import { SnackbarContext } from '../contexts/snackbarContext';

export type Site = {
	loop: string;
	site: string;
	siteId: string;
};

export type CampgroundAvailability = {
	date: Date;
	sites: Site[];
};

export type PermitAvailability = {
	total: Number;
	remaining: Number;
	show_walkup: Boolean;
	is_secret_quota: Boolean;
	date: Date;
};

export type Suggestion = {
	entity_id: string;
	entity_type: string;
	name: string;
	parent_name: string;
	text: string;
	preview_image_url: string;
	city: string;
};

const Home = () => {
	const [campgroundValue, setCampgroundValue] = useState({
		displayName: '',
		entityId: '',
		entityType: '',
	});
	const [campgroundSuggestions, setCampgroundSuggestions] = useState<
		Suggestion[]
	>([]);
	const [availableEntities, setAvailableEntities] = useState<
		CampgroundAvailability[] | PermitAvailability[] | []
	>([]);
	const [openSuggestions, setOpenSuggestions] = useState(false);
	const [openAvailabilities, setOpenAvailabilities] = useState(false);
	const [addAlertModalOpen, setAddAlertModalOpen] = useState(false);
	const [entityType, setEntityType] = useState('');
	const [checkInOutDates, setCheckInOutDates] = React.useState<
		DateRange<moment.Moment>
	>([null, null]);

	const { user } = useContext(AuthContext);

	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);

	const inputEl = useRef(null);

	// TODO: Add support for Permits from Rec API
	const fetchCampgrounds = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.value) {
			try {
				const { data } = await axios.get(
					`https://www.recreation.gov/api/search/suggest?q=${event.target.value}&geocoder=true&inventory_type=campground&inventory_type=permit`
				);
				if (data.inventory_suggestions && data.inventory_suggestions.length) {
					setCampgroundSuggestions(data.inventory_suggestions);
				}
			} catch (err) {
				console.error('error fetching campgrounds: ', err);

				if (axios.isAxiosError(err)) {
					const axiosError = err as AxiosError;

					console.error('Axios error: ', axiosError.response);

					setMessage(
						'Error fetching campgrounds: ' +
							' ' +
							axiosError.response?.status +
							' ' +
							axiosError.response?.statusText
					);
				}

				setSeverity('error');
				setSnackOpen(true);
			}
		}
	};

	const onCampgroundChangeHandler = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setCampgroundValue({
			displayName: event.target.value,
			entityId: '',
			entityType: '',
		});
		setOpenSuggestions(true);
		setOpenAvailabilities(false);
		delayedQuery(event);
	};

	const delayedQuery = useMemo(() => _.debounce(fetchCampgrounds, 500), []);

	const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// clear suggestions
		setCampgroundSuggestions([]);

		// fetch availabilites
		try {
			const apiUrl =
				campgroundValue.entityType === 'permit'
					? '/api/availablePermits'
					: '/api/availableCampsites';

			const { data } = await axios.post(apiUrl, {
				id: campgroundValue.entityId,
				checkinDate: checkInOutDates[0],
				checkoutDate: checkInOutDates[1],
				entityType: campgroundValue.entityType,
			});
			setOpenAvailabilities(true);

			setEntityType(campgroundValue.entityType);

			if (data.length) {
				setAvailableEntities(data);
			} else {
				setAvailableEntities([]);
			}
		} catch (err) {
			console.error('Error fetching available campsites: ', err);
			if (axios.isAxiosError(err)) {
				const axiosError = err as AxiosError;

				console.error('Axios error: ', axiosError.response);

				setMessage(
					'Error fetching campgrounds: ' +
						axiosError.response?.data.message +
						' '
				);
			}
			setSeverity('error');

			setSnackOpen(true);
		}
	};

	const onBlurField = () => {
		// setOpenSuggestions(false);
	};

	const onFocusFieldFirstName = () => {
		setOpenSuggestions(true);
	};

	const availabilitiesForEveryDate = () => {
		let allDatesBetweenCheckinOutDates = [];

		if (checkInOutDates[0] && checkInOutDates[1]) {
			let now = checkInOutDates[0].clone();

			while (now.isBefore(checkInOutDates[1])) {
				allDatesBetweenCheckinOutDates.push(now.format('MM/DD/YYYY'));
				now.add(1, 'days');
			}

			const availabilityDates = availableEntities.map((entity) => {
				return moment.utc(entity.date).format('MM/DD/YYYY');
			});

			const containsAll = (arr1: string[], arr2: string[]) =>
				arr2.every((arr2Item) => arr1.includes(arr2Item));

			const sameMembers = (arr1: string[], arr2: string[]) =>
				containsAll(arr1, arr2) && containsAll(arr2, arr1);

			return sameMembers(availabilityDates, allDatesBetweenCheckinOutDates)
				? true
				: false;
		}
	};

	// const isEntityPermit = (
	// 	entity: CampgroundAvailability | PermitAvailability
	// ) => {
	// 	// check if the specified property is in the given object
	// 	return 'remaining' in entity;
	// };

	const isEntityPermit = (
		entity: CampgroundAvailability | PermitAvailability
	): entity is PermitAvailability => {
		return (entity as PermitAvailability).remaining !== undefined;
	};

	const isEntityCampground = (
		entity: CampgroundAvailability | PermitAvailability
	): entity is CampgroundAvailability => {
		return (entity as CampgroundAvailability).sites !== undefined;
	};

	return (
		<div className="Home">
			<div style={{ padding: '0 15px', width: '100%', height: '100%' }}>
				<Box className="header-wrapper">
					<Typography
						align="center"
						color="primary"
						component="h1"
						variant="h1"
					>
						Find Your Next Campsite
					</Typography>
					<Typography
						align="center"
						color="primary"
						component="h3"
						variant="body2"
						sx={{ textTransform: 'uppercase' }}
					>
						Applicable for national parks, lakeshores &amp; forests
					</Typography>
				</Box>
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
							className="campground-text-input"
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
							onBlur={() => onBlurField()}
							onFocus={() => onFocusFieldFirstName()}
						/>
						<div
							className="divider"
							style={{
								alignSelf: 'center',
								borderRight: '1px solid #DDDDDD',
								flex: '0 0 0px !important',
								height: '32px',
							}}
						></div>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateRangePicker
								className="date-range-container"
								disablePast
								calendars={1}
								value={checkInOutDates}
								onChange={(newValue) => {
									setCheckInOutDates(newValue);
									setOpenAvailabilities(false);
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
							className="search-button"
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
							<List>
								{campgroundSuggestions.map((suggestion) => {
									return (
										<ListItem
											secondaryAction={
												<IconButton edge="end" aria-label="open in new window">
													<Link
														target="_blank"
														rel="noreferrer"
														href={`https://www.recreation.gov/camping/campgrounds/${suggestion.entity_id}`}
													>
														<OpenInNewIcon />
													</Link>
												</IconButton>
											}
											key={suggestion.entity_id}
											style={{ cursor: 'pointer', height: '90px' }}
											onMouseDown={(e) => e.preventDefault()} // to allow onClick to fire before onBlur
											onClick={() => {
												// setCampgroundSuggestions([]);
												// need to trigger onCampgroundChangeHandler
												// setOpenSuggestions(true);

												setCampgroundValue({
													displayName: suggestion.name.toLowerCase(),
													entityId: suggestion.entity_id,
													entityType: suggestion.entity_type,
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
											<ListItemAvatar>
												<Avatar sx={{ bgcolor: 'primary.main' }}>
													<SvgIcon
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
											/>
											{suggestion.preview_image_url ? (
												<Box
													sx={{
														alignItems: 'center',
														display: { xs: 'none', sm: 'flex' },
													}}
												>
													<img
														alt="campground preview"
														style={{
															borderRadius: '10px',
															height: '70px',
															objectFit: 'cover',
														}}
														width="100"
														src={suggestion.preview_image_url}
													/>
												</Box>
											) : null}
										</ListItem>
									);
								})}
							</List>
						</Box>
					) : null}

					{availableEntities.length && openAvailabilities ? (
						<Box className="search-results" p={2}>
							<List>
								<Grid container>
									<Grid item xs={6}>
										<h3 style={{ margin: 0 }}>
											{entityType === 'campground' ? 'Campsites' : 'Permits'}{' '}
											Available!{' '}
										</h3>
										<p style={{ margin: 0 }}>
											Reserve on{' '}
											<Link
												target="_blank"
												rel="noreferrer"
												href={
													entityType === 'campground'
														? `https://www.recreation.gov/camping/campgrounds/${campgroundValue.entityId}`
														: `https://www.recreation.gov/permits/${
																campgroundValue.entityId
														  }/registration/detailed-availability?date=${moment(
																checkInOutDates[0]
														  ).format('YYYY-MM-DD')}`
												}
											>
												Recreation.Gov
											</Link>
										</p>
										<List>
											{availableEntities
												.sort(
													(a, b) =>
														moment(a.date).valueOf() - moment(b.date).valueOf()
												)
												.map((entity, index) => {
													return (
														<ListItem disablePadding key={index}>
															<ListItemText>
																{isEntityPermit(entity) && entity.remaining ? (
																	<>
																		{entity.remaining}{' '}
																		{entity.remaining > 1
																			? 'permits available'
																			: 'permit available'}{' '}
																		for:{' '}
																		{moment(entity.date).format('MM-DD-YYYY')}
																	</>
																) : null}
																{isEntityCampground(entity) && entity.sites ? (
																	<>
																		{entity.sites.length}{' '}
																		{entity.sites.length > 1
																			? 'sites available'
																			: 'site available'}{' '}
																		for:{' '}
																		{moment(entity.date).format('MM-DD-YYYY')}
																	</>
																) : null}
															</ListItemText>
														</ListItem>
													);
												})}
										</List>
									</Grid>
									{/* if there arent availabilities for every date, create an alert */}
									{!availabilitiesForEveryDate() ? (
										<Grid item xs={6}>
											<Box mb="1rem">
												There aren't availabilites for all of the dates you
												selected. Create an alert to be notified when they
												become available.
											</Box>
											<Button
												className="create-alert-button"
												variant="contained"
												startIcon={<AddAlertIcon />}
												onClick={() => setAddAlertModalOpen(true)}
											>
												Create an alert
											</Button>
											<CreateAlertModal
												open={addAlertModalOpen}
												handleClose={() => {
													setAddAlertModalOpen(false);
												}}
												campgroundValue={campgroundValue}
												checkInOutDates={checkInOutDates}
											/>
										</Grid>
									) : null}
								</Grid>
							</List>
						</Box>
					) : !availableEntities.length && openAvailabilities ? (
						<Box
							className="search-results empty-results"
							p={2}
							style={{ display: 'flex', alignItems: 'center' }}
						>
							<Typography>
								Currently no available campsites/permits for the selected dates.{' '}
								<br /> Create an alert to be notified of an opening.
							</Typography>

							{user ? (
								<>
									<Button
										className="create-alert-button"
										variant="contained"
										startIcon={<AddAlertIcon />}
										onClick={() => setAddAlertModalOpen(true)}
									>
										Create an alert
									</Button>
									<CreateAlertModal
										open={addAlertModalOpen}
										handleClose={() => {
											setAddAlertModalOpen(false);
										}}
										campgroundValue={campgroundValue}
										checkInOutDates={checkInOutDates}
									/>
								</>
							) : (
								<Login
									className="login-button"
									loginText="Login to create an alert"
								/>
							)}
						</Box>
					) : null}
				</Box>
			</div>
		</div>
	);
};

export default Home;
