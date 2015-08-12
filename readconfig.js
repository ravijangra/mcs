/* Reads the configuations file config.json. config.json file must be passed while running the main program 


*/

var fs = require('fs')
var async = require('async')
var exportConfig = '';
var config;
var mcs;
var mbe;

module.exports = function(configFilePath,callback) {

exportConfig = configFilePath;

if ( exportConfig == '' ) {
   console.log("No config file passed - reading config.json from current directory");
   exportConfig = './config.json';
}   

/* Read file */
fs.readFile(exportConfig, function (err, data) {
	if ( err ) {
	   console.log('Error reading config:' + err);
	   return callback(err);
	}
	console.log(data.toString());
    config = JSON.parse(data.toString());
	//console.log("JSON Data is " + config);
	//printConfig();
	return callback(null,config);
 });

function printConfig() {
  mcs = config.mcs;
  console.log(" MCS Info : " + JSON.stringify(mcs));
  console.log(" MCS URL is : " + mcs.toolingUrl);
  console.log("MCS User is: " + mcs.userId);
  
  mbe = config.mbe;
  console.log("MBE is " + JSON.stringify(mbe));
  console.log("Backend is " + mbe.name + " " + mbe.version);
}

}


  