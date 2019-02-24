import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Song } from '../models/song';

@Injectable()

export class SongService {

    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getSongs(_token, _albumId: null) {
        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        let _baseURL: any;
        if (_albumId == null) {
            _baseURL = this.url + 'songs';
        } else {
            _baseURL = this.url + 'songs/' + _albumId;
        }
        return this._http.get(_baseURL, { headers: _headers })
                         .pipe(map(res => res));
    }

    getSong(_token, _id: string) {
        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        const _options = {
            headers: _headers
        };

        return this._http.get(this.url + 'song/' + _id, _options)
                         .pipe(map(res => res));
    }

    addSong(_token, _song: Song) {
        let _params = JSON.stringify(_song);

        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        return this._http.post(this.url + 'song', _params, { headers: _headers })
                         .pipe(map(res => res));
    }

    editSong(_token, _id: string, _song: Song) {
        let _params = JSON.stringify(_song);

        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        return this._http.put(this.url + 'song/' + _id, _params, { headers: _headers })
                         .pipe(map(res => res));
    }

    deleteSong(_token, _id: string) {
        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        const _options = {
            headers: _headers
        };

        return this._http.delete(this.url + 'song/' + _id, _options)
                         .pipe(map(res => res));
    }
}

