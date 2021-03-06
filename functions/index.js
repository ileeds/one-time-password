const admin = require('firebase-admin');
const functions = require('firebase-functions');
// const createUser = require('./create_user');
const serviceAccount = require('./service_account.json');
const requestOneTimePassword = require('./request_one_time_password');
const newUserOneTimePassword = require('./new_user_one_time_password');
const verifyOneTimePassword = require('./verify_one_time_password');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://one-time-password-1bd5c.firebaseio.com'
});

exports.newUserOneTimePassword = functions.https.onRequest(
	newUserOneTimePassword
);
// exports.createUser = functions.https.onRequest(createUser);
exports.requestOneTimePassword = functions.https.onRequest(
	requestOneTimePassword
);
exports.verifyOneTimePassword = functions.https.onRequest(
	verifyOneTimePassword
);
