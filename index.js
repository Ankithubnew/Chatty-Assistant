const express = require("express");
const IP = require("ip");
const cors = require("cors");

const app = express();
const PORT = 3002;
app.use(cors());



app.use(express.json());
app.use(express.static("public"));

app.get("/webhook", async (req, res) => {
    res.send("hello");
});
app.get("/",(req,res)=>{
    res.send("welcome");
})



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
