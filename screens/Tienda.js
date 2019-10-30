
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

//import Modal from "react-native-modal";
import Loader from './Loader';
import PopupRelogin from './PopupRelogin';
import { getProducto } from '../servicios/ProductoService';
import { anunciarSesionCaducada } from '../servicios/AlertSesionTerminada';

export default class Tienda extends React.Component {
  constructor(props) {
    super(props);
    this.listaBalances = [];
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

  _keyExtractorBalance = (item, index) => index.toString();

  _renderItemBalance = ({ item }) => (
    <Balance
      id={item.id}
      item={item}
    ></Balance>
  );

  getProductos = () => {
    this.setState({ loading: true });  
    /*getProducto(this.state.usuarioSesion.id, this.state.token)
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

  _keyExtractorCargo = (item, index) => index.toString();

  _renderItemCargo = ({ item }) => (
    <ItemCargo
      id={item.id_cargo_balance_alumno}
      item={item}
      _onPressItem={this._onPressItemCargo}
    />
  );

  _onPressItemCargo = (item) => {
    this.setState({ item_seleccionado: item });
    this.setState({ modalVisible: true });
  }

  _onClosePopupCargo = () => {
    this.setState({ modalVisible: false });
  };

  renderItem = ({ item }) => {
    const text = `${item}`;
    return (
      <TouchableOpacity>
        <Card>
          <CardItem
            style={{ backgroundColor: "#78CAA7" }} footer bordered>
            <Body>
              <Text >{moment(item.fecha).format("DD-MMM-YYYY")}</Text>
            </Body>
            <Right>
              {/*<Text style={item.pagado ? styles.textoNormal : styles.textoAdeudaRojo} >$ {item.total_adeudo}</Text>*/}
              <Text style={styles.textoNormal}>{item.contador}</Text>
            </Right>
          </CardItem>
          <View>
            <FlatList
              data={item.array_cargos}
              renderItem={this._renderItemCargo}
              keyExtractor={this._keyExtractorCargo}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  _closeanRefreshPopupRelogin = () => {
    this.setState({ tokenExpirado: false });
    this.iniciarBalance();
  };

  _onlyClosePopupRelogin = () => {
    this.setState({ tokenExpirado: false });
  };

  render() {
    return (
      <View style={styles.container}>
        <Loader
          loading={this.state.loading} />
        {/*}
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
              <Card>
                <FlatList
                  data={this.listaBalances}
                  renderItem={this.renderItem}
                  keyExtractor={this._keyExtractorBalance}
                />
              </Card>
            </Content>
          </View>
        </ScrollView>

        <Modal
          transparent={true}
          animationType={'slide'}
          visible={this.state.modalVisible}
          onRequestClose={() => { console.log('close modal') }}>
          <View style={styles.modalBackground}>
            <Card style={{ backgroundColor: "#fff", alignContent: "center" }}>
              <Header>

              </Header>
              <Body>
                <CardItem>
                  <Body>
                    <Text>{this.state.item_seleccionado != null ? this.state.item_seleccionado.nombre_cargo : ''}</Text>
                    <Text note>{this.state.item_seleccionado != null ? moment(this.state.item_seleccionado.fecha).format("DD MMM") : ''}</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text note>{this.state.item_seleccionado != null ? this.state.item_seleccionado.nota : ''}</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Left><Text style={
                    (this.state.item_seleccionado != null && this.state.item_seleccionado.pagado) ?
                      styles.textoPagado : styles.textoAdeudaRojo
                  }>Cargo</Text></Left>
                  <Right>
                    <Text style={
                      (this.state.item_seleccionado != null && this.state.item_seleccionado.pagado) ?
                        styles.textoPagado : styles.textoAdeudaRojo
                    }>${this.state.item_seleccionado != null ? this.state.item_seleccionado.cargo : ''}</Text>
                  </Right>
                </CardItem>
                <CardItem>
                  <Left><Text style={
                    (this.state.item_seleccionado != null && this.state.item_seleccionado.pagado) ?
                      styles.textoPagado : styles.textoAdeudaRojo
                  }>Pagado</Text></Left>
                  <Right>
                    <Text style={
                      (this.state.item_seleccionado != null && this.state.item_seleccionado.pagado) ?
                        styles.textoPagado : styles.textoAdeudaRojo
                    }>$ {this.state.item_seleccionado != null ? this.state.item_seleccionado.total_pagado : ''}</Text>
                  </Right>
                </CardItem>
              </Body>
              <Footer >

                <Button light block onPress={() => this.setState({ modalVisible: false })} textStyle={{ color: '#87838B' }}>
                  <Text>Cerrar</Text>
                </Button>

              </Footer>

            </Card>
          </View>
        </Modal>
      </View>
    );
  }
}


class ItemCargo extends React.Component {
  constructor(props) {
    super(props);
    //this.state = { isVisible: false };
  }

  _onPress = () => {
    //this.setState({ isVisible: !this.state.isVisible });
    //this.props._onPress(this.props.item);
    this.props._onPressItem(this.props.item);
  };

  componentDidMount() {

  }

  render() {
    //onPress={this._onPress}
    return (
      <CardItem button onPress={this._onPress} footer bordered>
        <Body>
          <Text style={this.props.item.pagado ? styles.textoPagado : styles.textoNormal}>{this.props.item.nombre_cargo}</Text>
          <Text note note style={{ fontSize: 12 }}>{this.props.item.nombre_alumno}</Text>
          <Text note style={{ fontSize: 10 }} >{this.props.item.nota}</Text>
        </Body>
        <Right>
          <Text style={this.props.item.pagado ? styles.textoNormal : styles.textoAdeudaRojo} >$ {this.props.item.cargo}</Text>
          {/*<Text>Pagado $ {this.props.item.total_pagado}</Text>          */}
        </Right>
      </CardItem>

    );
  }
}



class Balance extends React.Component {
  constructor(props) {
    super(props);

  }
  _onPress = () => {
    this.props.onPressItem(this.props.id);

  };

  componentDidMount() {

  }
  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Card style={styles.bordeRojo}>
          <CardItem header bordered button onPress={this.props.handlerClick} footer bordered>
            <Left>
              <Thumbnail source={require('../assets/images/alumno_generic_50_50.png')} />
              <Text>{this.props.item.nombre_alumno} {this.props.item.apellidos_alumno}</Text>
            </Left>
            <Body>
            </Body>
            <Right>
              <Text style={this.props.item.cargo == 0 ? styles.textoNormal : styles.textoAdeudaRojo}>Adeuda</Text>
              <Text style={this.props.item.pagado ? styles.textoNormal : styles.textoAdeudaRojo}>$ {this.props.item.total_adeudo}</Text>
            </Right>
          </CardItem>
        </Card>
      </TouchableOpacity>
    )
  }
}


class PupupCargo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null
    };
  }

  componentDidMount() {
    this.setState({ item: this.props.item });
  }

  render() {
    return (
      <Modal
        customBackdrop={<View style={{ flex: 1 }} />}
        transparent={false}
        animationType={'fade'}
        visible={this.props.visible}
        onRequestClose={() => { console.log('close modal') }}>

        <Card>
          <CardItem>
            {/*<Text >ID = {this.state.item.id}</Text>*/}
            <Text>{this.props.item != null ? this.props.item.id : 'SIN VALOR'}</Text>
          </CardItem>
          <CardItem footer>
            {/*<Button light onPress={this.props._onClose}><Text> Cerrar canc </Text></Button>*/}
            <Button light onPress={() => !this.props.visible}><Text> Cerrar  </Text></Button>
          </CardItem>
        </Card>

      </Modal>
    )
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
    backgroundColor: '#CFFFBC',
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
  },
  modalBackgroundModal: {
    flex: 1,
    backgroundColor: '#00000040'
  },
});
