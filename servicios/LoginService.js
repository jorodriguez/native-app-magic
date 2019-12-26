

import { AsyncStorage,Alert } from 'react-native';

import URL from './Urls';

import { updateToken } from './TokenService';

export function login(email, password) {
    return fetch(URL.LOGIN,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "correo": email,
                "password": password
            }), 
        });
};

export function cerrarSesion(usuario,token) {
    
    AsyncStorage.removeItem('logeado');
    AsyncStorage.removeItem('usuario');
    AsyncStorage.removeItem('userToken');
    //aqui borrar el token firebase en la bd

    updateToken(usuario.id, token, { "token":"" })
    .then(res => res.json())
    .then(res => {
      console.log("Se actualizo el token del usuario");
      //Alert.alert("Error", "Se actualizo el token");
    })
    .catch((e) => {
      Alert.alert("Error", "Existe un detalle con la mensajería en este dispositivo, por favor informe este aviso al equipo de Soporte.");
    });
}

export const setUsuarioSesion = async (usuario) => {
    if (usuario != null && usuario != undefined) {
       await  AsyncStorage.setItem('logeado', JSON.stringify(usuario.auth));
       await  AsyncStorage.setItem('userToken', usuario.token);
       await AsyncStorage.setItem('usuario', JSON.stringify(usuario.usuario));
    }else{
        throw "error al cargar la información del usuario.";
    }
    return true;
}

/*
export function setUsuarioSesion(usuario) {
    if (usuario != null && usuario != undefined) {
        AsyncStorage.setItem('logeado', JSON.stringify(usuario.auth));
        AsyncStorage.setItem('userToken', usuario.token);
        AsyncStorage.setItem('usuario', JSON.stringify(usuario.usuario));
    }
}*/

/*
_recogerUsuarioSesion = async () => {
    const user = await AsyncStorage.getItem('usuario');    
    const sendP = await AsyncStorage.getItem('NEST');        
    return { usuarioSesion: JSON.parse(user), password: sendP };
};*/