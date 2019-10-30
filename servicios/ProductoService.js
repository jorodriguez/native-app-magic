

import URL from './Urls';
import { getHeaderXToken } from './Headers';

export function getProductos(idSucursal, token) {
    return fetch(URL.PRODUCTOS + idSucursal, getHeaderXToken(token));
};
