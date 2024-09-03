module.exports = app => {
  'use strict';
  const express = require("express");
  const appPath = __dirname + '/../client';
  const path = require('path');
  const errors = require('./errors');
  const requireLogin = require('./authorization/authentication').requireLogin;

  app.route('*/:url(api|auth|components|app|bower_components)/*').get(errors[404]);

  /* BUILD */
  app.use(express.static(path.join(appPath, 'dist/client')));
  app.get('/*', (req, res) => res.sendFile(path.join(appPath, 'dist/client', 'index.html')));

  app.route('*').get(errors[404]);
};
