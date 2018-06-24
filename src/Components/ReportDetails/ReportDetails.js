import React, {Component} from 'react';
import {StyleSheet, StatusBar, View, Platform, Modal, ActivityIndicator} from 'react-native';
import SubCategory from "./SubCategory";
import { Button,Text,Thumbnail,Icon } from 'native-base';
import * as firebase from "firebase";
import DatabaseService from "../DatabaseService/DatabaseService";
import CameraView from "../Camera/CameraView";
import RNFetchBlob from 'react-native-fetch-blob';


const firebaseConfig = {
    apiKey: "AIzaSyAr_aEoCQKolbjxX6hmXyW53WnHXZdns2M",
    authDomain: "smarttropolis.firebaseapp.com",
    databaseURL: "https://smarttropolis.firebaseio.com",
    storageBucket:"smarttropolis.appspot.com",
    projectId: "smarttropolis",
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob


//TODO: Split This View in sub Components
export default class ReportDetails extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            showToast: false,
            report: {
                photoURL: "",
                textComment: "",
                reportType: "",
                reportSubCategory: "",
                userId: "",
                userName:"",
                location:{
                    latitude: 0,
                    longitude: 0
                },
                createdDate: "",
                status: "Open",
                rating: {
                    rateValue: 1,
                    users: {
                    }
                }
            },
            visible: false
        });

        this.setPhotoURL = this.setPhotoURL.bind(this);
        this.onSubCategoryClick = this.onSubCategoryClick.bind(this);
        this.onTextCommentChange = this.onTextCommentChange.bind(this);
    }

    componentDidMount () {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long = parseFloat(position.coords.longitude);

            var location = {
                latitude: lat.toString(),
                longitude: long.toString()
            }

            this.state.report.location = location;
        });
    }

    sendReport = (description, navigate) =>{
        this.state.report.reportType = description;

        this.state.report.userId = firebase.auth().currentUser.uid;
        this.state.report.userName= firebase.auth().currentUser.displayName;
        this.state.report.createdDate = this.setCurrentDate();

        var result = DatabaseService.setUserReport(this.state.report, firebase.auth().currentUser.uid);

        if(result === true)
            navigate("Map");
    }

    setCurrentDate=()=>{

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        return date + '/' + month + '/' + year;

    }

    onSubCategoryClick = (subCategory) => {
        this.state.report.reportSubCategory = subCategory;
    }

    uploadImage = async (uri, mime = 'application/octet-stream') =>{
        return new Promise((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri /*cale poză*/
            const sessionId = new Date().getTime()
            let uploadBlob = null
            const imageRef = firebase.storage().ref('reportsImages').child(`${sessionId}`); /*referință firebaseStorage*/

            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, { type: `${mime};BASE64` }) /*codare base64*/
                })
                .then((blob) => {
                    uploadBlob = blob
                    return imageRef.put(blob, { contentType: mime }) /*încărcare imagine*/
                })
                .then(() => {
                    uploadBlob.close();
                    return imageRef.getDownloadURL() /*returnarea url-ului de unde se poate descărca poza*/
                })
                .then((url) => {
                     resolve(url);
                })
                .catch((error) => {
                    reject(error)
                })
        });
    }

    setPhotoURL = async (path) => {
        this.setState({visible: true});
        var result = await this.uploadImage(path);

        while(true)
        {
            if(this.state.report.photoURL !== "")
                break;
            this.state.report.photoURL = result;
        }

        this.setState({visible: false});
    }

    onTextCommentChange = (textComment) => {
        this.state.report.textComment = textComment;
    }

    render() {
        const { params } = this.props.navigation.state;
        const iconCategory = params ? params.iconCategory : null;
        const description = params ? params.description : null;
        const details = params ? params.details : null;
        const {navigate} = this.props.navigation;
        return(
            <View style={styles.container}>
                <Modal
                    transparent={true}
                    animation ={"none"}
                    visible={this.state.visible}>
                    <View style={styles.content}>
                        <ActivityIndicator size="large" color="#2f3640" />
                    </View>
                </Modal> /*Componentă ce afișeză sub forma unei căsuțe dialog, subcategoria selectată*/
                <StatusBar
                    barStyle="light-content"
                /> /*Componeta ce permite afișarea bării cu ora, nivelul bateriei în partea de sus a ecranului*/
                <View style={styles.iconContainer}>
                    <Thumbnail
                    style={styles.icon}
                    source={iconCategory}>
                    </Thumbnail>
                </View> /*Tipul raportului*/
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{description}</Text>
                </View>
                /*Lista cu subcategorii a tipului raportului*/
                <View style={styles.subCatergoryContainer}>
                    <SubCategory onSubCategoryClick={this.onSubCategoryClick.bind(this)} icon={details.subCategory1.icon} subTitle={details.subCategory1.name}/>
                    <SubCategory onSubCategoryClick={this.onSubCategoryClick.bind(this)} icon={details.subCategory2.icon} subTitle={details.subCategory2.name}/>
                    <SubCategory onSubCategoryClick={this.onSubCategoryClick.bind(this)} icon={details.subCategory3.icon} subTitle={details.subCategory3.name}/>
                </View>
                <View style={styles.optionsContainer}>
                    /*Butonul care deschide camera, pentru a adăuga o poză*/
                        <Button transparent light rounded
                            style={styles.photoContainer}
                            onPress={()=>navigate('CameraView', { 'setPhotoURL': (path) => this.setPhotoURL(path)})}>
                            <Icon name="md-camera"/>
                        </Button>
                    /*Button ce deschide un nou ecran și permite adăugarea unei descrieri raportului*/
                    <Button transparent bordered light rounded
                            onPress={() => navigate('CommentView', {'onTextCommentChange': (textComment) => this.onTextCommentChange(textComment)})}>
                        <Icon name="md-text"/>
                        <Text style={{ color: 'white', fontWeight: '700' }}>Add a comment</Text>
                    </Button>

                </View>
                /*Anularea adaugării detaliilor pentru raportul curent*/
                <View style={styles.actionContainer}>
                    <Button  danger rounded
                        style={styles.cancelButton}
                        onPress={()=>navigate('Reports')}>
                        <Text >Cancel</Text>
                    </Button>
                    /*Buton de trimitere al raportului*/
                    <Button primary rounded
                        style={styles.sendButton}
                            onPress={() => this.sendReport(description, navigate)}
                        >
                        <Text style={styles.textButton}>Send</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#ff3b30',
    },
    optionsContainer:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom:10,
        marginRight:10,
        marginTop: 20
    },
    commentContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginRight: 10,
        width: 200
    },
    photoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:10,
        width: 130
    },
    subCatergoryContainer:{
        flex:1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    iconContainer: {
        marginTop:50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon:{
        height:100,
        width:100,
    },
    actionContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        height:90,
        backgroundColor:'#424242'
    },
    cancelButton:{
        backgroundColor:'#ff3b30',
        paddingVertical: 15,
        padding:10,
        marginRight:10,
        marginTop:20,
        width:160,
        marginBottom:20,
        marginLeft:5,
        justifyContent: 'center'
    },
    sendButton:{
        backgroundColor:'#007aff',
        paddingVertical: 15,
        padding:10,
        marginTop:20,
        marginBottom:20,
        marginRight: 5,
        width:180,
        justifyContent: 'center'
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 20,
        width: 260,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "#f5f6fa",
        opacity: 0.4
    },
    statusText:{
        color: "#222f3e",
        fontWeight: "bold",
        fontSize: 16
    }
})