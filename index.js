const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.Port||3002;
const ConnectToDatabase = require("./Config/mongoDbConfig")
const webhookRoutes=require("./Routes/webhookRoutes")

app.use(cors());
app.use(express.json());

app.use("/webhook",webhookRoutes)

app.get("/",(req,res)=>{
    res.send("welcome to Chatty Assitant");
})

app.listen(PORT, async () => {
  await ConnectToDatabase();
  console.log(`Server listening on port ${PORT}`);
});
