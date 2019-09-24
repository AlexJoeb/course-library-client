'use strict';

// * Import Modules
const express = require(`express`);
const morgan = require(`morgan`);
const cors = require(`cors`);

// * True/False Variable for Global Logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// * Init Express App
const app = express();

// * Enable Cors and Express JSON Passing
app.use(cors());
app.use(express.json());

// * Init Morgan for HTTP Request Logging
app.use(morgan('dev'));

app.use("/api/users", require("./routes/users"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/index", require("./routes/index"));
app.use("/api/authentication", require("./routes/authentication"));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
