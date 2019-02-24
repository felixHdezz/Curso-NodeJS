'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePagination = require('mongoose-pagination');

/* Carga las dependecias de los modelos de datos que se utlizaran */
var _Song = require('../models/song');
var _Artist = require('../models/artist');
var _Album = require('../models/album');

/* Se declara las funciones */

function Get(req, res) {
    var _albumId = req.params.album;
    if (!_albumId) {
        var _find = _Song.find({}).sort('number');
    } else {
        var _find = _Song.find({ album: _albumId }).sort('number');
    }

    _find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((_err, _songs) => {
        if (_err) {
            res.status(500).send({ message: 'Error en la peticion al servidor' });
        } else {
            if (!_songs) {
                res.status(404).send({ message: 'No se ha encontrado la cancion' });
            } else {
                res.status(200).send({ songs: _songs });
            }
        }
    });
}

function GetById(req, res) {
    var _songId = req.params.id;

    _Song.findById(_songId).populate({ path: 'album' }).exec((_err, _song) => {
        if (_err) {
            res.status(500).send({ message: 'Error en la peticion al servidor' });
        } else {
            if (!_song) {
                res.status(404).send({ message: 'No se ha encontrado la cancion' });
            } else {
                res.status(200).send({ song: _song });
            }
        }
    });
}

function Post(req, res) {
    var _song = new _Song();

    /* Obtiene los parametros del body, para agregar nueva cancion */
    var _params = req.body;
    console.log(_params);
    /* Setea los parametros a la nueva instancia de _Song */
    _song.number = _params.number;
    _song.name = _params.name;
    _song.duration = _params.duration;
    _song.file = 'null';
    _song.album = _params.album;

    _song.save((_err, _songStored) => {
        if (_err) {
            res.status(500).send({ message: 'Error en la peticion al servidor' });
        } else {
            if (!_songStored) {
                res.status(404).send({ message: 'La cancion no ha sido guardado' });
            } else {
                res.status(200).send({ song: _songStored });
            }
        }
    });
}

function Put(req, res) {
    var _songId = req.params.id;

    var _params = req.body;

    _Song.findByIdAndUpdate(_songId, _params, (_err, _songUpdated) => {
        if (_err) {
            res.status(500).send({ message: 'Error en la peticion al servidor' });
        } else {
            if (!_songUpdated) {
                res.status(404).send({ message: 'No ha sido actualizado la cancion' });
            } else {
                res.status(200).send({ song: _songUpdated });
            }
        }
    });
}

function Delete(req, res) {
    var _albumId = req.params.id;
    _Song.findByIdAndRemove(_albumId, (_err, _songRemoved) => {
        if (_err) {
            res.status(500).send({ message: 'Error al eliminar la canción' });
        } else {
            if (!_songRemoved) {
                res.status(500).send({ message: 'La canción no ha sido eliminado' });
            } else {
                res.status(200).send({
                    song: _songRemoved
                });
            }
        }
    });
}

function UploadFile(req, res) {
    var _songId = req.params.id;
    if (_songId) {
        if (req.files) {
            var _file_path = req.files.file.path;
            var _file_split = _file_path.split('\\');
            var _file_name = _file_split[2];
            var _file_ext = _file_name.split('.')[1];

            if (_file_ext === 'mp3' || _file_ext === 'ogg') {
                _Song.findByIdAndUpdate(_songId, { file: _file_name }, (_err, _songUpdated) => {
                    if (_err) {
                        res.status(500).send({ message: 'Error al actualizr el album' });
                    } else {
                        if (!_songUpdated) {
                            res.status(404).send({ message: 'No se ha actualizado el album' });
                        } else {
                            res.status(200).send({ song: _songUpdated });
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
}

function GetFile(req, res) {
    var _file = req.params.songFile;
    var _path_file = './uploads/songs/' + _file;

    fs.exists(_path_file, function (_exists) {
        if (_exists) {
            res.sendFile(path.resolve(_path_file));
        } else {
            res.status(200).send({ message: 'No existe el fichero del audio...' });
        }
    });
}

/* Se exporta las funiones */
module.exports = {
    Get,
    GetById,
    Post,
    Put,
    Delete,
    UploadFile,
    GetFile
};