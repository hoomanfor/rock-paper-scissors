
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

var mContainer = document.getElementById("message-display");

function scrollToBottom() {
  mContainer.scrollTop = mContainer.scrollHeight;
}

function determineWinner() {
  database.ref("players").once("value", function(snapshot) {
    p1Wins = snapshot.val().one.win;
    p2Wins = snapshot.val().two.win;
    p1Losses = snapshot.val().one.loss;
    p2Losses = snapshot.val().two.loss;
    ties = snapshot.val().one.tie;
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
    "<div class='input-container'>" + 
    "<input type='text' class='name-input' name='p1-name'>" +
    "<input type='submit' class='name-submit' id='p1-name-submit'>" +
    "</div>"
  );
}

function p2EnterName() {
  $("#player-two-name").html(
    "Enter Your Name to Play" + 
    "<br>" +
    "<div class='input-container'>" + 
    "<input type='text' class='name-input' name='p2-name'>" +
    "<input type='submit' class='name-submit' id='p2-name-submit'>" +
    "</div>"
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
          } else {
            $("#p1-waiting").html("Waiting for Player 2 to Make a Selection!")
          }
        })
      })
      // database.ref("players/one/selection").once("value", function(snapshot) {
      //   if (snapshot.val() !== "null") {
      //     console.log("cats")
      //     $(document).off("click", "#p1-option")
      //   }
      // })
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
          } else {
            $("#p2-waiting").html("Waiting for Player 1 to Make a Selection!")
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
    $("#sb-p1-name").html(snapshot.val().name);
    $("#p1-win").html(snapshot.val().win);
    $("#p1-tie").html(snapshot.val().tie);
    $("#p1-loss").html(snapshot.val().loss);
    database.ref("players/two").once("value", function(snapshot) {
      if (snapshot.exists()) {
        $("#p2-waiting").html("");
      } else {
        $("#p1-waiting").html("Waiting for Player 2 to Join!");
      }
    })
  } else {
    $("#sb-p1-name").html("Player 1");
  }
})

database.ref("players/two").on("value", function(snapshot) {
  if (snapshot.exists()) {
    $("#player-two-name").html(snapshot.val().name);
    $("#sb-p2-name").html(snapshot.val().name);
    $("#p2-win").html(snapshot.val().win);
    $("#p2-tie").html(snapshot.val().tie);
    $("#p2-loss").html(snapshot.val().loss);
    database.ref("players/one").once("value", function(snapshot) {
      if (snapshot.exists()) {
        $("#p1-waiting").html("");
      } else {
        $("#p2-waiting").html("Waiting for Player 1 to Join!")
      }
    })
  } else {
    $("#sb-p2-name").html("Player 2");
  }
})


database.ref("players").on("value", function(snapshot) {
  if (snapshot.numChildren() === 2) {
    console.log(snapshot.val());
    if (snapshot.val().one.selection !== "null" && snapshot.val().two.selection !== "null") {
      $("figure").css("background-color", "");
    }
    if (snapshot.val().one.selection === "null" && snapshot.val().two.selection !== "null") {
      $("#p1-waiting").html("Player 2 is Waiting for you to Make a Selection!");
    }
    if (snapshot.val().one.selection !== "null" && snapshot.val().two.selection === "null") {
      $("#p2-waiting").html("Player 1 is Waiting for you to Make a Selection!");
    }
    if (snapshot.val().one.selection === "null" && snapshot.val().two.selection === "null") {
      $("#p1-waiting").html("Select Rock, Paper, or Scissors");
      $("#p2-waiting").html("Select Rock, Paper, or Scissors");
    }
    if (snapshot.val().one.selection === "rock" && snapshot.val().two.selection === "rock") {
      $(".banner").html("Tie! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
    }
    if (snapshot.val().one.selection === "paper" && snapshot.val().two.selection === "paper") {
      $(".banner").html("Tie! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
    }
    if (snapshot.val().one.selection === "scissors" && snapshot.val().two.selection === "scissors") {
      $(".banner").html("Tie! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
    }
    if (snapshot.val().one.selection === "rock" && snapshot.val().two.selection === "paper") {
      $(".p1-banner").html("You Lost! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
      $(".p2-banner").html("You Won! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
    }
    if (snapshot.val().one.selection === "rock" && snapshot.val().two.selection === "scissors") {
      $(".p1-banner").html("You Won! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
      $(".p2-banner").html("You Lost! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
    }
    if (snapshot.val().one.selection === "paper" && snapshot.val().two.selection === "rock") {
      $(".p1-banner").html("You Won! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
      $(".p2-banner").html("You Lost! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
    }
    if (snapshot.val().one.selection === "paper" && snapshot.val().two.selection === "scissors") {
      $(".p1-banner").html("You Lost! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
      $(".p2-banner").html("You Won! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
    }
    if (snapshot.val().one.selection === "scissors" && snapshot.val().two.selection === "rock") {
      $(".p1-banner").html("You Lost! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
      $(".p2-banner").html("You Won! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
    }
    if (snapshot.val().one.selection === "scissors" && snapshot.val().two.selection === "paper") {
      $(".p1-banner").html("You Won! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
      $(".p2-banner").html("You Lost! " + snapshot.val().one.name + " selected " + snapshot.val().one.selection + ". " + snapshot.val().two.name + " selected " + snapshot.val().two.selection + ".");
    }
  }
})

database.ref("messages").orderByChild("date_added").on("child_added", function(snapshot) {
  console.log("messages", snapshot.val());
  console.log("")
  var playerMessage = "<div class='message'>" + snapshot.val().name + ": " + snapshot.val().message + "</div>";
  console.log("LOOK!!!!=>", playerMessage);
  $("#message-display").append(playerMessage);
  scrollToBottom();
})

$(document).on("click", "#p1-name-submit", function(event) {
  $("#p2-waiting").html("");
  $(".player-two").css("display", "none");
  $(".banner").addClass("p1-banner");
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
  $(document).on("click", "#message-submit", function(event) {
    event.preventDefault();
    console.log("This Works!");
    console.log("messanger playerOneName", playerOneName)
    var message = $(".message-input").val().trim();
    database.ref("messages").push({
      name: playerOneName,
      message: message,
      date_added: firebase.database.ServerValue.TIMESTAMP
    })
    $(".message-input").val("");
  })
  p1Selector()
  database.ref("players/one").onDisconnect().remove()
});

$(document).on("click", "#p2-name-submit", function(event) {
  $("#p1-waiting").html("");
  $(".player-one").css("display", "none");
  $(".banner").addClass("p2-banner");
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
  $(document).on("click", "#message-submit", function(event) {
    event.preventDefault();
    console.log("This Works!");
    console.log("messanger playerTwoName", playerTwoName)
    var message = $(".message-input").val().trim();
    database.ref("messages").push({
      name: playerTwoName,
      message: message,
      date_added: firebase.database.ServerValue.TIMESTAMP
    })
    $(".message-input").val("");
  })
  p2Selector()
  database.ref("players/two").onDisconnect().remove()
});




