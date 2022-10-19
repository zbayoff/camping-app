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
	Link,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';

import { SvgIcon } from '@mui/material';
import moment from 'moment';
import CreateAlertModal from './CreateAlertModal';

import { SnackbarContext } from '../contexts/snackbarContext';

import { TentIconPath } from './SVGIconPaths';
import useLogin from '../hooks/useLogin';
import { fetchTrailheads } from '../api/recGovApi';

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
	trailheads?: Trailhead[];
};

export type Trailhead = {
	name: string;
	id: string;
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

	const [trailheadsPopoverOpen, setTrailheadsPopoverOpen] = useState(true);

	const { user } = useContext(AuthContext);

	const { setSnackOpen, setSeverity, setMessage } = useContext(SnackbarContext);

	const inputEl = useRef(null);

	const { signIn } = useLogin();

	// TODO: Add support for Permits from Rec API
	const fetchEntities = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value) {
			try {
				const { data } = await axios.get(
					`https://www.recreation.gov/api/search/suggest?q=${event.target.value}&geocoder=true&inventory_type=campground&inventory_type=permit`
				);
				if (data.inventory_suggestions && data.inventory_suggestions.length) {
					console.log(
						'data.inventory_suggestions: ',
						data.inventory_suggestions
					);

					// loop through searched results and return suggestions object with trailheads if entity is type permit
					const promises = data.inventory_suggestions.map(
						async (suggestion: any) => {
							if (suggestion.entity_type === 'permit') {
								console.log('suggestion: ');
								const trailheads = await fetchTrailheads(suggestion.entity_id);

								console.log('trailheads: ', trailheads);

								return {
									...suggestion,
									trailheads,
								};
							} else {
								return suggestion;
							}
						}
					);

					const results = await Promise.all(promises);

					console.log('results: ', results);

					setCampgroundSuggestions(results);
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

	const delayedQuery = useMemo(() => _.debounce(fetchEntities, 500), []); // eslint-disable-line react-hooks/exhaustive-deps

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

	const inputLabelTextStyle = {
		fontSize: '18px',
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: '0.1rem',
		color: 'primary.main',
	} as const;

	const inputPlaceholderStyle = {
		letterSpacing: '0.1rem',
		paddingTop: '10px',
		fontWeight: 300,
		color: 'primary.main',
		opacity: '1 !important',
		'&::placeholder': {
			opacity: 1,
		},
	} as const;

	interface TrailheadPopoverProps {
		trailheads: Trailhead[];
	}

	const TrailheadPopover = ({ trailheads }: TrailheadPopoverProps) => {
		return (
			<Box
			sx={{
				position: 'absolute',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				// backgroundColor: 'rgba(252, 247, 238, 0.85)',
				borderRadius: '15px',
			}}
			>
				{trailheads.map((trailhead) => {
					return <div key={trailhead.id}>{trailhead.name}</div>;
				})}
			</Box>
		);
	};

	return (
		<div className="Home">
			<div className="bg-image"></div>
			<Box
				className="form-wrapper"
				style={{
					position: 'relative',
					paddingBottom: '1rem',
					paddingRight: '1rem',
					paddingLeft: '1rem',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						backgroundColor: 'rgba(252, 247, 238, 0.85)',
						borderRadius: '15px',
					}}
					p={3}
				>
					<Box>
						<Typography
							align="center"
							color="secondary"
							component="h3"
							variant="body2"
							sx={{
								textTransform: 'uppercase',
								fontWeight: '600',
								marginBottom: '1rem',
								letterSpacing: '0.1rem',
								fontSize: '20px',
							}}
						>
							Applicable for national parks, lakeshores &amp; forests
						</Typography>
					</Box>
					<Box
						className="search-form-container"
						component="form"
						sx={{
							width: '100%',
						}}
						autoComplete="off"
						onSubmit={onSubmitHandler}
					>
						<Grid container sx={{ alignItems: 'center' }}>
							<Grid item xs={12} md={5}>
								<div style={{ position: 'relative' }}>
									<TextField
										className="campground-text-input"
										id="standard-basic"
										required
										variant="standard"
										placeholder="Where are you exploring"
										label="Campground Location"
										size="small"
										fullWidth
										value={campgroundValue.displayName}
										onChange={onCampgroundChangeHandler}
										InputProps={{ disableUnderline: true }}
										inputProps={{ sx: inputPlaceholderStyle }}
										InputLabelProps={{
											shrink: true,
											sx: inputLabelTextStyle,
										}}
										ref={inputEl}
										onBlur={() => onBlurField()}
										onFocus={() => onFocusFieldFirstName()}
									/>

									{campgroundSuggestions.length && openSuggestions ? (
										<Box
											sx={{
												padding: ' 0 15px',
												borderTop: '2px solid',
												borderColor: 'primary.main',
												zIndex: 10,
												'@media (min-width:899px)': {
													position: 'absolute',
													top: '68px',
													width: '727px',
												},
											}}
										>
											<Box className="suggestions-wrapper" mb={2}>
												<div>
													<List>
														{campgroundSuggestions.map((suggestion) => {
															return (
																<ListItem
																	key={suggestion.entity_id}
																	onMouseDown={(e) => e.preventDefault()} // to allow onClick to fire before onBlur
																	// only allow onClick if entity is NOT permit
																	// else open side popup with list of entry points
																	onClick={() => {
																		setCampgroundValue({
																			displayName:
																				suggestion.name.toLowerCase(),
																			entityId: suggestion.entity_id,
																			entityType: suggestion.entity_type,
																		});
																		setOpenSuggestions(false);
																		setOpenAvailabilities(false);
																	}}
																	sx={{
																		cursor: 'pointer',
																		position: 'relative',
																		height: '100%',
																		paddingTop: '10px',
																		paddingBottom: '10px',
																		':hover': {
																			bgcolor: 'rgba(65, 93, 110, 0.2)',
																		},
																		':hover .MuiTypography-root': {
																			color: 'primary.main',
																		},

																		':hover .tent-icon': {
																			color: 'primary.main',
																		},
																	}}
																	onMouseEnter={() => {
																		// check if suggestion has trailheads
																		console.log(
																			'suggestion.trailheads',
																			suggestion?.trailheads
																		);
																		if (suggestion?.trailheads) {
																			setTrailheadsPopoverOpen(true);
																		}
																	}}
																	onMouseLeave={() => {
																		// setTrailheadsPopoverOpen(false);
																	}}
																>
																	<ListItemAvatar>
																		<Avatar
																			sx={{
																				bgcolor: 'unset',
																				borderRadius: '0',
																				height: '50px',
																			}}
																		>
																			<SvgIcon
																				className="tent-icon"
																				sx={{ width: '100%', height: '100%' }}
																				color="secondary"
																				viewBox="0 0 79 75"
																			>
																				<TentIconPath />
																			</SvgIcon>
																		</Avatar>
																	</ListItemAvatar>
																	<ListItemText
																		sx={{ marginRight: '1rem' }}
																		primary={
																			<Typography
																				color="secondary"
																				sx={{
																					textTransform: 'capitalize',
																					fontSize: '18px',
																					letterSpacing: '0.1rem',
																					fontWeight: 600,
																				}}
																			>
																				{suggestion.name.toLowerCase()}
																			</Typography>
																		}
																		secondary={
																			<Typography
																				color="secondary"
																				variant="caption"
																				sx={{
																					fontSize: '12px',
																					letterSpacing: '0.1rem',
																					fontWeight: 300,
																				}}
																			>
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
																			<Box sx={{ position: 'relative' }}>
																				<Link
																					target="_blank"
																					rel="noreferrer"
																					href={
																						suggestion.entity_type === 'permit'
																							? `https://www.recreation.gov/permit/${suggestion.entity_id}`
																							: `https://www.recreation.gov/camping/campgrounds/${suggestion.entity_id}`
																					}
																					sx={{
																						display: 'flex',
																						':hover': {
																							transform: 'scale(1.05)',
																							transition:
																								'transform .2s ease-out',
																						},
																					}}
																				>
																					<img
																						alt="campground preview"
																						style={{
																							borderRadius: '10px',
																							height: '80px',
																							width: '170px',
																							objectFit: 'cover',
																						}}
																						src={suggestion.preview_image_url}
																					/>
																					<OpenInNewIcon
																						sx={{
																							color: 'white',
																							position: 'absolute',
																							right: '5px',
																							bottom: '10px',
																						}}
																					/>
																				</Link>
																			</Box>
																		</Box>
																	) : null}
																	{trailheadsPopoverOpen &&
																	suggestion.trailheads ? (
																		<TrailheadPopover
																			trailheads={suggestion.trailheads}
																		/>
																	) : null}
																</ListItem>
															);
														})}
													</List>
												</div>
											</Box>
										</Box>
									) : null}
								</div>
							</Grid>
							<Grid item xs={12} md={5}>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateRangePicker
										className="m0"
										PaperProps={{
											sx: {
												borderRadius: '15px',
												backgroundColor: 'rgba(252, 247, 238, 0.85)',
												margin: 0,
											},
										}}
										disablePast
										calendars={1}
										value={checkInOutDates}
										onChange={(newValue) => {
											setCheckInOutDates(newValue);
											setOpenAvailabilities(false);
										}}
										renderInput={(startProps, endProps) => (
											<React.Fragment>
												<Box
													sx={{
														alignSelf: 'center',
														borderRight: '1px solid #54798F',
														flex: '0 0 0px !important',
														height: '60px',
														marginRight: '2rem',
														marginTop: '10px',
														display: { xs: 'none', md: 'block' },
													}}
												></Box>
												<TextField
													{...startProps}
													id="standard-basic"
													label="Check-in"
													variant="standard"
													size="small"
													placeholder="mm/dd/yyyy"
													fullWidth
													InputLabelProps={{
														shrink: true,
														sx: inputLabelTextStyle,
													}}
													InputProps={{ disableUnderline: true }}
													inputProps={{
														sx: inputPlaceholderStyle,
														...startProps.inputProps,
													}}
													style={{
														margin: '10px 0 0 0',
													}}
													required
												/>
												<Box
													sx={{
														alignSelf: 'center',
														borderRight: '1px solid #54798F',
														flex: '0 0 0px !important',
														height: '60px',
														marginRight: '2rem',
														marginTop: '10px',
													}}
												></Box>
												<TextField
													{...endProps}
													id="standard-basic"
													label="Check-out"
													variant="standard"
													size="small"
													fullWidth
													placeholder="mm/dd/yyyy"
													InputProps={{ disableUnderline: true }}
													inputProps={{
														sx: inputPlaceholderStyle,
														...endProps.inputProps,
													}}
													InputLabelProps={{
														shrink: true,
														sx: inputLabelTextStyle,
													}}
													style={{ margin: '10px 0 0 0' }}
													required
												/>
											</React.Fragment>
										)}
									/>
								</LocalizationProvider>
							</Grid>
							<Grid
								item
								xs={12}
								md={2}
								sx={{ marginTop: { xs: '1rem', md: '0' } }}
							>
								<Button
									className="search-button"
									type="submit"
									variant="contained"
									color="primary"
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										color: 'rgba(252, 247, 238, 0.85)',
										fontWeight: 700,
										padding: '10px 20px',
										width: '100%',
									}}
								>
									<SvgIcon
										className="tent-icon"
										sx={{
											width: '50px',
											height: '50px',
											fill: 'rgba(252, 247, 238, 0.85)',
										}}
										viewBox="0 0 79 75"
									>
										<TentIconPath />
									</SvgIcon>
									Zearch
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Box>

				{availableEntities.length && openAvailabilities ? (
					<Box className="search-results" p={3}>
						<List>
							<Grid container>
								<Grid
									item
									xs={12}
									md={availabilitiesForEveryDate() ? 12 : 8}
									sx={{ marginRight: '-8px' }}
								>
									<Typography
										component="h3"
										color="primary"
										sx={{
											fontSize: '18px',
											fontWeight: 600,
											letterSpacing: '0.1rem',
										}}
									>
										{entityType === 'campground' ? 'Campsites' : 'Permits'}{' '}
										Available!{' '}
									</Typography>
									<Typography
										sx={{
											fontSize: '18px',
											fontWeight: 300,
											letterSpacing: '0.1rem',
										}}
									>
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
									</Typography>
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
																<Box sx={{ display: 'inline-flex' }}>
																	<Typography
																		sx={{
																			fontSize: '18px',
																			fontWeight: 300,
																			letterSpacing: '0.1rem',
																			marginRight: '2rem',
																		}}
																	>
																		{moment(entity.date).format('MM-DD-YYYY')}
																	</Typography>
																	<Typography
																		color="primary"
																		sx={{
																			fontSize: '18px',
																			fontWeight: 600,
																			letterSpacing: '0.1rem',
																		}}
																	>
																		{entity.sites.length}{' '}
																		{entity.sites.length > 1
																			? 'sites available'
																			: 'site available'}{' '}
																	</Typography>
																</Box>
															) : null}
														</ListItemText>
													</ListItem>
												);
											})}
									</List>
								</Grid>

								{/* if there arent availabilities for every date, create an alert */}
								{!availabilitiesForEveryDate() ? (
									<Grid
										item
										xs={12}
										md={4}
										sx={{
											borderLeft: { xs: 'none', md: '1px solid' },
											borderColor: 'primary.main',
										}}
									>
										<Box mb="1rem" sx={{ pl: { xs: '0', md: '1rem' } }}>
											<Typography
												color={'primary'}
												sx={{
													fontSize: '18px',
													fontWeight: 400,
													letterSpacing: '0.05rem',
												}}
											>
												There aren't availabilites for all of the dates you
												selected.{' '}
												<span
													style={{
														fontWeight: 700,
													}}
												>
													Create an alert to be notified when they become
													available.
												</span>
											</Typography>
										</Box>
										{user ? (
											<Button
												className="create-alert-button"
												variant="contained"
												startIcon={<NotificationAddIcon />}
												onClick={() => setAddAlertModalOpen(true)}
												sx={{ marginLeft: { xs: 0, md: '1rem' } }}
											>
												Create an alert
											</Button>
										) : (
											<Button
												onClick={() => signIn()}
												variant="contained"
												sx={{
													color: 'rgba(252, 247, 238, 0.85)',
													marginRight: '1rem',
													marginLeft: { xs: 0, md: '1rem' },
													textTransform: 'uppercase',
													fontWeight: 600,
													fontSize: '14px',
													letterSpacing: '.1em',
													padding: '1rem',
												}}
											>
												Login to create an alert
											</Button>
										)}

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
						className="search-results"
						p={3}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography color={'primary.main'} sx={{ letterSpacing: '.05rem' }}>
							There are currently no available campsites/permits for your
							selected dates.
						</Typography>

						<Typography
							color={'primary.main'}
							sx={{ letterSpacing: '.05rem', fontWeight: 600 }}
						>
							To be notified of an opening please create an alert.
						</Typography>

						{user ? (
							<>
								<Button
									variant="contained"
									startIcon={<NotificationAddIcon />}
									onClick={() => setAddAlertModalOpen(true)}
									sx={{
										padding: '15px',
										borderRadius: '15px',
										marginTop: '16px',
										fontWeight: 600,
										fontSize: '14px',
									}}
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
							<Button
								onClick={() => signIn()}
								variant="contained"
								sx={{
									color: 'rgba(252, 247, 238, 0.85)',
									marginRight: '1rem',
									marginLeft: { xs: 0, md: '1rem' },
									marginTop: '16px',
									textTransform: 'uppercase',
									fontWeight: 600,
									fontSize: '14px',
									letterSpacing: '0.1rem',
									padding: '1rem',
								}}
							>
								Login to create an alert
							</Button>
						)}
					</Box>
				) : null}
			</Box>
		</div>
	);
};

export default Home;
