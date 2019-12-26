import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableOpacity,
    Image,
    Alert,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';

import { Icon } from "native-base";

import Loader from './Loader';

import { login, setUsuarioSesion } from '../servicios/LoginService';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.usuario = {
            auth: false,
            token: ''
        };
        this.state = {
            loading: false,
            email: '',
            password: '',
            secureTextEntry : true,
        }
    }

    onClickListener = (viewId) => {

        if (this.state.email == '') {
            Alert.alert("Correo Requerido", "Escribe el Correo.");
        } else {

            if (this.state.password == '') {
                Alert.alert("Clave Requerida", "Escribe tu clave de acceso.");

            } else {
                this.setState({ loading: true });            

                login(this.state.email.toLowerCase(), this.state.password)
                    .then(function (res) { return res.json(); })
                    .then(this.handleLogin)
                    .catch(this.handleErrorLogin);

            }
        }
    }

    handleLogin = (data) => {
        this.usuario = data;

        if (this.usuario.auth) {
            delete this.usuario.usuario.mensaje;
            this.usuario.usuario.password = '';

            setUsuarioSesion(this.usuario).then((realizado) => {
                if (realizado) {
                    AsyncStorage.setItem('NEST', this.state.password);
                    this.props.navigation.navigate('Principal', { usuario: this.usuario });
                }
            });

        } else {
            Alert.alert("Usuario no encotrado", this.usuario.mensaje);
        }
        this.setState({ loading: false });
    };

    handleErrorLogin = (error) => {
        this.setState({ loading: false });
        Alert.alert("Exception", "error " + error);
        console.error(error);
    };

    onToggleShowPasswordPressed = () => {
        this.setState({ secureTextEntry : !this.state.secureTextEntry });
    };

    render() {

        return (
            <View style={styles.container}>                
                <Loader loading={this.state.loading} />                
                <View>
                    <Image style={styles.bgImage} source={{ uri: "https://magicintelligence.com/wp-content/uploads/revslider/kiddie/little-boy.png" }} />
                </View>
                <View >
                    <Image source={{ uri: "https://magicintelligence.com/wp-content/uploads/revslider/kiddie/little-boy.png" }} />
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                            placeholder="Correo"
                            keyboardType="email-address"
                            underlineColorAndroid='transparent'
                            autoCapitalize = 'none'
                            autoCorrect={false}
                            onChangeText={(email) => this.setState({ email })} />
                        <Icon style={styles.icon} type="MaterialCommunityIcons" name='email' />
                        {/*
                    <Image style={styles.inputIcon} source={{ uri: 'https://magicintelligence.com/wp-content/uploads/revslider/kiddie/little-girl.png' }} />
                        */}
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.inputs}
                            placeholder="Clave"
                            secureTextEntry={this.state.secureTextEntry}
                            autoCorrect={false}
                            underlineColorAndroid='transparent'                            
                            onChangeText={(password) => this.setState({ password })} />
                        <Icon style={styles.icon}
                        onPress={this.onToggleShowPasswordPressed}
                         type="MaterialCommunityIcons" name='textbox-password' />
                        {/*
                    <Image style={styles.inputIcon} source={{ uri: 'https://magicintelligence.com/wp-content/uploads/revslider/kiddie/kids.png' }} />
                    */}
                    </View>
                    <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
                        <Text style={styles.loginText}>Entrar</Text>
                        {/*<ActivityIndicator animating={this.state.loading} />*/}
                    </TouchableOpacity>

                    {/*
                    <TouchableOpacity style={styles.btnForgotPassword} onPress={() => this.onClickListener('restore_password')}>
                        <Text style={styles.btnText}>¿Olvidaste tu clave?</Text>
                    </TouchableOpacity>
                    */}

                </View>
            </View>
        );
    }
}

const resizeMode = 'center';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8FE3A4',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 300,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',

        shadowColor: "#808080",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    icon: {
        color: '#D636D3',
        marginRight: 15,
        justifyContent: 'center'
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginRight: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 300,
        borderRadius: 30,
        backgroundColor: 'transparent'
    },
    btnForgotPassword: {
        height: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 10,
        width: 300,
        backgroundColor: 'transparent'
    },
    loginButton: {
        backgroundColor: "#00b5ec",

        shadowColor: "#808080",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,
    },
    loginText: {
        color: 'white',
    },
    bgImage: {
        flex: 1,
        resizeMode,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    bgImageTop: {
        flex: 1,
        resizeMode,

    },
    btnText: {
        color: "white",
        fontWeight: 'bold'
    }
}); 