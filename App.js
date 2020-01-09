//import React,{ useState } from 'react';
import React from 'react';
import { StatusBar, StyleSheet, Platform, Image, TextInput, View, ScrollView } from 'react-native';

import firebase from 'react-native-firebase';

import { Notification, NotificationOpen } from 'react-native-firebase';
import {StyleProvider , Container, ActionSheet, Header, Content, Tab, Tabs, TabHeading, Thumbnail, Icon, Text, Left, Body, Button, Title, Right } from 'native-base';

//import customVariables from './theme/variables';
import getTheme from './native-base-theme/components/index';
import material from './native-base-theme/variables/material';

import Principal from './navigation/Principal';
import PrincipalTienda from './navigation/PrincipalTienda';
import Login from './screens/Login';
import HomeClass from './screens/HomeClass';
import AuthLoadingScreen from './navigation/AuthLoadingScreen';
//import Tienda from './screens/Tienda';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

//Deshabilita la caja amarilla de warnings
console.disableYellowBox = true;

const MainNavigator = createStackNavigator(
  {
    Principal: Principal,    
  }
);

const MainNavigatorTienda = createStackNavigator(
  {
    PrincipalTienda: PrincipalTienda,    
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    principal: MainNavigator,
    Login: Login,
    PrincipalTienda : MainNavigatorTienda,            
  },
    {
      initialRouteName: 'AuthLoading',
    }
  ));


export default class App extends React.Component {
  constructor() {
    super();
    this.state = { log: "" };
  }

  componentWillUnmount() {
   
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    //const { user } = await firebase.auth().signInAnonymously();

    //await firebase.analytics().logEvent('foo', { bar: '123' });
    //const enabled = await firebase.messaging().hasPermission();
    //this.setState({permiso_notificacion:enabled});
    //    this.setState({log:this.state.log+" Enable Messa "+enabled});

        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
          // user has a device token
          this.setState({ log: this.state.log + "TOKEN " + fcmToken });
        } else {
          // user doesn't have a device token yet
          this.setState({ log: this.state.log + "NO TOKEN " });
        }

    /*if (enabled) {
      // user has permissions
    } else {
      // user doesn't have permission
      firebase.messaging().requestPermission()
        .then(() => {
          // User has authorised  
        })
        .catch(error => {
          // User has rejected permissions  
        });
    } */
    //App in Foreground and background
    /*this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {      
      const action = notificationOpen.action;      
      const notification = notificationOpen.notification;
      this.setState({ notificacion: notification });
    });   */
  }

  render() {        
    return (          
      <StyleProvider style={getTheme(material)}>
        <Container style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppContainer></AppContainer>
        </Container>             
        </StyleProvider> 
    );
    
  }
}

//hacer hook como el componente Banner
const Loader = props => {
  const {
    loading,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => { console.log('close modal') }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <Image
            source={require('./assets/images/magic.png')}
            style={styles.loaderImage}
          />
          <ActivityIndicator
            animating={loading} />
        </View>
      </View>
    </Modal>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    //paddingTop: 25
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  loaderImage: {
    width: 90,
    height: 70,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  }
});

