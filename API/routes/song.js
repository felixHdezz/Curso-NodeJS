'use strict'

/* se declaran las dependencias que se utilizran */
var express = require('express');
var multipart = require('connect-multiparty');
var _SongController = require('../controllers/SongController');

var app =  express.Router();

/* Configuracion de autentificacion */
var _md_auth =  require('../middleware/authentication');

var _md_upload = multipart({ uploadDir: './uploads/songs' });

/* Se reclaran las rutas del api, del controlador Song */
app.get('/songs/:album', _md_auth.ensureAuth, _SongController.Get);
app.get('/song/:id', _md_auth.ensureAuth, _SongController.GetById);
app.post('/song', _md_auth.ensureAuth, _SongController.Post);
app.put('/song/:id', _md_auth.ensureAuth, _SongController.Put);
app.delete('/song/:id', _md_auth.ensureAuth, _SongController.Delete);
app.post('/song/upload/:id', [_md_auth.ensureAuth, _md_upload], _SongController.UploadFile);

app.get('/song/getFile/:songFile', _SongController.GetFile);

module.exports = app;