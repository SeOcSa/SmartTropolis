import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Button, Thumbnail, Icon} from 'native-base';
import ReportServices from ".././Services/ReportServices";
import DatabaseService from "../DatabaseService/DatabaseService";
import * as firebase from "firebase";


export default class ReportListItem extends Component {
    constructor(props){
        super(props);

        this.resolvedReport=this.resolvedReport.bind(this);
    }

    resolvedReport(userId, reportId, status) {
        if(status === "Sent")
            DatabaseService.updateReportStatus(userId, reportId, "Resolved");
        else
            alert("Unable to resolve this report!");
    }

    renderItem(){
        var isAdmin = (firebase.auth().currentUser.email === "admin@admin.com"); /*determină dacă user-ul curent este admin*/
        if(isAdmin){
            return( /*Afișare conținut pentru admin*/
                <View style={{backgroundColor: "white"}}>
                    <View style={styles.authorInfoContainer}> /*imaginea aferentă timpului raportului*/
                        <Thumbnail square style={styles.logo}
                                   source={ReportServices.getIcon(this.props.reportSubCategory)}/>
                        <View style={styles.infoContainer}> /*container ce conține informațiile despre raport*/
                            <Text note>Type: {this.props.reportSubCategory}</Text>
                            <Text style={styles.nameStyle}>{"Added by:"+ this.props.userName}</Text>
                            <Text note>{"Post on:" + this.props.createdDate}</Text>
                            <Text style={styles.nameStyle}>Status: {this.props.status}</Text>
                            <Button bordered success rounded /*Schimbare stare raport, admin-ul în pune ca rezolvat*/
                                    onPress={() => this.resolvedReport(this.props.userId, this.props.reportId, this.props.status)}>
                                <Icon name="md-checkmark-circle"/>
                                <Text style={{ color: 'green'}}>Resolve</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            )}
            else {
            return( /*afișare conținut pentru utilizatorul normal*/
                <View style={{backgroundColor: "white"}}>
                    <View style={styles.authorInfoContainer}>/*imaginea aferentă timpului raportului*/
                        <Thumbnail square style={styles.logo}/*container ce conține informațiile despre raport*/
                                   source={ReportServices.getIcon(this.props.reportSubCategory)}/>
                        <View style={styles.infoContainer}>
                            <Text note>Type: {this.props.reportSubCategory}</Text>
                            <Text style={styles.nameStyle}>{"Added by:"+ this.props.userName}</Text>
                            <Text note>{"Post on:" + this.props.createdDate}</Text>
                            <Text style={styles.nameStyle}>Status: {this.props.status}</Text>
                        </View>
                    </View>
                </View>
            )}
    };



    render(){
        return(
            this.renderItem()
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