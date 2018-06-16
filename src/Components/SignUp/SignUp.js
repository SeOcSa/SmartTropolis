import React, {Component} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Text} from 'react-native';
import SignUpForm from './SignUpForm';
import {Button, Fab, Icon} from 'native-base';
import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "smarttropolis.firebaseapp.com",
    databaseURL: "https://smarttropolis.firebaseio.com",
    storageBucket:"smarttropolis.appspot.com",
    projectId: "smarttropolis",
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default class SignUp extends Component {
    constructor(props){
        super(props);
        this.state = ({
            email: '',
            password: '',
            confirmPassword:'',
            userName: ''
        })

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onUserNameChange = this.onUserNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
    }

    signUp= () => {
        try {
            if (this.state.password.length <= 6 ||
                this.state.confirmPassword.length <= 6 ||
                this.state.password != this.state.confirmPassword) {
                alert('Password is not correct!')
                return;
            }

            const userName= this.state.userName;
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((credential) => {
                    credential.user.updateProfile({
                        displayName: userName
                    });
                    this.props.navigation.navigate('Home');
                });
        }
        catch (error){
            alert(error.message.toString());
        }
    }

    onEmailChange = (email) =>{
        this.setState({ email: email});
    };
    onUserNameChange = (userName) =>{
        this.setState({ userName: userName});
    };
    onPasswordChange = (password) =>{
        this.setState({ password: password});
    };
    onConfirmPasswordChange = (confirmPassword) =>{
        this.setState({ confirmPassword: confirmPassword});
    };

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.title}>
                       CREATE NEW ACCOUNT
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    <SignUpForm onEmailChange={this.onEmailChange.bind(this)}
                                onUserNameChange={this.onUserNameChange.bind(this)}
                                onPasswordChange={this.onPasswordChange.bind(this)}
                                onConfirmPasswordChange={this.onConfirmPasswordChange.bind(this)}/>
                    <Button rounded iconRight block
                            style={styles.buttonContainer}
                            onPress={this.signUp.bind(this)}>
                        <Text style={{color:'#FFF', marginLeft:150}}>
                            SIGN UP
                        </Text>
                        <Icon name="ios-arrow-forward-outline" style={{marginRight:20}}/>
                    </Button>
                </View>
                <Fab style={{backgroundColor: 'white' }} onPress={ () => this.props.navigation.goBack()}
                     direction="up" position="bottomRight">
                    <Icon style={{color: 'red'}} name="md-arrow-round-back"></Icon>
                </Fab>
            </KeyboardAvoidingView>
        );
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff3b30',
        padding: 2
    },
    logoContainer: {
        alignItems: 'center',
        marginTop:100,
        marginBottom: 30
    },
    buttonContainer: {
        backgroundColor: '#424242',
        justifyContent: 'space-between',
    },
    title:{
        color: '#FFF',
        marginTop: 10,
        fontSize: 20,
        textAlign: 'center',
        opacity: 0.9,
    }
});