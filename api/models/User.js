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
	name: String,
	email: String,
	alertJobId: { type: String, default: '' },
	notificationSettings: { type: NotificationSettingSchema },
});

module.exports = mongoose.model('User', userSchema);
