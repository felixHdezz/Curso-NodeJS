import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
    public title: string;
    public artist: Artist;
    public token;
    public identity;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _ArtistService: ArtistService
    ) {
        this.title = 'Crear nuevo artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
    }

    ngOnInit() {
        console.log('artist-add.component.ts cargado');
    }

    onSubmit() {
        console.log(this.artist);
        this._ArtistService.addArtist(this.token, this.artist).subscribe(
            (response: any) => {
                if (!response.artist) {
                    this.alertMessage = 'error en el servidor';
                } else {
                    this.artist = response.artist;
                    // this._router.navigate(['/edit-artist'], response.artist._id);
                    this.alertMessage = 'El artista se ha creado correctamente';
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
    }
}
