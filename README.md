# Cloud Firestore Data Model

1. Collections
2. Documents

Think about Collections as a folder which contains documents.

A users collection could have a document named user with the following attributes

```javascript

{name:"Gideon", channels:{
  'General':true,
  'Messages':[]
}}

```

Now whenever you request for channels, we get the messages array too.
In the Real time database, you get whatever node of the tree you required and all of it's subnodes.

This meant you had to be really careful about how you structured your data. In Firestore, queries are shallow. In Cloud Firestore, queries are shallow. You don't get all of the sub-collections by default

**_useEffect_** is our chance to go and do a side effect
like go and read something from firebase. Whenever we use **_useeffect_**, we need a method to clean things up.

Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects. Whether or not you’re used to calling these operations “side effects” (or just “effects”), you’ve likely performed them in your components before.

Sometimes, we want to run some additional code after React has updated the DOM. Network requests, manual DOM mutations, and logging are common examples of effects that don’t require a cleanup. We say that because we can run them and immediately forget about them.

Instead of thinking in terms of “mounting” and “updating”, you might find it easier to think that effects happen “after render”. React guarantees the DOM has been updated by the time it runs the effects.

Detailed Explaination here: [useEffect](https://reactjs.org/docs/hooks-effect.html)

Whenvever the data changes firebase is going to call **_onSnapshot_** for us

```javascript
const unsubscribe = db.collection('channels').onSnapshot(snapshot => {
	const docs = [];
	snapshot.forEach(doc => {
		docs.push({
			...doc.data(),
			id: doc.id
		});
	});
});

return unsubscribe;
```

**React knows when an effect should be cleaned up and we need to
just give it a function**

We could have added messages as field of the type array with objects in it as a message. but we choose to add it as a collection. In the nav bar we are subscribing to every channel and if every channel has an array of messages, then to build the list we wil have to download every message in the database.

Collections do not get downloaded and you have got to ask for the collection. Collections can also be queried which means messages can come in the right order on the channel.

If we don't pass **arguments** to useEffect, React will call the effect every single time the app renders.

```javascript
db.collection('channels')
	.doc('random')
	.collection('messages')
	.orderBy('createdAt');
```

# Persisting Login

When the user signs in, we will use an effect to persist login. Firebase gives us an onAuthStateChanged() which is called when the user log's in or out.

**Detailed Code in App.js**

```javascript
firebase.auth().onAuthStateChanged(user => {
	if (user) {
		setUser({
			displayName: user.displayName,
			photoUrl: user.photoURL,
			uid: user.uid
		});
	} else {
		setUser(null);
	}
});
```

# Referencing users in Messages

There is a bit of prop drilling required here
to get the user from the app to the ChatInput component

The goal is have an avatar or user information
on each User.

```javascript
db.collection('channels')
	.doc('random')
	.collection('messages')
	.add({
		user: db.collection('users').doc(user.uid),
		text: value,
		createdAt: new Date()
	});
```

The **uid** will be unique across all users.
The user will be stored as a reference type on the messages collection.

## Tricky parts implemented

We want an avatar to be displayed if the message
is from a different user id.

### Code snipped from the Messages component

```javascript
{
	messages.map((messages, index) => {
		const previous = messages[index - 1];
		const showAvatar = !previous || messages.user.id !== previous.user.id;
	});
}
```


# More notes to come....











