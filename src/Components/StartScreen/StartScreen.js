import React, {Component} from 'react';
import {StyleSheet, View, KeyboardAvoidingView} from 'react-native';
import { Button,Text,Icon } from 'native-base';
import LoginForm from "../Login/LoginForm";
import Logo from "./Logo";
import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAr_aEoCQKolbjxX6hmXyW53WnHXZdns2M",
    authDomain: "smarttropolis.firebaseapp.com",
    databaseURL: "https://smarttropolis.firebaseio.com",
    storageBucket:"smarttropolis.appspot.com",
    projectId: "smarttropolis",
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default class StartScreen extends Component {
    constructor(props){
        super(props);

        this.state =({
            email: '',
            password:''
        })
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }
    onEmailChange = (email) =>{
        this.setState({ email: email});
    };
    onPasswordChange = (password) =>{
        this.setState({ password: password});
    };

    signIn = () =>{
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() =>{
            this.props.navigation.navigate('Map');
        }).catch(function(error){
            alert(error.message.toString());
        })
    };
    render() {
        return <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Logo/> /*Componenta ce definește log-ul aplicației și aspectul lui în ecran*/
            <View style={styles.formContainer}>
                <LoginForm onEmailChange={this.onEmailChange.bind(this)}
                           onPasswordChange={this.onPasswordChange.bind(this)}/> /*Componentă ce definește căsuțele text ale paginii*/
                <Button rounded iconLeft block
                        style={styles.buttonContainer}
                        onPress={this.signIn.bind(this)}>
                    <Icon name="md-log-in"/>
                    <Text style={{color:'#FFF'}}>
                        LOGIN
                    </Text>
                </Button> /*Buttonul de logare*/
            </View>

            <View style={styles.signUpContainer}>
                <Button transparent bordered light rounded
                        onPress={() => this.props.navigation.navigate('SignUp')}>
                    <Icon name="md-person-add"/>
                    <Text style={{ color: 'white', fontWeight: '700' }}>Sign Up</Text>
                </Button> /*Butonul de înregistrare*/
            </View>
        </KeyboardAvoidingView>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2,
        alignItems:'stretch',
        justifyContent: 'center',
        backgroundColor: '#ff3b30'
    },
    buttonContainer: {
        backgroundColor: '#424242',
        justifyContent: 'center',
        marginTop: 170
    },
    formContainer:{
        marginBottom: 80
    },
    signUpContainer: {
        justifyContent: 'center',
        marginBottom: 10,
        flexDirection: 'row'
    }
});