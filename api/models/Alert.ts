import { model, Schema, Model, Document, Types } from 'mongoose';

interface IEntitySchema {
	id: Number;
	name: string;
	type: string;
}

interface AlertSchema {
	userId: Types.ObjectId;
	entity: IEntitySchema;
	checkinDate: Date;
	checkoutDate: Date;
	enabled: Boolean;
}

// campground or permit
const EntitySchema = new Schema<IEntitySchema>(
	{
		id: Number,
		name: String,
		type: String,
	},
	{ _id: false }
);

const alertSchema = new Schema<AlertSchema>({
	userId: Types.ObjectId,
	entity: { type: EntitySchema },
	checkinDate: Date,
	checkoutDate: Date,
	enabled: Boolean,
});

const Alert = model<AlertSchema>('Alert', alertSchema);
export default Alert;
