
import * as WebBrowser from 'expo-web-browser';
import moment from "moment";
import React from 'react';

import * as Animatable from 'react-native-animatable'

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  FlatList,
  View,
  Span,
  RefreshControl,
  AsyncStorage,
  Component, Alert
} from 'react-native';

import { Container, Header, Content, Card, CardItem, Text, Left, Icon, Thumbnail, Right, Button, Body } from "native-base";

import ConfettiCannon from 'react-native-confetti-cannon';

import firebase from 'react-native-firebase';

import { SimpleAnimation } from 'react-native-simple-animations';

import Loader from './Loader';

import PopupRelogin from './PopupRelogin';

import { getActividades } from '../servicios/ActividadService';

import { anunciarSesionCaducada } from '../servicios/AlertSesionTerminada';

//https://oblador.github.io/react-native-vector-icons/
//https://www.bootdey.com/react-native-snippet/9/Login-form-ui-example
export default class HomeClass extends React.Component {
  constructor(props) {
    super(props);
    this.lista = [];
    this.state = {
      loading: false,
      tokenExpirado: false,
      image: null,
      ref: null,
      contador_sin_revisar: 0,
      ultima_actividad: null,
      refreshing: false,
      selected: (new Map()),
      token: "",
      usuarioSesion: null
    }
  }

  componentWillUnmount() {
    //  this.removeNotificationDisplayedListener();
    //this.removeNotificationListener();
    this.removeNotificationOpenedListener();
    this.removeNotificationDisplayedListener();
  }

  _recogerUsuarioSesion = async () => {
    const user = await AsyncStorage.getItem('usuario');
    const token = await AsyncStorage.getItem('userToken');
    this.setState({ token: token });
    this.setState({ usuarioSesion: JSON.parse(user) });
  };

  componentDidMount() {

    this.iniciarListaActividades();
    moment.locale('es');
    firebase.messaging().hasPermission().then(hasPermission => {
      if (hasPermission) {
        this.managedNotificaction();
      } else {
        firebase.messaging().requestPermission().then(() => {
          this.managedNotificaction();
        }).catch(error => {
          console.error(error);
        })
      }
    });
    const ref = firebase.storage().ref('default/little-girl.png');;
    ref.getDownloadURL()
      .then((url) => {
        this.setState({ image: url, ref: ref });
        Alert.alert("", "" + JSON.stringify(ref));
      });
  }

  iniciarListaActividades = () => {
    this._recogerUsuarioSesion()
      .then(() => {
        this.getActividades();
      }).catch((e) => {
        Alert.alert("Error", "Al cargar las actividades");
      });
  }

  managedNotificaction() {
    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification = notificationOpen.notification;
      //this.setState({ notificacion: notification });
      this.getActividades();
    });

    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
      // Process your notification as required
      this.setState({ contador_sin_revisar: this.state.contador_sin_revisar + 1 });
      firebase.notifications().setBadge(this.state.contador_sin_revisar);
    });

    this.notificationListener = firebase.notifications().onNotification((notification) => {
      // si llego una notificacion          
      this.setState({ contador_sin_revisar: this.state.contador_sin_revisar + 1 });
    });
  }

  getActividades = () => {
    this.setState({ loading: true });
    getActividades(this.state.usuarioSesion.id, this.state.token)
      .then(res => res.json())
      .then(res => {
        let that = this;
        this.handleResponse(res, () => {
          that.lista = res.respuesta == null ? [] : res.respuesta;
          if (that.lista.length > 0) {
            that.setState({ ultima_actividad: this.lista[0] });
          }
        });
      })
      .catch((e) => {
        Alert.alert("Error", "Al cargar las actividades " + e);
      });
  };

  //maneja el token expirado
  handleResponse(response, handlerProcess) {
    if (!response.estatus) {
      this.setState({ tokenExpirado: response.tokenExpirado });
      if (response.tokenExpirado) {
        anunciarSesionCaducada(this.iniciarListaActividades);
      } else {
        Alert.alert("Operación Fallida", "Sucedió un detalle al procesar la operación. ");
      }
    } else {
      handlerProcess();
    }
    this.setState({ loading: false, refreshing: false });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getActividades();
  }

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id) => {
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return { selected };
    });
  };

  _renderItem = ({ item, index }) => (
    <ItemActividad
      id={item.id}
      selected={!!this.state.selected.get(item.id)}
      item={item}
      activar_animacion_confeti={index == 0 && item.actividad == 'Logro'}
    />
  );

  _closeanRefreshPopupRelogin = () => {
    this.setState({ tokenExpirado: false });
    this.iniciarListaActividades();
  };

  _onlyClosePopupRelogin = () => {
    this.setState({ tokenExpirado: false });
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
          }
          contentContainerStyle={styles.contentContainer}>

          {/*
  <Text>ref {this.state.ref != null ? JSON.stringify(this.state.ref) : ''}</Text>
          <Image source={this.state.image != null ? this.state.image : null} />
*/}
          <View style={styles.getStartedContainer}>
            {/*<DevelopmentModeNotice />*/}
            {/*
          <TokenExpiredMonitor label="Recargar Actividades"
                                tokenExpired={JSON.stringify(this.state.tokenExpirado)}                                 
                                />
          */                   }
            <Text>Actividades de hoy</Text>
          </View>
          <Content padder >
            <FlatList
              data={this.lista}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </Content>
        </ScrollView>

      </View>
    );
  }
}

const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

class ItemActividad extends React.Component {
  constructor() {
    super();
    this.state = {
      activar_animacion: false,
      liked: false
    };
    this.lastPress = 0
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  _activarAnimacion = () => {
    this.setState({ activar_animacion: false });
    Alert.alert("Anim", "ok");
    setTimeout(() => {
      this.setState({ shoot: true });
    }, 500);
  };

  componentDidMount() {

  }


  //--animaciones
  handleLargeAnimatedIconRef = (ref) => {
    this.largeAnimatedIcon = ref
  }

  handleSmallAnimatedIconRef = (ref) => {
    this.smallAnimatedIcon = ref
  }

  animateIcon = () => {
    const { liked } = this.state
    this.largeAnimatedIcon.stopAnimation()

    if (liked) {
      this.largeAnimatedIcon.bounceIn()
        .then(() => this.largeAnimatedIcon.bounceOut())
      this.smallAnimatedIcon.pulse(200)
    } else {      
      
      this.largeAnimatedIcon.bounceIn()
        .then(() => {
          this.largeAnimatedIcon.bounceOut()
          this.smallAnimatedIcon.bounceIn()
        })
        .then(() => {
          if (!liked) {
            //this.setState(prevState => ({ liked: !prevState.liked }))
          }
        });      
    }
  }

  handleOnPress = () => {
    const time = new Date().getTime()
    const delta = time - this.lastPress
    const doublePressDelay = 400

    if (delta < doublePressDelay) {
      this.animateIcon()
    }
    this.lastPress = time
  }

  handleOnPressLike = () => {
    this.smallAnimatedIcon.bounceIn()
    this.setState({ liked: !this.state.liked });
    this.animateIcon();
    //this.setState(prevState => ({ liked : !prevState.liked }))
  }
  // animaciones


  render() {
    const { liked } = this.state;
    return (
      <View>

        <Card>
          <CardItem>
            <Left>
              <Icon name={this.props.item.icono}
                type="FontAwesome"
                style={{ fontSize: 30, color: '#BC6CE9' }} />
              <Body>
                <SimpleAnimation delay={1000} duration={1000} fade staticType='zoom' direction='up'>
                  <Text>{this.props.item.actividad}</Text>
                  {
                    (this.props.item.sub_actividad != null && this.props.item.sub_actividad != '') ?
                      <Text>{this.props.item.sub_actividad}</Text> : null
                  }
                  <Text note style={{ fontSize: 10 }}>{this.props.item.nombre_alumno}</Text>
                </SimpleAnimation>
              </Body>
              <Right>
                <SimpleAnimation delay={1000} duration={1000} fade staticType='zoom' direction='up'>
                  <Text note style={{ fontSize: 10 }}>{moment(this.props.item.fecha_hora_text).format("DD MMM h:mm a")}
                  </Text>
                </SimpleAnimation>
              </Right>
            </Left>
          </CardItem>
          <CardItem bordered>      
            {
              (this.props.activar_animacion_confeti || this.state.activar_animacion) ?
                <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} /> : null
            }
            <Body>
            <AnimatedIcon
              ref={this.handleLargeAnimatedIconRef}
              name="heart"
              color="#FF5733"              
              style={styles.animatedIcon}
              duration={800}
              delay={300}
            />

              <SimpleAnimation delay={1000} duration={1000} fade staticType='zoom' direction='up'>
                <Text>
                  {this.props.item.nota}
                </Text>
              </SimpleAnimation>
            </Body>
          </CardItem>

          <CardItem footer bordered>
            <Left>
              <Button transparent
                onPress={this.handleOnPressLike}>
                <AnimatedIcon
                  ref={this.handleSmallAnimatedIconRef}
                  type="FontAwesome"
                  name={liked ? 'heart' : 'heart-o'}                  
                  size={100}
                  style={ liked ? styles.iconCorazonMarcado :styles.iconCorazon}
                />
              </Button>
            </Left>
            <Body>
            
            </Body>
            <Right>
            </Right>
          </CardItem>

        </Card>
      </View>
    );
  }

  estiloActividad = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start', // if you want to fill rows left to right    
      padding: 14,
      minHeight: 70,
      backgroundColor: '#fff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#DAE0FF'
    },
    containerActividad: {
      backgroundColor: '#fff',
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
    },
    headerActividad: {
      flex: 1,
      alignContent: 'space-between',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      backgroundColor: 'red'
    },
    card: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#CFD4EC",
      padding: 5,
      backgroundColor: '#fff',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 5,
      shadowOpacity: 1.0
    },
    itemImage: {
      width: '14%',
      alignItems: 'flex-start',
      alignContent: "center",
      paddingBottom: 1,
    },

  });

}


HomeClass.navigationOptions = {
  header: null,
  title: 'Joel',
};


function DevelopmentModeNotice() {
  if (__DEV__) {
    return (
      <Text style={styles.getStartedText}>
        En desarrollo.
      </Text>
    );
  } else {
    return (
      <Text style={styles.getStartedText}>
        en producción
      </Text>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BCF0FF',
    paddingTop: 2,
  },
  iconCorazon: {
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    color:"#F1948A",
   
  },
  iconCorazonMarcado: {
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems:'center',
    color:"#F1948A",
   
  },
  animatedIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderRadius: 160,
    opacity: 0,
    color:"#E74C3C",
    //width: '100%',
    //height: '100%',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 7,
    lineHeight: 10,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#9EE6FC"
  },
  alumnoImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',

  },
  welcomeImage: {
    width: 90,
    height: 70,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  logoNoticeImage: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
