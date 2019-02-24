'use strict'

/* Se declaran la dependencia que se van a utilizar */
var fs = require('fs');
var path = require('path');
var mongoosePagination = require('mongoose-pagination');

// Carga de los modelos de datos a utilizar
var _Artist = require('../models/artist');
var _Album = require('../models/album');
var _Song = require('../models/song');


// funcion get, para obtener las lista de los albums
function Get(req, res) {
    /* Obtiene la variable Id artista por si se busca por algun artista en especifico */
    var _artistId = req.params.artist;
    if (!_artistId) {
        var _find = _Album.find({}).sort('title');
    } else {
        var _find = _Album.find({ artist: _artistId }).sort('year');
    }

    _find.populate({ path: 'artist' }).exec((_err, _albums) => {
        if (_err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!_albums) {
                res.status(404).send({ message: 'No hay albums !!' })
            } else {
                res.status(200).send({
                    albums: _albums
                });
            }
        }
    });
}

/* funcion get by id, obtiene un album en espepcifico por el Id */
function GetById(req, res) {
    var _albumtId = req.params.id;

    _Album.findById(_albumtId).populate({ path: 'artist' }).exec((_err, _album) => {
        if (_err) {
            res.status(500).send({ message: 'Error de peticion al servidor' });
        } else {
            if (!_album) {
                res.status(404).send({ message: "El album no existe en la DB" });
            } else {
                res.status(200).send({ album: _album });
            }
        }
    });
}

/* funcion que guarda un nuevo album */
function Post(req, res) {
    var _album = new _Album();

    //Obtenemos los parametros del body
    var _params = req.body;

    _album.title = _params.title;
    _album.description = _params.description;
    _album.year = _params.year;
    _album.iamgen = 'null';
    _album.artist = _params.artist;

    _album.save((_err, _albumStored) => {
        if (_err) {
            res.status(500).send({ message: 'Error al guardar el album' });
        } else {
            if (!_albumStored) {
                res.status(404).send({ message: 'No se ha podido guardar el album' });
            } else {
                res.status(200).send({ album: _albumStored });
            }
        }
    });
}

/* funcion que actuliza un album */
function Put(req, res) {
    var _albumId = req.params.id;
    var _update = req.body;

    _Album.findByIdAndUpdate(_albumId, _update, (_err, _albumUpdated) => {
        if (_err) {
            res.status(500).send({ message: 'Error al actualizar el album' });
        } else {
            if (!_albumUpdated) {
                res.status(404).send({ messahe: 'El album no ha sido actualizado' });
            } else {
                res.status(200).send({ album: _albumUpdated });
            }
        }
    });
}

/* funcion que elimina un album */
function Delete(req, res) {
    var _albumtId = req.params.id;
    _Album.findByIdAndRemove(_albumtId, (_err, _albumRemoved) => {
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
                                album: _albumRemoved
                            });
                        }
                    }
                });
            }
        }
    });
}

/* funcion que carga imagen en un album */
function UploadImage(req, res) {
    var _albumtId = req.params.id;
    var _fil_name = 'No subido...';

    if (req.files) {
        var _file_path = req.files.image.path;
        var _file_split = _file_path.split('\\');
        var _file_name = _file_split[2];
        var _file_ext = _file_name.split('.')[1];

        if (_file_ext === 'png' || _file_ext === 'jpg') {
            _Album.findByIdAndUpdate(_albumtId, { image: _file_name }, (_err, _albumUpdated) => {
                if (_err) {
                    res.status(500).send({ message: 'Error al actualizr el album' });
                } else {
                    if (!_albumUpdated) {
                        res.status(404).send({ message: 'NO se ha actualizado el album' });
                    } else {
                        res.status(200).send({ album: _albumUpdated });
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

/* funcion que obtine el imagen de un album */
function GetImageFile(req, res) {
    var _image = req.params.imageFile;
    var _path_file = './uploads/albums/' + _image;

    fs.exists(_path_file, function (_exists) {
        if (_exists) {
            res.sendFile(path.resolve(_path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen...' });
        }
    });
}

/* exporta la funciones  */
module.exports = {
    Get,
    GetById,
    Post,
    Put,
    Delete,
    UploadImage,
    GetImageFile
};
