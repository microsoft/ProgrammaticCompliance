/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();
var isAuthenticated = require('../middleware.js')

router.get('/health', (request, response, next) => {
    response.send('<h2>Programmatic Compliance is alive and well.</h2>')
  })
  
router.get('/unauthorized', (request, response, next) => {
  response.send('<p>You are unauthorized to view these contents. Please reach out to craigmo@ to be added to the security group for this resource.</p>')
})

  // general catch all
router.get('/*', function (req, res, next) {
    // Check if user is authenticated
    console.log("HIT")
    if (!isAuthenticated(req)) {
      // If not authenticated, redirect to /login
      res.redirect('/auth/acquireToken');
    } else {
      // If authenticated, serve the index page
      const path = path.join(__dirname, 'public', 'build', 'index.html');
      res.sendFile(path);
    }
  });

module.exports = router;