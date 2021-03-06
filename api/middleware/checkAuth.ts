import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const checkAuth = (req: Request, res: Response, next: any) => {
	const { token } = req.cookies;
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
			if (err) {
				// would like to redirect user to /login page
				res.status(401).send({
					success: false,
					message: 'Failed to authenticate token.',
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.userId = decoded._id;
				next();
			}
		});
	} else {
		// if there is no token, return an error
		res.status(401).json({
			message: 'Unauthenticated Request. Please login and try again.',
		});
	}
};

export default checkAuth;
