

import URL from './Urls';
import { getHeaderXToken } from './Headers';

export function getBalance(idUsuario, token) {
    return fetch(URL.BALANCE + idUsuario, getHeaderXToken(token));
};
