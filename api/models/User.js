const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationSettingSchema = new Schema(
	{
		frequencyNumber: Number,
		frequencyGranularity: String,
	},
	{ _id: false }
);

const userSchema = new Schema({
	googleId: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	picture: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	alertJobId: { type: mongoose.Schema.Types.ObjectId },
	notificationSettings: { type: NotificationSettingSchema },
});

module.exports = mongoose.model('User', userSchema);
