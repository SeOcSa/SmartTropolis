import * as firebase from "firebase";

async function getReports(rootRef, forUser) {
    var reports = [];
    if(!forUser) {
        rootRef.once('value').then(childSnapshot => {
            childSnapshot.forEach((doc) => {
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
                            createdDate: obj[key].createdDate,
                            status: obj[key].status,
                            rating: obj[key].rating
                        });
                    });
                });
            });
        });
    }
    else {
        rootRef.once('value').then(childSnapshot => {
            childSnapshot.forEach((doc) => {
                doc.forEach((reportDoc) => {
                    var obj = reportDoc.toJSON();
                    reports.push({
                        key: reportDoc.key,
                        latlng: {
                            latitude: parseFloat(obj.location.latitude),
                            longitude: parseFloat(obj.location.longitude)
                        },
                        userName: obj.userName,
                        userId: obj.userId,
                        reportType: obj.reportType,
                        reportSubCategory: obj.reportSubCategory,
                        textComment: obj.textComment,
                        createdDate: obj.createdDate,
                        status: obj.status,
                        rating: obj.rating
                    });
                })
            });
        });
    }

    return reports;
}

class DatabaseService {

    static setUserReport = (report,user) =>{
        try {
            let userReportPath = "/userReports/" + report.userId + "/reports";

            var key = firebase.database().ref(userReportPath).push().key;

            firebase.database().ref(userReportPath).child(key).set(report);

            var userKey = firebase.database().ref(userReportPath + "/" + key + "/rating").child("users").push().key;
            firebase.database().ref(userReportPath + "/" + key + "/rating").child("users").child(userKey).set({user: user});

            return true;
        }
        catch (error){
            alert(error.message.toString());
        }

        return false;
    }

    static updateReportRatingValue(userId, reportId, rateValue){
        let reportRatingPath= "/userReports/" + userId + "/reports/" + reportId +"/rating";

       var rateRef = firebase.database().ref(reportRatingPath);

        rateRef.update({rateValue : rateValue});

        var userKey = firebase.database().ref(reportRatingPath).child("users").push().key;
        firebase.database().ref(reportRatingPath).child("users").child(userKey).set({user: firebase.auth().currentUser.uid});
    }

    static updateReportStatus(userId, reportId, newStatus){
        let reportRatingPath= "/userReports/" + userId + "/reports/" + reportId;

        var rateRef = firebase.database().ref(reportRatingPath);

        rateRef.update({status : newStatus});
    }

    static getAllReports= async () => {
        const rootRef = firebase.database().ref("/userReports/");

        var reports= await getReports(rootRef, false);

        return reports;
    };


    static getUserReports = async () => {
        const rootRef =  firebase.database().ref("/userReports/"+firebase.auth().currentUser.uid);

        var reports= await getReports(rootRef, true);

        return reports;
    };
}

module.exports = DatabaseService;
