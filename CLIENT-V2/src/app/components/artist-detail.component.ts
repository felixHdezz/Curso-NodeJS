import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
    public title: string;
    public artist: Artist;
    public albums: Album[];
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
        private _ArtistService: ArtistService,
        private _AlbumService: AlbumService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('artist-detail.component.ts cargado');
        // Llamar el metodo del api para sacar un artita en base a su id
        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            let _id = params['id'];
            this._ArtistService.getArtist(this.token, _id).subscribe(
                (response: any) => {
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;

                        // Obtener los albums del artista
                        this._AlbumService.getAlbums(this.token, response.artist._id).subscribe(
                            (response: any) => {
                                console.log(response);
                                if (!response.albums) {
                                    this.alertMessage = 'Este artista no hay albums';
                                } else {
                                    this.albums = response.albums;
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

    onCancelAlbum () {
        this.confirmado = null;
    }

    onDeleteAlbum(_id) {
        this._AlbumService.deleteAlbum(this.token, _id).subscribe(
            (response: any) => {
                if (!response.artist) {
                    alert('Error en el servidor');
                } else {
                    this.getArtist();
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
