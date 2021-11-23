const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

const auth = require('../middleware/checkAuth');

router.post('/google', authController.auth);
router.delete('/google', auth, (req, res) => {
	res.clearCookie('token', { httpOnly: true, path: '/' });
	res.status('200').json({ deleted: true });
});

module.exports = router;
