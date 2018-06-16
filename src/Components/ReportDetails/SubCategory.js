import React, {Component} from 'react';
import {StyleSheet,Text,View,Image,TouchableOpacity} from 'react-native';
import { Toast } from 'native-base';

export default class SubCategory extends Component {
    render() {
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.container}
                onPress={() => {
                    this.props.onSubCategoryClick(this.props.subTitle)
                    Toast.show({
                        text: this.props.subTitle,
                        buttonText: "Okay",
                        duration: 3000
                    });
                }}>
                    <Image
                        style={styles.icon}
                        source={this.props.icon}/>
                    <Text style={styles.subtitle}>{this.props.subTitle}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    icon:{
        height:70,
        width:70,
    },
    subtitle: {
        textAlign: 'center',
        color: '#ecf0f1',
        marginTop: 5,
        width: 140
    }
})