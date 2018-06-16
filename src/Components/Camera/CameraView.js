import React, {Component} from 'react';
import {StyleSheet,View,TouchableOpacity,Image} from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class CameraView extends Component {
    constructor(props){
        super(props);

        this.takePicture = this.takePicture.bind(this);
    }
    render() {
        var {params} = this.props.navigation.state;

        return <View style={styles.container}>
            <RNCamera
                ref={(cam) => {
                    this.camera = cam;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'We need your permission to use your camera phone'}>
                <TouchableOpacity onPress={() => {
                     this.takePicture(params);
                }}>
                    <Image style={styles.cameraIcon}
                           source={require('../../../images/camera_icon.png')}
                    />
                </TouchableOpacity>
            </RNCamera>
        </View>;
    }



    takePicture = async function(params) {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            params.setPhotoURL(data.uri);
            this.props.navigation.goBack();
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    cameraIcon:{
        margin: 40,
        height:50,
        width:50
    }
});