const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailJobSchema = new Schema({
	userId: mongoose.Schema.Types.ObjectId,
	lastRunAt: Date,
	alerts: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model('emailJob', emailJobSchema);
