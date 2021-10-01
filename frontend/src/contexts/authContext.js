import { useState, createContext } from 'react';
import { validateToken } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	let token = localStorage.getItem('jwtToken');
	const isTokenValid = validateToken(token);

	const initialState = isTokenValid
		? localStorage.getItem('user')
			? JSON.parse(localStorage.getItem('user'))
			: null
		: null;

	// want the initial value of 'user' to get the localStorage value, else null
	const [user, setUser] = useState(initialState);

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
