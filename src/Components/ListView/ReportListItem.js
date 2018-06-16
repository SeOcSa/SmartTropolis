import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Body, Thumbnail, Right} from 'native-base';
import ReportServices from ".././Services/ReportServices";

export default class ReportListItem extends Component {
    render(){
        return(
            <View style={{backgroundColor: "white"}}>
                <View style={styles.authorInfoContainer}>
                    <Thumbnail square style={styles.logo}
                           source={ReportServices.getIcon(this.props.reportSubCategory)}/>
                    <View style={styles.infoContainer}>
                        <Text note>Type: {this.props.reportSubCategory}</Text>
                        <Text style={styles.nameStyle}>{"Added by:"+ this.props.userName}</Text>
                        <Text note>{"Post on:" + this.props.createdDate}</Text>
                        <Text style={styles.nameStyle}>Status: {this.props.status}</Text>
                    </View>
                </View>
            </View>
        )};
}

var styles = StyleSheet.create({
    container:{
        marginTop:10,
        flexDirection: 'column',
        backgroundColor: '#ff3b30',
        width:350,
        height:170,
        borderRadius:20
    },
    authorInfoContainer:{
        marginTop:5,
        marginLeft:20,
        marginLeft:20,
        flexDirection: 'row'
    },
    infoContainer:{
        marginTop:10,
        width:250,
        borderRadius:5
    },
    nameStyle:{
        fontWeight: 'bold',
        fontSize:12,
        color: "black"
    },
    infoStyle:{
        fontWeight: 'bold',
        fontSize:11,
        alignSelf:'flex-start'
    },
    label:{
        fontSize:12
    },
    logo: {
        marginRight:10,
        alignSelf: 'flex-start',
        width: 70,
        height:70
    },
    messageContainer:{
        marginLeft: 10,
        marginRight:10,
        backgroundColor:"white",
        borderRadius:5,
        alignItems:'center',
        height:90,
        marginTop:2
    }
})