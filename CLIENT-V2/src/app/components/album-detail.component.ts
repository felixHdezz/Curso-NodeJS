import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit {
    public title: string;
    public Album: Album;
    public songs: Song[];
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public confirmado;
    public filesToUpload: Array<File>;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _AlbumService: AlbumService,
        private _SongService: SongService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('album-detail.component.ts cargado');
        // obtener album de la base de datos
        this.getAlbum();
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let _id = params['id'];
            this._AlbumService.getAlbum(this.token, _id).subscribe(
                (response: any) => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.Album = response.album;

                        /* Obener las canciones */
                        this._SongService.getSongs(this.token, response.album._id).subscribe(
                            (response: any) => {
                                if (!response.songs) {
                                    this.alertMessage = 'Este albums no tiene canciones';
                                } else {
                                    this.songs = response.songs;
                                    console.log(response.songs);
                                }
                            },
                            (error) => {
                                var _errorMsg = <any>error;
                                if (_errorMsg != null) {
                                    var _body = JSON.parse(error._body);
                                    // this.alertMessage = _body.message;
                                    console.log(_errorMsg);
                                }
                            }
                        );
                    }
                },
                error => {
                    var _errorMsg = <any>error;
                    if (_errorMsg != null) {
                        var _body = JSON.parse(error._body);
                        // this.alertMessage = _body.message;
                        console.log(_errorMsg);
                    }
                }
            );
        });
    }

    onDeleteConfirm(_id) {
        this.confirmado = _id;
    }

    onCancelSong () {
        this.confirmado = null;
    }

    onDeleteSong(_id) {
        this._SongService.deleteSong(this.token, _id).subscribe(
            (response: any) => {
                if (!response.song) {
                    alert('Error en el servidor');
                } else {
                    this.getAlbum();
                }
            },
            error => {
                var _errorMsg = <any>error;
                if (_errorMsg != null) {
                    var _body = JSON.parse(error._body);
                    // this.alertMessage = _body.message;
                    console.log(_errorMsg);
                }
            }
        );
    }

    startPlayer(song) {
        let song_player =  JSON.stringify(song);
        let file_path = this.url + 'song/getFile/' + song.file;
        let _image_path = this.url + 'album/image/' + song.album.image;

        localStorage.setItem('sound_song', song_player);
        document.getElementById('mp3-source').setAttribute('src', file_path);
        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();

        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src', _image_path);
    }
}
