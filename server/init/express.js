module.exports = (app, config)=> {
  'use strict';
  let express = require('express'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    multer = require('multer'),
    helmet = require('helmet'),
    timeout = require('express-timeout-handler');

  let options = {
    timeout: 27000,
    onTimeout: function (req, res) {
      let logError = require('../utils/utils')(app.locals.db).logError;
      logError(req.user, 'Request timeout', 'url: '+req.originalUrl);
      res.status(503).end();
    }
    //disable: ['write', 'setHeaders', 'send', 'json', 'end']
  };
  app.use(timeout.handler(options));
  app.use(compression());
  if ('dev' === config.env) {
    app.use(helmet({
      contentSecurityPolicy: false
    }));
  } else {
    app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", 'data:', 'https://yourconsulting.ro'],

          baseUri: ["'self'"],
          blockAllMixedContent: [],

          connectSrc: ["'self'", 'data:', 'https:', 'ws://localhost:8001'],

          fontSrc: ["'self'", 'https:'],
          frameAncestors: ["'self'", 'blob:'],
          frameSrc: ["'self'", 'blob:', 'https://www.google.com'],

          imgSrc: ["'self'", 'data:', 'https:', 'blob:', 'https://yourconsulting.ro'],

          objectSrc: ["'self'", 'blob:'],

          //scriptSrc: ["'self'", "data:"],
          scriptSrc: ["'self'", "data:", "'unsafe-inline'", 'https://www.google.com', 'https://maps.googleapis.com'], // test firefox
          scriptSrcAttr: ['none', "'unsafe-inline'"],
          scriptSrcElem: ["'self'", 'data:', "'unsafe-inline'", "'unsafe-eval'", 'https:'],
          styleSrc: ["'self'", "data:", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrcElem: ["'self'", "data:", "'unsafe-inline'", "'unsafe-eval'", 'https:'],

          upgradeInsecureRequests: []
        },
        reportOnly: false
      }
    }));
  }
  app.disable('x-powered-by');
  // app.use(express.static(path.join(config.path, '/public')));
  // app.set('views', config.path + '/server/views');
  // app.set('view engine', 'pug');
  app.use(multer({dest:'./tempReports/'}).any());
  app.use(bodyParser.json({limit: '10mb'}));
  app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
  app.use(cookieParser());
  // app.set('appPath', config.path + '/public');
  app.use(morgan('dev'));
};
