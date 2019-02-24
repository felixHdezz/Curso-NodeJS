import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';


@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
    public _title: string;
    public song: Song;
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService

    ) {
        this._title = 'Editar canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('song-edit.component.ts cargado');

        //Obtener la cancion a editar
        this.getSong();
    }

    getSong() {
        this._route.params.forEach((params: Params) => {
            let _songId = params['id'];
            this._songService.getSong(this.token, _songId).subscribe(
                (response: any) => {
                    if (!response.song) {
                        this._router.navigate(['/']);
                    } else {
                        this.song = response.song;
                        // this._router.navigate(['/edit-artist'], response.artist._id);
                    }
                },
                error => {
                    var _errorMsg = <any>error;
                    if (_errorMsg != null) {
                        var _body = JSON.parse(error._body);
                        console.log(_errorMsg);
                    }
                }
            );
        });
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let _id = params['id'];
            console.log(this.song);
            this._songService.editSong(this.token, _id, this.song).subscribe(
                (response: any) => {
                    if (!response.song) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        // this.artist = response.artist;
                        // this._router.navigate(['/edit-artist'], response.artist._id);
                        this.alertMessage = 'La canción se ha actualizado correctamente';
                        if (!this.filesToUpload) {
                            this._router.navigate(['/album/detail', response.song.album]);
                        } else {
                            this._uploadService.makeFileRequest(this.url + 'song/upload/' + _id, [], this.filesToUpload, this.token, 'file')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/album/detail', response.song.album]);
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                        }
                    }
                },
                error => {
                    var _errorMsg = <any>error;
                    if (_errorMsg != null) {
                        var _body = JSON.parse(error._body);
                        this.alertMessage = _body.message;
                        console.log(_errorMsg);
                    }
                }
            );
        });
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}

