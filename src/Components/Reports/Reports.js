import React, {Component} from 'react';
import {StyleSheet, ScrollView,StatusBar,View} from 'react-native';
import { Button,Text } from 'native-base';
import ReportLine from './ReportsLine'

export default class Reports extends Component {
    render() {
        const {navigate} = this.props.navigation;
        return(
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Send a report</Text>
                </View>
                <ScrollView style={styles.container}>
                    <ReportLine navigation={this.props.navigation}/>
                </ScrollView>
                <Button block rounded style={styles.closeButton} onPress={() => navigate('Map')}>
                    <Text style={styles.buttonText}>CLOSE</Text>
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#ff3b30',
    },
    title: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 20,
        width: 260,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    titleContainer: {
        alignItems: 'center',
        marginTop:20,
        marginBottom: 10,
    },
    buttonText:{
        color: '#FFF',
        fontSize: 20,
        width: 260,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    closeButton:{
        height:50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#424242',
        margin:10
    }
})