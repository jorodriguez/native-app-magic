import React, { Component } from "react";
import { View, StyleSheet, Image, AsyncStorage, Alert, Modal, ActivityIndicator } from "react-native";
import {
    Container, Left, Card, Footer, Thumbnail,
    Header, Item, Label,
    Input, Content, Button,
    Text, Body, Toast, Title, Right
} from "native-base";

import { withNavigation } from 'react-navigation';

import { tsImportEqualsDeclaration } from "@babel/types";

import { cerrarSesion, login, setUsuarioSesion } from '../servicios/LoginService';

//import Modal from "react-native-modal";

class PopupRelogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isModalVisible: false,
            token: "",
            usuarioSesion: null,
            correo: "",
            password: "",
        };
    }

    componentDidMount() {
     }

    _recogerUsuarioSesion = async () => {
        const user = await AsyncStorage.getItem('usuario');
        //const token = await AsyncStorage.getItem('userToken');
        const sendP = await AsyncStorage.getItem('NEST');
        //this.setState({ token: token });
        this.setState({ usuarioSesion: JSON.parse(user), password: sendP });
    };

    relogin = () => {
        this.setState({ loading: true });
        this._recogerUsuarioSesion()
            .then(() => {                
                login(this.state.usuarioSesion.correo, this.state.password)
                    .then(function (res) { return res.json(); })
                    .then(this.handleLogin)
                    .catch(this.handleErrorLogin);
            }).catch((e) => {
                this.setState({ loading: false });
                Alert.alert("Error", "Al cargar información del usuario." + e);
            });

    }

    handleLogin = (data) => {
        try {
            let usuario = data;
            if (usuario.auth) {       
                setUsuarioSesion(usuario);                
                this.props.navigation.navigate('Principal', { });            
            } else {
                Alert.alert("Usuario no encotrado", "usu" + JSON.stringify(usuario));
            }                 
            this.setState({ loading: false });            
            this.props.closeAction();
        } catch (e) {
            Alert.alert("err ", "err "+e);
        }
    };

    handleErrorLogin = (error) => {
        this.setState({ loading: false });
        this.props.onlyClose();
        Alert.alert("Exception", "error " + error);
        console.error(error);
    };

    salir = () => {
        cerrarSesion();
        this.props.onlyClose();
        this.props.navigation.navigate('AuthLoading', {});
    }

    state = {
        isModalVisible: false
    };

    render() {
        return (
            <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.props.tokenExpirado}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <Card style={{ backgroundColor: "#fff", alignContent: "center" }}>
                        <Header>
                            <Left style={{ flex: 1 }}>
                            </Left>
                            <Body tyle={{ flex: 3, justifyContent: 'center' }}>
                                <Thumbnail source={require('../assets/images/padre_avatar.png')} />
                                <Text style={styles.textoNombre} >{this.state.nombre}</Text>
                            </Body>
                            <Right style={{ flex: 1 }}></Right>
                        </Header>
                        <Body>
                            <Text>El tiempo de la sesión terminó par seguir </Text>
                            <ActivityIndicator
                                animating={this.state.loading} />
                        </Body>
                        <Footer >
                            <Button info block onPress={this.relogin}>
                                <Text>Confirmar</Text>
                            </Button>
                            <Button block onPress={this.salir}>
                                <Text>Cerrar sesión</Text>
                            </Button>
                        </Footer>
                    </Card>
                </View>
            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 0
    }, titulo: {
        fontSize: 12,
    },
    textoInfoReinicio: {
        color: 'red',
        fontSize: 12
    },
    textoCambioContrasena: {
        color: '#029CFA',
        fontSize: 13
    },
    textoNombre: {
        color: '#029CFA',
        fontSize: 11
    },
    textoInfoCorreo: {
        color: '#928C9B',
        fontSize: 10
    }
});

export default withNavigation(PopupRelogin);