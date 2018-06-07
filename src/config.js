//Global config/helpers

const fetch = require('node-fetch');

module.exports = {
  errorResponse: function(response) {
    response.say("Sorry, something went wrong! Try again later.");
  },
  notSupportedResponse: function(response) {
    response.say("Sorry, I can't do that for a live stream.")
  },
  stream: {
    url: "https://wfmt-wowza.streamguys1.com/live/smil:wfmt.smil/playlist.m3u8",
    start: function(response) {
      response.audioPlayerPlayStream('REPLACE_ALL', {
          token: module.exports.stream.url,
          url: module.exports.stream.url,
          offsetInMilliseconds: 0,
          metadata: {
            title: 'Live on WFMT',
            art: module.exports.schedule.art
          }
      });
    }
  },
  schedule: {
    url: "https://clients.webplaylist.org/cgi-bin/wfmt/wonV2.json",
    art: {
      image: {
        "contentDescription": "WFMT logo",
        "sources": [
          {
            //480x320
            "url": "https://www.wfmt.com/wp-content/uploads/2018/06/wfmt-alexa_x-sm.png",
            "size": "X_SMALL"
          }, {
            //720x480
            "url": "https://www.wfmt.com/wp-content/uploads/2018/06/wfmt-alexa_sm.png",
            "size": "SMALL",
          }, {
            //960x640
            "url": "https://www.wfmt.com/wp-content/uploads/2018/06/wfmt-alexa_md.png",
            "size": "MEDIUM",
          }, {
            //1200x800
            "url": "https://www.wfmt.com/wp-content/uploads/2018/06/wfmt-alexa_lg.png",
            "size": "LARGE",
          }, {
            //1920x1280
            "url": "https://www.wfmt.com/wp-content/uploads/2018/06/wfmt-alexa_x-lg.png",
            "size": "X_LARGE",
          },
        ]
      }
    },
    getOnNow: function() {
      var onNow = {};

      return fetch(module.exports.schedule.url).then((json) => {
        return json.json()
      }).then((json) => {
        onNow.title = json.track.title;
        onNow.subtitle = json.track.composer;
        onNow.show = json.show.title;

        return onNow;
      }).catch((ex) => {
        return new Error(ex);
      });
    }
  }
}
