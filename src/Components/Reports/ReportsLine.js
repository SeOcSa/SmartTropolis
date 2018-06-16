import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import ReportType from './ReportType';

const treeSubcategories= {
    subCategory1: {
        name: "Fallen tree",
        icon: require('../../../images/fallenTree.png')

    },
    subCategory2: {
        name: "Old tree",
        icon: require('../../../images/oldTree.png')
    },
    subCategory3: {
        name: "Clean tree",
        icon: require('../../../images/cleanTree.png')
    }
};

const garbageSubcategories={
    subCategory1: {
        name: "Clean worker",
        icon: require('../../../images/cleaningworker.png')
    },
    subCategory2: {
        name: "Dustbin garbage",
        icon: require('../../../images/garbage.png')
    },
    subCategory3: {
        name: "Door to door",
        icon: require('../../../images/doortodoor.png')
    }
};

const hazardSubCategories= {
    subCategory1: {
        name: "Construction",
        icon: require('../../../images/construction.png')
    },
    subCategory2: {
        name: "Road hazard",
        icon: require('../../../images/pothole.png')
    },
    subCategory3: {
        name: "Sidewalk hazard",
        icon: require('../../../images/warning.png')
    }
};

export default class ReportsLine extends Component {
    render() {
        return (
            <View style={styles.container}>
                        <ReportType  icon={require('../../../images/garbage.png')} description={"Garbage"} navigation={this.props.navigation}
                                     details={garbageSubcategories}/>
                        <ReportType icon={require('../../../images/tree.png')} description={"Fallen tree"} navigation={this.props.navigation}
                        details={treeSubcategories}/>
                        <ReportType icon={require('../../../images/hazard.png')} description={"Hazard"} navigation={this.props.navigation}
                        details={hazardSubCategories}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        marginTop: 15,
        marginLeft:15,
        marginRight:2,
        marginBottom:2
    }
})