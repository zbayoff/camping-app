const mongoose = require('mongoose');

const { Schema } = mongoose;

const alertSchema = new Schema({
	userId: mongoose.Schema.Types.ObjectId,
	campground: Number,
	checkinDate: Date,
	checkoutDate: Date,
	enabled: Boolean,
});

module.exports = mongoose.model('Alert', alertSchema);
