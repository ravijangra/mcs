/* Utility Modules to create the URLs and options to be passed along with API request*/

var config = '';
       
/* To form a URL from different components*/
var formURL = function(config, APIString1, mbe, APIString2) {
        if (mbe===0) {
            return config.mcs.toolingUrl + config.mbe.version + APIString1 + APIString2;
        }
            return  config.mcs.toolingUrl + config.mbe.version + APIString1 + mbe + APIString2;

}

/* To form a url options for API Requests*/
var formOptions = function(uri, method, userId){
return {"uri": uri, "method": method, headers: { 
                     OAM_REMOTE_USER: userId,
                    'Content-Type': "application/json"
            } };

}

exports.formURL = formURL;
exports.formOptions = formOptions;