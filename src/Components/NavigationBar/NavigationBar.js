import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Container, Button,Icon,Footer,FooterTab,Text} from 'native-base';



export default class NavigationBar extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
            <Container>
                <Footer>
                    <FooterTab>
                        <Button vertical active={this.props.mapViewActive} onPress={() => navigate("Map")}>
                            <Icon name="md-map" />
                            <Text style={styles.textS}>Map View</Text>
                        </Button>
                        <Button vertical active={this.props.listViewActive} onPress={() => navigate("ListView")}>
                            <Icon name="md-list" />
                            <Text style={styles.textS}>List View</Text>
                        </Button>
                        <Button vertical active={this.props.myReportsListView} onPress={() => navigate("MyReportsListView")}>
                            <Icon active name="md-paper" />
                            <Text style={styles.textS}>My reports</Text>
                        </Button>
                        <Button active={this.props.addView} onPress={() => navigate("Reports")} vertical>
                            <Icon name="ios-add-circle-outline" />
                            <Text style={styles.textS}>New report</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
    )};
}

var styles = StyleSheet.create({
    textS:{
        fontSize: 10
    }
})