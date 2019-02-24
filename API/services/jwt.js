'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'my_voice_is_my_password';

exports.createToken = function (_user) {
	var payload = {
		sub: _user._id,
		name: _user.name,
		lastname: _user.lastname,
		email: _user.email,
		role: _user.role,
		image: _user.image,
		ait: moment().unix(),
		exp: moment().add(30, 'days').unix
	};
	return jwt.encode(payload, secret);
};
