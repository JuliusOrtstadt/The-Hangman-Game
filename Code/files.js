//--- Julius ORTSTADT G4 Peip2 ---//

//--- Variable containing basic path for the Hangman frontend source files ---//
const frontPath = "./front";

//--- Variable for default file ---//
const defaultFile = "index.html";

//--- Variable for error files ---//
const error404File = "./front/404Error.html";
const error403File = "./front/403Error.html";

//--- Variable containing basic mime types ---//
const mimeTypes = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.md': 'text/plain',
        'default': 'application/octet-stream'
   };

//--- Variables for module use ---//
const urlModule = require('url');
const pathModule = require('path');
const fsModule = require('fs');


function manageRequest(request, response) {
    //--- Variable to verify if response has already been sent or not (to avoid "Cannot set headers after they are sent to the client" error) ---//
    let responseSent = false;
    
    //--- Create full pathname with predefined location and added path ---//
    let requestedPath = urlModule.parse(request.url).pathname;
    let filePath = pathModule.join(frontPath, requestedPath);

    //--- NEED TO VERIFY ----------------------------------------------------------------------///////////////////////////////
    //--- Checks if there is ".." in the path and denies access ---//
    if (filePath.includes('..')){
        fsModule.readFile(error403File, function(error,data){
            if (error){
                response.end(`Unable to read file`);
                responseSent = true;
            }
            if (!responseSent){
                response.setHeader('content-Type', mimeTypes[pathModule.parse(error403File).ext] || mimeTypes['default']);
                response.end(data);
                responseSent = true;
            }
        });
    }


    
    
    //--- If path in url is a directory, add default file to display: index.html ---//
    try{
        if (fsModule.statSync(filePath).isDirectory()){
            filePath = pathModule.join(filePath, defaultFile);
        }    
    }
    //--- If path is not a directory (or file) statSync() function throws error that is catched here ---//
    catch (error){
    }
    
    //--- Checks if file exists on device ---//
    fsModule.exists(filePath, function(exists){
        //--- If the file doesn't exist, try to display the error 404 page ---//
        if (!exists){
            fsModule.readFile(error404File, function(error,data){
                if (error){
                    response.end(`Unable to read file`);
                    responseSent = true;
                }
                if (!responseSent){
                    response.setHeader('content-Type', mimeTypes[pathModule.parse(error404File).ext] || mimeTypes['default']);
                    response.end(data);
                    responseSent = true;
                }
            });
        }

        else {
            //--- Reads file ---//
            fsModule.readFile(filePath, function(error,data){
                if (error){
                    response.end(`Unable to read file`);
                    responseSent = true;
                }
                
                if(!responseSent){
                    //--- Sets header and sends data so it can be displayed ---//
                    response.setHeader('content-Type', mimeTypes[pathModule.parse(filePath).ext] || mimeTypes['default']);
                    response.end(data);
                    responseSent = true;
                }
            });
        }
    });

    
    
    

    
        
}

exports.manage = manageRequest; 