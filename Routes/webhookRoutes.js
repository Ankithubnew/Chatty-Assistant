const express = require("express");
const router = express.Router();
const User = require("../Models/User")
const {sendMessage,handleCredit,Truecaller}=require("../Controllers/webhookController")
const {handleAimsg,handleAiImage,getTranscript}=require("../Services/openAiServices")

router.get("/", (req, res) => {
  const challenge = req.query["hub.challenge"];
  const verify_token = req.query["hub.verify_token"];
  const hubmode = req.query["hub.mode"];
  if (hubmode === "subscribe" && verify_token === process.env.FB2_Token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post("/", async (req, res) => {
  let body = req.body;
  if (body.object === "page") {
    const webhookEvent = body.entry[0].messaging[0];
    const senderId = webhookEvent.sender.id;
    let user = await User.findOne({ userId: senderId });
    if (!user) {
      await User.create({
        userId: senderId,
        credits: 5,
        payload: "CHAT_PAYLOAD",
      });
      user = await User.findOne({ userId: senderId });
    }
    if (user) {
      console.log(user);
      if (webhookEvent.postback && webhookEvent.postback.payload) {
        let payload = webhookEvent.postback.payload;
        console.log("Payload is :" + payload);
        if (payload === "CHAT_PAYLOAD") {
          const upd = await User.findOneAndUpdate(
            { userId: senderId },
            { payload: payload },
            { new: true }
          );
          sendMessage(
            senderId,
            "You have selected to chat with AI Assistant. Please start typing your message."
          );
        } else if (payload === "GENERATE_IMAGES_PAYLOAD") {
          const upd = await User.findOneAndUpdate(
            { userId: senderId },
            { payload: payload },
            { new: true }
          );
          sendMessage(
            senderId,
            "You have selected to generate images with prompts. Please provide a prompt for image generation."
          );
        }else if (payload === "GET_STARTED_PAYLOAD") {
          sendMessage(
            senderId,
            "Welcome to Chatty Assistant!\n\nHere are some features:\n- Chat with Ai Assitant\n- Image generation with prompt\n- YouTube video summarization\n- Truecaller integration\n- Credit-based system\n\nGo ahead and try out these exciting features!"
          );
        } else if (payload === "GENERATE_SUMMARY_PAYLOAD") {
          const upd = await User.findOneAndUpdate(
            { userId: senderId },
            { payload: payload },
            { new: true }
          );
          sendMessage(
            senderId,
            "You have selected to YouTube video summerizer Program. Please provide a valid youtube video link for summerize."
          );
        } else if (payload === "GENERATE_IDENTITY_PAYLOAD") {
          const upd = await User.findOneAndUpdate(
            { userId: senderId },
            { payload: payload },
            { new: true }
          );
          sendMessage(
            senderId,
            "You have selected to Number Search Program. Please provide a Valid Indian 10 digit number for search ."
          );
        } else if (payload === "GENERATE_CREDIT_PAYLOAD") {
          const upd = await User.findOneAndUpdate(
            { userId: senderId },
            { payload: payload },
            { new: true }
          );
          sendMessage(
            senderId,
            `You have selected to add more credit to this account.You have ${user.credits} left. Please provide a promocode for more credit.`
          );
        } else {
          const upd = await User.findOneAndUpdate(
            { userId: senderId },
            { payload: payload },
            { new: true }
          );
          sendMessage(senderId, payload);
        }
      } else {
        const queryMsg = webhookEvent.message.text;
        user = await User.findOne({ userId: senderId });
        console.log(queryMsg);
        if (queryMsg) {
          if (user.payload === "CHAT_PAYLOAD" && user.credits > 0) {
            await User.updateOne(
              { userId: senderId },
              { $inc: { credits: -1 } }
            );
            console.log("payload with msg called2");
            handleAimsg(senderId, queryMsg);
          } else if (
            user.payload === "GENERATE_IMAGES_PAYLOAD" &&
            user.credits > 0
          ) {
            await User.updateOne(
              { userId: senderId },
              { $inc: { credits: -1 } }
            );
            handleAiImage(senderId, queryMsg);
          } else if (
            user.payload === "GENERATE_SUMMARY_PAYLOAD" &&
            user.credits > 0
          ) {
            await User.updateOne(
              { userId: senderId },
              { $inc: { credits: -1 } }
            );
            getTranscript(senderId, queryMsg);
          } else if (
            user.payload === "GENERATE_IDENTITY_PAYLOAD" &&
            user.credits > 0
          ) {
            await User.updateOne(
              { userId: senderId },
              { $inc: { credits: -1 } }
            );
            Truecaller(senderId, queryMsg);
          } else if (user.payload === "GENERATE_CREDIT_PAYLOAD") {
            handleCredit(senderId, queryMsg);
          } else {
            sendMessage(
              senderId,
              "Sorry, you have insufficient credits. Please Choose promo code section to restore your credits."
            );
          }
        }
      }
    } else {
      sendMessage(senderId, "User is Not here");
    }
  }
  res.status(200).send("EVENT_RECEIVED");
});
module.exports=router;