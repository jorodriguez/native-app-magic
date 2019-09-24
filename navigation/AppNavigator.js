import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import MainTabNavigator from './MainTabNavigator';
import Principal from './Principal';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    //Main: MainTabNavigator,Main: MainTabNavigator,
    Main: Principal,
  })
);
