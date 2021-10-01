import jwt_decode from 'jwt-decode';

export const validateToken = (jwt) => {
	if (!jwt) {
		return false;
	}
	const decoded = jwt_decode(jwt);
	if (!decoded) {
		return false;
	}

	const { exp = 1 } = decoded;
	const expirationDate = new Date(exp * 1000);
	if (expirationDate < new Date()) {
		return false;
	}

	return true;
};