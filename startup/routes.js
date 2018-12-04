const express = require('express');
const ping = require('../routes/ping');
const posts = require('../routes/posts');
const authors = require('../routes/authors');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/ping', ping);
    app.use('/api/posts', posts);
    app.use('/api/authors', authors);
};