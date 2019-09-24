
import * as WebBrowser from 'expo-web-browser';
import moment from "moment";
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Component,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from 'react-native';


import {
  Container, CheckBox, TextInput,
  Header, DatePicker, Form, Item, Label,
  Input, Content, Button,
  Text, Body, Toast
} from "native-base";

import Modal from "react-native-modal";

import Loader from './Loader';
import PopupCambioPassword from './PopupCambioPassword';
import PopupRelogin from './PopupRelogin';
import { cambiarClave } from '../servicios/UsuarioService';
import { anunciarSesionCaducada } from '../servicios/AlertSesionTerminada';

export default class CuentaFamiliar extends React.Component {
  constructor(props) {
    super(props);
    this.listaBalances = [];
    this.state = {
      showToast: false,
      tokenExpirado:false,
      loading: false,
      refreshing: false,
      token: "",
      usuarioSesion: null,
      mensaje: "",
      nombre: "",
     // telefono: "",
      fecha_nacimiento: null,
      correo: "",
      celular: "",
      religion: "",
      cambio_password: false
      
    }
    this.setDate = this.setDate.bind(this);

  }

  componentDidMount() {
    this.iniciarDatosUsuario();
  }

  iniciarDatosUsuario() {
    this._recogerUsuarioSesion()
      .then(() => {
        //asignar valores
        this.setState({
          nombre: this.state.usuarioSesion.nombre,
          //telefono: this.state.usuarioSesion.telefono,
          celular: this.state.usuarioSesion.celular,
          fecha_nacimiento: this.state.usuarioSesion.fecha_nacimiento,
          correo: this.state.usuarioSesion.correo,
          password: this.state.usuarioSesion.password,
          religion: this.state.usuarioSesion.religion
        });
      }).catch((e) => {
        Alert.alert("Error", "Al cargar la cuenta del familiar " + e);
      });
  }


  existenModificaciones() {
    if (this.state.usuarioSesion.nombre != this.state.nombre) {
      return true;
    }   
    if (this.state.usuarioSesion.celular != this.state.celular) {
      return true;
    }

    if (this.state.usuarioSesion.fecha_nacimiento != this.state.fecha_nacimiento) {
      return true;
    }
    if (this.state.usuarioSesion.religion = this.state.religion) {
      return true;
    }
    return false;
  }


  _recogerUsuarioSesion = async () => {
    const user = await AsyncStorage.getItem('usuario');
    const token = await AsyncStorage.getItem('userToken');
    this.setState({ token: token });
    this.setState({ usuarioSesion: JSON.parse(user) });
  };

  _onRefresh = () => {
    //this.setState({ refreshing: true });
  }

  validarForma = () => {
    try {

      if (this.state.nombre == "") {
        Alert.alert("Validación", "El nombre es requerido.");
        return false;
      }

      if (this.state.correo == "") {
        Alert.alert("Validación", "El correo es requerido.");
        return false;
      }
      if (this.state.celular == "") {
        Alert.alert("Validación", "El numero de celular es requerido.");
        return false;
      }

      if (this.state.fecha_nacimiento == "" || this.state.fecha_nacimiento == undefined) {
        Alert.alert("Validación", "La fecha de nacimiento es requerida.");
        return false;
      }
      return true;
    } catch (e) {
      Alert.alert("Error", "Error al validar los datos " + e);
      return false;
    }
  };

  modificarDatos = () => {

    if (this.existenModificaciones()) {
      if (this.validarForma) {
        this.setState({ loading: true });      
        cambiarClave(this.state.usuarioSesion.id, this.state.token)
        .then(res => res.json())
        .then(res => {
          this.handleResponse(res, () => {
            this.listaBalances = res.respuesta == null ? [] : res.respuesta;
            if (this.listaBalances.length > 0) {
              this.setState({ loading: false });
              this.setState({ refreshing: false });
            }
          });
        });

        /*fetch('https://api-ambiente-desarrollo.herokuapp.com/cliente/' + this.state.usuarioSesion.id,
          {
            method: 'PUT',
            headers: {
              'Content-Type': "application/json", 'x-access-token': 'Token ' + this.state.token
            },
            body: JSON.stringify({
              "nombre": this.state.nombre,
              "telefono": this.state.telefono,
              "celular": this.state.celular,
              "fecha_nacimiento": this.state.fecha_nacimiento,
              "religion": this.state.religion,
              "correo": this.state.correo
            }),
          })
          .then(res => res.json())
          .then(res => {
            this.setState({ loading: false, refreshing: false });
            if (res) {
              Alert.alert("Información", "Se modificaron los datos. ");
            }
          })
          .catch((e) => {
            Alert.alert("Error", "Al cargar modificar los datos " + e);
          });*/
      }
    } else {
      Alert.alert("Info", "Modifique los datos y después oprima el boton Guardar.");
    }
  }

  handleResponse(response, handlerProcess) {
    if (!response.estatus) {
      this.setState({ tokenExpirado: response.tokenExpirado });
      if (response.tokenExpirado) {        
        anunciarSesionCaducada(this.iniciarDatosUsuario);
      } else {
        Alert.alert("Operación Fallida", "Sucedió un detalle al procesar la operación. ");
      }
    } else {
      handlerProcess();
    }
    this.setState({ loading: false, refreshing: false });
  }

  setDate(newDate) {
    this.setState({ fecha_nacimiento: newDate });
  }

  _closeanRefreshPopupRelogin = () => {
    this.state.tokenExpirado = false;
    this.iniciarDatosUsuario();
  };

  _onlyClosePopupRelogin() {
    this.state.tokenExpirado = false;
  };

  render() {
    return (
      <View style={styles.container}>
        <Loader
          loading={this.state.loading} />
{/*
        <PopupRelogin tokenExpirado={this.state.tokenExpirado}
          navigation={this.props.navigation}
          closeAction={this._closeanRefreshPopupRelogin}
          onlyClose={this._onlyClosePopupRelogin}
        ></PopupRelogin>*/}

        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View>
            <Content style={styles.container}>             
              <Form>
                <Item padder>
                  <Label>Nombre</Label>
                  <Input
                    placeholder="Nombre"
                    underlineColorAndroid='transparent'
                    value={this.state.usuarioSesion != null ? this.state.nombre : ''}
                    onChangeText={(nombre) => this.setState({ nombre })} />
                </Item>
                {/*<Item padder>
                  <Label>Teléfono</Label>
                  <Input
                    placeholder="Teléfono"
                    underlineColorAndroid='transparent'
                    value={this.state.usuarioSesion != null ? this.state.telefono : ''}
                    onChangeText={(telefono) => this.setState({ telefono })} />
                </Item>*/}
                <Item padder>
                  <Label>Fecha Nac.</Label>
                  <DatePicker
                    defaultDate={this.state.usuarioSesion != null ? this.state.fecha_nacimiento : new Date()}
                    format="DD-MM-YYYY"
                    minimumDate={new Date(1950, 1, 1)}
                    maximumDate={new Date()}
                    locale={"es"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"calendar"}
                    placeHolderText={this.state.fecha_nacimiento != null ? this.state.fecha_nacimiento.toString().substr(0, 10) : 'Cambiar'}
                    textStyle={{ color: "green" }}
                    placeHolderTextStyle={{ color: "black" }}
                    onDateChange={this.setDate}
                    disabled={false}
                  />

                </Item>
                <Item padder>
                  <Label>Correo</Label>
                  <Input
                    placeholder="Correo"
                    underlineColorAndroid='transparent'
                    value={this.state.usuarioSesion != null ? this.state.correo : ''}
                    onChangeText={(correo) => this.setState({ correo })} />

                </Item>
                <Item padder>
                  <Label>Celular</Label>
                  <Input
                    placeholder="Celular"
                    underlineColorAndroid='transparent'
                    value={this.state.usuarioSesion != null ? this.state.celular : ''}
                    onChangeText={(celular) => this.setState({ celular })} />
                </Item>
                <Item padder>
                  <Label>Religión</Label>
                  <Input
                    placeholder="Religión"
                    underlineColorAndroid='transparent'
                    value={this.state.usuarioSesion != null ? this.state.religion : ''}
                    onChangeText={(religion) => this.setState({ religion })} />
                </Item>

                <PopupCambioPassword _salir={this.props._salir} ></PopupCambioPassword>

                <Item padder>
                </Item>

                <Button block rounded info onPress={this.modificarDatos}><Text>Guardar</Text></Button>
              </Form>
            </Content>
          </View>

        </ScrollView>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDED',
  },
  textoPagado: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: 'gray'
  },
  textoAdeudaRojo: {
    color: 'red',
    fontSize: 12
  },
  bordeRojo: {
    borderColor: '#FF5B5B',
    borderWidth: 1
  }
});
