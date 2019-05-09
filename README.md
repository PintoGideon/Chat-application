# Cloud Firestore Data Model

1. Collections
2. Documents

Think about Collections as a folder which contains documents.

A users collection could have a document named user with the following attributes

Users---------> User---->

```javascript

{name:"Gideon", channels:{
  'General':true,
  'Messages':[]
}}

```
Now whenever you request for channels, we get the messages array too.
In the Real time database, you get whatever node of the tree you required and all of it's subnodes.

This meant you had to be really careful about how you structured your data. In Firestore, queries are shallow. In Cloud Firestore, queries are shallow. You don't get all of the sub-collections by default

## Tons of notes coming up soon.....









