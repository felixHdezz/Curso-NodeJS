import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';
import { Artist } from '../models/artist';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public _title: string;
    public artist: Artist;
    public album: Album;
    public token;
    public identity;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _ArtistService: ArtistService,
        private _AlbumService: AlbumService
    ) {
        this._title = 'Crear nuevo album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2019, '', '');
    }

    ngOnInit() {
        console.log('album-add.component.ts cargado');
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let _artist = params['artist'];
            this.album.artist = _artist;
            this._AlbumService.addAlbum(this.token, this.album).subscribe(
                (response: any) => {
                    if (!response.album) {
                        this.alertMessage = 'error en el servidor';
                    } else {
                        this.album = response.album;
                        this.alertMessage = 'El album se ha creado correctamente';
                        this._router.navigate(['/album/edit'], response.album._id);
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

