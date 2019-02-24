import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public title: string;
    public artists: Artist[];
    public token;
    public identity;
    public url: string;
    public _next_page;
    public _prev_page;
    public confirmado;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;

        this._next_page = 1;
        this._prev_page = 1;
    }

    ngOnInit() {
        console.log('artist-component.ts cargado');
        this.getArtists();
    }

    getArtists() {
        this._route.params.forEach((params: Params) => {
            let _page = +params['page'];
            if (!_page) {
                _page = 1;
            } else {
                this._next_page = _page + 1;
                this._prev_page = _page - 1;
                if ( this._prev_page === 0) {
                    this._prev_page = 1;
                }
            }
            this._artistService.getArtists(this.token, _page).subscribe(
                (response: any) => {
                    if (!response.artists) {
                        this._router.navigate(['/']);
                    } else {
                        this.artists = response.artists;
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

    onCancelArtist () {
        this.confirmado = null;
    }

    onDeleteArtist(_id) {
        this._artistService.deleteArtist(this.token, _id).subscribe(
            (response: any) => {
                if (!response.artist) {
                    alert('Error en el servidor');
                } else {
                    this.getArtists();
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
}
