/*  Exports the MobileBackendn and associated APIs, Clients, Users basis the configuration mentioned in the configuration file config.json
    config.json file must be passed while running this program
    Output is in JSON format and the output files are saved in the directories mentioned in configuration file
*/

var request = require("request");
var fs = require("fs");
var readconfig = require("./readconfig.js");
var utils = require("./utils.js");
var config = '';
var url = '';
var mbename = '';
var toolingUrl = '';
var version = '';
var userId = '';
var exportUsers;
var mbe_id;
var exportClientApps;

var APIStringUMSRoles = '/envs/dev/ums';
var APIStringConnectors = '/envs/dev/asset';
var APIStringAsset = '/envs/dev/asset/mobilebackends/';
var APIStringUMS = '/envs/dev/ums/mobilebackends/';
	
var mbefileName = 'mbe.json';
var clientfileName = 'clients.json';
var apisfileName = 'API/apis.json';
var usersfileName = 'users.json';
var rolesfileName = 'roles.json';
var connectorsfileName = 'Connectors/connectors.json';
var mbefile,clientfile,apisfile,usersfile, connectorsfile, rolesfile;
var outputDir;


	/* pass the config file path & name to the program */
	readconfig(process.argv[2],callback);
	
    function callback(err,conf){
          if (err) {
            console.log("Error reading config file" + err);
          }
	 
	 config = conf;
	 toolingUrl = config.mcs.toolingUrl;
	 mbename = config.mbe.name;
	 mbeversion = config.mbe.version;
	 userId = config.mcs.userId;
	 exportUsers = config.mbe.exportUsers;
	 exportClientApps = config.mbe.exportClientApps;
	 outputDir = config.mbe.outputDir;
	 
	 //console.log("Tooling url from API is " + config.mcs.toolingUrl);
		
  	 url = toolingUrl + mbeversion + APIStringAsset + "?backendName=" + mbename;
	 //console.log(url);
    
     mbefile = fs.createWriteStream(outputDir + '/' + mbefileName);
	 apisfile = fs.createWriteStream(outputDir + '/' + apisfileName);
	 
        var options = utils.formOptions(url, 'GET', userId);

        /* Get MBE */
        request(options, function (error, response, body) {
           if (error) {console.log(error);}

          if (!error && response.statusCode == 200) {
            mbe_id = JSON.parse(body).items[0].id;
            var uri = utils.formURL(config, APIStringAsset, mbe_id, '/apis/');
            var apisAPIoptions = utils.formOptions(uri, 'GET',userId);
            

            /* Get API based on MBE */
            request(apisAPIoptions, function(error, res, body){
            if (error) {console.log("Error retrieving API List for MBE :" + error);}
            if (!error && res.statusCode == 200) {
                console.log("APIs list exported to apis.json successfully!");
              }
          }).pipe(apisfile);

          /* Create users */
         if ( exportUsers == 'true' ) {
                usersfile = fs.createWriteStream(outputDir + '/' + usersfileName);
                uri = utils.formURL(config, APIStringUMS, mbe_id, '/users');
                var usersAPIoption = utils.formOptions(uri,'GET',userId);

                // get Users based on MBE 
                request(usersAPIoption, function(error,res,body){
                if (error || res.statusCode != 200){ console.log("Error retrieving users for MBE :" + error); }
                    if ( !error && res.statusCode == 200 ) {
                        console.log("Users list exported to users.json successfully!");
                    }
              }).pipe(usersfile);				  
        }

        /* Create clients */
        if ( exportClientApps == 'true' ){
              clientfile = fs.createWriteStream(outputDir + '/' + clientfileName);
              uri = utils.formURL(config, APIStringAsset, mbe_id, '/clients');
              var clientAPIoption = utils.formOptions(uri,'GET',userId);

              // get Clients based on MBE 
              request(clientAPIoption, function(error,res,body){
                if (error || res.statusCode != 200){ console.log("Error retrieving clients for MBE :" + error); }
                    if ( !error && res.statusCode == 200 ) {
                        console.log("Clients list exported to clients.json successfully!");
                    }
                }).pipe(clientfile);
        }
              
              /* Create connectors */
        
              connectorsfile = fs.createWriteStream(outputDir + '/' + connectorsfileName);
              uri = utils.formURL(config, APIStringConnectors, 0 , '/connectors');
              var connectorsAPIoption = utils.formOptions(uri,'GET',userId);
                            
              // get Connectors 
              request(connectorsAPIoption, function(error,res,body){
                if (error || res.statusCode != 200){ console.log("Error retrieving connectors list: " + error); }
                    if ( !error && res.statusCode == 200 ) {
                        console.log("Connectors list exported to connectors.json successfully!");
                    }
                }).pipe(connectorsfile);
              
               /* Create roles */
        
              rolesfile = fs.createWriteStream(outputDir + '/' + rolesfileName);
              uri = utils.formURL(config, APIStringUMSRoles, 0 , 'roles');
              var rolesAPIoption = utils.formOptions(uri,'GET',userId);
              
              // get Roles 
              request(rolesAPIoption, function(error,res,body){
                if (error || res.statusCode != 200){ console.log("Error retrieving roles : " + error); }
                    if ( !error && res.statusCode == 200 ) {
                        console.log("roles list exported to roles.json successfully!");
                    }
                }).pipe(rolesfile);
             
             
              
    }}).pipe(mbefile);

};