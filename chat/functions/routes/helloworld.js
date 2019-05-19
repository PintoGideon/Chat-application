/* eslint-disable promise/always-return */
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

module.exports = functions.https.onRequest((request, response) => {
	console.log('Hello World');
	response.send('Hello');
});
