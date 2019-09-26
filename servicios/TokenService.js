import URL from './Urls';
import { getHeaderXToken,getPostHeaderXToken } from './Headers';

export function updateToken(id_usuario,token,body) {
   return fetch(URL.CLIENTE + id_usuario ,getPostHeaderXToken(token,body));

}