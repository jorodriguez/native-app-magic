import React, { Component } from 'react';
import {
    AsyncStorage
} from 'react-native';

const helpers = {
    set: async function set(key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
            return false;
        }

        return true;
    },
    get: async function get(key) {
        try {
            const value = await AsyncStorage.getItem(key);

            return JSON.parse(value);
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};

export default helpers;



