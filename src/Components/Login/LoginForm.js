import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { Container, Icon, Item, Input,Button,Text } from 'native-base';

export default class LoginForm extends Component {
    render() {
        return (
            <Container>
                <Item rounded
                      style={styles.item}>
                    <Icon active name='md-person' style={styles.iconS} />
                    <Input
                        placeholder="Email" /*textul afișat înainte de introducerea caracterelor în căsuța text*/
                        placeholderTextColor="rgba(255,255,255,0.9)"
                        returnKeyType="next" /*textul butonului de navigare la următoarea căsuță text*/
                        onSubmitEditing={(event) => {
                            this.refs.passwordInput._root.focus();
                        }} /*focalizarea pe următoare căsuță text în caz că există*/
                        keyboardType="email-address" /*Setarea tipului tastaturii să fie specific pentru introducerea unui email*/
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                        onChangeText={(UserName) => this.props.onEmailChange(UserName)}
                    />
                </Item>/*Căsuța text pentru email*/
                <Item rounded
                      style={styles.item}>
                    <Icon active name='md-lock'  style={styles.iconS}/>
                    <Input
                        placeholder="Password"
                        placeholderTextColor="rgba(255,255,255,0.9)"
                        secureTextEntry /*Face caracterele introduse în căsuță să fie securizate, astfel nu putem să vedem parola introdusă*/
                        returnKeyType="go"
                        style={styles.input}
                        ref='passwordInput'
                        onChangeText={(passwordInput) => this.props.onPasswordChange(passwordInput)}
                    />
                </Item>
                <Container style={styles.forgotPass}>
                    <Button  transparent onPress={() => alert("Under construction!")}>
                        <Text style={styles.forgotPassText}>Forgot password?</Text>
                    </Button>/*Button*/
                </Container>
            </Container>
        );
    }
}

const styles = StyleSheet.create({ /*Stiluri definite pentru aranjarea în ecran a elementelor*/
    input: {
        color: "#FFF"
    },
    item:{
        height: 55,
        marginBottom: 10
    },
    iconS:{
        color: "#FFF"
    },
    forgotPass: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginTop: -10
    },
    forgotPassText: {
        color: '#ffffff',
        fontWeight: '500',
    }
});