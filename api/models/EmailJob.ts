import { model, Schema, Types } from 'mongoose';

export interface EmailJobInterface {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	lastRunAt: Date;
	alerts: [Types.ObjectId];
	updatedAt: Date;
	createdAt: Date;
}

const emailJobSchema = new Schema<EmailJobInterface>(
	{
		userId: Types.ObjectId,
		lastRunAt: Date,
		alerts: [Types.ObjectId],
	},
	{ timestamps: true }
);

const EmailJob = model<EmailJobInterface>('EmailJob', emailJobSchema);
export default EmailJob;
