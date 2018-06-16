import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import { Button,Text,Thumbnail } from 'native-base';

export default class ReportType extends Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <Button transparent style={styles.container}
                    onPress={() => navigate('ReportDetails', {iconCategory: this.props.icon,
                        description: this.props.description, details: this.props.details})}>
                    <Thumbnail large
                        source={this.props.icon}
                    />
                    <Text style={styles.subtitle}>{this.props.description}</Text>
                </Button>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'center',
        marginTop:20
    },
    subtitle:{
        textAlign: 'center',
        color: '#FFF',
        marginTop: 10,
        width: 115,
        fontWeight: 'bold'
    }
})