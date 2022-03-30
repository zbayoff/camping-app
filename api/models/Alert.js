const mongoose = require('mongoose');

const { Schema } = mongoose;

// campground or permit
const EntitySchema = new Schema(
	{
		id: Number,
		name: String,
		type: String,
	},
	{ _id: false }
);

const alertSchema = new Schema({
	userId: mongoose.Schema.Types.ObjectId,
	entity: { type: EntitySchema },
	checkinDate: Date,
	checkoutDate: Date,
	enabled: Boolean,
});

module.exports = mongoose.model('Alert', alertSchema);
