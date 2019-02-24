import { Component, OnInit } from '@angular/core';

import {GLOBAL} from '../services/global';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { promise } from 'protractor';
import { _iterableDiffersFactory } from '@angular/core/src/application_module';
import { X_OK } from 'constants';
import { XhrFactory } from '@angular/common/http';
import { resolve } from 'url';
import { reject } from 'q';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public filesToUpload: Array<File>;
    public url: string;
    constructor(
        private _userService: UserService
    ) {
        this.title = 'Actualizar mis datos';

        // LocalStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('Editar usuario');
    }

    onSubmit() {
        console.log(this.user);

        this._userService.updateUser(this.user).subscribe(
            (response: any) => {
                if (!response.user) {
                    this.alertMessage = 'El usuario no se ha actualizado';
                } else {
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById('identity_username').innerHTML = this.user.name + " " + this.user.lastname;

                    if (!this.filesToUpload) {

                    } else {
                        this.makeFileRequest(this.url + 'user/upload/' + this.user._id, [], this.filesToUpload).then(
                            (result: any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));

                                let _image_path = this.url + 'user/image/' + this.user.image;
                                document.getElementById('image-logged').setAttribute('src', _image_path);
                                console.log(this.user);
                            }
                        );
                    }

                    this.alertMessage = 'El usuario se  ha actualizado correctamente';
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

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        const _token = this.token;
        return new Promise (function (resolve, reject) {
            let _formData: any = new FormData();
            let _xhr = new XMLHttpRequest();

            for (let _i = 0; _i < files.length; _i++) {
                _formData.append('image', files[_i], files[_i].name);
            }

            _xhr.onreadystatechange = function() {
                if (_xhr.readyState === 4) {
                    if (_xhr.status === 200) {
                        resolve(JSON.parse(_xhr.response));
                    } else {
                        reject(_xhr.response);
                    }
                }
            };

            _xhr.open('POST', url, true);
            _xhr.setRequestHeader('Authorization', _token);
            _xhr.send(_formData);
        });
    }
}

