'use strict'

var express = require('express');
var _AlbumController = require('../controllers/AlbumController');
var multipart = require('connect-multiparty');


var api = express.Router();
var _md_auth = require('../middleware/authentication');

var _md_upload = multipart({ uploadDir: './uploads/albums' });

api.get('/albums/:artist?', _md_auth.ensureAuth, _AlbumController.Get);
api.get('/album/:id', _md_auth.ensureAuth, _AlbumController.GetById);
api.post('/album/register', _md_auth.ensureAuth, _AlbumController.Post);
api.put('/album/update/:id', _md_auth.ensureAuth, _AlbumController.Put);
api.delete('/album/delete/:id', _md_auth.ensureAuth, _AlbumController.Delete);
api.post('/album/upload/:id', [_md_auth.ensureAuth, _md_upload], _AlbumController.UploadImage);
api.get('/album/image/:imageFile', _AlbumController.GetImageFile);

module.exports = api;

