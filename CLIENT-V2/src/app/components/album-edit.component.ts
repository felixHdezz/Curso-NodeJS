import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';

import { UploadService } from '../services/upload.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';
import { Artist } from '../models/artist';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
    public _title: string;
    public album: Album;
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
        private _AlbumService: AlbumService,
        private _uploadService: UploadService
    ) {
        this._title = 'Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2019, '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('album-edit.component.ts cargado');
        this.getAlbum();
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let _id = params['id'];
            this._AlbumService.getAlbum(this.token, _id).subscribe(
                (response: any) => {
                    if (!response.album) {
                        this._router.navigate(['./']);
                    } else {
                        this.album = response.album;
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
        this._route.params.forEach((params: Params) => {
            let _id = params['id'];
            this._AlbumService.editAlbum(this.token, _id, this.album).subscribe(
                (response: any) => {
                    if (!response.album) {
                        this.alertMessage = 'error en el servidor';
                    } else {
                        // this._router.navigate(['/edit-artist'], response.artist._id);
                        this.alertMessage = 'El album se ha actualizado correctamente';

                        if (!this.filesToUpload) {
                            this._router.navigate(['/artist/detail', response.album.artist]);
                            // redirect
                        } else {
                            // Subir imagen
                            this._uploadService.makeFileRequest(this.url + 'album/upload/' + _id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/artist/detail', response.album.artist]);
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
