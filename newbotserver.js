require('use-strict');
var app = require('express')();
app = require('./api/api');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var connect = require('connect');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

var apiai = require('apiai');
var apiapp = apiai("d3bf36baa23f41d29d41e6e0619641ae");//developer access token

var serverport = 2001;

var web = connect();
web.use(serveStatic('web'));
app.use('/',web);

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('socket id is :',socket.id);

  socket.on('apicall', function(data){
 		console.log(data);

 	 	var options = {
    	    sessionId: data.session
  		};
   		var request = apiapp.textRequest(data.msg, options);

		request.on('response', function(response) {
    	  console.log("response", response);
        //var socketId=req.query.id;
        io.sockets.connected[socket.id].emit('getresponse',response);
        //if(io.sockets.connected[socket.id]!=null) {}
    	  //io.emit('getresponse',response);
    	  //res.jsonp(response);
  		});

  		request.on('error', function(error) {
    		  console.log("error",error);
      		//res.jsonp(error);
  		});

	  	request.end();

  		socket.on('disconnect', function () {
    		console.log('A user disconnected');
  		});

	});
});

http.listen(serverport, function(){
  console.log('listening on *:'+serverport);
});
