import React, { Component } from 'react';
import {Root} from 'native-base';
import {StackNavigator} from "react-navigation";
import StartScreen from './src/Components/StartScreen/StartScreen';
import SignUp from './src/Components/SignUp/SignUp';
import  Map from './src/Components/Map/Map'
import Reports from './src/Components/Reports/Reports'
import ReportDetails from "./src/Components/ReportDetails/ReportDetails";
import CameraView from "./src/Components/Camera/CameraView";
import CommentComponent from "./src/Components/ReportDetails/CommentComponent";
import Settings from "./src/Components/Settings/Settings";
import ListView from  "./src/Components/ListView/ListView";
import MyReportListView from "./src/Components/ListView/MyReportsListView";


export const AppNav=StackNavigator({
        Home: {screen: StartScreen},
        SignUp: {screen: SignUp},
        Map: {screen: Map},
        Reports: {screen: Reports},
        ReportDetails: {screen: ReportDetails},
        CameraView:{screen: CameraView},
        CommentView:{screen: CommentComponent},
        Settings: {screen: Settings},
        ListView: {screen: ListView},
        MyReportsListView: {screen: MyReportListView}
    },
    {
        headerMode: 'none',
        mode: 'modal',
        navigationOptions: {
            gesturesEnabled: false
        }
    });

export default class App extends Component<{}> {
    render() {
        return (
            <Root>
                <AppNav/>
            </Root>
        );
    }
}

