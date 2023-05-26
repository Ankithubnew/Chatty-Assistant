const express = require("express");
const cors = require("cors");
const axios= require("axios");
const openAi=require("openai")
const mongoose= require("mongoose")
require("dotenv").config();

const app = express();
const PORT = 3002;
const {Configuration,OpenAIApi}=openAi;
app.use(cors());

app.use(express.json());
app.use(express.static("public"));
const config=new Configuration({apiKey:process.env.OpenAi_Api})
const ai=new OpenAIApi(config);

const UserSchema=new mongoose.Schema({
  userId: { type: String, required: true, unique:true },
  credits: { type: Number, default: 5 },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  payload: {
    type: String
  },
  promoapply: { type: Number, default: 0 }
})
const User= mongoose.model("User",UserSchema);

app.get('/webhook', (req, res) => {
    const { query } = req;
    const challenge = req.query['hub.challenge'];
    const verify_token = req.query['hub.verify_token'];
    const hubmode = req.query['hub.mode'];
    // const { hub.mode, hub.verify_token, hub.challenge } = query;
    console.log(query);
  
    if (hubmode === 'subscribe' && verify_token === process.env.FB2_Token) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403); 
    }
  });

app.post("/webhook",async (req,res)=>{
  let body =req.body;
  console.log(body);
  if(body.object==="page"){
    const webhookEvent=body.entry[0].messaging[0];
    console.log("webhook"+webhookEvent);
    const senderId=webhookEvent.sender.id;
    //const queryMsg=webhookEvent.message.text;
    console.log("sender"+senderId);

    let user=await User.findOne({userId:senderId})
    if(!user){
      await User.create({userId:senderId,credits:5,payload:"CHAT_PAYLOAD"});
      user=await User.findOne({userId:senderId})
      console.log("user"+user);
    }
    if(user){
      console.log(user);
      if(user.credits>0){
        await User.updateOne({ userId: senderId }, { $inc: { credits: -1 } });
        //it is calling repeatidly if credit is greater than 0
        if(webhookEvent.postback && webhookEvent.postback.payload){
          console.log("payload called")
          let payload=webhookEvent.postback.payload;
          console.log(payload);
          if (payload === 'CHAT_PAYLOAD') {
            const upd=await User.findOneAndUpdate({userId:senderId},{payload:payload},{new:true})
            console.log(upd);
            sendMessage(senderId, 'You have selected to chat with AI Assistant. Please start typing your message.');
          } else if (payload === 'GENERATE_IMAGES_PAYLOAD') {
            const upd=await User.findOneAndUpdate({userId:senderId},{payload:payload},{new:true})
            console.log(upd);
            sendMessage(senderId, 'You have selected to generate images with prompts. Please provide a prompt for image generation.');
          } else if (payload === 'GENERATE_IDENTITY_PAYLOAD') {
            const upd=await User.findOneAndUpdate({userId:senderId},{payload:payload},{new:true})
            console.log(upd);
            sendMessage(senderId, 'You have selected to Number Search Program. Please provide a number for search.');
          } else if (payload === 'GENERATE_CREDIT_PAYLOAD') {
            const upd=await User.findOneAndUpdate({userId:senderId},{payload:payload},{new:true})
            console.log(upd);
            sendMessage(senderId, `You have selected to add more credit to this account.You have ${user.credits} left. Please provide a promocode for more credit.`);
          }
           else {
             const upd=await User.findOneAndUpdate({userId:senderId},{payload:payload},{new:true})
             console.log(upd);
            sendMessage(senderId, payload);
          }
        }else{
          const queryMsg=webhookEvent.message.text
          user=await User.findOne({userId:senderId});
          console.log(user.payload);
          console.log("payload with msg called")
          console.log(queryMsg);
          if(queryMsg){
            if (user.payload === 'CHAT_PAYLOAD') {
              console.log("payload with msg called2")
              handleAimsg(senderId,queryMsg);
            } else if (user.payload === 'GENERATE_IMAGES_PAYLOAD') {
              handleAimsg(senderId,queryMsg);
            } else if (user.payload === 'GENERATE_IDENTITY_PAYLOAD') {
              handleAimsg(senderId,queryMsg);
            } else if (user.payload === 'GENERATE_CREDIT_PAYLOAD') {
              handleCredit(senderId,queryMsg);
              //sendMessage(senderId, 'You have selected to add more credit to this account. Please provide a promocode for more credit.');
            }
             else {
              handleAimsg(senderId,queryMsg);
            }
          }
        }
      }else{
        console.log("bug called")
        //it is calling repeatidly if credit is less than 0
        sendMessage(senderId, 'Sorry, you have insufficient credits. Please Choose promo code section to restore your credits.')
      }
    }else{
      sendMessage(senderId, 'User is Not here')
    }

    
  }
  res.status(200).send('EVENT_RECEIVED')
})

async function handleCredit(sender,msg){
  // let user=await User.findOne({userId:sender});
  console.log("credit called")
  let promoobj={
    ptweb09:5,
    ankit:2,
    chatty:1
  }
  let promo=msg.toLowerCase();
  if(promo in promoobj){
    let credit=promoobj[promo]
    await User.findOneAndUpdate({userId:sender},{$inc:{credits:credit}})
    sendMessage(sender,`Promo code ${promo} redeemed successfully! ${credit} credits have been added to your account.`)
  }else{
    sendMessage(sender,'Invalid Promo Code')
  }
}

async function handleAimsg(sender,msg){
  console.log("ai assitant with msg called")
  try {
    const res=await ai.createChatCompletion(
      {
        model:'gpt-3.5-turbo',
        messages: [
            { "role": "system", "content": "You are a helpful assistant.Your name is Chatty Assitant created by Ankit Kumar." },
            { "role": "user", "content": msg }
        ],
        max_tokens:500
      }
    )
    console.log(res.data);
    const resmsg=res.data.choices[0].message.content;
    console.log(resmsg);
    sendMessage(sender,resmsg);

  } catch (error) {
    console.log(error);
  }
}
// handleAimsg(6506533576076061,"who are you");
async function sendMessage(sender,msg){
  console.log("send messege called")
  const reqt=await axios.post('https://graph.facebook.com/v13.0/me/messages', {
    recipient: { id: sender },
    message: { text: msg },
    access_token: process.env.FB_Token,
  });
  console.log("msg sent")
  // console.log(reqt.data);
}

app.get("/",(req,res)=>{
    res.send("welcome");
})




app.listen(PORT, async () => {
  await mongoose.connect(process.env.Mongo_Url)
  console.log(`Server listening on port ${PORT}`);
});
