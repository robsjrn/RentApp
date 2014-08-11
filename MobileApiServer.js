var express = require('express'),
    app = express.createServer();
var DatabaseConn=require('./ServerScripts/Database.js');
var jwt = require('jwt-simple');

app.configure(function() {
  
   app.use(express.cookieParser());
   app.use(express.bodyParser({uploadDir:__dirname +'/app/uploads'}));
   app.use(express.bodyParser());
   app.use(express.static(__dirname + '/app'));

});


var tokenSecret='1234567890QWERTY';

 function decodeuser(req, res, next) {
	 console.log("decoding token " +req.headers.token);
  var decoded = jwt.decode(req.headers.token, tokenSecret);
      req.user={};
      req.user.identifier=decoded.username;
   return next();
}

app.post('/MobileLogin',   function(req, res) {



console.log("The username is.." + req.body.username);

console.log("The password is.." + req.body.password);

    DatabaseConn.getCredentials(req.body.username, function(err, user) {
     if (err)  { console.log("error occured is .." + err); res.send(401);  }
     if (!user) {console.log("Incorrect username" );res.send(401); } 
	 if (user.password !=req.body.password) { console.log("Incorrect password." ); res.send(401); }
	   var token = jwt.encode({username: user.identifier}, tokenSecret);
	   console.log("the user role is "+user.role);
	     console.log("Sending Token"+user.identifier);
		res.json({token : token,role:user.role});	
            	});
  }); 
	

app.get('/Viewmail2',decodeuser,DatabaseConn.Viewmail);

app.get('/Viewmail3',DatabaseConn.Viewmail2);

app.get('/tenantDetails',decodeuser,DatabaseConn.tenantDetails); 

 app.get('/test', function(req, res){
			res.send(200,{"status":"ok"});
		});
app.listen(4001);