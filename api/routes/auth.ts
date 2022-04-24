import express from 'express';

import authController from '../controllers/auth';

const router = express.Router();

import checkAuth from '../middleware/checkAuth';

router.post('/google', authController);
router.delete('/google', checkAuth, (req, res) => {
	res.clearCookie('token', { httpOnly: true, path: '/' });
	res.status(200).json({ deleted: true });
});

export default router;
