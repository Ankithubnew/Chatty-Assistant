const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3002;
app.use(cors());



app.use(express.json());
app.use(express.static("public"));

app.get("/webhook", async (req, res) => {
    res.send("1875738765");
});
app.get("/",(req,res)=>{
    res.send("welcome");
})



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
