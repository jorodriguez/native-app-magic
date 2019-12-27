
const BASE = 'https://api-ambiente-desarrollo.herokuapp.com';
//const BASE = 'https://api-ambiente-produccion.herokuapp.com';

const URL = {    
    LOGIN : BASE+'/auth_cliente/login',
    CAMBIO_CLAVE :BASE+'/auth_cliente/',
    ACTIVIDADES : BASE+'/actividades/',
    CLIENTE: BASE+'/cliente/',
    BALANCE : BASE+'/balance_familiar_alumno/',
    EMOCION : BASE+'/emocion',
    PRODUCTOS: BASE+'/productos/' 
}


export default URL;