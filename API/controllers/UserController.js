'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function Get(req, res) {
	res.status(200).send({ message: 'Pruebando una accion del controlador de usuarios del api rest' });
}

function Post(req, res) {
	var user = new User();

	var params = req.body;

	// Setea los valores al modelo
	user.name = params.name;
	user.lastname = params.lastname;
	user.email = params.email;
	user.role = 'ROLES_USER';
	user.image = 'null';

	//Verifica si el parametro de contraseña exista
	if (params.password) {
		bcrypt.hash(params.password, null, null, function (err, hash) {
			user.password = hash;

			if (user.name != null && user.lastname != null && user.email != null) {
				// Guarda datos de usuario
				user.save((err, userStored) => {
					if (err) {
						res.status(500).send({ message: 'Error al aguardar el usuario' });
					} else {
						if (!userStored) {
							res.status(404).send({ message: 'No se ha registrado el usaurio' });
						} else {
							res.status(200).send({ user: userStored });
						}
					}
				});
			} else {
				res.status(200).send({ message: 'Rellena todos los campos' });
			}
		});
	} else {
		res.status(200).send({ message: 'Introduce la contrseña' });
	}
}

function AccessLogin(req, res) {
	//Obtiene los parametros enviados desde el front	
	var _params = req.body;

	var _email = _params.email;
	var _password = _params.password;

	if (_password && _email) {
		User.findOne({ email: _email.toLowerCase() }, function (_err, user) {
			if (_err) {
				res.status(500).send({ message: 'Error en la peticion al servidor ' });
			} else {
				if (!user) {
					res.status(404).send({ message: 'El usuario no existe a la base de datos' });
				} else {
					bcrypt.compare(_password, user.password, function (_err, _check) {
						if (_check) {
							//devolver los datos del usario logueado
							if (_params.gethash) {
								// devolvera un ojeto
								res.status(200).send({
									token: jwt.createToken(user)
								});
							} else {
								res.status(200).send({ user })
							}
						} else {
							res.status(404).send({ message: 'El usaurio no ha podido loguearse' });
						}
					});
				}
			}
		});
	} else {
		res.status(200).send({ message: 'Introduce el email y/o contraseña' });
	}
}

function Put(req, res) {
	var _userId = req.params.id;
	var _update = req.body;

	if (_userId !== req.user.sub) {
		return res.status(500).send({ message: 'No tiene permisos para actualizar el usuario' });
	}
	User.findByIdAndUpdate(_userId, _update, (_err, _userUpdated) => {
		if (_err) {
			res.status(500).send({ message: 'Error al actualizar el usuario' });
		} else {
			if (!_userUpdated) {
				res.status(404).send({ message: 'No se ha actualizado el usuario' });
			} else {
				res.status(200).send({ user: _userUpdated });
			}
		}
	});

}

function UploadImage(req, res) {
	var _userId = req.params.id;
	var _fil_name = 'No subido...';

	if (req.files) {
		var _file_path = req.files.image.path;
		var _file_split = _file_path.split('\\');
		var _file_name = _file_split[2];
		var _file_ext = _file_name.split('.')[1];

		if (_file_ext === 'png' || _file_ext === 'jpg') {
			User.findByIdAndUpdate(_userId, { image: _file_name }, (_err, _userUpdated) => {
				if (_err) {
					res.status(500).send({ message: 'Error al actualizr el usuario' });
				} else {
					if (!_userUpdated) {
						res.status(404).send({ message: 'No se ha actualizado el usuario' });
					} else {
						res.status(200).send({ image: _file_name, user: _userUpdated });
					}
				}
			});
		} else {
			res.status(200).send({ message: 'Extension del archivo no valida' });
		}
	} else {
		res.status(200).send({ message: 'No has subido ninguna imagen...' });
	}
}

function GetImageFile(req, res) {
	var _image = req.params.imageFile;
	var _path_file = './uploads/users/' + _image;

	fs.exists(_path_file, function (_exists) {
		if (_exists) {
			res.sendFile(path.resolve(_path_file));
		} else {
			res.status(200).send({ message: 'No existe la imagen...' });
		}
	});
}

//Exporta las funciones
module.exports = {
	Get,
	Post,
	AccessLogin,
	Put,
	UploadImage,
	GetImageFile
};