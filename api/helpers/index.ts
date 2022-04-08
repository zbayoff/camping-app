import User from '../models/User';
import Alert from '../models/Alert';
import EmailJob from '../models/EmailJob';
import { Types } from 'mongoose';

function findUser(userId: Types.ObjectId) {
	return User.findById(userId);
}

function findAlerts() {
	return Alert.find({});
}

function findAlertsById(alertId: Types.ObjectId) {
	return Alert.findById(alertId);
}

function findEmailJobs() {
	return EmailJob.find({});
}

export { findUser, findAlerts, findAlertsById, findEmailJobs };
