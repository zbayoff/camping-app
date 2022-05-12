import { model, Schema, Model, Document, Types } from 'mongoose';
import moment from 'moment';

interface NotificationSettingSchema {
	frequencyNumber: number;
	frequencyGranularity: moment.unitOfTime.DurationConstructor;
}

export interface UserSchema {
	_id: string;
	googleId: string;
	firstName: string;
	lastName: string;
	picture: string;
	email: string;
	createdAt: Date;
	alertJobId: Types.ObjectId;
	notificationSettings: NotificationSettingSchema;
}

const NotificationSettingSchema = new Schema<NotificationSettingSchema>(
	{
		frequencyNumber: Number,
		frequencyGranularity: String,
	},
	{ _id: false }
);

const userSchema = new Schema<UserSchema>({
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
		default: () => new Date(Date.now()),
	},
	alertJobId: Types.ObjectId,
	notificationSettings: { type: NotificationSettingSchema },
});

// module.exports = model('User', userSchema);

const User = model<UserSchema>('User', userSchema);
export default User;
