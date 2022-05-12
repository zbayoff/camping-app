import { datadogRum } from '@datadog/browser-rum';
import React, { useState, createContext } from 'react';
import { validateToken } from '../utils/auth';

import { UserSchema } from '../../../api/models/User';

export const AuthContext = createContext<any>(null);

export interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	let token = localStorage.getItem('jwtToken');
	const isTokenValid = validateToken(token);

	const initialState = isTokenValid
		? localStorage.getItem('user')
			? JSON.parse(localStorage.getItem('user') || '{}')
			: null
		: null;

	// want the initial value of 'user' to get the localStorage value, else null
	const [user, setUser] = useState<UserSchema>(initialState);

	if (user) {
		datadogRum.setUser({
			id: user._id,
			name: user.firstName + user.lastName,
			email: user.email,
		});
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
