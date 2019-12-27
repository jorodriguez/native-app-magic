/*
  Componente hook para mostrar un Baner
  
  import { Banner } from './components/Banner';

  USO :
    <Banner imagenes="['RUTA.png']"></Banner>

*/

import React, { useState } from "react";

import {
  StyleSheet,
  Image,
  View,
  Alert,
  TouchableHighlight,
  Dimensions,Text
} from 'react-native';

import Carousel from 'react-native-banner-carousel';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 120;

//hook - export
export function Banner({imagenes,actionOnPress}) {
  return (
    <View style={styles.container}>
      <Carousel
        autoplay
        autoplayTimeout={5000}
        loop
        index={0}
        pageSize={BannerWidth}
      >
        {imagenes.map((image, index) => renderPage(image,actionOnPress, index))}
      </Carousel>
    </View>
  );
}


function renderPage(image,actionOnPress, index) {
  return (
  <TouchableHighlight onPress={ ()=> actionOnPress()} key={index} >
      <View>
          <Text>texto</Text>
          <Image style={{ width: BannerWidth, height: BannerHeight }} source={{ uri: image }} />          
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BCF0FF',
    paddingTop: 2,
  }
});
