import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const AuthContext = createContext(false);

export const AuthProvider = (props) => {
	// const { data, error, mutate } = useSWR(`/api/v1/auth/me`)

	const [user, setUser] = useState(null);

	const onSuccess = async (response) => {
		console.log('success response: ', response);
		const res = await fetch('http://localhost:5000/api/v1/auth/google', {
			method: 'POST',
			body: JSON.stringify({
				token: response.tokenId,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});
		console.log('res: ', res);
		const { user, jwtToken } = await res.json();

		// Cookie.set('token', jwtToken);
		// console.log('data: ', data);
		setUser(user);

		// store returned user somehow
	};

	const onFailure = (response) => {
		console.log('failure response: ', response);
	};

	const onLogoutSuccess = (response) => {
		console.log('onLogoutSuccess response: ', response);
		// delete the token and redirect to home page?
		setUser(null);
	};

	// useEffect(() => {
	// 	const checkLoggedIn = async () => {
	// 		let token = Cookies.get('token'); // can't get this token because it's http-only
	// 		console.log('token: ',token)
	// 		if (token === null) {
	// 			token = '';
	// 		}
	// 		const res = await fetch('http://localhost:5000/api/v1/auth/google', {
	// 			method: 'POST',
	// 			body: JSON.stringify({
	// 				token,
	// 			}),
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			credentials: 'include',
	// 		});

	// 		const { user } = await res.json();

	// 		setUser(user);
	// 	};

	// 	checkLoggedIn();
	// }, []);

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(() => {
		// const checkLoggedIn = async () => {
		// 	let token = Cookies.getItem('token');
		// };

		// Update the document title using the browser API
		// const fetchUser = async () => {
		// 	console.log('fetching user...')
		// 	const res = await fetch('http://localhost:5000/api/v1/auth/google', {
		// 		method: 'POST',
		// 		body: JSON.stringify({
		// 			token: Cookie.get('token'),
		// 		}),
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 	});
		// 	console.log('res: ', res);
		// 	const { user } = await res.json();
		// 	setUser(user);
		// };
		// fetchUser();
	});

	return (
		<AuthContext.Provider
			value={{
				user,
				// error: error,
				// googleLogIn: googleLogIn,
				// logOut: logOut
			}}
			{...props}
		>
			<div className="sign-up-mode">
				{props.children}
				<div className="panels-container">
					<div className="panel left-container">
						<div className="content">
							<p>
								Login with your gmail id and start using kanban for better
								experience!
							</p>
							<GoogleLogin
								clientId="233067414245-il4rkpad53ot27kgln3pe3qbimuu6gvj.apps.googleusercontent.com"
								buttonText="Login"
								onSuccess={onSuccess}
								onFailure={onFailure}
								cookiePolicy={'single_host_origin'}
								isSignedIn={true}
							/>
							<GoogleLogout
								clientId="233067414245-il4rkpad53ot27kgln3pe3qbimuu6gvj.apps.googleusercontent.com"
								buttonText="Logout"
								onLogoutSuccess={onLogoutSuccess}
							></GoogleLogout>
						</div>
					</div>
				</div>
			</div>
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
