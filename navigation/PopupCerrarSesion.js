import React, { Component } from "react";
import { Text, View, StyleSheet, Image, AsyncStorage } from "react-native";
import { ActionSheet,Icon, Button, Header, Left, Right, Card, ListItem, Content, Footer, Body, Title, Container, Thumbnail } from 'native-base';
import Modal from "react-native-modal";

var BUTTONS = [
    { text: "Cerrar Sesión", icon: "logout", iconColor: "#25de5b" },
    { text: "Cancelar", icon: "close", iconColor: "red" }
  ];
  var CERRAR_SESION = 0;
  var CANCEL_INDEX = 1;
  
export default class ModalTester extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            clicked:null
        };

    }

    componentDidMount() {

    }

    state = {
        isModalVisible: false
    };
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };



    render() {
        /*
              const deviceWidth = Dimensions.get("window").width;
              const deviceHeight = Platform.OS === "ios"
                ? Dimensions.get("window").height
                : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");
      */
        return (

            <Header>
                <Left>                   
                    <Button
                        onPress={() =>
                            ActionSheet.show(
                                {
                                    options: BUTTONS,
                                    cancelButtonIndex: CANCEL_INDEX,
                                    /*destructiveButtonIndex: DESTRUCTIVE_INDEX,*/
                                    title: "Magic Intelligence"
                                },
                                buttonIndex => {
                                    //this.setState({ clicked: BUTTONS[buttonIndex] });
                                    if(buttonIndex == 0){
                                        this.props.salir();
                                    }
                                }
                            )}
                    >
                         <Icon name='menu' />
                    </Button>
                </Left>
                <Body>
                    <Title style={styles.titulo}>{this.props.nombreUsuarioSesion}</Title>
                    {this.props.contenido}
                </Body>
                <Right>
                    <Image square source={require('../assets/images/magic.png')} />
                </Right>
           </Header>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 0
    }, titulo: {
        fontSize: 14,
    }
});
