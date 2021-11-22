const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampgroundSchema = new Schema(
	{
		id: Number,
		name: String,
	},
	{ _id: false }
);

const alertSchema = new Schema({
	userId: mongoose.Schema.Types.ObjectId,
	campground: { type: CampgroundSchema },
	checkinDate: Date,
	checkoutDate: Date,
	enabled: Boolean,
});

module.exports = mongoose.model('Alert', alertSchema);
