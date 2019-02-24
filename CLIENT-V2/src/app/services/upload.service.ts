import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import {Artist} from '../models/artist';

@Injectable()

export class UploadService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>, _token: string, _name: string) {
        return new Promise (function (resolve, reject) {
            let _formData: any = new FormData();
            let _xhr = new XMLHttpRequest();

            for (let _i = 0; _i < files.length; _i++) {
                _formData.append(_name, files[_i], files[_i].name);
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
