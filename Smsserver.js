var express = require('express');
var twilio = require('twilio')
var app = express();
app.use(express.urlencoded());
var db=require('./ServerScripts/Database.js');


 app.get('/', function(req, res){
	 res.send("Sms Server Up and Running..");
	 ;});

app.post('/inboundVoice', function(request, response) {
  
   // response.send('<Response><Say>Hello there! Thanks for calling.</Say></Response>');

       var resp = new twilio.TwimlResponse();
    resp.say({voice:'woman'}, 'Welcome to Nana !');
    resp.gather({ timeout:30 }, function() {
 
         this.say('For balance inquiry, press 1. For support, press 2.');
 
    });
	 res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.end(resp.toString());

});

app.post('/inboundSMS', function(request, response) {
	var body = request.param('Body').trim();
   console.log("got sms  a request from "+request.param('From'));
    db.findPhoneNumber(request.param('From'),function(err,status){
		if (status){

			if (status.role="tenant")
			{
				 console.log("balance is  "+status.balance);
		          var msg="<Response><Sms>Hello "+status.names+" Your House Balance is "+ status.balance +"</Sms></Response>";
                 response.send(msg); 
			}
			else{
			     var msg="<Response><Sms>Hello "+status.names+" Your Expected Monthly Income is "+ status.expcMonthlyIncome+"</Sms></Response>";
                 response.send(msg); 
			}
		  
		}
		else{
            var msg="<Response><Sms>Sorry You Are not Registered</Sms></Response>"
           response.send(msg);
		}
		 
	});
   
});
console.log("Incoming SMS Server up..");
app.listen(4001);