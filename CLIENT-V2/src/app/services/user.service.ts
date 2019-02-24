import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()

export class UserService {
    public identity;
    public token;
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    signup(user_to_login, gethash = null) {
        if (gethash != null) {
            user_to_login.gethash = gethash;
        }
        let _json = JSON.stringify(user_to_login);
        let _params = _json;

        let _headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.post(this.url + 'user/login', _params, { headers: _headers })
                         .pipe(map(res => res));
    }
    register(new_user) {
        let _params = JSON.stringify(new_user);

        let _headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.post(this.url + 'user/register', _params, { headers: _headers })
                         .pipe(map(res => res));
    }

    updateUser(user_update) {
        let _params = JSON.stringify(user_update);

        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()
        });

        return this._http.put(this.url + 'user/update/' + user_update._id, _params, { headers: _headers })
                         .pipe(map(res => res));

    }

    getIdentity() {
        let _identity = JSON.parse(localStorage.getItem('identity'));
        if (_identity !== 'undefined') {
            this.identity = _identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        let _token = localStorage.getItem('token');
        if (_token !== 'undefined') {
            this.token = _token;
        } else {
            this.token = null;
        }
        return this.token;
    }
}
