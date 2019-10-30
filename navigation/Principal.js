import React from 'react';

import { Platform, Image, StyleSheet, AsyncStorage, Alert } from 'react-native';

import { Root, Container, ActionSheet, Header, Content, Tab, Tabs, TabHeading, Thumbnail, Icon, Text, Left, Body, Button, Title, Right } from 'native-base';
import HomeClass from '../screens/HomeClass';
import Estados from '../screens/Estados';
import CuentaFamiliar from '../screens/CuentaFamiliar';
/*import SettingsScreen from '../screens/SettingsScreen';*/
import firebase from 'react-native-firebase';

import Sidebar from '../screens/SideBar';
import AppHeader from '../screens/AppHeader';

import PopupCerrarSesion from './PopupCerrarSesion';

import { cerrarSesion } from '../servicios/LoginService';

import { updateToken } from '../servicios/TokenService';



export default class Principal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      permiso_notificacion: false,
      usuarioSesion: null,
      token: "",
      verPopupCerrarSesion: false,
      clicked: null
    }
    this._bootstrapAsync();
  }

  componentDidMount() {

  }

  validarCambioTokenFCM() {

    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          this.modificarToken(fcmToken);
        } else {
          console.debug('User doesn\'t have a device token yet, token = ', fcmToken)
        }
      });
  }

  componentWillUnmount() {

  }

  _bootstrapAsync = async () => {
    const user = await AsyncStorage.getItem('usuario');
    const token = await AsyncStorage.getItem('userToken');
    this.setState({ token: token });
    this.setState({ usuarioSesion: JSON.parse(user) });
    //Validar el token del usuario   

    firebase.messaging().hasPermission().then(hasPermission => {
      if (hasPermission) {
        this.setState({ permiso_notificacion: true });
        this.validarCambioTokenFCM();
      } else {
        Alert.alert("Permisos", "La aplicación no cuenta con permisos para recibir notificaciones.");
        firebase.messaging().requestPermission().then(() => {
          this.validarCambioTokenFCM();
          this.setState({ permiso_notificacion: true });
        }).catch(error => {
          console.error(error);
          this.setState({ permiso_notificacion: false });
        })
      }
    });

  };

  modificarToken = (tokenMensajeria) => {
    updateToken(this.state.usuarioSesion.id, this.state.token, { "token": tokenMensajeria })
      .then(res => res.json())
      .then(res => {
        console.log("Se actualizo el token del usuario");
        //Alert.alert("Error", "Se actualizo el token");
      })
      .catch((e) => {
        Alert.alert("Error", "Existe un detalle con la mensajería en este dispositivo, por favor informe este aviso al equipo de Soporte.");
      });
  };


  salir = () => {
    cerrarSesion(this.state.usuarioSesion,this.state.token);
 
    this.props.navigation.navigate('AuthLoading', {});
  }

  togglePopupCerrarSesion = () => {
    this.setState({ verPopupCerrarSesion: !this.state.verPopupCerrarSesion });
  }

  
  render() {
    return (
      <Root>
        <Container >                 
          <PopupCerrarSesion visible={this.state.verPopupCerrarSesion}
            salir={this.salir}
            nombreUsuarioSesion={this.state.usuarioSesion != null ? this.state.usuarioSesion.nombre : "-"}
          ></PopupCerrarSesion>
          <Tabs tabBarPosition="top">
            <Tab
              heading={<TabHeading ><Icon type="FontAwesome" name="smile-o" /><Text>Inicio</Text></TabHeading>}>
              <HomeClass token={this.state.token} />
            </Tab>
            <Tab
              heading={<TabHeading><Icon name="list" /><Text>Balance</Text></TabHeading>}>
              <Estados token={this.state.token} />
            </Tab>
            <Tab
              heading={<TabHeading><Icon name="md-cog" /><Text>Cuenta</Text></TabHeading>}>
              <CuentaFamiliar token={this.state.token} _salir={this.salir} />
            </Tab>
            <Tab
              heading={<TabHeading><Icon name="md-cog" /><Text>Tienda</Text></TabHeading>}>
              <CuentaFamiliar token={this.state.token} _salir={this.salir} />
            </Tab>
          </Tabs>

        </Container>
      </Root>
    );
  }
}

Principal.navigationOptions = {
  header: null,
  title: 'Principal',
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 0
  }, titulo: {
    fontSize: 12,
  }
});
