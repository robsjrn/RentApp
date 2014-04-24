var express = require('express'),
    app = express.createServer();
var DatabaseConn=require('./ServerScripts/Database.js');
var passport = require('passport'),LocalStrategy = require('passport-local').Strategy;

//PDFDocument = require ('pdfkit')

 //  doc = new PDFDocument


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  DatabaseConn.getCredentials(_id, function(err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    DatabaseConn.getCredentials(username, function(err, user) {
      if (err) {console.log("error" + err); return done(err); }
      if (!user) {console.log("Incorrect username" );return done(null, false, { usernameError: true }); }
      if (user.pwd != password) { console.log("Incorrect password." ); return done(null, false, { pwdError: true }); }
      return done(null, user);
    });
  }
));


function ensureAuthenticated(req, res, next) {
	console.log("Authenticating user.. " + req);
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}



app.configure(function() {
  
   app.use(express.cookieParser());
   app.use(express.session({secret: '1234567890QWERTY'}));
   app.use(express.bodyParser());
   app.use(express.static(__dirname + '/app'));
  // any request that gets here is a dynamic page, and benefits from session
  // support

});

var pageNotFound= function(res){
   res.redirect('/404.html');
}
try
 {
		app.get('/', function(req, res){
			res.redirect('/index.html');
		});

     

		app.post('/tenantlogin',DatabaseConn.loginTenant);
			

		app.get('/tenantRedirect', function(req, res){
			res.redirect('/Tenant.html');
		});


		app.get('/landlordlogin', function(req, res){
			res.redirect('/Landlord.html');
		});

        app.get('/404', function(req, res){
			res.redirect('/404.html');
		});

		app.get('/agentlogin', function(req, res){
			res.redirect('/Agent.html');
		});


		app.post('/createTenant',DatabaseConn.CreateTenant);
		app.post('/createHouse',DatabaseConn.CreateHouse);

		app.get('/tenantList/:param',DatabaseConn.listoftenant);
		app.get('/houseList/:param',DatabaseConn.listofHouse);


		app.get('/UnbookedtenantList/:param',DatabaseConn.listofUnbookedtenant);
		app.get('/VacanthouseList/:param',DatabaseConn.listofVacantHouse);

		app.get('/bookedtenantList/:param',DatabaseConn.listofbookedtenant);

		app.post('/Rent',DatabaseConn.Rent);
		app.post('/vacate',DatabaseConn.vacate);



		app.post('/RentalPayment',DatabaseConn.postTransaction);
		app.get('/tenantStatement',ensureAuthenticated,DatabaseConn.tenantStatement);
		app.get('/tenantDetails',ensureAuthenticated,DatabaseConn.tenantDetails); 
 }
 
 catch (e)
 {

    console.error(e);
	pageNotFound(res);

 }


//update tenant :{"name" : "fghfgh"},{$set:{"status":1,"housename":"A5"}}
//update House {"number" : "a5"},{$set:{"status":"rented","tenantid":"25214"}


app.listen(4000);
console.log('Express server started on port 4000');