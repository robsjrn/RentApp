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
  res.send(401);
}



app.configure(function() {
  
   app.use(express.cookieParser());
   app.use(express.bodyParser({uploadDir:__dirname +'/app/uploads'}));
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
        app.get('/logout',ensureAuthenticated,DatabaseConn.logout);

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
			  else if(req.user.role=="admin"){
			    res.redirect('/Admin.html');
			 }	
			
			});



        app.get('/404', function(req, res){
			res.redirect('/Error.html');
		});

	


		app.post('/createTenant',ensureAuthenticated,DatabaseConn.CreateTenant);
		app.post('/createHouse',ensureAuthenticated,DatabaseConn.CreateHouse);

		app.get('/tenantList/:plot',ensureAuthenticated,DatabaseConn.listoftenant);
		app.get('/houseList/:plot',ensureAuthenticated,DatabaseConn.listofHouse);


		app.get('/UnbookedtenantList/:plot',ensureAuthenticated,DatabaseConn.listofUnbookedtenant);
		app.get('/VacanthouseList/:plot',ensureAuthenticated,DatabaseConn.listofVacantHouse);

		app.get('/bookedtenantList/:plot',ensureAuthenticated,DatabaseConn.listofbookedtenant);

		app.post('/Rent',ensureAuthenticated,DatabaseConn.Rent);
		app.post('/vacate',ensureAuthenticated,DatabaseConn.vacate);



		app.post('/RentalPayment',ensureAuthenticated,DatabaseConn.postTransaction);
		app.get('/tenantStatement',ensureAuthenticated,DatabaseConn.tenantStatement);
		app.get('/tenantDetails',ensureAuthenticated,DatabaseConn.tenantDetails); 
        app.get('/LandLordDetails',ensureAuthenticated,DatabaseConn.LandLordDetails); 
		app.get('/LandLordConfiguration',ensureAuthenticated,DatabaseConn.LandLordConfiguration);
		
        
		app.get('/AccessRequest',DatabaseConn.Accessrequest);
		app.post('/GrantAccess',DatabaseConn.GrantAccess);


        app.post('/HseTypeConfiguration',DatabaseConn.HseTypeConfiguration);
		app.post('/PaymentmethodConfiguration',DatabaseConn.PaymentmethodConfiguration);
		app.post('/TransactiontypeConfiguration',DatabaseConn.TransactiontypeConfiguration);
		app.post('/ExpenseTypeConfiguration',DatabaseConn.ExpenseTypeConfiguration);
        

        app.get('/UpdateTenantAgreement',ensureAuthenticated,DatabaseConn.UpdateTenantAgreement);

		app.post('/LandlordAddPlots',ensureAuthenticated,DatabaseConn.LandlordAddPlots);
		 

	    app.post('/Mail',ensureAuthenticated,DatabaseConn.CreateMail);
		app.get('/Viewmail',ensureAuthenticated,DatabaseConn.Viewmail);

        app.post('/CheckPwd',ensureAuthenticated,DatabaseConn.CheckPwd);
		app.post('/ChangePwd',ensureAuthenticated,DatabaseConn.ChangePwd);

        app.get('/LandlordTenants',ensureAuthenticated,DatabaseConn.LandlordTenants);
        app.get('/Findneighbours',ensureAuthenticated,DatabaseConn.Findneighbours);
        app.post('/photoupload',ensureAuthenticated,DatabaseConn.photoupload);
		app.post('/Landlordphotoupload',ensureAuthenticated,DatabaseConn.Landlordphotoupload);
		

        app.get('/TenantInfo',ensureAuthenticated,DatabaseConn.TenantInfo);
        app.post('/updateTenantData',ensureAuthenticated,DatabaseConn.updateTenantData); 
        app.post('/MonthlyRentPosting',ensureAuthenticated,DatabaseConn.MonthlyRentPosting); 

 //Reports
		app.post('/Report',ensureAuthenticated,DatabaseConn.Report); 
	    app.post('/TenantPaidReport',ensureAuthenticated,DatabaseConn.TenantPaidReport); 
        app.post('/TenantUnpaidReport',ensureAuthenticated,DatabaseConn.TenantUnpaidReport); 

		 app.post('/TenantListReport',ensureAuthenticated,DatabaseConn.TenantListReport); 
		

  //Service that dont Require Login
          app.post('/ServiceRegistration',DatabaseConn.ServiceRegistration); 
          app.post('/ServiceListing',DatabaseConn.ServiceListing);
		  app.post('/PropertyRegistration',DatabaseConn.PropertyRegistration);
          app.post('/PropertyListing',DatabaseConn.PropertyListing); 
		  app.post('/VacantRentalListing',DatabaseConn.VacantRentalListing);
		  app.post('/CreateLandlord',DatabaseConn.CreateLandlord);

		app.get('/mobileTest',DatabaseConn.TestMobile);	
		app.post('/TestMobilePost', passport.authenticate('local'),  function(req, res) { res.send(200);});	
 }
 
 catch (e)
 {

    console.error(e);
	pageNotFound(res);

 }


app.listen(4000);
console.log('Express server started on port 4000');