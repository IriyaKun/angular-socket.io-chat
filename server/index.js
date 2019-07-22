let express = require('express');
let app = express();

let http = require('http');
let server = http.createServer(app);

let socketIO = require('socket.io');
let io = socketIO(server);

let axios = require('axios');

const port = process.env.PORT || 3001;

let interval;

io.on("connection", socket => {
    console.log("New client connected"), setInterval(
      () => getApiAndEmit(socket),
      1000
    );
    socket.on("disconnect", () => console.log("Client disconnected"));
  });

server.listen(port, ()=>{
   console.log(`listening on port: ${port}`);
});

const getApiAndEmit = async socket => {
    try {
      const res = await axios.get(
        "https://api.darksky.net/forecast/4207eea0f0009097154e6ad153557622/43.7695,11.2558"
      ); // Getting the data from DarkSky
      socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
    } catch (error) {
      console.error(`Error: ${error.code}`);
    }
  };