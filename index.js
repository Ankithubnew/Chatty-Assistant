const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3002;
app.use(cors());



app.use(express.json());
app.use(express.static("public"));

app.get('/webhook', (req, res) => {
    const { query } = req;
    const { hubMode, hubVerifyToken, hubChallenge } = query;
  
    if (hubMode === 'subscribe' && hubVerifyToken === 'EAAbKM7FvGKUBAAEMhLZCF6pNekCzyAD2CUPZCCBL75') {
      res.status(200).send(hubChallenge);
    } else {
      res.sendStatus(403); 
    }
  });
  
app.get("/",(req,res)=>{
    res.send("welcome");
})



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
