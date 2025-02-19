if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
// const { sequelize } = require("./models");

// sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log("DB connected");
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// const { routeInit } = require("./routs/config_route");
const port = process.env.port || 3001;
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});
//   routeInit(app);
const server = http.createServer(app);
server.listen(port, () => console.log("Server running on port " + port));
