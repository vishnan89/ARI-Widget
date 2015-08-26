var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var json;

// Instantiate the express object
var app = express();

// Use the static assets from the same directory as this server.js file
app.use(express.static(path.resolve('./')));

/* **************
 * GET Requests *
 * **************/

// index.html
app.get('/', function(req, res) {
  res.sendFile('index.html');
});

/* ******************
 * Start the server *
 * ******************/

var port = process.env.PORT || 8000;

var server = app.listen(port, function() {
  console.log('Listening on port:', port);
});

//Parsing the XML file to JSON
/*var returnJSONResults = function(baseName, queryName) {
     var XMLPath = "emp.xml";
     var rawJSON = loadXMLDoc(XMLPath);
     function loadXMLDoc(filePath) {
                  
        try {
            var fileData = fs.readFileSync(filePath, 'ascii');
            var parser = new xml2js.Parser();
            parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
            json = JSON.stringify(result);
            console.log(JSON.stringify(result));                
        });

        console.log("File '" + filePath + "/ was successfully read.\n");
        return json;
    } catch (ex) {console.log(ex)}
 }
}();*/

 
//Socket Communication Starts
// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Loading socket.io
var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    
     var XMLPath = "emp.xml";
     var rawJSON = loadXMLDoc(XMLPath);
     function loadXMLDoc(filePath) 
    {
        var fileData = fs.readFileSync(filePath, 'ascii');
        var parser = new xml2js.Parser();
        parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
        json = JSON.stringify(result);
        console.log(JSON.stringify(result));                
        });
    
        socket.emit('message', json);
    
    }
    
    fs.watchFile('emp.xml', function(curr, prev){
        fs.readFile('emp.xml', function(err, data){
            if(err) throw err;
            json = parser.parseString(data);            
        });
    });    
    //socket.emit('message', json);
    parser.addListener('end', function(result){
        socket.volatile.emit('message',result)
    });
});

server.listen(8080);




























//// This module does the conversion
//var xmlParser = require("xml2js").parseString;
//var parserOptions = {
//	normalizeTags:true,
//	strict:true,
//	explicitArray:false
//}
//
//// This is the path to the file to which the JSON will be written to
//var outputFile = "./output.json";
//
//// I'm reading this sample XML file.
//var xmlUri = "/emp.xml";
//
//// We perform a GET request and we begin by setting a variable where we will store
//// our data.
//http.get(xmlUri, function(response) {
//	// This variable is where we will accumulate our XML data before conversion
//	var data = '';
//
//	// As the data pours in, the 'data' event is fired and we simply concatenate the incoming data into the variable
//	response.on("data", function(dat) {
//		data += dat;
//	});
//
//	// Once all the data has been received, the 'end' event is fired, which is when we run our XML2JS parser which
//	// converts the data to a JavaScript object which we then write out to a json file as a string.
//	response.on("end", function() {
//		// Convert to a JavaScript object
//		xmlParser(data, parserOptions, function(error, result) {
//            
//			// Write out a stringified version of the JS Object to a file
////			fs.writeFile(outputFile, JSON.stringify(result), function(err) {
////				if(!err) {
////					console.log("JSON data written out to : " + outputFile);
////				}
////			});
//            Array = JSON.stringify(result);
//            console.log(Array);
//            // Loading the index file . html displayed to the client
//            var server = http.createServer(function(req, res) {
//                fs.readFile('./index.html', 'utf-8', function(error, content) {
//                    res.writeHead(200, {"Content-Type": "text/html"});
//                    res.end(content);
//                });
//            });
//
//            // Loading socket.io
//            var io = require('socket.io').listen(server);
//
//            // When a client connects, we note it in the console
//            io.sockets.on('connection', function (socket) {
//                socket.emit('message', JSON.parse(Array));
//            });
//            
//            server.listen(8080);
//        });
//	});
//});


