import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()

export class AlbumService {

    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getAlbums(_token, _artistId: null) {
        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        let _baseURL: any;
        if (_artistId == null) {
            _baseURL = this.url + 'albums';
        } else {
            _baseURL = this.url + 'albums/' + _artistId;
        }
        return this._http.get(_baseURL, { headers: _headers })
                         .pipe(map(res => res));
    }

    getAlbum(_token, _id: string) {
        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        const _options = {
            headers: _headers
        };

        return this._http.get(this.url + 'album/' + _id, _options)
                         .pipe(map(res => res));
    }

    addAlbum(_token, _album: Album) {
        let _params = JSON.stringify(_album);

        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        return this._http.post(this.url + 'album/register', _params, { headers: _headers })
                         .pipe(map(res => res));
    }

    editAlbum(_token, _id: string, _album: Album) {
        let _params = JSON.stringify(_album);

        let _headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': _token
        });

        return this._http.put(this.url + 'album/update/' + _id, _params, { headers: _headers })
                         .pipe(map(res => res));
    }

    deleteAlbum(_token, _id: string) {
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

