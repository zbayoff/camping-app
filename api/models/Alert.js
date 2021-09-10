const mongoose = require('mongoose');

const { Schema } = mongoose;

const alertSchema = new Schema({
	userId: String,
	campground: Number,
	checkinDate: String,
	checkoutDate: String,
	enabled: Boolean,
});

module.exports = mongoose.model('Alert', alertSchema);
