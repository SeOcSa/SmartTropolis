import React, {Component} from 'react';
import {StyleSheet, View, Image, KeyboardAvoidingView, AlertIOS,TouchableOpacity,Text} from 'react-native';
import LoginForm from './LoginForm';
import TouchID from 'react-native-touch-id';

export default class Login extends Component {

    _pressHandler() {
        TouchID.authenticate('Authentication Required', optionalConfigObject)
            .then(success => {
                this.props.navigation.navigate('Map');
            })
            .catch(error => {
                AlertIOS.alert('Authenticated Failed');
            });
    }

    render() {
        return <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../../../images/icon.png')}
                />
            </View>
            <View style={styles.formContainer}>
                <TouchableOpacity style={styles.formContainer} onPress={this._pressHandler.bind(this)}>
                    <Image style={styles.touchId}
                           source={require('../../../images/touchId.png')}/>
                    <Text style={styles.title}>
                        Authenticate with Touch ID
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    }
}

const optionalConfigObject = {
    title: "Authentication Required",
    color: "#e00606"
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c0392b'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    formContainer: {
        alignItems:'center'
    },
    touchId:{
        width:100,
        height:100
    },
    title:{
        color: '#FFF',
        marginTop: 10,
        fontSize: 20,
        width: 260,
        textAlign: 'center',
        opacity: 0.9
    },
    logo: {
        width: 180,
        height: 180
    }
});