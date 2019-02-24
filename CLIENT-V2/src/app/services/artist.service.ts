import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()

export class ArtistService {

    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getArtists(_token, _page) {
        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        return this._http.get(this.url + 'artists/' + _page, { headers: _headers })
                         .pipe(map(res => res));
    }

    getArtist(_token, _id: string) {
        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        const _options = {
            headers: _headers
        };

        return this._http.get(this.url + 'artist/' + _id, _options)
                         .pipe(map(res => res));
    }

    addArtist(_token, _artist: Artist) {
        let _params = JSON.stringify(_artist);

        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        return this._http.post(this.url + 'artist/register', _params, { headers: _headers })
                         .pipe(map(res => res));
    }

    editArtist(_token, _id: string, _artist: Artist) {
        let _params = JSON.stringify(_artist);

        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        return this._http.put(this.url + 'artist/update/' + _id, _params, { headers: _headers })
                         .pipe(map(res => res));
    }

    deleteArtist(_token, _id: string) {
        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        const _options = {
            headers: _headers
        };

        return this._http.delete(this.url + 'artist/delete/' + _id, _options)
                         .pipe(map(res => res));
    }
}

