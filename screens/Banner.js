import React, { useState } from "react";

import {
  StyleSheet,
  Image,
  View,
  Alert,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import Carousel from 'react-native-banner-carousel';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 120;

//hook - export
export function Banner({imagenes}) {
  return (
    <View style={styles.container}>
      <Carousel
        autoplay
        autoplayTimeout={5000}
        loop
        index={0}
        pageSize={BannerWidth}
      >
        {imagenes.map((image, index) => renderPage(image, index))}
      </Carousel>
    </View>
  );
}


function renderPage(image, index) {
  return (
    <TouchableHighlight onPress={()=> Alert.alert("","index ==> "+index)} key={index} >
          <Image style={{ width: BannerWidth, height: BannerHeight }} source={{ uri: image }} />
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
