

import { AsyncStorage, Alert } from 'react-native';

import { cerrarSesion, login, setUsuarioSesion } from '../servicios/LoginService';


export function anunciarSesionCaducada(reloadFunctionWhenNewSesion) {
    Alert.alert(
        'Seguridad',
        'Su sesión caducó, oprima OK para seguir en la aplicación. ',
        [
            //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => relogin(reloadFunctionWhenNewSesion) },
        ],
        { cancelable: false },
    );
};


_recogerUsuarioSesion = async () => {
    const user = await AsyncStorage.getItem('usuario');
    const sendP = await AsyncStorage.getItem('NEST');
    return { usuarioSesion: JSON.parse(user), password: sendP };
};

const relogin = (reloadFunctionWhenNewSesion) => {
    // this.setState({ loading: true });
    this._recogerUsuarioSesion()
        .then((usuario) => {
            login(usuario.usuarioSesion.correo, usuario.password)
                .then(function (res) { return res.json(); })
                .then((data) => this.handleLogin(data, reloadFunctionWhenNewSesion))
                .catch(this.handleErrorLogin);
        }).catch((e) => {
            //  this.setState({ loading: false });
            Alert.alert("Error", "Al cargar información del usuario." + e);
        });

}

handleLogin = (data, reloadFunctionWhenNewSesion) => {
    try {
        let usuario = data;
        if (usuario.auth) {
            setUsuarioSesion(usuario).then((realizado) => {
                if (realizado) {
                    reloadFunctionWhenNewSesion();
                }
            });
            //this.props.navigation.navigate('Principal', { });            
        } else {
            Alert.alert("Usuario no encontrado", "Vuela a intentarlo ");

        }
        //this.setState({ loading: false });            
        //this.props.closeAction();
    } catch (e) {
        Alert.alert("Ups ", "Error al intentar obtener una sesión nueva " + e);
    }
};

handleErrorLogin = (error) => {
    this.setState({ loading: false });
    //this.props.onlyClose();
    Alert.alert("Exception", "error " + error);
    console.error(error);
};
/*
const salir = () => {
    cerrarSesion();
    this.props.onlyClose();
    this.props.navigation.navigate('AuthLoading', {});
}*/