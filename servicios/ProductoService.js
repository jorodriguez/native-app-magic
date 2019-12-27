

import URL from './Urls';
import { getHeaderXToken } from './Headers';

export function getProductos(pagina, token) {
    console.log("Consultando productos desde el servicio");
    return fetch(URL.PRODUCTOS + pagina , getHeaderXToken(token));
};
