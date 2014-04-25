var express = require('express'),
    app = express.createServer();
var DatabaseConn=require('./ServerScripts/Database.js');
var passport = require('passport'),LocalStrategy = require('passport-local').Strategy;

//PDFDocument = require ('pdfkit')

 //  doc = new PDFDocument


passport.serializeUser(function(user, done) {
  done(null, user.housename);
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
      if (user._id != password) { console.log("Incorrect password." ); return done(null, false); }
      return done(null, user);
    });
  }
));


function ensureAuthenticated(req, res, next) {
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
    app.use(passport.initialize());
	app.use(passport.session());
});

var pageNotFound= function(res){
   res.redirect('/404.html');
}
try
 {
		
		app.post('/login',   passport.authenticate('local', {     successRedirect: '/Tenant.html',     failureRedirect: '/404.html'  }) );  
		
		
		
		
		app.get('/', function(req, res){
			res.redirect('/index.html');
		});

     

		app.post('/tenantlogin', passport.authenticate('local'),  function(req, res) { res.send(200);});
        app.post('/landlordlogin', passport.authenticate('local'),  function(req, res) { res.send(200);});
		app.post('/agentlogin', passport.authenticate('local'),  function(req, res) { res.send(200);});	

		
		app.get('/tenantRedirect', function(req, res){res.redirect('/Tenant.html');	});
        app.get('/landlordRedirect', function(req, res){res.redirect('/Landlord.html');	});
       	app.get('/agentRedirect', function(req, res){res.redirect('/Agent.html');});
		

        app.get('/404', function(req, res){
			res.redirect('/404.html');
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


app.listen(4000);
console.log('Express server started on port 4000');