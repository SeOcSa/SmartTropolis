import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Container, Button,Icon,Text} from 'native-base';
import NavigationBar from "../NavigationBar/NavigationBar";
import * as DatabaseService from "../DatabaseService/DatabaseService";
import ListComponent from "./ListComponent";



export default class MyReportsListView extends Component {
    constructor(props){
        super(props);
        this.state = {
            reports: {}
        }
    }

    componentDidMount() {
        var reports = [];

        DatabaseService.getUserReports().then((value => {
            Object.keys(value).map(key => {
                reports.push(value[key]);
            });
        }));


        this.setState({
            reports: reports
        });
    }

    render(){
        return(<ListComponent navigation={this.props.navigation} isActive={false} myReportsIsActive={true} reports={this.state.reports}/>)
    };
}