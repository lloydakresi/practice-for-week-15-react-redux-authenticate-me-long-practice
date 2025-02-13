const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const { environment } = require('./config');
const isProduction = environment === 'production';
const app = express();
const { ValidationError } = require('sequelize');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
);

app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);

app.use(routes);

app.use((req, res, next)=>{
  const err = new Error("The requested resource could not be found");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource could not be found"];
  err.status = 404;
  next(err)
});

app.use((err, req, res, next)=>{
  if (err instanceof ValidationError){
    err.errors = err.errors.map(e => e.message);
    err.title = 'Validation Error'
  }
  next(err);
});

app.use((err, req, res, next)=>{
  res.status(err.status||500);
  console.log(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  })

})



module.exports = app;
