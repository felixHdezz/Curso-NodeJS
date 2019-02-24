import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
    public title: string;
    public artist: Artist;
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
        private _UploadService: UploadService,
        private _ArtistService: ArtistService
    ) {
        this.title = 'Editar artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('artist-edit.component.ts cargado');
        // Llamar el metodo del api para sacar un artita en base a su id
        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            let _id = params['id'];
            console.log('(id)', _id);
            this._ArtistService.getArtist(this.token, _id).subscribe(
                (response: any) => {
                    if (!response.artist) {
                        this._router.navigate(['./']);
                    } else {
                        this.artist = response.artist;
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

    onSubmit() {
        console.log(this.artist);
        this._route.params.forEach((params: Params) => {
            let _id = params['id'];
            this._ArtistService.editArtist(this.token, _id, this.artist).subscribe(
                (response: any) => {
                    if (!response.artist) {
                        this.alertMessage = 'error en el servidor';
                    } else {
                        // this.artist = response.artist;
                        // this._router.navigate(['/edit-artist'], response.artist._id);
                        this.alertMessage = 'El artista se ha actualizado correctamente';
                        if (!this.filesToUpload) {
                            this._router.navigate(['/artist/detail', response.artist._id]);
                        } else {
                            this._UploadService.makeFileRequest(this.url + 'artist/upload/' + _id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/artists', 1]);
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
