// Code backend
'use strict'

var mongoose = require('mongoose');
var setting = require('./config/settings');
var app = require('./app/app');
var port = process.env.PORT || setting.PORT;

//conexion a la base de datos
mongoose.Promise = global.Promise;

mongoose.connect( setting._URL_MONGO, function (err, rep) {
	if (err) {
		console.log('Error en la conexión a la base de datos');
	} else {
		console.log('Conexion a la base de datos fue exitosa');
		app.listen(port, function () {
			console.log('Servidor escuchando en el puerto ' + setting.PORT);
		});
	}
});
