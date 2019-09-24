

import URL from './Urls';
import { getHeaderXToken } from './Headers';

export function getActividades(idUsuario, token) {
    return fetch(URL.ACTIVIDADES + idUsuario, getHeaderXToken(token));
};
