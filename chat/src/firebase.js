import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
	apiKey: '',
	authDomain: 'firechat-d8a74.firebaseapp.com',
	databaseURL: 'https://firechat-d8a74.firebaseio.com',
	projectId: 'firechat-d8a74',
	storageBucket: 'firechat-d8a74.appspot.com',
	messagingSenderId: '206694336270',
	appId: '1:206694336270:web:3412b0963d910e10'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const rtdb = firebase.database();

export function setupPresence(user) {
	const isOfflineForRTDB = {
		state: 'offline',
		lastChanged: firebase.database.ServerValue.TIMESTAMP
	};

	const isOfflineForFirestore = {
		state: 'offline',
		lastChanged: firebase.firestore.FieldValue.serverTimestamp()
	};

	const isOnlineForFirestore = {
		state: 'online',
		lastChanged: firebase.firestore.FieldValue.serverTimestamp()
	};

	const isOnlineForRTDB = {
		state: 'online',
		lastChanged: firebase.database.ServerValue.TIMESTAMP
	};

	const rtdbRef = rtdb.ref(`/status/${user.uid}`);

	const userDoc = db.doc(`users/${user.uid}`);

	rtdb.ref(`.info/connected`).on('value', async snapshot => {
		if (snapshot.val() === false) {
			userDoc.update({
				status: isOfflineForFirestore
			});
			return;
		}

		await rtdbRef.onDisconnect().set(isOfflineForRTDB);

		rtdbRef.set(isOnlineForRTDB);
		userDoc.update({
			status: isOnlineForFirestore
		});
	});
}

export { db, firebase };
