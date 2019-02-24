import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params} from '@angular/router';


import { UserService } from './services/user.service';
import { User } from './models/user';
import {GLOBAL} from './services/global';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [UserService]
})
export class AppComponent implements OnInit {
    public title = 'Musify';
    public user: User;
    public user_register: User;
    public identity;
    public token;
    public errorMsg;
    public alertRegister;
    public url: string;
    constructor(
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
        this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    public onSubmit() {
        this._userService.signup(this.user).subscribe(
            (response: any) => {
                let identity = response.user;
                this.identity = identity;
                if (!this.identity._id) {
                    alert('El usuario no está correctamente indentificado');
                } else {
                    // Crear elemento en el localstorage
                    localStorage.setItem('identity', JSON.stringify(identity));

                    // Conseguir el token para envairselo
                    this._userService.signup(this.user, 'true').subscribe(
                        (_response: any) => {
                            let _token = _response.token;
                            this.token = _token;
                            if (this.token.length <= 0) {
                                alert('El token no se ha generado correctamente');
                            } else {
                                // Crear elemento en el localstorage
                                localStorage.setItem('token', _token);

                                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
                            }
                        },
                        error => {
                            var _errorMsg = <any>error;
                            if (_errorMsg != null) {
                                var _body = JSON.parse(error._body);
                                this.errorMsg = _body.message;
                                console.log(_errorMsg);
                            }
                        }
                    );
                }
            },
            error => {
                var _errorMsg = <any>error;
                if (_errorMsg != null) {
                    console.log(_errorMsg);
                }
            }
        );
    }

    public logout() {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;
        this._router.navigate(['/']);
    }

    onSubmitRegister() {
        this._userService.register(this.user_register).subscribe(
            (response: any) => {
                let _user = response.user;
                this.user_register = _user;

                if (!_user._id) {
                    alert('Error al resgiatrarse');
                } else {
                    this.alertRegister = 'E registro se ha realizado correctamente, identificate con ' + this.user_register.email;
                    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
                }
            },
            error => {
                var _errorMsg = <any>error;
                if (_errorMsg != null) {
                    var _body = JSON.parse(error._body);
                    this.alertRegister = _body.message;
                    console.log(_errorMsg);
                }
            }
        );
    }
}
