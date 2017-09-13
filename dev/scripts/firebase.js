 import firebase from 'firebase';

 var config = {
    apiKey: "AIzaSyDmWALZjEa9734ZAfF89IgB3GzYYYZyoes",
    authDomain: "festivalorganizer-5125e.firebaseapp.com",
    databaseURL: "https://festivalorganizer-5125e.firebaseio.com",
    projectId: "festivalorganizer-5125e",
    storageBucket: "festivalorganizer-5125e.appspot.com",
    messagingSenderId: "1904699333"
  };
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase