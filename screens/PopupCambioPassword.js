import React, { Component } from "react";
import { View, StyleSheet, Image, AsyncStorage, Alert, Modal, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import {
    Container, Left, Card, CardItem, Footer, Thumbnail,
    Header, Item, Label,
    Input, Content, Button,
    Text, Body, Toast, Title, Right, Icon    
} from "native-base";

//import Modal from "react-native-modal";

import { cambiarClave } from '../servicios/UsuarioService';

export default class ModalCambioClave extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showToast: false,
            isModalVisible: false,
            token: "",
            usuarioSesion: null,
            correo: "",
            password: "",
            password_nuevo: "",
            password_confirm: "",
            loading: false

        };
    }

    componentDidMount() {
        this._recogerUsuarioSesion()
            .then(() => {
                //asignar valores
                this.setState({
                    nombre: this.state.usuarioSesion.nombre,
                    correo: this.state.usuarioSesion.correo,
                    password: this.state.usuarioSesion.password
                });
            }).catch((e) => {
                Alert.alert("Error", "Al cargar datos del familiar " + e);
            });
    }

    state = {
        isModalVisible: false
    };

    confirmarCambioContrasena = () => {
        if (this.state.password == "" || this.state.password_nuevo == "" || this.state.password_confirm == "") {
            //Toast.show({ text: "Escribe todos los campos ", buttonText: "Ok", position: "top"});
            Alert.alert("Información", "Escribe todos los campos");
        } else {
            if (this.state.password_confirm !== this.state.password_nuevo) {
                //  Toast.show({ text: "Las nuevas claves no coinciden ", buttonText: "Ok", position: "top" });
                Alert.alert("Información", "Las nuevas claves no coinciden");
            } else {
                //consumir re
                this.cambiarClave();
            }
        }
    }


    cambiarClave = () => {
        this.setState({ loading: true });
        var that = this;

        cambiarClave(this.state.usuarioSesion.id, this.state.token, {
            "correo": this.state.correo,
            "password": this.state.password,
            "password_nuevo": this.state.password_nuevo,
        })
            .then(res => res.json())
            .then(res => {
                if (res.auth) {
                    this.setState({ loading: false, refreshing: false });
                    Alert.alert("Información", res.mensaje,
                        [
                            {
                                text: 'OK', onPress: () => {
                                    that.toggleModal();
                                    that.props._salir();
                                }
                            },
                        ]);
                } else {
                    Alert.alert("Error", res.mensaje);
                }
            })
            .catch((e) => {
                Alert.alert("Error", "Al tratar de cambiar la contraseña " + e);
                this.setState({ loading: false, refreshing: false });
            });
    }


    _recogerUsuarioSesion = async () => {
        const user = await AsyncStorage.getItem('usuario');
        const token = await AsyncStorage.getItem('userToken');
        this.setState({ token: token });
        this.setState({ usuarioSesion: JSON.parse(user) });
    };


    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    render() {
        return (
            <Item onPress={this.toggleModal}>
                <Label style={styles.textoCambioContrasena}>Cambiar contraseña</Label>
                <Input
                    style={styles.textoCambioContrasena}
                    value={'*****'}
                    disabled={true}
                />
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    onRequestClose={() => { console.log('close modal') }}
                    visible={this.state.isModalVisible}>

                    <View style={styles.popupOverlay}>
                        <View style={styles.popup}>
                            <View style={styles.popupContent}>
                                <ScrollView contentContainerStyle={styles.modalInfo}>
                                <Thumbnail source={require('../assets/images/padre_avatar.png')} />
                                    <Text style={styles.name}>{this.state.nombre}</Text>
                                    <Text style={styles.position}>{this.state.correo}</Text>
                                    <Item floatingLabel>
                                        <Label>Contraseña actual</Label>
                                        <Input                                            
                                            secureTextEntry={true}
                                            underlineColorAndroid='transparent'
                                            value={this.state.usuarioSesion != null ? this.state.password : ''}
                                            onChangeText={(password) => this.setState({ password })} />
                                    </Item>
                                    <Item floatingLabel>
                                        <Label>Nueva Contraseña</Label>
                                        <Input                                                                                      
                                            secureTextEntry={true}
                                            underlineColorAndroid='transparent'
                                            value={this.state.usuarioSesion != null ? this.state.password_nuevo : ''}
                                            onChangeText={(password_nuevo) => this.setState({ password_nuevo })} />
                                    </Item>
                                    <Item floatingLabel>
                                        <Label>Confirmar nueva contraseña</Label>
                                        <Input
                                            secureTextEntry={true}
                                            underlineColorAndroid='transparent'
                                            value={this.state.usuarioSesion != null ? this.state.password_confirm : ''}
                                            onChangeText={(password_confirm) => this.setState({ password_confirm })} />
                                    </Item>

                                </ScrollView>
                            </View>
                            <View style={styles.popupButtons}>                              
                            <Button block light onPress={this.toggleModal}>
                                    <Text>Cancelar</Text>
                                </Button>
                                <Button info block onPress={this.confirmarCambioContrasena}>                                    
                                    <Text>Confirmar</Text>
                                    <ActivityIndicator
                                        animating={this.state.loading} />
                                </Button>
                               {/*<TouchableOpacity onPress={this.toggleModal} style={styles.btnClose}>
                                    <Text style={styles.txtClose}>Cerrar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.confirmarCambioContrasena} style={styles.btnClose}>
                                    <Text >Confirmar</Text>
        </TouchableOpacity>*/}
                            </View>
                        </View>
                    </View>
                </Modal>
                {/*
                <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={this.state.isModalVisible}
                    onRequestClose={() => { console.log('close modal') }}>
                    <View style={styles.modalBackground}>
                        <Card style={{ backgroundColor: "#fff", alignContent: "center" }}>
                            <Header>

                            </Header>
                            <Body>
                                <CardItem>
                                    <Body tyle={{ flex: 3, justifyContent: 'center' }}>
                                        <Thumbnail source={require('../assets/images/padre_avatar.png')} />
                                        <Text style={styles.textoNombre} >{this.state.nombre}</Text>
                                    </Body>
                                </CardItem>
                                <Item floatingLabel>
                                    <Label>Contraseña actual</Label>
                                    <Input
                                        secureTextEntry={true}
                                        underlineColorAndroid='transparent'
                                        value={this.state.usuarioSesion != null ? this.state.password : ''}
                                        onChangeText={(password) => this.setState({ password })} />
                                </Item>
                                <Item floatingLabel>
                                    <Label>Nueva Contraseña</Label>
                                    <Input
                                        secureTextEntry={true}
                                        underlineColorAndroid='transparent'
                                        value={this.state.usuarioSesion != null ? this.state.password_nuevo : ''}
                                        onChangeText={(password_nuevo) => this.setState({ password_nuevo })} />
                                </Item>
                                <Item floatingLabel>
                                    <Label>Confirmar nueva contraseña</Label>
                                    <Input
                                        secureTextEntry={true}
                                        underlineColorAndroid='transparent'
                                        value={this.state.usuarioSesion != null ? this.state.password_confirm : ''}
                                        onChangeText={(password_confirm) => this.setState({ password_confirm })} />
                                </Item>
                            </Body>
                            <Footer >                               
                                <Button block light onPress={this.toggleModal}>
                                    <Text>Cancelar</Text>
                                </Button>
                                <Button info block onPress={this.confirmarCambioContrasena}>                                    
                                    <Text>Confirmar</Text>
                                    <ActivityIndicator
                                        animating={this.state.loading} />
                                </Button>
                            </Footer>
                        </Card>
                    </View>
                </Modal>
                */}

            </Item>
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
    },

    /************ modals ************/
    popup: {
        backgroundColor: 'white',
        marginTop: 80,
        marginHorizontal: 20,
        borderRadius: 7,
    },
    popupOverlay: {
        backgroundColor: "#00000057",
        flex: 1,
        marginTop: 0
    },
    popupContent: {
        //alignItems: 'center',
        margin: 5,
        height: 250,
    },
    popupHeader: {
        marginBottom: 45
    },
    popupButtons: {
        marginTop: 15,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: "#eee",
        justifyContent: 'center'
    },
    popupButton: {
        flex: 1,
        marginVertical: 16
    },
    btnClose: {
        height: 20,
        backgroundColor: '#20b2aa',
        padding: 20
    },
    modalInfo: {
        alignItems: 'center',
        justifyContent: 'center',
    }

});
