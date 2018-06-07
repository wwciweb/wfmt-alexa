const express = require("express"),
    alexa = require("alexa-app"),
    request = require("request"),
    fetch = require('node-fetch'),
    PORT = process.env.PORT || 3000,
    app = express(),
    // Setup the alexa app and attach it to express before anything else.
    alexaApp = new alexa.app(""),
    //import global config/helper object
    wfmt = require('./config.js');

app.set("view engine", "ejs");

// POST calls to / in express will be handled by the app.request() function
alexaApp.express({
  expressApp: app,
  checkCert: true,
  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production.
  debug: false
});

alexaApp.launch(function(request, response) {
  console.log("App launched");
  wfmt.stream.start(response);
});

alexaApp.sessionEnded(function(request, response) {
  console.log("In sessionEnded");
  console.error('Alexa ended the session due to an error');
});

//Intents
alexaApp.intent("stream", {
    "slots": {},
    "utterances": [
      "stream",
      "start",
      "open",
      "play",
      "play the wfmt stream",
      "start the wfmt stream",
      "open the wfmt stream",
      "open the wfmt live stream",
      "open wfmt",
      "start the wfmt live stream",
      "play wfmt",
      "stream wfmt"
    ]
  }, function(request, response) {
      console.log("In stream intent");
      wfmt.stream.start(response);
});

alexaApp.intent("whats_on", {
    "slots": {},
    "utterances": [
      "what is this track",
      "what is this song",
      "which track is this",
      "what track is this",
      "which song is this",
      "what song is this",
      "what's playing",
      "what's currently playing",
      "current song",
      "current track",
      "currently playing",
      "what's on",
      "what's on now",
      "what's on right now",
      "what's playing now",
      "what's playing right now"
    ]
  }, function(req, response) {
    console.log("In what's on intent");

    return wfmt.schedule.getOnNow().then((data) => {
      response.say('Now playing ' + data.title + " by " + data.subtitle + " on " + data.show);
    });
});

alexaApp.intent("previous_track", {
    "slots": {},
    "utterances": [
      "what just played",
      "what was just on",
      "what was the previous track",
      "what was the last track",
      "what was the previous song",
      "what was the last song",
      "what song was that",
      "what track was that",
      "previous track",
      "previous song"
    ]
  }, function(req, response) {
    console.log("In previous track intent");

    return fetch(wfmt.schedule.url).then((json) => {
      return json.json()
    }).then((json) => {
      var previousTrack = "The previous song was " + json.prev_track[0].title + " by " + json.prev_track[0].composer;
      response.say(previousTrack);
    }).catch((ex) => {
      wfmt.errorResponse(response);
    });
});

alexaApp.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": [
      'stop',
      'cancel',
      'stop playing',
      'cancel playing'
    ]
  }, function(request, response) {
    console.log("In cancel intent");
    response.audioPlayerStop();
    return;
});

alexaApp.intent("AMAZON.PauseIntent", {
    "slots": {},
    "utterances": [
      'pause'
    ]
  }, function(request, response) {
    console.log("In pause intent");
    response.audioPlayerStop();
    return;
});

alexaApp.intent("AMAZON.ResumeIntent", {
    "slots": {},
    "utterances": [
      'resume',
      'start playing again'
    ]
  }, function(request, response) {
    console.log("In resume intent");
    wfmt.stream.start(response);
    return;
});

alexaApp.intent("AMAZON.StopIntent", {
    "slots": {},
    "utterances": [
      'stop',
      'cancel',
      'stop playing',
      'cancel playing'
    ]
  }, function(request, response) {
    console.log("In stop intent");
    response.audioPlayerStop();
    return;
});

alexaApp.intent("AMAZON.LoopOffIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    wfmt.notSupportedResponse(response);
    return;
});

alexaApp.intent("AMAZON.LoopOnIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    wfmt.notSupportedResponse(response);
    return;
});

alexaApp.intent("AMAZON.NextIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    wfmt.notSupportedResponse(response);
    return;
});

alexaApp.intent("AMAZON.PreviousIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    wfmt.notSupportedResponse(response);
    return;
});

alexaApp.intent("AMAZON.RepeatIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    wfmt.notSupportedResponse(response);
    return;
});

alexaApp.intent("AMAZON.ShuffleOffIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    wfmt.notSupportedResponse(response);
    return;
});

alexaApp.intent("AMAZON.ShuffleOnIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    wfmt.notSupportedResponse(response);
    return;
});

alexaApp.intent("AMAZON.StartOverIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    wfmt.notSupportedResponse(response);
    return;
});

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
