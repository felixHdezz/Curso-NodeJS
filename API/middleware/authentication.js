'use strict'

var jwt = require('jwt-simple');
var moment  = require('moment');
var secret = 'my_voice_is_my_password';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        res.status(403).send({message:'La peticion no tiene la cabecera de autentificacion'});
    }else{
        var _token = req.headers.authorization.replace(/['"]+/g,'');
        try{
            var _payload = jwt.decode(_token, secret);
            if(_payload <= moment().unix()){
                return res.status(401).send({message:'El token ha expirado'});

            }
        }catch(ex){
            console.log(ex);
            return res.status(404).send({message:'Token no valido'});
        }
    }
    req.user = _payload;
    next();
};

