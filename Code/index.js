//--- Julius ORTSTADT G4 Peip2 ---//

const http = require('http');
const api = require("./api.js");
const file = require("./files.js");

http.createServer(function(request,response){
    let tabUrl = request.url.split('/');

    if (tabUrl[1] == 'api'){
        api.manage(request,response);
    }

    else{
        file.manage(request,response);
    }



}).listen(8000);