var express = require("express"),
    alexa = require("alexa-app"),
    request = require("request"),
    PORT = process.env.PORT || 3000,
    app = express(),
    // Setup the alexa app and attach it to express before anything else.
    alexaApp = new alexa.app("");

//global config
const config = {
  stream: {
    url: "https://wfmt-wowza.streamguys1.com/live/smil:wfmt.smil/playlist.m3u8"
  }
}

// POST calls to / in express will be handled by the app.request() function
alexaApp.express({
  expressApp: app,
  checkCert: true,
  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production.
  debug: true
});

app.set("view engine", "ejs");

function startStream(response) {
    response.audioPlayerPlayStream('REPLACE_ALL', {
    token: config.stream.url,
    url: config.stream.url,
    offsetInMilliseconds: 0
  });
}

alexaApp.launch(function(request, response) {
  console.log("App launched");
  startStream(response);
});

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
      console.log("In play intent");
      startStream(response);
    }
);

alexaApp.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    console.log("Sent cancel response");
  	response.audioPlayerStop();
  	return;
  }
);

alexaApp.intent("AMAZON.PauseIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    console.log("Pausing intent");
  	response.audioPlayerStop();
  	return;
  }
);

alexaApp.intent("AMAZON.ResumeIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    console.log("Resume intent");
    startStream(response);
  	return;
  }
);

alexaApp.intent("AMAZON.StopIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    response.audioPlayerStop();
  	return;
  }
);

alexaApp.sessionEnded(function(request, response) {
  console.log("In sessionEnded");
  console.error('Alexa ended the session due to an error');
});

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
