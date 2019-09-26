

import URL from './Urls';
import { getPutHeaderXToken } from './Headers';

export function cambiarClave(idUsuario, token,body) {
    return fetch(URL.CAMBIO_CLAVE + idUsuario,getPutHeaderXToken(token,body));
    /*{
        method: 'PUT',
        headers: {
            'Content-Type': "application/json", 'x-access-token': 'Token ' + this.state.token
        },
        body: JSON.stringify({
            "correo": this.state.correo,
            "password": this.state.password,
            "password_nuevo": this.state.password_nuevo,
        }),
    })     */
};

export function modificarDatos(idUsuario, token,body) {
    return fetch(URL.CLIENTE + idUsuario,getPutHeaderXToken(token,body));
    /*{
        method: 'PUT',
        headers: {
            'Content-Type': "application/json", 'x-access-token': 'Token ' + this.state.token
        },
        body: JSON.stringify({
            "correo": this.state.correo,
            "password": this.state.password,
            "password_nuevo": this.state.password_nuevo,
        }),
    })     */
};
