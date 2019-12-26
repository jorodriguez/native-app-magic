import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Image,
  ActivityIndicator
} from 'react-native';

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
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
        <Image
              source={require('../assets/images/magic.png')}
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

export default Loader;