if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { sequelize } = require("./models");

const corsOptions = {
  origin: [
    "https://cheap-lc-l-frontend.vercel.app",
    "http://cheap-lc-l-frontend.vercel.app",
    // Add your local development URL if needed, e.g.:
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  credentials: true,
  maxAge: 86400,
};

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error(err);
  });

const { routeInit } = require("./routs/config_route");
const port = process.env.port || 3001;
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));
app.options("*", cors());
routeInit(app);
const server = http.createServer(app);
server.listen(port, () => console.log("Server running on port " + port));
