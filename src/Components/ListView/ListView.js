import React, {Component} from 'react';
import * as DatabaseService from "../DatabaseService/DatabaseService";
import ListComponent from "./ListComponent";



export default class ReportListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: {}
        }
    }

    componentDidMount() {
        var reports = [];

        DatabaseService.getAllReports().then((value => {
            Object.keys(value).map(key => {
                reports.push(value[key]);
            });
        }));


        this.setState({
            reports: reports
        });
    }

    render() {
        return (<ListComponent navigation={this.props.navigation} isActive={true} myReportsIsActive={false} reports={this.state.reports}/>)}
}