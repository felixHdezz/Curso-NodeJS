'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = Schema({
	name: String,
	lastname:String,
	email:String,
	password:String,
	role:String,
	image:String
});

module.exports = mongoose.model('Users', UsersSchema);
