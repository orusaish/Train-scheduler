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
var Train = "";
var Dest = "";
var Time = "";
var frequency = 0;

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
    Train = $("#Tname")
      .val()
      .trim();

    Dest = $("#Tdestination")
      .val()
      .trim();

    Time = $("#train-time")
      .val()
      .trim();

    frequency = $("#frequency")
      .val()
      .trim();

    database.ref().push({
      trainName: Train,
      Destination: Dest,
      FirstTrainTime: Time,
      Frequency: frequency,
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
        var firstTimeConverted = moment(
          snapshot.val().FirstTrainTime,
          "hh:mm"
        ).subtract(1, "days");
        console.log("FTC: " + firstTimeConverted);

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("Difference in time: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % snapshot.val().Frequency;
        console.log(tRemainder);

        // Minute Until Train
        var minutesAway = snapshot.val().Frequency - tRemainder;
        console.log("Minutes away: " + minutesAway);
        var nextTrain = moment().add(minutesAway, "minutes");
        var nextArrival = moment(nextTrain).format("hh:mm a");
        console.log(minutesAway);
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
            nextArrival +
            "</td>" +
            "<td>" +
            minutesAway +
            " minutes Away" +
            "</td></tr>"
        );
      },
      function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      }
    );
});
