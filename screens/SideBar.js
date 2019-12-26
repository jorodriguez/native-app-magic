
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
      telefono: "",
      fecha_nacimiento: null,
      correo: "",
      celular: "",
      religion: "",
      cambio_password: false
    }
    this.setDate = this.setDate.bind(this);

  }

  componentDidMount() {
    this.recogerUsuarioSesion();
  }
  recogerUsuarioSesion = async () => {
    const user = await AsyncStorage.getItem('usuario');
    const token = await AsyncStorage.getItem('userToken');
    this.setState({ token: token });
    this.setState({ usuarioSesion: JSON.parse(user) });
  };

  render() {
    return (
      <View style={styles.container}>
       <ScrollView
          style={styles.container}>
          <View>
            <Content style={styles.container}>
              
              <Label>{this.state.usuarioSesion.nombre}}</Label>
              
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
