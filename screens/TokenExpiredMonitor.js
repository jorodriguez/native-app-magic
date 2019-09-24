import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';

import { Card, CardItem, Text, Left, Icon, Right, Body, Button } from "native-base";

import { SimpleAnimation } from 'react-native-simple-animations';

const TokenExpiredMonitor = props => {
  const {
    tokenExpired,
    label,
    ...attributes
  } = props;

  
  return function () {
    if (tokenExpired == 'true') {
      return (
        <View style={styles.row}>
          <Text>token expirado</Text>
          <TouchableOpacity >
            <Card>
              <CardItem>
                <Left>
                  <Icon name="touch-app"
                    type="MaterialIcons"
                    style={{ fontSize: 30, color: '#BC6CE9' }} />
                  <Body>
                    <SimpleAnimation delay={1000} duration={1000} fade staticType='fade' direction='up'>
                      <Button>{label}</Button>
                    </SimpleAnimation>
                  </Body>
                  <Right>

                  </Right>
                </Left>
              </CardItem>
            </Card>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (<View style={styles.row}><Text>token ok</Text></View>);
    }
  };
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'red'
  }
});

export default TokenExpiredMonitor;