import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { NavLink, Link } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';

import { AuthContext } from '../contexts/authContext';
import { Avatar, Button, Menu, MenuItem, SvgIcon } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { SxProps } from '@mui/system';
import useLogin from '../hooks/useLogin';
import { GoogleIconPath } from './SVGIconPaths';
import Logout from './Logout';

const Navigation = () => {
	const { user } = useContext(AuthContext);
	const { pathname } = useLocation();

	const { login } = useLogin();

	const [anchorElNav, setAnchorElNav] = useState<Element | null>(null);

	const [scroll, setScroll] = useState(false);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	useEffect(() => {
		window.addEventListener('scroll', () => {
			setScroll(window.scrollY > 1);
		});
	}, [scroll]);

	const mobileNavItemStyle: SxProps = {
		textTransform: 'uppercase',
		fontWeight: 600,
		fontSize: '14px',
		letterSpacing: '0.1rem',
		color: 'primary.main',
	};

	return (
		<AppBar
			className={`Navbar ${scroll ? 'scrolled' : ''} ${
				pathname === '/' ? 'home' : ''
			}`}
			position="absolute"
		>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Link to="/" style={{ display: 'flex' }}>
						<SvgIcon
							htmlColor="white"
							viewBox={'0 0 224 144'}
							style={{ width: '60px' }}
						>
							<path
								id="path4"
								d="m112 0c-25.8 0-49 28.8-68.6 63.6l-35.4 63.2v-4.8h-8v22h8v-4.4l41.2-72 49.4-30.6c9-5.6 9.6-6.6 13.4-6.6s4.4 1.2 13.4 6.6l49.4 30.6 41.2 72v4.4h8v-22.2h-8v5l-35.6-63.2c-19.4-34.8-42.6-63.6-68.4-63.6zm-28.4 53.2-28.8 17.6-30.2 69.2h174.8l-30.2-69.2-28.6-17.6 5.8 56.2c.4 4.8-3.4 8.8-7.6 8.8h-53.2c-4.2 0-8-4-7.6-8.8z"
							/>
						</SvgIcon>
					</Link>

					{/* Mobile nav */}
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						{user ? (
							<>
								<IconButton
									size="large"
									aria-label="account of current user"
									aria-controls="menu-appbar"
									aria-haspopup="true"
									onClick={handleOpenNavMenu}
									color="primary"
								>
									<MenuIcon sx={{ color: 'rgba(252, 247, 238, 0.85)' }} />
								</IconButton>
								<Menu
									id="menu-appbar"
									anchorEl={anchorElNav}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'left',
									}}
									open={Boolean(anchorElNav)}
									onClose={handleCloseNavMenu}
									sx={{
										display: { xs: 'block', md: 'none' },
										borderRadius: '15px',
									}}
									PaperProps={{
										style: { borderRadius: '15px' },
									}}
								>
									<MenuItem
										onClick={handleCloseNavMenu}
										component={NavLink}
										to="/"
										activeClassName="active-nav"
									>
										<Typography sx={mobileNavItemStyle} textAlign="center">
											Search
										</Typography>
									</MenuItem>
									<MenuItem
										onClick={handleCloseNavMenu}
										component={NavLink}
										to="/alerts"
										activeClassName="active-nav"
									>
										<Typography sx={mobileNavItemStyle} textAlign="center">
											Alerts
										</Typography>
									</MenuItem>
									<MenuItem
										onClick={handleCloseNavMenu}
										component={NavLink}
										to="/donate"
										activeClassName="active-nav"
									>
										<Typography sx={mobileNavItemStyle} textAlign="center">
											Donate
										</Typography>
									</MenuItem>
									<MenuItem
										onClick={handleCloseNavMenu}
										component={NavLink}
										to="/"
										activeClassName="active-nav"
									>
										{user ? <Logout sx={mobileNavItemStyle} /> : null}
									</MenuItem>
								</Menu>
							</>
						) : null}
					</Box>

					{/* Desktop Nav */}
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: 'none', md: 'flex' },
							justifyContent: 'flex-end',
						}}
					>
						{user ? (
							<>
								<Button
									to="/"
									exact
									component={NavLink}
									onClick={handleCloseNavMenu}
									sx={{
										mr: 2,
										color: 'white',
										fontWeight: 500,
										fontSize: '18px',
									}}
								>
									Search
								</Button>
								<Box
									sx={{
										alignSelf: 'center',
										borderRight: `2px solid`,
										borderColor: 'white',
										flex: '0 0 0px !important',
										height: '31px',
										marginRight: '1rem',
									}}
								></Box>
								<Button
									to="/alerts"
									component={NavLink}
									onClick={handleCloseNavMenu}
									sx={{
										mr: 2,
										color: 'white',
										fontWeight: 500,
										fontSize: '18px',
									}}
								>
									Alerts
								</Button>
								<Box
									sx={{
										alignSelf: 'center',
										borderRight: `2px solid`,
										borderColor: 'white',
										flex: '0 0 0px !important',
										height: '31px',
										marginRight: '1rem',
									}}
								></Box>
								<Button
									to="/donate"
									component={NavLink}
									onClick={handleCloseNavMenu}
									sx={{
										mr: 2,
										color: 'white',
										fontWeight: 500,
										fontSize: '18px',
									}}
								>
									Donate
								</Button>
								<Box
									sx={{
										alignSelf: 'center',
										borderRight: `2px solid`,
										borderColor: 'white',
										flex: '0 0 0px !important',
										height: '31px',
										marginRight: '1rem',
									}}
								></Box>
								<Logout
									sx={{
										mr: 2,
										textTransform: 'uppercase',
										color: 'white',
										fontWeight: 500,
										fontSize: '18px',
										letterSpacing: '0.1rem',
									}}
								/>
							</>
						) : null}
					</Box>
					<Box sx={{ flexGrow: 0 }}>
						{user ? (
							<div>
								<Avatar alt={user.firstName} src={user.picture} />
							</div>
						) : (
							<Box
								sx={{
									flexGrow: 1,
									display: { xs: 'none', md: 'flex' },
									justifyContent: 'flex-end',
								}}
							>
								<Button
									to="/donate"
									component={NavLink}
									onClick={handleCloseNavMenu}
									sx={{
										mr: 2,
										color: 'white',
										fontWeight: 500,
										fontSize: '18px',
									}}
								>
									Donate
								</Button>
								<Box
									sx={{
										alignSelf: 'center',
										borderRight: `2px solid`,
										borderColor: 'white',
										flex: '0 0 0px !important',
										height: '31px',
										marginRight: '1rem',
									}}
								></Box>
								<Button onClick={() => login()}>
									<Typography
										sx={{
											fontWeight: 600,
											textTransform: 'uppercase',
											fontSize: '18px',
											letterSpacing: '0.1rem',
											color: 'white',
											marginRight: '1rem',
										}}
									>
										Sign In
									</Typography>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<SvgIcon
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												width: '47px',
												height: '47px',
												backgroundColor: 'white',
												borderRadius: '50%',
												padding: '8px',
											}}
											viewBox="0 0 18 18"
										>
											<GoogleIconPath />
										</SvgIcon>
									</Box>
								</Button>
							</Box>
						)}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navigation;
