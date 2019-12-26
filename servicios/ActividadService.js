

import URL from './Urls';
import { getHeaderXToken,getPostHeaderXToken } from './Headers';

export function getActividades(idUsuario, token) {
    return fetch(URL.ACTIVIDADES + idUsuario, getHeaderXToken(token));
};


export function tocarEmocion(body,token){      
    return fetch(URL.EMOCION,getPostHeaderXToken(token,body));    
}