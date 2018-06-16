import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Item, Input } from 'native-base';

export default class SignUpForm extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={styles.formContainer}>
                <Item>
                    <Icon name='md-person' style={styles.iconS}/>
                    <Input
                        ref='userName'
                        autoFocus={true}
                        placeholder={'User name'}
                        placeholderTextColor="rgba(255,255,255,0.9)"
                        returnKeyType={'next'}
                        onSubmitEditing={()=> {this.refs.email._root.focus();}}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                        onChangeText={(userName) => this.props.onUserNameChange(userName)}
                    />
                </Item>
                <Item>
                    <Icon name='md-mail' style={styles.iconS}/>
                    <Input
                        ref='email'
                        autoFocus={true}
                        placeholder={'Email'}
                        placeholderTextColor="rgba(255,255,255,0.9)"
                        keyboardType='email-address'
                        returnKeyType={'next'}
                        onSubmitEditing={() => {this.refs.pass._root.focus();}}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                        onChangeText={(email) => this.props.onEmailChange(email)}
                    />
                </Item>
                <Item>
                    <Icon name='md-lock' style={styles.iconS}/>
                    <Input
                        ref='pass'
                        placeholder={'Password'}
                        placeholderTextColor="rgba(255,255,255,0.9)"
                        secureTextEntry
                        onSubmitEditing={() => {this.refs.confPass._root.focus();}}
                        returnKeyType='next'
                        style={styles.input}
                        onChangeText={(pass)=> this.props.onPasswordChange(pass)}
                    />
                </Item>
                <Item>
                    <Icon name='md-lock' style={styles.iconS}/>
                    <Input
                        ref='confPass'
                        placeholder={'Confirm Password'}
                        placeholderTextColor="rgba(255,255,255,0.9)"
                        secureTextEntry
                        returnKeyType='go'
                        style={styles.input}
                        onChangeText={(confPass) => this.props.onConfirmPasswordChange(confPass)}
                    />
                </Item>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formContainer: {
            padding: 10
        },
    input: {
        height: 40,
        marginBottom: 10,
        paddingHorizontal: 10,
        color:'#FFF'
    },
    iconS:{
        color: "#FFF",
    }
});