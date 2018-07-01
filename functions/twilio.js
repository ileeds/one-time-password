const twilio = require('twilio');
const twilioPrivate = require('./twilio_private');

const accountSid = twilioPrivate.accountSid;
const authToken = twilioPrivate.authToken;

module.exports = new twilio.Twilio(accountSid, authToken);
