if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { sequelize } = require("./models");

const app = express();

const allowedOrigins = [
  "https://cheap-lc-l-frontend.vercel.app",
  "http://localhost:3000",
  "https://staging-cheaplcl-backend.onrender.com", // Add your backend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "x-api-key",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

app.use(cors(corsOptions));
5;
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key"
  );
  next();
});

app.options("*", cors(corsOptions));

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    console.error("CORS Error:", {
      origin: req.headers.origin,
      method: req.method,
      path: req.path,
    });
    return res.status(403).json({
      status: false,
      error: "CORS Error: Origin not allowed",
      allowedOrigins,
    });
  }
  next(err);
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
routeInit(app);

const port = process.env.PORT || 3001; // Note: Changed 'port' to 'PORT' for consistency
const server = http.createServer(app);
server.listen(port, () => console.log("Server running on port " + port));
