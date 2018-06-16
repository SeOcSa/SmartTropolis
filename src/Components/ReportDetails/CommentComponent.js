import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Container, Button,Icon,
    Header,Left,Body,Title,Right,
    Content, Textarea, Form} from 'native-base';


//TODO: fill text area with the previous comment if is add comment is press second time and so one
export default class CommentComponent extends Component {
    constructor(props){
        super(props);
    }
    render() {
        var {params} =this.props.navigation.state;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent rounded success
                        onPress={() => this.props.navigation.goBack()}>
                            <Icon name="md-checkmark-circle"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title></Title>
                    </Body>
                    <Right>
                        <Button transparent rounded danger onPress={() =>{
                            params.onTextCommentChange("");
                            this.props.navigation.goBack();
                        }}>
                            <Icon name="md-close-circle"/>
                        </Button>
                    </Right>
                </Header>
                <Content padder style={styles.textAreaStyle}>
                    <Form>
                        <Textarea onChangeText={(textComment) => params.onTextCommentChange(textComment)} rowSpan={6}/>
                    </Form>
                </Content>
            </Container>
        );
    }
}

const styles =StyleSheet.create({
    container:{
        height: 200
    },
    textAreaStyle: {
        borderRadius: 10,
        borderWidth:3,
        borderColor: '#636e72',
        backgroundColor:"#ffffff",
        marginTop: 5,
        marginRight: 2,
        marginLeft:2,
        marginBottom:270
    }
});
