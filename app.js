var express = require('express'),
    app = express.createServer();
var DatabaseConn=require('./ServerScripts/Database.js');
var passport = require('passport'),LocalStrategy = require('passport-local').Strategy;
var jwt = require('jwt-simple');



var tokenSecret='1234567890QWERTY';

 function ensureAuthenticated(req, res, next) {
	  try
		  {
			var decoded = jwt.decode(req.headers.token, tokenSecret);
			  req.user={};
			  req.user.identifier=decoded.username;
			  return next();
		  }
		  catch (e)
		  {
			   console.error(e);
	           res.json(401,{error: "Server Error"});
		  }
		  
}

app.configure(function() {
  
   app.use(express.bodyParser({uploadDir:__dirname +'/app/uploads'}));
   app.use(express.bodyParser());
   app.use(express.static(__dirname + '/app'));
  // any request that gets here is a dynamic page, and benefits from session
  // support
});

var pageNotFound= function(res){
   res.redirect('/Error.html');
}
try
 {
    app.get('/', function(req, res){res.redirect('/index.html');});

     app.post('/Login',   function(req, res) {
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

		//app.post('/login', passport.authenticate('local'),  function(req, res) { res.send(200);});
        app.get('/logout',ensureAuthenticated,DatabaseConn.logout);

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
		
        
		app.get('/AccessRequest',ensureAuthenticated,DatabaseConn.Accessrequest);
		app.post('/GrantAccess',ensureAuthenticated,DatabaseConn.GrantAccess);


        app.post('/HseTypeConfiguration',ensureAuthenticated,DatabaseConn.HseTypeConfiguration);
		app.post('/PaymentmethodConfiguration',ensureAuthenticated,DatabaseConn.PaymentmethodConfiguration);
		app.post('/TransactiontypeConfiguration',ensureAuthenticated,DatabaseConn.TransactiontypeConfiguration);
		app.post('/ExpenseTypeConfiguration',ensureAuthenticated,DatabaseConn.ExpenseTypeConfiguration);
        

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
		  app.post('/OccupiedHouseReport',ensureAuthenticated,DatabaseConn.OccupiedHouseReport); 
		  app.post('/vacantHouseReport',ensureAuthenticated,DatabaseConn.vacantHouseReport); 

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
    res.json(500,{error: "Server Error"});
 }


//app.listen(4000);
// on deployment un comment 
app.listen(process.env.PORT || 4000);
console.log('Express server started on port 4000');