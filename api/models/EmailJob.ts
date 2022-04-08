import { model, Schema, Types } from 'mongoose';

export interface EmailJobInterface {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	lastRunAt: Date;
	alerts: [Types.ObjectId];
}

const emailJobSchema = new Schema<EmailJobInterface>({
	userId: Types.ObjectId,
	lastRunAt: Date,
	alerts: [Types.ObjectId],
});

const EmailJob = model<EmailJobInterface>('EmailJob', emailJobSchema);
export default EmailJob;
