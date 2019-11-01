
import * as WebBrowser from 'expo-web-browser';
import moment from "moment";
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ListView,
  RefreshControl,
  Component,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  FlatList, Modal
} from 'react-native';
import { Container, Footer, Item, Header, Content, Button, Icon, Accordion, List, ListItem, Text, Card, CardItem, Body, Right, Thumbnail, Left } from "native-base";
import { Col, Row, Grid } from 'react-native-easy-grid';

import Loader from './Loader';
import PopupRelogin from './PopupRelogin';
import { getProducto } from '../servicios/ProductoService';
import { anunciarSesionCaducada } from '../servicios/AlertSesionTerminada';

export default class Tienda extends React.Component {
  constructor(props) {
    super(props);
    this.listaProductos = [];
    this.state = {
      loading: false,
      refreshing: false,
      modalVisible: false,
      tokenExpirado: false,
      item_seleccionado: null,
      selected: (new Map()),
      token: "",
      usuarioSesion: null
    }
  }

  componentDidMount() {
    moment.locale('es');
    this.iniciar();
  }

  iniciar = () => {
    this._recogerUsuarioSesion()
      .then(() => {
        this.getProductos();
      }).catch((e) => {
        Alert.alert("Error", "Al cargar actualizar " + e);
      });
  }

  _recogerUsuarioSesion = async () => {
    const user = await AsyncStorage.getItem('usuario');
    const token = await AsyncStorage.getItem('userToken');
    this.setState({ token: token });
    this.setState({ usuarioSesion: JSON.parse(user) });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getProductos();
  }

  getProductos = () => {
    /*this.setState({ loading: true });  
    getProducto(this.state.usuarioSesion.id, this.state.token)
      .then(res => res.json())
      .then(res => {
        this.handleResponse(res, () => {
          this.listaBalances = res.respuesta == null ? [] : res.respuesta;
          if (this.listaBalances.length > 0) {
            this.setState({ loading: false });
            this.setState({ refreshing: false });
          }
        });
      });*/
  };

  //maneja el token expirado
  handleResponse(response, handlerProcess) {
    if (!response.estatus) {
      this.setState({ tokenExpirado: response.tokenExpirado });
      if (response.tokenExpirado) {
        anunciarSesionCaducada(this.iniciarBalance);
      } else {
        Alert.alert("Operación Fallida", "Sucedió un detalle al procesar la operación. ");
      }
    } else {
      handlerProcess();
    }
    this.setState({ loading: false, refreshing: false });
  }

  _keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <View style={styles.container}>
        <Loader
          loading={this.state.loading} />

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
              <Grid>
                <Col style={{ backgroundColor: '#635DB7', height: 200 }}></Col>
                <Col style={{ backgroundColor: '#00CE9F', height: 200 }}></Col>
              </Grid>
              <Grid>
                <Col style={{ backgroundColor: 'pink', height: 200 }}></Col>
                <Col style={{ backgroundColor: 'red', height: 200 }}></Col>
              </Grid>
              <Grid>
                <Col style={{ backgroundColor: '#63AAB7', height: 200 }}></Col>
                <Col style={{ backgroundColor: '#00AA9F', height: 200 }}></Col>
              </Grid>
              <Grid>
                <Col style={{ backgroundColor: '#63DDB7', height: 200 }}></Col>
                <Col style={{ backgroundColor: '#00DD9F', height: 200 }}></Col>
              </Grid>
            </Content>
          </View>
        </ScrollView>
      </View>
    );
  }
}

Tienda.navigationOptions = {
  header: null,
  title: 'Principal Tienda',
};

class ItemProducto extends React.Component {
  constructor(props) {
    super(props);
  }

  _onPress = () => {
    this.props._onPressItem(this.props.item);
  };

  componentDidMount() {

  }

  render() {
    return (
      <CardItem button onPress={this._onPress} footer bordered>
        <Body>
          <Text >Texto</Text>
        </Body>
      </CardItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },


});
