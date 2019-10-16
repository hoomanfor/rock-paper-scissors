
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

$("#p1-name-submit").on("click", function(event) {
  event.preventDefault();
  console.log("This Works!");
  var playerOneName = $("[name*='p1-name']").val().trim(); 
  console.log("playerOneName", playerOneName);
  database.ref("players/one").set({
    name: playerOneName,
    selection: ""
  });
  $("[name*='p1-name']").val("SUBMITTED");

  $("figure").on("click", function(event) {
    var selection = $(this);
    selection = selection[0].children[0].alt;
    database.ref("players/one").set({
      name: playerOneName,
      selection: selection
    });
  });
});

// database.ref(".info/connected").on("value", function(snapshot) {

//   console.log("snapshot.val()", snapshot.val());
//   if (snapshot.val() == true) {
//     database.ref("players").push({
//       name: "Hooman"
//     })
//   } else {
//     console.log("Not Connected")
//   }
// })

// I need to pick up reading here: 
// https://firebase.google.com/docs/database/web/offline-capabilities?authuser=1
// 

// I need to come up with a plan to Structure my Data. 
// https://firebase.google.com/docs/database/web/structure-data?authuser=1


