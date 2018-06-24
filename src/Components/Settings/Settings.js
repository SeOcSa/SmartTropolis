import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Container, Text, Header, Content, ListItem, List, Thumbnail, Body} from 'native-base';



export default class Settings extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
            <Container>
                <Header />
                <Content>
                    <List>
                        <ListItem>
                            <Thumbnail square size={80} source={{ uri: 'Image URL' }} />
                            <Body>
                                <Text>Sankhadeep</Text>
                                <Text note>Its time to build a difference . .</Text>
                            </Body>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        )};
}

var styles = StyleSheet.create({
    textS:{
        fontSize: 10
    }
})