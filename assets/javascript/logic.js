
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

function determineWinner() {
  database.ref("players").once("value", function(snapshot) {
    console.log("snapshot.val()", snapshot.val());
    var playerOneSelection = snapshot.val().one.selection;
    console.log("TEST!1", playerOneSelection);
    var playerTwoSelection = snapshot.val().two.selection;
    console.log("TEST!2", playerTwoSelection);
    if (playerOneSelection === "rock" && playerTwoSelection === "rock") {
      console.log("Rock & Rock = Tie")
    } else if (playerOneSelection === "paper" && playerTwoSelection === "paper") {
      console.log("Paper & Paper = Tie")
    } else if (playerOneSelection === "scissors" && playerTwoSelection === "scissors") {
      console.log("Scissors & Scissors = Tie")
    } else if (playerOneSelection === "rock" && playerTwoSelection === "scissors") {
      console.log("rock & scissors = Player One Wins!")
    } else if (playerOneSelection === "rock" && playerTwoSelection === "paper") {
      console.log("rock & paper = Player Two Wins!")
    } else if (playerOneSelection === "scissors" && playerTwoSelection === "rock") {
      console.log("scissors & rock = Player Two Wins!")
    } else if (playerOneSelection === "scissors" && playerTwoSelection === "paper") {
      console.log("scissors & paper = Player One Wins!")
    } else if (playerOneSelection === "paper" && playerTwoSelection === "rock") {
      console.log("paper & rock = Player One Wins!")
    } else if (playerOneSelection === "paper" && playerTwoSelection === "scissors") {
      console.log("paper & scissors = Player Two Wins!")
    } else {
      console.log("I don't know!")
    }
  })
}

database.ref("players/one").on("value", function(snapshot) {
  if (snapshot.exists()) {
    if (snapshot.val().name !== "null") {
      $("#player-one-name").html(snapshot.val().name);
      $(document).on("click", "#p1-option", function(event) {
        var selection = $(this);
        $(this).css("background-color", "green");
        selection = selection[0].children[0].alt;
        console.log("selection", selection);
        database.ref("players/one").set({
          name: snapshot.val().name,
          selection: selection
        })
      })
    } 
  }
})

database.ref("players/two").on("value", function(snapshot) {
  if (snapshot.exists()) {
    if (snapshot.val().name !== "null") {
      $("#player-two-name").html(snapshot.val().name);
      $(document).on("click", "#p2-option", function(event) {
        var selection = $(this);
        $(this).css("background-color", "green");
        selection = selection[0].children[0].alt;
        console.log("selection", selection);
        database.ref("players/two").set({
          name: snapshot.val().name,
          selection: selection
        })
        determineWinner()
      })
    } 
  }
})

$("#p1-name-submit").on("click", function(event) {
  event.preventDefault();
  console.log("This Works!");
  var playerOneName = $("[name*='p1-name']").val().trim(); 
  console.log("playerOneName", playerOneName);
  database.ref("players/one").set({
    name: playerOneName
  })
  database.ref("players/two").once("value", function(snapshot) {
    if (snapshot.exists()) {
      $("#p2-waiting").html("");
    } else {
      $("#p1-waiting").html("Waiting for 'Player 2'");
    }
  })
});

$("#p2-name-submit").on("click", function(event) {
  event.preventDefault();
  console.log("This Works!");
  var playerTwoName = $("[name*='p2-name']").val().trim(); 
  console.log("playerTwoName", playerTwoName);
  database.ref("players/two").set({
    name: playerTwoName
  })
  database.ref("players/one").once("value", function(snapshot) {
    if (snapshot.exists()) {
      $("#p1-waiting").html("");
    } else {
      $("#p2-waiting").html("Waiting for 'Player 1'");
    }
  })
});


// database.ref("players").onDisconnect().remove()

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

// I need to come up with a plan to Structure my Data. 
// https://firebase.google.com/docs/database/web/structure-data?authuser=1


