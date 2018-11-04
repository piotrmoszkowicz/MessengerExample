const express = require("express");
const router = express.Router();

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
      console.log(entry);
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    console.log(body.object);
    res.sendStatus(404);
  }
});

module.exports = router;
