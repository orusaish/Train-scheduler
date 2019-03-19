var config = {
  apiKey: "AIzaSyDGDQ8KNTE9SKf9ybD6jo_S1owrMcOQrnM",
  authDomain: "spongebob1993-f79df.firebaseapp.com",
  databaseURL: "https://spongebob1993-f79df.firebaseio.com",
  projectId: "spongebob1993-f79df",
  storageBucket: "spongebob1993-f79df.appspot.com",
  messagingSenderId: "141196884592"
};
firebase.initializeApp(config);
var database = firebase.database();
var currentTime = moment();

datetime = null;
date = null;
var update = function() {
  date = moment(new Date());
  datetime.html(date.format("dddd, MMMM Do YYYY, h:mm:ss a"));
};
$(document).ready(function() {
  event.preventDefault();
  datetime = $("#current-status");
  update();
  setInterval(update, 1000);

  $("#add-train").on("click", function() {
    event.preventDefault();
    var Train = $("#Tname")
      .val()
      .trim();

    var Dest = $("#Tdestination")
      .val()
      .trim();

    var Time = $("#train-time")
      .val()
      .trim();

    var frequency = $("#frequency")
      .val()
      .trim();

    var firstTimeConverted = moment(Time, "hh:mm").subtract(1, "days");
    console.log("FTC: " + firstTimeConverted);

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var minutesAway = frequency - tRemainder;
    console.log("Minutes away: " + minutesAway);
    var nextTrain = moment().add(minutesAway, "minutes");
    var nextArrival = moment(nextTrain).format("hh:mm a");
    console.log(minutesAway);
    database.ref().push({
      trainName: Train,
      Destination: Dest,
      FirstTrainTime: Time,
      Frequency: frequency,
      NextTrain: nextArrival,
      MinutesAway: minutesAway,
      dateEntered: firebase.database.ServerValue.TIMESTAMP
    });
    alert("form submitted");

    return false;
  });
  database
    .ref()
    .orderByChild("dateEntered")
    .limitToLast(25)
    .on(
      "child_added",
      function(snapshot) {
        $("#new-train").append(
          "<tr><td>" +
            snapshot.val().trainName +
            "</td>" +
            "<td>" +
            snapshot.val().Destination +
            "</td>" +
            "<td>" +
            "every " +
            snapshot.val().Frequency +
            " minutes" +
            "</td>" +
            "<td>" +
            snapshot.val().NextTrain +
            "</td>" +
            "<td>" +
            snapshot.val().MinutesAway +
            " minutes Away" +
            "</td></tr>"
        );
      },
      function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      }
    );
});
