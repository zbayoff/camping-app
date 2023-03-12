import { Button, Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

import venmoLogo from '../images/venmo-logo.png';
import paypalLogo from '../images/paypal-logo.png';

const Donate = () => {
	return (
		<div>
			<Box className="donate-bg-image">
				<Box
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					justifyContent={'center'}
				>
					<Container maxWidth="xl" sx={{ height: '100%' }}>
						<Grid
							container
							alignItems={'center'}
							sx={{ height: '100%' }}
							display={'flex'}
							flexDirection={'column'}
							justifyContent={'center'}
						>
							<Grid item md={8}>
								<Typography
									color={'cream.main'}
									style={{ opacity: 0.8 }}
									fontFamily={'Passion One'}
									fontSize={'120px'}
									lineHeight={'100px'}
									textAlign={'center'}
									marginBottom={'2rem'}
								>
									Keep us online <br /> so you can <br /> explore offline
								</Typography>
							</Grid>
							<Grid item md={8}>
								<Typography
									color={'cream.main'}
									fontWeight={'500'}
									fontSize={'30px'}
									lineHeight={'40px'}
									textAlign={'center'}
									marginBottom={'3rem'}
								>
									Have you snagged last minute campsites or high-season permits
									using Zampsites? Consider donating just $10 to support the
									costs of keeping the website live and{' '}
									<em style={{ fontWeight: 600 }}>free for everyone.</em>
								</Typography>
							</Grid>
							<Grid item md={5}>
								<Typography
									fontSize={'25px'}
									fontFamily={'North Pole, cursive'}
									textAlign={'center'}
									color={'cream.main'}
								>
									Thank you!
								</Typography>
								<Typography
									sx={{
										fontFamily: 'North Pole',
										fontSize: '24px',
									}}
									marginBottom={'3rem'}
									textAlign={'center'}
									color={'cream.main'}
								>
									-Zach
								</Typography>
								<Box sx={{ display: 'flex' }} justifyContent={'center'}>
									<Button
										size="small"
										variant="contained"
										sx={{ marginRight: '1rem' }}
										color="venmoBlue"
										target={'_blank'}
										rel={'nofollow'}
										href="https://account.venmo.com/pay?recipients=Zack-Bayoff&amount=10&note=Zampsites%20donation"
									>
										<img src={venmoLogo} alt="venmo logo" />
									</Button>
									<Button
										size="small"
										variant="contained"
										color="payPalBlue"
										target={'_blank'}
										rel={'nofollow'}
										href="https://paypal.me/zachbayoff"
									>
										<img src={paypalLogo} alt="Paypal logo" />
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Container>
				</Box>
			</Box>
			<Box
				sx={{
					width: '100%',
					bottom: 0,
					backgroundColor: 'cream.main',
					paddingTop: '3rem',
					paddingBottom: '3rem',
				}}
			>
				<Box
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					justifyContent={'center'}
				>
					<Container maxWidth="xl">
						<Grid
							container
							spacing={2}
							display={'flex'}
							flexDirection={'column'}
							justifyContent={'center'}
							alignItems={'center'}
						>
							<Grid item md={8}>
								<Typography
									variant="body1"
									textAlign={'center'}
									fontWeight={'500'}
									fontSize={'24px'}
									marginBottom={'3rem'}
									color={'greyblue2.main'}
								>
									Have a suggestion on how we can improve your Zampsites
									experience?<br></br>
									Want to share an epic adventure that was possible because of a
									Zampsites alert?
								</Typography>
								<Box textAlign={'center'}>
									<Button
										size="medium"
										variant="contained"
										color="greyBlue2"
										target={'_blank'}
										rel={'nofollow'}
										href="https://forms.gle/kp5SxWhtDocdNq1Y8"
										sx={{ paddingLeft: '30px', paddingRight: '30px' }}
									>
										<Typography
											sx={{
												fontFamily: 'North Pole',
												color: 'cream.main',
											}}
										>
											Share feedback
										</Typography>
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Container>
				</Box>
			</Box>
		</div>
	);
};

export default Donate;
