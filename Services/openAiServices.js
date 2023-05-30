const openAi = require("openai");
const transcript = require("youtube-transcript");
const { YoutubeTranscript } = transcript;
const { Configuration, OpenAIApi } = openAi;
const config = new Configuration({ apiKey: process.env.OpenAi_Api });
const ai = new OpenAIApi(config);
const {sendMessage,sendImage} = require("../Controllers/webhookController")
async function handleAimsg(sender, msg) {
  console.log("ai assitant with msg called");
  try {
    let res = await ai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant.Your name is Chatty Assitant created by Ankit Kumar.",
        },
        { role: "user", content: msg },
      ],
      max_tokens: 500,
    });
    if (!res.data.choices[0]) {
      console.log("msg genrate from ai2");
      res = await ai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant.Your name is Chatty Assitant created by Ankit Kumar.",
          },
          { role: "user", content: msg },
        ],
        max_tokens: 500,
      });
    }
    console.log("ai genrate the msg");
    const resmsg = res.data.choices[0].message.content;
    sendMessage(sender, resmsg);
  } catch (error) {
    console.log(error);
  }
}

async function handleAiImage(sender, prompt) {
  console.log("handle ai image called");
  try {
    let res = await ai.createImage({
      prompt,
      n: 1,
      size: "512x512",
    });
    console.log("image genrated")
    sendImage(sender, res.data.data[0].url);
  } catch (error) {
    console.log(error);
  }
}

async function getTranscript(sender, link) {
  try {
    console.log("transcript start");
    let res = await YoutubeTranscript.fetchTranscript(link);
    if (!res) {
      res = await YoutubeTranscript.fetchTranscript(link);
    }
    let ts = res.map((line) => line.text).join(" ");
    console.log("transcript done");
    SummerizeIt(sender, ts);
  } catch (error) {
    console.log(error);
  }
}

async function SummerizeIt(sender, msg) {
  try {
    console.log("summerize start");
    let res = await ai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Summerize this youtube video with title" },
        { role: "user", content: msg },
      ],
      max_tokens: 500,
    });
    console.log("summerize done");
    const resmsg = res.data.choices[0].message.content;
    sendMessage(sender, resmsg);
  } catch (error) {
    console.log(error);
  }
}

module.exports={handleAimsg,handleAiImage,SummerizeIt,getTranscript}