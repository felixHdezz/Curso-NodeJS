'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var _user_routes = require('../routes/user');
var _artist_routes = require('../routes/artist');
var _album_routes = require('../routes/album');
var _song_routes= require('..//routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar headers http

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

// Rutas base
app.use('/api', _user_routes);
app.use('/api', _artist_routes);
app.use('/api', _album_routes);
app.use('/api', _song_routes);

module.exports = app;
