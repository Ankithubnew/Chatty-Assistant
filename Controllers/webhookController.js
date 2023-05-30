const axios = require("axios");
const transcript = require("youtube-transcript");
const { YoutubeTranscript } = transcript;
const User=require("../Models/User")
const {SummerizeIt}=require("../Services/openAiServices")

async function sendMessage(sender, msg) {
  console.log("sendmsg :" + msg);
  try {
    let reqt = await axios.post(
      "https://graph.facebook.com/v13.0/me/messages",
      {
        recipient: { id: sender },
        message: { text: msg },
        access_token: process.env.FB_Token,
      }
    );
    if (!reqt.data) {
      reqt = await axios.post("https://graph.facebook.com/v13.0/me/messages", {
        recipient: { id: sender },
        message: { text: msg },
        access_token: process.env.FB_Token,
      });
    }
    console.log("finally msg sent");
  } catch (error) {
    console.log("Error:");
    console.log(error);
  }
}

async function sendImage(sender, url) {
  console.log("sendimage :" + url);
  let reqt = await axios.post("https://graph.facebook.com/v13.0/me/messages", {
    recipient: { id: sender },
    message: {
      attachment: { type: "image", payload: { url: url, is_reusable: true } },
    },
    access_token: process.env.FB_Token,
  });
  if (!reqt.data) {
    reqt = await axios.post("https://graph.facebook.com/v13.0/me/messages", {
      recipient: { id: sender },
      message: {
        attachment: { type: "image", payload: { url: url, is_reusable: true } },
      },
      access_token: process.env.FB_Token,
    });
  }
  console.log("img  sent");
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

// async function getTranscript2(sender, link) {
//   console.log("transscipt start with 2");
//   try {
//     const valid =
//       /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|[^\/]+\?v=)|youtu\.be\/)([^"&?\/ ]{11})/;
//     const check = link.match(valid);
//     // console.log(check);
//     if (check && check[1]) {
//       let vid = check[1];
//       let time = 5000;
//       const youtube = google.youtube({
//         version: "v3",
//         auth: process.env.YouTube_Key,
//       });
//       // let res=await axios.get(`https://youtube-browser-api.netlify.app/transcript?videoId=${vid}`);
//       // if(!res.data.videoId){
//       //   console.log("checking with fetch")
//       //   let res3=await fetch(`https://youtube-browser-api.netlify.app/transcript?videoId=${vid}`)
//       //   if(!res3.ok){
//       //     console.log("fetch failed")
//       //   }
//       //   res=await res2.json();
//       // }
//       // // console.log(res.data)
//       // const res2=res.data.videoId
//       // let ts=res2.map(line => line.text).join(' ')
//       // // console.log(ts2)
//       // console.log("transcript done")
//       // SummerizeIt(sender,ts);

//       // let res=await axios.get(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${check[1]}&key=${process.env.YouTube_Key}`)
//       // // console.log(res.data);
//       // console.log(res.data.items[0].id)
//       // let cid=res.data.items[0].id;
//       // let res2=await axios.get(`https://www.googleapis.com/youtube/v3/captions/${cid}?key=${process.env.YouTube_Key}`)
//       // console.log(res2.data.snippet)
//       // console.log(res.data.items[0].snippet.transcriptUrl)
//       // console.log(ts);
//     } else {
//       sendMessage(sender, "Please Provide Valid Youtube Video Link.");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

async function Truecaller(sender, num) {
  const numregex = /^\d{10}$/;
  if (numregex.test(num)) {
    const url = process.env.TrueCaller_Api;
    const params = {
      q: num,
      countryCode: "IN",
      type: 4,
      locAddr: "",
      placement: "EARCHRESULTS,HISTORY,DETAILS",
      adId: "",
      encoding: "json",
    };
    const headers = {
      Authorization: `Bearer ${process.env.TrueCaller_Key}`,
      "User-Agent": "Truecaller/10.38.7 (Android;6.0.1)",
    };
    const res = await axios.get(url, { params, headers });
    const name = res.data.data[0]?.name || "Not Available";
    const access = res.data.data[0]?.access || "Not Available";
    const image = res.data.data[0]?.image || "Not Available";
    const carrier = res.data.data[0].phones[0]?.carrier || "Not Available";
    const city = res.data.data[0].addresses[0]?.city || "Not Available";
    const email = res.data.data[0].internetAddresses[0]?.id || "Not Available";
    const msg =
      `Mobile Number : ${num} Info\n` +
      `Name : ${name}\n` +
      `Email : ${email}\n` +
      `City : ${city}\n` +
      `Carrier : ${carrier}\n` +
      `Image: ${image}`;
    console.log(msg);
    sendMessage(sender, msg);
  } else {
    sendMessage(sender, "Please send exactly 10 digit number for Information.");
  }
}

async function handleCredit(sender, msg) {
  let promoobj = {
    ptweb09: 5,
    ankit: 2,
    chatty: 1,
  };
  let promo = msg.toLowerCase();
  if (promo in promoobj) {
    let credit = promoobj[promo];
    console.log("promo match");
    await User.findOneAndUpdate(
      { userId: sender },
      { $inc: { credits: credit } }
    );
    console.log("promo updated");
    sendMessage(
      sender,
      `Promo code ${promo} redeemed successfully! ${credit} credits have been added to your account.`
    );
  } else {
    sendMessage(sender, "Invalid Promo Code");
  }
}



module.exports={sendMessage,sendImage,getTranscript,handleCredit,Truecaller}