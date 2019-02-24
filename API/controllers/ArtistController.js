'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePagination = require('mongoose-pagination');

// Carga de los modelos a utilizar
var _Artist = require('../models/artist');
var _Album = require('../models/album');
var _Song = require('../models/song');


// funciones que se utilizan

function Get(req, res) {
	if (req.params.page) {
		var _page = req.params.page;
	} else {
		var page = 1;
	}

	var _itemsPerPage = 5;

	_Artist.find().sort('name').paginate(_page, _itemsPerPage, function (_err, _artists, _total) {
		if (_err) {
			res.status(500).send({ message: 'Error en la petición.' });
		} else {
			if (!_artists) {
				res.status(404).send({ message: 'No hay artistas !!' })
			} else {
				res.status(200).send({
					total_items: _total,
					artists: _artists
				});
			}
		}
	});
}

function GetById(req, res) {
	var _artistId = req.params.id;
	_Artist.findById(_artistId, function (_err, _artist) {
		if (_err) {
			res.status(500).send({ message: 'Error de peticion al servidor' });
		} else {
			if (!_artist) {
				res.status(404).send({ message: "El artista no existe en la DB" });
			} else {
				res.status(200).send({ artist: _artist });
			}
		}
	});
}

function Post(req, res) {
	var _artist = new _Artist();

	//Obtenemos los parametros del body
	var _params = req.body;

	_artist.name = _params.name;
	_artist.description = _params.description;
	_artist.image = 'null';

	_artist.save((_err, _artistStored) => {
		if (_err) {
			res.status(500).send({ message: 'Error al guardar el artista' });
		} else {
			if (!_artistStored) {
				res.status(404).send({ message: 'No se ha podido guardar el artista' });
			} else {
				res.status(200).send({ artist: _artistStored });
			}
		}
	});
}

function Put(req, res) {
	var _artistId = req.params.id;
	var _update = req.body;

	_Artist.findByIdAndUpdate(_artistId, _update, (_err, _artistUpdated) => {
		if (_err) {
			res.status(500).send({ message: 'Error al aguadar el artista' });
		} else {
			if (!_artistUpdated) {
				res.status(404).send({ messahe: 'El artista no ha sido actualizado' });
			} else {
				res.status(200).send({ artist: _artistUpdated });
			}
		}
	});
}

function Delete(req, res) {
	var _artistId = req.params.id;
	_Artist.findByIdAndRemove(_artistId, (_err, _artistRemoved) => {
		if (_err) {
			res.status(500).send({ message: 'Error al eliminar el artista' });
		} else {
			if (!_artistRemoved) {
				res.status(404).send({ message: 'El artista no ha sido eliminado' });
			} else {
				_Album.find({ artist: _artistRemoved._id }).remove((_err, _albumRemoved) => {
					if (_err) {
						res.status(500).send({ message: 'Error al eliminar el album' });
					} else {
						if (!_albumRemoved) {
							res.status(500).send({ message: 'No se ha eliminado el album' });
						} else {
							_Song.find({ album: _albumRemoved._id }).remove((_err, _songRemoved) => {
								if (_err) {
									res.status(500).send({ message: 'Error al eliminar la canción' });
								} else {
									if (!_songRemoved) {
										res.status(500).send({ message: 'La canción no ha sido eliminado' });
									} else {
										res.status(200).send({
											artist: _artistRemoved
										});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function UploadImage(req, res) {

	var _artistId = req.params.id;
	var _fil_name = 'No subido...';

	if (req.files) {
		var _file_path = req.files.image.path;
		var _file_split = _file_path.split('\\');
		var _file_name = _file_split[2];
		var _file_ext = _file_name.split('.')[1];

		if (_file_ext === 'png' || _file_ext === 'jpg') {
			_Artist.findByIdAndUpdate(_artistId, { image: _file_name }, (_err, _artistUpdated) => {
				if (_err) {
					res.status(500).send({ message: 'Error al actualizr el usuario' });
				} else {
					if (!_artistUpdated) {
						res.status(404).send({ message: 'NO se ha actualizado el usuario' });
					} else {
						res.status(200).send({ artist: _artistUpdated });
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
	var _path_file = './uploads/artists/' + _image;

	fs.exists(_path_file, function (_exists) {
		if (_exists) {
			res.sendFile(path.resolve(_path_file));
		} else {
			res.status(200).send({ message: 'No existe la imagen...' });
		}
	});
}

module.exports = {
	Get,
	GetById,
	Post,
	Put,
	Delete,
	UploadImage,
	GetImageFile
};
