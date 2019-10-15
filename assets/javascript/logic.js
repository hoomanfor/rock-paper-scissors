
var firebaseConfig = {
    apiKey: "AIzaSyANX0fArKsHQ8T-YgitEKS8W5g081w-hf4",
    authDomain: "rock-paper-scissors-96eaa.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-96eaa.firebaseio.com",
    projectId: "rock-paper-scissors-96eaa",
    storageBucket: "rock-paper-scissors-96eaa.appspot.com",
    messagingSenderId: "613307419599",
    appId: "1:613307419599:web:14a3f235792044e1f220ba"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var connectedRef = firebase.database().ref(".info/connected");
connectedRef.on("value", function(snap) {
  if (snap.val() === true) {
    alert("connected");
  } else {
    alert("not connected");
  }
});

// I need to pick up reading here: 
// https://firebase.google.com/docs/database/web/offline-capabilities?authuser=1
// 

// I need to come up with a plan to Structure my Data. 
// https://firebase.google.com/docs/database/web/structure-data?authuser=1


