const express = require('express');
const router = express.Router();

/* GET home page. */
// router.get("/", async (req, res) => {
//   res.render("index", { title: "Campground checker" });
// });

const mainController = require('../controllers/index');

router.get('/alerts', mainController.getAlerts);
router.post('/alert', mainController.addAlert);

router.get('/user/:id', mainController.getUser);
router.get('/users', mainController.getUsers);
router.post('/user', mainController.addUser);

module.exports = router;
