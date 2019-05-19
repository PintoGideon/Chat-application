/* eslint-disable promise/always-return */

const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

module.exports = functions.database
	.ref('status/{userId}')
	.onUpdate((change, context) => {
		const eventStatus = change.after.val();
		//Synchronize it will cloud firestore

		const userDoc = db.doc(`users/${context.params.userId}`);

		return change.after.ref.once('value').then(snapshot => {
			const status = snapshot.val();
			if (status.lastChanged > eventStatus.lastChanged) {
				return;
			}
			eventStatus.lastChanged = new Date(eventStatus.lastChanged);
			userDoc.update({ status: eventStatus });
		});

		//Converting the date timestamp
		//from milliseconds to a real date
	});
