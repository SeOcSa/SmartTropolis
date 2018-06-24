import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import NavigationBar from "../NavigationBar/NavigationBar";
import ReportListItem from "./ReportListItem";



export default class ListComponent extends Component {
    constructor(props) {
        super(props);
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.props.reports}
                    renderItem={({item}) =>(
                        <ReportListItem
                            status={item.status}
                            reportSubCategory={item.reportSubCategory}
                            userName={item.userName}
                            createdDate={item.createdDate}
                            description={item.textComment}
                            userId={item.userId}
                            reportId={item.key}
                        />)}
                    keyExtractor={item => item.key}
                    ItemSeparatorComponent={this.renderSeparator}/>
                <View style={{height: 50}}>
                    <NavigationBar navigation={this.props.navigation} mapViewActive={false} listViewActive={this.props.isActive}
                                   myReportsListView={this.props.myReportsIsActive} addView={false}/>
                </View>
            </View>
        )};
}

var styles = StyleSheet.create({
    container: {
        flex: 3,
        marginTop:20,
        backgroundColor:"white"
    }
})