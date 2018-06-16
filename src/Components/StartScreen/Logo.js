import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Text } from 'native-base';

export default class Logo extends Component {
    render() {
        return (
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../../../images/icon.png')}
                />
                <Text style={styles.title}>
                    SmartTropolis
                </Text>
            </View>
        );
    }
}
/*O aplicatie pentru un oras mai curat și sigur*/
const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        flexGrow:1,
        marginTop:100
    },
    logo: {
        width: 100,
        height: 100
    },
    title: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 16,
        width: 260,
        textAlign: 'center',
        opacity: 0.9
    }
});