import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';

import { SongService } from '../services/song.service';
import { Song } from '../models/song';


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit {
    public _title: string;
    public song: Song;
    public token;
    public identity;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService
    ) {
        this._title = 'Crear nueva canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
    }

    ngOnInit() {
        console.log('song-add.component.ts cargado');
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let _albumId = params['album'];
            this.song.album = _albumId;
            this._songService.addSong(this.token, this.song).subscribe(
                (response: any) => {
                    if (!response.song) {
                        this.alertMessage = 'error en el servidor';
                    } else {
                        this.song = response.song;
                        // this._router.navigate(['/edit-artist'], response.artist._id);
                        this.alertMessage = 'El artista se ha creado correctamente';
                        this._router.navigate(['/song/edit', response.song._id]);
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
}

