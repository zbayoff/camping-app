import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Login from './Login';
import Logout from './Logout';
import { Link } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';

import { AuthContext } from '../contexts/authContext';
import { Avatar, Button, Menu, MenuItem, SvgIcon } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';

const Navigation = () => {
	const { user } = useContext(AuthContext);
	const { pathname } = useLocation();

	const [anchorElNav, setAnchorElNav] = useState<Element | null>(null);
	const [anchorElUser, setAnchorElUser] = useState<Element | null>(null);

	const [scroll, setScroll] = useState(false);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	useEffect(() => {
		window.addEventListener('scroll', () => {
			setScroll(window.scrollY > 1);
		});
	}, [scroll]);

	return (
		<AppBar
			className={`Navbar ${scroll ? 'scrolled' : ''} ${
				pathname === '/' ? 'home' : ''
			}`}
			position="fixed"
		>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Link to="/">
						<SvgIcon
							color="primary"
							viewBox={'0 0 224 144'}
							style={{ width: '60px' }}
						>
							<path
								id="path4"
								d="m112 0c-25.8 0-49 28.8-68.6 63.6l-35.4 63.2v-4.8h-8v22h8v-4.4l41.2-72 49.4-30.6c9-5.6 9.6-6.6 13.4-6.6s4.4 1.2 13.4 6.6l49.4 30.6 41.2 72v4.4h8v-22.2h-8v5l-35.6-63.2c-19.4-34.8-42.6-63.6-68.4-63.6zm-28.4 53.2-28.8 17.6-30.2 69.2h174.8l-30.2-69.2-28.6-17.6 5.8 56.2c.4 4.8-3.4 8.8-7.6 8.8h-53.2c-4.2 0-8-4-7.6-8.8z"
							/>
						</SvgIcon>
					</Link>

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
									<MenuIcon />
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
									}}
								>
									<MenuItem
										onClick={handleCloseNavMenu}
										component={Link}
										to="/alerts"
									>
										<Typography textAlign="center">Alerts</Typography>
									</MenuItem>
								</Menu>
							</>
						) : null}
					</Box>
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: 'none', md: 'flex' },
							justifyContent: 'flex-end',
						}}
					>
						{user ? (
							<Button
								to="/alerts"
								component={Link}
								onClick={handleCloseNavMenu}
								sx={{ mr: 2 }}
							>
								Alerts
							</Button>
						) : null}
					</Box>

					{/* Avatar */}
					<Box sx={{ flexGrow: 0 }}>
						{user ? (
							<div>
								<Tooltip title="Open settings">
									<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
										<Avatar alt={user.firstName} src={user.picture} />
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: '45px' }}
									id="menu-appbar"
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									<MenuItem onClick={handleCloseUserMenu}>
										<Logout />
									</MenuItem>
								</Menu>
							</div>
						) : (
							<Login />
						)}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navigation;
