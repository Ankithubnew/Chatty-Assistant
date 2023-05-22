const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3002;
app.use(cors());



app.use(express.json());
app.use(express.static("public"));

app.get('/webhook', (req, res) => {
    const { query } = req;
    // const { hub.mode, hub.verify_token, hub.challenge } = query;
    console.log(query);
  
    if (query.hub.mode === 'subscribe' && query.hub.verify_token === 'EAAbKM7FvGKUBAAEMhLZCF6pNekCzyAD2CUPZCCBL75') {
      res.status(200).send(query.hub.challenge);
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
