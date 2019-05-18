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

![Architectural Decision_02](https://user-images.githubusercontent.com/15992276/57504233-b1dfce80-72c1-11e9-8af5-47cded42ead8.JPG)
![Architecural Decision](https://user-images.githubusercontent.com/15992276/57504234-b1dfce80-72c1-11e9-98db-509fe846ca64.JPG)

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

Code snippet from the **Messages component**

```javascript
{
	messages.map((messages, index) => {
		const previous = messages[index - 1];
		const showAvatar = !previous || messages.user.id !== previous.user.id;
	});
}
```

# Routing

- Install Reach Router

Whenever a section of the page is changing,
you need a router there.

```javascript
<Router>
	<Channel path="channel/:channelId" user={user} />
	<Redirect from="/" to="channel/general" />
</Router>
```

**_Router is going to parse the url in the path and is going to send it to the channel as a prop_**

We pass the channelId from Channel to Messages. Messages takes that channelId and passes it to useCollection.
The messages are pushed under the channelId passed as arguments to useEffect.

```javascript
<div className="ChannelMain">
	<ChannelInfo channelId={channelId} />
	<Messages channelId={channelId} />
	<ChatInput channelId={channelId} user={user} />
</div>
```

```javascript
useEffect(() => {
	const docs = [];
	snapshot.forEach(doc => {
		docs.push({
			...doc.data(),
			id: doc.id
		});
	});
}, [path, orderBy]);
```

Whenever we click on the channels, the useCollection is called with a new path. The useEffect unsubscribes and subscribes to the new channel.

# Using a cache

There are some features of the app that could be stored in a
cache rather than pulling data from firebase.
This will avoid a flicker or any delays in rendering.

We are going to create a cache
and a pending cache.

We are going to store the users
in the cache and set the state
with it. We are going to tell
useEffect that if we do have
a doc, just return out of here. We are going to read it from
the cache.

**_Please refer the useDocWithCache.js for the code_**

We are also going to have a pendingCache.

- We are going to check if we have the user in the
  cache
- We also want to figure out what our promise should be
- We are going to check if our promise is in the pending[path].
- When a new request for a user comes in, it's
  not going to be in the cache. When the second
  request comes in for a new user, it's going
  to check if a promise is pending in the pendingCache. We do not
  want to set data on an unmounted component.

# use Ref

When we have a chatroom with a lot of messages,
we have to scroll down to see a new message come in.

To create side effect like a scroll is what **_useEffect_** is actually designed
for.

We put a ref on the messages component called
scrollerRef. A ref is is just somewhere
to hang onto a value.
React is going to create an actual DOM element
and ref is a reference to that.

# Managing the smooth Scroll

In the ChatScroller Component, we use
an **_useEffect_**

```javascript
useEffect(() => {
	if (shouldScrollRef.current) {
		const node = ref.current;
		node.scrollTop = node.scrollHeight;
	}
}, []);
```

We only want to scroll when we are
at the bottom of the screen. We can use refs
for DOM elements and then we can use
ref for something that is stateful.

```javascript
function ChatScroller(props) {
	const ref = useRef();
	const shouldScrollRef = useRef(true);

	useEffect(() => {
		if (shouldScrollRef.current) {
			const node = ref.current;
			node.scrollTop = node.scrollHeight;
		}
	}, []);
	const handleScroll = () => {
		const node = ref.current;
		const { scrollTop, clientHeight, scrollHeight } = node;
		const atBottom = scrollHeight === clientHeight + scrollTop;
		shouldScrollRef.current = atBottom;
	};

	return <div {...props} ref={ref} onScroll={handleScroll} />;
}
```

# Queries in Firebase

We want to display the users according to the chatrooms
they are currently participating in.
Here is a peek in firebase to see Ryan proceeds to do this.

Now when we fetch the users from usecollection, we want
to query it as per channels.channelId.

```javascript
function Members({ channelId }) {
	useEffect(() => {
		db.collection('users')
			.where(`channels.${channelId}`, '==', true)
			.onSnapshot(snapshot => {
				snapshot.forEach(doc => {
					console.log(doc.data());
				});
			});
	}, [channelId]);
}
```
