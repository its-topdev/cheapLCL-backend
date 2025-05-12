if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const { routeInit } = require('./routs/config_route');
const { sequelize } = require('./models');

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigins = [
  'https://cheap-lcl-frontend.vercel.app',
  'http://cheap-lcl-frontend.vercel.app',
  'http://localhost:5173',
  'https://staging-cheaplcl-backend-vcew.onrender.com',
];

// Configure CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
  credentials: true, // Allow cookies and credentials
}));
// const allowedOrigins = [
//   'https://cheap-lc-l-frontend.vercel.app',
//   'http://cheap-lc-l-frontend.vercel.app',
//   'http://localhost:5173',
//   'https://staging-cheaplcl-backend.onrender.com',
// ];

// const corsOptions = {
//   origin(origin, callback) {
//     if (!origin) {
//       return callback(null, true);
//     }

//     if (allowedOrigins.indexOf(origin) !== -1) {
//       return callback(null, true);
//     }
//     console.log('Blocked origin:', origin);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'X-Requested-With',
//     'x-api-key',
//   ],
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   maxAge: 86400,
// };

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key',
  );
  next();
});

// app.options('*', cors(corsOptions));

routeInit(app);

app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    console.error('CORS Error:', {
      origin: req.headers.origin,
      method: req.method,
      path: req.path,
    });
    return res.status(403).json({
      status: false,
      error: 'CORS Error: Origin not allowed',
      allowedOrigins,
    });
  }
  return next(err);
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.error(err);
  });

const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on port ${port}`));
