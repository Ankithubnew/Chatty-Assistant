const express = require("express");
const cors = require("cors");
const axios= require("axios");
const openAi=require("openai")
const mongoose= require("mongoose")
const transcript= require("youtube-transcript")
require("dotenv").config();

const app = express();
const PORT = 3002;
const {YoutubeTranscript} = transcript;
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
          //sendMessage(senderId, 'You have selected to Number Search Program. Please provide a number for search.');
          sendMessage(senderId, 'You have selected to YouTube video summerizer Program. Please provide a valid youtube video link for summerize.');
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
          if (user.payload === 'CHAT_PAYLOAD' && user.credits>0) {
            await User.updateOne({ userId: senderId }, { $inc: { credits: -1 } });
            console.log("payload with msg called2")
            handleAimsg(senderId,queryMsg);
          } else if (user.payload === 'GENERATE_IMAGES_PAYLOAD' && user.credits>0) {
            await User.updateOne({ userId: senderId }, { $inc: { credits: -1 } });
            handleAiImage(senderId,queryMsg);
          } else if (user.payload === 'GENERATE_IDENTITY_PAYLOAD' && user.credits>0) {
            await User.updateOne({ userId: senderId }, { $inc: { credits: -1 } });
            getTranscript2(senderId,queryMsg);
          } else if (user.payload === 'GENERATE_CREDIT_PAYLOAD') {
            handleCredit(senderId,queryMsg);
            //sendMessage(senderId, 'You have selected to add more credit to this account. Please provide a promocode for more credit.');
          }
           else {
            // handleAimsg(senderId,queryMsg);
            sendMessage(senderId, 'Sorry, you have insufficient credits. Please Choose promo code section to restore your credits.')
          }
        }
      }
    }else{
      sendMessage(senderId, 'User is Not here')
    }

    
  }
  res.status(200).send('EVENT_RECEIVED')
})

async function handleCredit(sender,msg){
  // let user=await User.findOne({userId:sender});
  // console.log("credit called")
  let promoobj={
    ptweb09:5,
    ankit:2,
    chatty:1
  }
  let promo=msg.toLowerCase();
  if(promo in promoobj){
    let credit=promoobj[promo]
    console.log("promo match")
    await User.findOneAndUpdate({userId:sender},{$inc:{credits:credit}})
    console.log("promo updated")
    sendMessage(sender,`Promo code ${promo} redeemed successfully! ${credit} credits have been added to your account.`)
  }else{
    sendMessage(sender,'Invalid Promo Code')
  }
}

async function handleAiImage(sender,prompt){
  // size: '512x512' size: '1024x1024
  console.log("handle ai image called")
  try {
    let res=await ai.createImage(
      {
        prompt,
        n:1,
        size: '512x512'
      }
    )
    console.log(res.data.data[0].url);
    sendImage(sender,res.data.data[0].url);
  } catch (error) {
    console.log(error)
  }
}


// handleAiImage(6506533576076061,"a blue sky with lots of beautiful stars")

async function handleAimsg(sender,msg){
  console.log("ai assitant with msg called")
  try {
    let res=await ai.createChatCompletion(
      {
        model:'gpt-3.5-turbo',
        messages: [
            { "role": "system", "content": "You are a helpful assistant.Your name is Chatty Assitant created by Ankit Kumar." },
            { "role": "user", "content": msg }
        ],
        max_tokens:500
      }
    )
    if(!res.data.choices[0]){
      console.log("msg genrate from ai2")
      res=await ai.createChatCompletion(
        {
          model:'gpt-3.5-turbo',
          messages: [
              { "role": "system", "content": "You are a helpful assistant.Your name is Chatty Assitant created by Ankit Kumar." },
              { "role": "user", "content": msg }
          ],
          max_tokens:500
        }
      )
    }
    console.log("ai genrate the msg")
    console.log(res.data);
    const resmsg=res.data.choices[0].message.content;
    console.log(resmsg);
    // await User.updateOne({ userId: senderId }, { $inc: { credits: -1 } });
    sendMessage(sender,resmsg);

  } catch (error) {
    console.log(error);
  }
}
// handleAimsg(6506533576076061,"who are you");
async function sendMessage(sender,msg){
  console.log("send messege called")
  console.log("sendmsg"+msg)
  // console.log("msg sent")
  try {
    let reqt=await axios.post('https://graph.facebook.com/v13.0/me/messages', {
        recipient: { id: sender },
        message: { text: msg },
        access_token: process.env.FB_Token,
      });
    console.log("msg sent from 1")
    if(!reqt.data){
      reqt=await axios.post('https://graph.facebook.com/v13.0/me/messages', {
        recipient: { id: sender },
        message: { text: msg },
        access_token: process.env.FB_Token,
      });
      console.log("msg sent from 2")
    }
    console.log("finally msg sent")

  } catch (error) {
    console.log("Error:")
    console.log(error)
  }

}


async function sendImage(sender,url){
  console.log("send image called")
  console.log("sendmsg"+url)
  let reqt=await axios.post('https://graph.facebook.com/v13.0/me/messages', {
    recipient: { id: sender },
    message: { attachment: { type:'image',payload: {url:url,is_reusable:true}} },
    access_token: process.env.FB_Token,
  });
  if(!reqt.data){
      reqt=await axios.post('https://graph.facebook.com/v13.0/me/messages', {
      recipient: { id: sender },
      message: { attachment: { type:'image',payload: {url:url,is_reusable:true}} },
      access_token: process.env.FB_Token,
    });
  }
  console.log("img  sent")
  console.log(reqt.data);
}
// sendImage(6506533576076061,"http://www.wheelermagnet.com/images/png/20th%20anniv.png")

async function getTranscript(sender,link){
  try {
    console.log("transcript start")
    let res=await YoutubeTranscript.fetchTranscript(link);
    // console.log(res);
    let ts=res.map(line => line.text).join(' ')
    // console.log(ts);
    console.log("transcript done")
    SummerizeIt(sender,ts);
  } catch (error) {
    console.log(error)
  }
}

async function SummerizeIt(sender,msg){
  try {
    console.log("summerize start")
    let res=await ai.createChatCompletion(
      {
        model:'gpt-3.5-turbo',
        messages: [
            { "role": "system", "content": "Summerize this youtube video with title" },
            { "role": "user", "content": msg }
        ],
        max_tokens:500
      }
    )
    console.log("summerize done")
    const resmsg=res.data.choices[0].message.content;
    sendMessage(sender,resmsg)
  } catch (error) {
    console.log(error)
  }

}

// getTranscript(6506533576076061,"https://youtu.be/lRQ5z7i7pxE");
async function getTranscript2(sender,link){
  console.log("transscipt start with 2")
  try {
    const valid=/(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|[^\/]+\?v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const check=link.match(valid)
    console.log(check);
    if(check && check[1]){
      let res=await axios.get(`https://youtube-browser-api.netlify.app/transcript?videoId=${check[1]}`)
      // console.log(res.data)
      const res2=res.data.videoId
      let ts=res2.map(line => line.text).join(' ')
      // console.log(ts2)
      console.log("transcript done")
      SummerizeIt(sender,ts);
      // let res=await axios.get(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${check[1]}&key=${process.env.YouTube_Key}`)
      // // console.log(res.data);
      // console.log(res.data.items[0].id)
      // let cid=res.data.items[0].id;
      // let res2=await axios.get(`https://www.googleapis.com/youtube/v3/captions/${cid}?key=${process.env.YouTube_Key}`)
      // console.log(res2.data.snippet)
      // console.log(res.data.items[0].snippet.transcriptUrl)
      // console.log(ts);

    }else{
      sendMessage(sender,"Please Provide Valid Youtube Video Link.")
    }
  } catch (error) {
    console.log(error)
  }
}

// getTranscript2(6506533576076061,"https://youtu.be/lRQ5z7i7pxE");



app.get("/",(req,res)=>{
    res.send("welcome");
})




app.listen(PORT, async () => {
  await mongoose.connect(process.env.Mongo_Url)
  console.log(`Server listening on port ${PORT}`);
});
