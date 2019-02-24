'use strict'

var express = require('express');
var _ArtistController = require('../controllers/ArtistController');
var multipart = require('connect-multiparty');


var api = express.Router();
var _md_auth = require('../middleware/authentication');

var _md_upload = multipart({ uploadDir: './uploads/artists' });

api.get('/artists/:page?', _md_auth.ensureAuth, _ArtistController.Get);
api.get('/artist/:id', _md_auth.ensureAuth, _ArtistController.GetById);
api.post('/artist/register', _md_auth.ensureAuth, _ArtistController.Post);
api.put('/artist/update/:id', _md_auth.ensureAuth, _ArtistController.Put);
api.delete('/artist/delete/:id', _md_auth.ensureAuth, _ArtistController.Delete);
api.post('/artist/upload/:id', [_md_auth.ensureAuth, _md_upload], _ArtistController.UploadImage);
api.get('/artist/image/:imageFile', _ArtistController.GetImageFile);

module.exports = api;

