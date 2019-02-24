'use strict'

var express = require('express');
var UserController = require('../controllers/UserController');
var multipart = require('connect-multiparty');


var api = express.Router();
var _md_auth = require('../middleware/authentication');

var _md_upload = multipart({uploadDir: './uploads/users'});

api.get('/users', _md_auth.ensureAuth, UserController.Get);
api.post('/user/register', UserController.Post);
api.post('/user/login', UserController.AccessLogin);
api.put('/user/update/:id', _md_auth.ensureAuth, UserController.Put);
api.post('/user/upload/:id', [_md_auth.ensureAuth, _md_upload], UserController.UploadImage);
api.get('/user/image/:imageFile', UserController.GetImageFile);

module.exports = api;
