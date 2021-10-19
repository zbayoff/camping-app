import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import Login from './Login';
import Logout from './Logout';
import { Link } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';

import { AuthContext } from '../contexts/authContext';
import { Avatar, Button, Menu, MenuItem, SvgIcon } from '@mui/material';

const Navigation = () => {
	const { user } = useContext(AuthContext);
	const { pathname } = useLocation();

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	console.log('user: ', user);
	return (
		<div className={`Navbar ${pathname === '/' ? 'home' : ''}`}>
			<div>
				<Link to="/" underline="none">
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
			</div>

			{user ? (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{/* <Link to="/alerts" underline="none">
						Alerts{' '}
					</Link> */}
					<Button
						id="basic-button"
						aria-controls="basic-menu"
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}
					>
						<MenuIcon />
					</Button>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
					>
						<MenuItem onClick={handleClose} component={Link} to="/alerts">
							Alerts
						</MenuItem>
						<MenuItem onClick={handleClose} component={Link} to="/settings">
							Settings
						</MenuItem>
						<MenuItem onClick={handleClose}>
							<Logout />
						</MenuItem>
					</Menu>

					<div>
						<Avatar alt={user.firstName} src={user.picture} />
					</div>
				</div>
			) : (
				<Login />
			)}
		</div>
	);
};

export default Navigation;
