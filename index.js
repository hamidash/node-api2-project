// require your server and launch it here
const express = require("express");

const app = express();

const server = require("./api/server");

app.use(express.json());

const port = 8080;

app.use("/api", server);

app.use("/", (req, res)=>{
    res.json({message: "You have reached the server"})
})

app.listen(port, () => {
  console.log(`Server is runnning on ${port}`);
});