
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

var p1Wins = 0
var p2Wins = 0;
var p1Losses = 0
var p2Losses = 0
var ties = 0;

function determineWinner() {
  database.ref("players").once("value", function(snapshot) {
    p1Wins = snapshot.val().one.win;
    p2Wins = snapshot.val().two.win;
    p1Losses = snapshot.val().one.loss;
    p2Losses = snapshot.val().two.loss;
    ties = snapshot.val().one.tie;
    $("figure").css("background-color", "");
    console.log("snapshot.val()", snapshot.val());
    var playerOneSelection = snapshot.val().one.selection;
    console.log("TEST!1", playerOneSelection);
    var playerTwoSelection = snapshot.val().two.selection;
    console.log("TEST!2", playerTwoSelection);
    if (playerOneSelection === "rock" && playerTwoSelection === "rock") {
      tie()
      clearSelection()
      console.log("Rock & Rock = Tie")
    } else if (playerOneSelection === "paper" && playerTwoSelection === "paper") {
      tie()
      clearSelection()
      console.log("Paper & Paper = Tie")
    } else if (playerOneSelection === "scissors" && playerTwoSelection === "scissors") {
      tie()
      clearSelection()
      console.log("Scissors & Scissors = Tie")
    } else if (playerOneSelection === "rock" && playerTwoSelection === "scissors") {
      p1Win()
      clearSelection()
      console.log("rock & scissors = Player One Wins!")
    } else if (playerOneSelection === "rock" && playerTwoSelection === "paper") {
      p2Win()
      clearSelection()
      console.log("rock & paper = Player Two Wins!")
    } else if (playerOneSelection === "scissors" && playerTwoSelection === "rock") {
      p2Win()
      clearSelection()
      console.log("scissors & rock = Player Two Wins!")
    } else if (playerOneSelection === "scissors" && playerTwoSelection === "paper") {
      p1Win()
      clearSelection()
      console.log("scissors & paper = Player One Wins!")
    } else if (playerOneSelection === "paper" && playerTwoSelection === "rock") {
      p1Win()
      clearSelection()
      console.log("paper & rock = Player One Wins!")
    } else if (playerOneSelection === "paper" && playerTwoSelection === "scissors") { 
      p2Win()
      clearSelection()
      console.log("paper & scissors = Player Two Wins!")
    } else {
      console.log("I don't know!")
    }
  })
}

function p1EnterName() {
  $("#player-one-name").html(
    "Enter Your Name to Play" + 
    "<br>" +
    "<input type='text' class='name-input' name='p1-name'>" +
    "<br>" +
    "<input type='submit' class='name-submit' id='p1-name-submit'>"
  );
}

function p2EnterName() {
  $("#player-two-name").html(
    "Enter Your Name to Play" + 
    "<br>" +
    "<input type='text' class='name-input' name='p2-name'>" +
    "<br>" +
    "<input type='submit' class='name-submit' id='p2-name-submit'>"
  );
}

function clearSelection() {
  database.ref("players/one").update({
    selection: "null"
  });
  database.ref("players/two").update({
    selection: "null"
  });
}

function tie() {
  ties++;
  database.ref("players/one").update({
    tie: ties
  });
  database.ref("players/two").update({
    tie: ties
  });
}

function p1Win() {
  p1Wins++;
  p2Losses++;
  database.ref("players/one").update({
    win: p1Wins
  })
  database.ref("players/two").update({
    loss: p2Losses
  })
}

function p2Win() {
  p2Wins++;
  p1Losses++;
  database.ref("players/one").update({
    loss: p1Losses
  })
  database.ref("players/two").update({
    win: p2Wins
  })
}

function p1Selector() {
  database.ref("players/one").once("value", function(snapshot) {
    if (snapshot.exists()) {
      $("#player-one-name").html(snapshot.val().name);
      $(document).on("click", "#p1-option", function(event) {
        var selection = $(this);
        $(this).css("background-color", "green");
        selection = selection[0].children[0].alt;
        console.log("selection", selection);
        database.ref("players/one").update({
          name: snapshot.val().name,
          selection: selection
        })
        database.ref("players/two/selection").once("value", function(snapshot) {
          if (snapshot.val() !== "null") {
            determineWinner()
          }
        })
      })
    }
  })
}

function p2Selector() {
  database.ref("players/two").once("value", function(snapshot) {
    if (snapshot.exists()) {
      $("#player-two-name").html(snapshot.val().name);
      $(document).on("click", "#p2-option", function(event) {
        var selection = $(this);
        $(this).css("background-color", "green");
        selection = selection[0].children[0].alt;
        console.log("selection", selection);
        database.ref("players/two").update({
          name: snapshot.val().name,
          selection: selection
        })
        database.ref("players/one/selection").once("value", function(snapshot) {
          if (snapshot.val() !== "null") {
            determineWinner()
          }
        })
      })
    }
  })
}

p1Selector()
p2Selector()

database.ref("players/one").on("value", function(snapshot) {
  if (!snapshot.exists()) {
    console.log("No Player One!");
    $("#p1-win").html("0");
    $("#p1-tie").html("0");
    $("#p1-loss").html("0");
    p1EnterName()
  }
})

database.ref("players/two").on("value", function(snapshot) {
  if (!snapshot.exists()) {
    console.log("No Player Two!");
    $("#p2-win").html("0");
    $("#p2-tie").html("0");
    $("#p2-loss").html("0");
    p2EnterName()
  }
})

database.ref("players/one").on("value", function(snapshot) {
  if (snapshot.exists()) {
    $("#player-one-name").html(snapshot.val().name);
    $("#p1-win").html(snapshot.val().win);
    $("#p1-tie").html(snapshot.val().tie);
    $("#p1-loss").html(snapshot.val().loss);
    database.ref("players/two").on("value", function(snapshot) {
      if (snapshot.exists()) {
        $("#p2-waiting").html("");
      } else {
        $("#p1-waiting").html("Waiting for Player 2 to Join!")
      }
    })
  }
})

database.ref("players/two").on("value", function(snapshot) {
  if (snapshot.exists()) {
    $("#player-two-name").html(snapshot.val().name);
    $("#p2-win").html(snapshot.val().win);
    $("#p2-tie").html(snapshot.val().tie);
    $("#p2-loss").html(snapshot.val().loss);
    database.ref("players/one").on("value", function(snapshot) {
      if (snapshot.exists()) {
        $("#p1-waiting").html("");
      } else {
        $("#p2-waiting").html("Waiting for Player 1 to Join!")
      }
    })
  }
})

// database.ref("players").on("value", function(snapshot) {
//   if (snapshot.exists()) {
//     console.log("LOOK HERE =>", snapshot.key);
//   }
// })


$(document).on("click", "#p1-name-submit", function(event) {
  $("#p2-waiting").html("");
  event.preventDefault();
  console.log("This Works!");
  var playerOneName = $("[name*='p1-name']").val().trim(); 
  console.log("playerOneName", playerOneName);
  database.ref("players/one").set({
    name: playerOneName,
    selection: "null",
    win: 0,
    tie: 0,
    loss: 0
  })
  p1Selector()
  database.ref("players/one").onDisconnect().remove()
});

$(document).on("click", "#p2-name-submit", function(event) {
  $("#p1-waiting").html("");
  event.preventDefault();
  console.log("This Works!");
  var playerTwoName = $("[name*='p2-name']").val().trim(); 
  console.log("playerTwoName", playerTwoName);
  database.ref("players/two").set({
    name: playerTwoName,
    selection: "null",
    win: 0,
    tie: 0,
    loss: 0
  })
  p2Selector()
  database.ref("players/two").onDisconnect().remove()
});






// ----
// database.ref("players/two").on("value", function(snapshot) {
//   if (snapshot.exists()) {
//     $("#p2-waiting").html("");
//   } else {
//     $("#p1-waiting").html("Waiting for 'Player 2'");
//   }
// })
// ----

// ----
// database.ref(".info/connected").once("value", function(snapshot) {
//   if (snapshot.val()) {
//     var con = database.ref("connections").push({
//       name: playerTwoName
//     })
//     con.onDisconnect().remove()
//   }
// })
// ----

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


