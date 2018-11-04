const express = require("express");
const util = require("util");
const rp = require("request-promise");
const router = express.Router();

const pageAccessToken = "EAAHb40EDXvQBALKqHAhZBlnAOanQzlSw1xmUSsRmkj2s0kIzMwn1XpNDZCrOPtA0L697YXirCll2FQQZAqE80cZA6UUts7GJp5IyUntieAib7snBH9qrvly3tPcZB01H1ZA91I5JJQhdu9AWAV7fHVt9nHaekWN4f4mmWM5i900QZDZD";
const messengerApiUrl = `https://graph.facebook.com/v2.6/me/messages?access_token=${pageAccessToken}`;

function reponse(msg, recipient) {
  const message = {
    text: `Napisałeś do mnie: ${msg}`
  };

  const seenBody = {
    messaging_type: "RESPONSE",
    recipient,
    sender_action: "mark_seen"
  };

  const writingBody = {
    messaging_type: "RESPONSE",
    recipient,
    sender_action: "typing_on"
  };

  const stopWritingBody = {
    messaging_type: "RESPONSE",
    recipient,
    sender_action: "typing_off"
  };

  const replyBody = {
    messaging_type: "RESPONSE",
    recipient,
    message
  };

  const messagesToApi = [
    seenBody,
    writingBody,
    stopWritingBody,
    replyBody
  ];

  messagesToApi.forEach((body, index) => {
    setTimeout(async () => {
      const requestOptions = {
        method: "POST",
        uri: messengerApiUrl,
        body,
        json: true
      };

      try {
        const result = await rp(requestOptions);
        console.info(result);
      } catch (err) {
        console.error(err);
      }
    }, (index+1) * 1500);
  })
}

/* GET Webook. */
router.get("/message", (req, res) => {
  let VERIFY_TOKEN = "331c6883dd6010864b7ead130be77cd5";

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

/* POST Webook. */
router.post("/message", (req, res) => {
  let body = req.body;
  
  if (body.object === "page") {

    body.entry.forEach(function(entry) {
      // let webhook_event = entry.messaging[0];

      reponse(entry.messaging[0].message.text, entry.messaging[0].sender);
      
      console.log(util.inspect(entry, showHidden = false, depth = 5, colorize = true));
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    console.log(body.object);
    res.sendStatus(404);
  }
});

module.exports = router;
