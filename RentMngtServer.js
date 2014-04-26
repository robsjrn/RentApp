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
      if (!user) {console.log("Incorrect username" );return done(null, false); }
      if (user.password != password) { console.log("Incorrect password." ); return done(null, false); }
      return done(null, user);
    });
  }
));


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/Error.html');
}



app.configure(function() {
  
   app.use(express.cookieParser());
   app.use(express.session({secret: '1234567890QWERTY'}));
   app.use(express.bodyParser());
   app.use(express.static(__dirname + '/app'));
  // any request that gets here is a dynamic page, and benefits from session
  // support
    app.use(passport.initialize());
	app.use(passport.session());
});

var pageNotFound= function(res){
   res.redirect('/Error.html');
}
try
 {
			
		app.get('/', function(req, res){res.redirect('/index.html');});

     

		app.post('/login', passport.authenticate('local'),  function(req, res) { res.send(200);});
      
		

        app.get('/LoginRedirect', function(req, res){
			console.log("The User Role is." +req.user.role );
           
			if(req.user.role=="tenant"){
			    res.redirect('/Tenant.html');
			 }

            else if(req.user.role=="landlord"){
			    res.redirect('/Landlord.html');
			 }
         
             else if(req.user.role=="agent"){
			    res.redirect('/Agent.html');
			 }
				
			
			});



        app.get('/404', function(req, res){
			res.redirect('/Error.html');
		});

	


		app.post('/createTenant',ensureAuthenticated,DatabaseConn.CreateTenant);
		app.post('/createHouse',ensureAuthenticated,DatabaseConn.CreateHouse);

		app.get('/tenantList/:param',ensureAuthenticated,DatabaseConn.listoftenant);
		app.get('/houseList/:param',ensureAuthenticated,DatabaseConn.listofHouse);


		app.get('/UnbookedtenantList/:param',ensureAuthenticated,DatabaseConn.listofUnbookedtenant);
		app.get('/VacanthouseList/:param',ensureAuthenticated,DatabaseConn.listofVacantHouse);

		app.get('/bookedtenantList/:param',ensureAuthenticated,DatabaseConn.listofbookedtenant);

		app.post('/Rent',ensureAuthenticated,DatabaseConn.Rent);
		app.post('/vacate',ensureAuthenticated,DatabaseConn.vacate);



		app.post('/RentalPayment',ensureAuthenticated,DatabaseConn.postTransaction);
		app.get('/tenantStatement',ensureAuthenticated,DatabaseConn.tenantStatement);
		app.get('/tenantDetails',ensureAuthenticated,DatabaseConn.tenantDetails); 

        app.get('/LandLordDetails',ensureAuthenticated,DatabaseConn.LandLordDetails); 

		
 }
 
 catch (e)
 {

    console.error(e);
	pageNotFound(res);

 }


app.listen(4000);
console.log('Express server started on port 4000');