class ReportServices {

    static getIcon = (subCategory) => {
        var retVal = require("../../../images/defaultReport.png");
        switch (subCategory) {
            case "Fallen tree":
                retVal= require('../../../images/fallenTree.png');
                break;
            case "Old tree":
                retVal= require('../../../images/oldTree.png');
                break;
            case "Clean tree":
                retVal= require('../../../images/cleanTree.png');
                break;
            case "Clean worker":
                retVal= require('../../../images/cleaningworker.png');
                break;
            case "Dustbin garbage":
                retVal=  require('../../../images/garbage.png');
                break;
            case "Door to door":
                retVal= require('../../../images/doortodoor.png');
                break;
            case "Construction":
                retVal= require('../../../images/construction.png');
                break;
            case "Road hazard":
                retVal= require('../../../images/pothole.png');
                break;
            case "Sidewalk hazard":
                retVal= require('../../../images/warning.png');
                break;
        }
        return retVal;
    };

}


module.exports = ReportServices;