import React, {Component} from 'react';
import {StyleSheet, View,StatusBar,Dimensions,Image, Modal} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as firebase from "firebase";
import {Text,Thumbnail,Card,CardItem,Left,Body,Right,Icon,Button,Fab,Toast} from 'native-base';
import DatabaseService from "../DatabaseService/DatabaseService";
import axios from 'axios';
import NavigationBar from "../NavigationBar/NavigationBar";



const {width, height} = Dimensions.get('window')
const SCREEN_WIDTH = width
const SCREEN_HEIGHT = height
const ASPECT_RATIO = height/ width
const LATITUDE_DELTA = 0.0050
const LONGITUDE_DELTA= LATITUDE_DELTA * ASPECT_RATIO

const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "smarttropolis.firebaseapp.com",
    databaseURL: "https://smarttropolis.firebaseio.com",
    storageBucket:"smarttropolis.appspot.com",
    projectId: "smarttropolis",
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default class Map extends Component {
    constructor(props){
        super(props)

        this.state ={
            CurrentPosition:{
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0
            },
            markerPosition:{
                latitude: 0,
                longitude: 0
            },
            region: new MapView.AnimatedRegion({
                latitude: 0,
                longitude: 0,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }),
            animatedMarker: new MapView.AnimatedRegion({
                latitude: 0,
                longitude: 0,
            }),
            reports: [],
            cnt: 0,
            showModal: false,
            selectedReport: {
                key: "",
                latlng: {
                    latitude: 0,
                    longitude: 0
                },
                userName: "",
                userId: "",
                reportType: "",
                reportSubCategory: "",
                textComment: "",
                photoURL: "",
                markerIcon: "",
                icon: this.setIcon("def"),
                createdDate: "",
                status: "",
                rating: {
                    rateValue: 0,
                    users: []
                }
            }
        }
        this.onShowModal = this.onShowModal.bind(this);
        this.rate = this.rate.bind(this);
    }

    watchID : ?number =null

    componentDidMount () {
        const rootRef =  firebase.database().ref("/userReports/");

        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var long= parseFloat(position.coords.longitude);

            var initialRegion ={
                latitude:lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }

            this.setState({CurrentPosition: initialRegion});
            this.setState({markerPosition: initialRegion});
            this.setState({region: new MapView.AnimatedRegion(initialRegion)});
            this.setState({animatedMarker: new MapView.AnimatedRegion(initialRegion)});
        },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 10})

        this.watchID = navigator.geolocation.watchPosition((position) =>{
            var lat = parseFloat(position.coords.latitude);
            var long= parseFloat(position.coords.longitude);

            var lastRegion = {
                latitude:lat,
                longitude: long,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }

             this.setState({CurrentPosition : lastRegion});
             this.setState({markerPosition: lastRegion});
             this.setState({region: new MapView.AnimatedRegion(lastRegion)});
             this.setState({animatedMarker: new MapView.AnimatedRegion(lastRegion)});
        })

        rootRef.on('value', (childSnapshot) => {
            const reports =[];
            childSnapshot.forEach((doc)=>{
                doc.forEach((reportDoc) => {
                    var obj = reportDoc.toJSON();
                    Object.keys(obj).map((key) => {
                        reports.push({
                            key: key,
                            latlng: {
                                latitude: parseFloat(obj[key].location.latitude),
                                longitude: parseFloat(obj[key].location.longitude)
                            },
                            userName: obj[key].userName,
                            userId: obj[key].userId,
                            reportType: obj[key].reportType,
                            reportSubCategory: obj[key].reportSubCategory,
                            textComment: obj[key].textComment,
                            photoURL: this.setPhotoURL(obj[key].photoURL),
                            markerIcon: this.setMarkerIcon(obj[key].reportType),
                            icon: this.setIcon(obj[key].reportType),
                            createdDate: obj[key].createdDate,
                            status: obj[key].status,
                            rating: obj[key].rating
                        });
                    });
                });
            });
            this.setState({reports: reports});
        });
    }

    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChange(region) {
        this.state.region.setValue(region);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.animatedMarker !== nextProps.animatedMarker) {
            this.state.animatedMarker.timing({
                duration: 500,
                ...nextProps.animatedMarker
            }).start();
        }
    }

    onShowModal = (event) =>{
        var report = this.state.reports.find((reportItem)=>{ return reportItem.key===event._targetInst.return.key});
        this.setState({selectedReport: report, showModal: true});
    }

    rate = async () =>{
        var isAlreadyRate = await this.alreadyRate();
        if(this.state.selectedReport.status === "Open" && !isAlreadyRate) {
            switch(this.state.selectedReport.reportSubCategory){
                case "Fallen tree":
                        this.sendReportToAuthorities(15);
                    break;
                case "Old tree":
                        this.sendReportToAuthorities(25);
                        break;
                case "Clean tree":
                        this.sendReportToAuthorities(30);
                        break;
                case "Clean worker":
                        this.sendReportToAuthorities(10);
                        break;
                case "Dustbin garbage":
                    this.sendReportToAuthorities(5);
                    break;
                case "Door to door":
                    this.sendReportToAuthorities(12);
                    break;
                case "Construction":
                    this.incrementRateValue();
                    break;
                case "Road hazard":
                    this.sendReportToAuthorities(10);
                    break;
                case "Sidewalk hazard":
                    this.sendReportToAuthorities(15);
                    break;
            }
        }
        else
            Toast.show({
                text: "This report cannot be rated",
                duration: 2000
            });
    }

    incrementRateValue() {
        this.state.selectedReport.rating.rateValue = this.state.selectedReport.rating.rateValue +1;
        DatabaseService.updateReportRatingValue(this.state.selectedReport.userId,
            this.state.selectedReport.key,
            this.state.selectedReport.rating.rateValue);
    }

    alreadyRate = async () => {
        let reportRatingPath= "/userReports/" + this.state.selectedReport.userId + "/reports/" + this.state.selectedReport.key +"/rating/users";
        var currentUserUid = firebase.auth().currentUser.uid;
        let users = [];
         await firebase.database().ref(reportRatingPath).once("value").then(snapshop => {
             snapshop.forEach((doc) =>{
                 users.push({key: doc.toJSON().user});
             })
        });


        var user= users.find((userItem) => {return userItem.key === currentUserUid});

        if(user !== undefined){
            return true;
        }

        return false;
    }

    configObjForMailGun = {
        MAILGUN:{
            baseUrl : "https://api.mailgun.net/v3",
            domain :"sandbox25db9fbcf36f44daa18ca14a698bccaf.mailgun.org",
            apiKey: "API_key"
        },
        from: 'Administrator SmartTropolis <administrator@smartTropolis.com>',
        to: 'sebastianoctavian.sas@yahoo.com',
        subject: 'Report Summary',
        text: 'The SmartTropolis community would like to inform' +
        ' you that a problem was found and has the following summary: '

    };

    sendReportToAuthorities = (ratingValue) => {
        var from = this.configObjForMailGun.from;
        var to = this.configObjForMailGun.to;
        var subject = this.configObjForMailGun.subject;
        var text = this.configObjForMailGun.text;

        text = text +
            '\nReportType: ' + this.state.selectedReport.reportType +
            '\nReport sub-category: ' + this.state.selectedReport.reportSubCategory+
            `\nLocation: ` + `https://www.google.com/maps/@${this.state.selectedReport.latlng.latitude},${this.state.selectedReport.latlng.longitude}` +
            `\nReported by: ${this.state.selectedReport.userName} On:${this.state.selectedReport.createdDate}`;

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data; charset=utf-8; boundary="another cool boundary";'
            }
        };



        this.incrementRateValue();

        if (this.state.selectedReport.rating.rateValue >= ratingValue) {
            try {

                axios({
                    method: 'post',
                    url: `${this.configObjForMailGun.MAILGUN.baseUrl}/${this.configObjForMailGun.MAILGUN.domain}/messages`,
                    auth: {
                        username: 'api',
                        password: this.configObjForMailGun.MAILGUN.apiKey
                    },
                    params: {
                        from,
                        to,
                        subject,
                        text,
                    }
                }, config)
                    .then(function (response) {
                        console.log('=========== RESPONSE =============', response.data);
                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            }
            catch (error) {
                console.log(error);
            }

            DatabaseService.updateReportStatus(this.state.selectedReport.userId,
                this.state.selectedReport.key,
                "Sent");
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{flex: 3}}>
                <View style={styles.container}>
                    <StatusBar/>
                    <MapView.Animated
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={this.state.region}
                        onRegionChange={() => this.onRegionChange.bind(this)}
                        customMapStyle={MapStyle}
                        >
                        <MapView.Marker.Animated
                            coordinate = {this.state.animatedMarker}>
                            <View style={styles.radius}>
                                <View style={styles.marker}></View>
                            </View>
                        </MapView.Marker.Animated>
                        {this.state.reports.map((report) => {
                            return (
                                <Marker
                                    onPress={(report) => this.onShowModal(report)}
                                    id={report.key}
                                    key={report.key}
                                    coordinate={report.latlng}>
                                    <View>
                                        <Thumbnail circular source={report.markerIcon}/>
                                    </View>
                                </Marker>
                            )})}
                    </MapView.Animated>
                    <Fab style={{backgroundColor: 'rgb(0,122,255)' }} onPress={ () => navigate('Reports')}
                         direction="up" position="bottomRight">
                        <Icon name="md-add"></Icon>
                    </Fab>

                </View>
                <View style={{height: 50}}>
                    <Modal visible={this.state.showModal} style={styles.modalStyle}>
                        <Card>
                            <CardItem  header bordered>
                                <Left>
                                    <Thumbnail circular small source={this.state.selectedReport.icon} />
                                    <Body>
                                    <Text style={styles.titleStyle}>{this.state.selectedReport.reportType}</Text>
                                    <Text note style={styles.subtitleStyle}>{this.state.selectedReport.reportSubCategory}</Text>
                                    </Body>
                                </Left>
                                <Right style={{marginTop: 7}}>
                                    <Body style={{marginLeft: 10}}>
                                    <Text style={styles.titleStyle}>Status</Text>
                                    <Text note style={styles.subtitleStyle}>{this.state.selectedReport.status}</Text>
                                    </Body>
                                </Right>
                            </CardItem>
                            <CardItem bordered>
                                <Image source={{uri: this.state.selectedReport.photoURL}} style={{height: 200, width: null, flex: 1}}/>
                            </CardItem>
                            <CardItem>
                                <Text style={styles.titleStyle}>
                                    {this.state.selectedReport.textComment}
                                </Text>
                            </CardItem>
                            <CardItem footer bordered>
                                <Left>
                                    <Thumbnail source={require("../../../images/user.png")} circular small />
                                    <Body>
                                    <Text style={styles.titleStyle}>Created by: {this.state.selectedReport.userName}</Text>
                                    <Text note style={styles.subtitleStyle}>On: {this.state.selectedReport.createdDate}</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem>
                                <Left>
                                    <Button onPress={() => this.rate()} transparent >
                                        <Icon active name="md-thumbs-up" />
                                        <Text style={styles.subtitleStyle}>{this.state.selectedReport.rating.rateValue}</Text>
                                    </Button>
                                </Left>
                            </CardItem>
                        </Card>
                        <Fab style={{ backgroundColor: '#ff3b30' }} onPress={ () => this.setState({showModal: false})}
                             direction="up" position="bottomRight">
                            <Icon name="md-close"></Icon>
                        </Fab>
                    </Modal>
                    <NavigationBar navigation={this.props.navigation} mapViewActive={true} listViewActive={false}
                    myReportsListView={false} addView={false}/>
                </View>
            </View>
        );
    }

    setIcon(reportType) {
        var retVal = require("../../../images/defaultReport.png");
        switch (reportType){
            case "Garbage":
                retVal= require("../../../images/garbage.png");
                break;
            case "Hazard":
                retVal= require("../../../images/hazard.png");
                break;
            case "Fallen tree":
                retVal= require("../../../images/tree.png");
                break;
        }

        return retVal;
    }
    setMarkerIcon(reportType) {
        var retVal = require("../../../images/defaultMarkerIcon.png");
        switch (reportType) {
            case "Garbage":
                retVal = require("../../../images/garbageMarkerIcon.png");
                break;
            case "Hazard":
                retVal = require("../../../images/hazardMarkerIcon.png");
                break;
            case "Fallen tree":
                retVal = require("../../../images/treeMarkerIcon.png");
                break;
        }

        return retVal;
    }
    setPhotoURL(url){
        if(url === ""){
            return "https://firebasestorage.googleapis.com/v0/b/smarttropolis.appspot.com/o/reportsImages%2FnoImg.png?alt=media&token=67b09d06-088b-472b-a762-403c2c383478";
        }
        else
            return url;
    }
}

MapStyle=[
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#523735"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#c9b2a6"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#dcd2be"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ae9e90"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#93817c"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#a5b076"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#447530"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#fdfcf8"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f8c967"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#e9bc62"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e98d58"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#db8555"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#806b63"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8f7d77"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#b9d3c2"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#92998d"
                }
            ]
        }
]

const styles = StyleSheet.create({
    radius:{
        height: 50,
        width: 50,
        borderRadius:50/2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0, 122, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    marker:{
        height: 20,
        width: 20,
        borderWidth: 3,
        borderRadius:20/2,
        borderColor:'white',
        overflow: 'hidden',
        backgroundColor: '#007AFF'

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map:{
        ...StyleSheet.absoluteFillObject
    },
    modalStyle:{
        width:270,
        height:330,
        padding: 1,
        marginTop: 5
    },
    userIconStyle:{
        height:35,
        width: 35
    },
    titleStyle:{
        fontSize: 10,
        fontWeight:"bold",
        color: "#000"
    },
    subtitleStyle:{
        fontSize: 8,
        fontWeight:"bold"
    }
})