var email   = require("emailjs/email");
var DatabaseConn=require('./Database.js');
var ejs = require('ejs')
  , fs = require('fs')
  , str = fs.readFileSync('./MailTemplates/welcomeMail.ejs', 'utf8'); 

var WelcomemessageHtml = ejs.render(str, []);

var server  = email.server.connect({
   user:    "nanatecltd@gmail.com", 
   password:"sebastian123!", 
   host:    "smtp.gmail.com", 
   ssl:     true
});



// send the message and get a callback with an error or details of the message that was sent



exports.sendMail = function(req, res) {
var id=null;
var hseno=null;
if (typeof req.body.id!="undefined")
{
	id= req.body.id;
}
else if (typeof req.body.hseno!="undefined")
{
    hseno=req.body.hseno;
}

DatabaseConn.findEmail(id,hseno,function(err, message) { 


	if (err)
	{
		res.json(500,{error: "User Not Found"});
	}
	else
	{  
		   console.log("Sending Mail to ...."+message.email);
         var  message=getMessage(message.email);
          server.send(message, function(err, message) { 
			console.log(err || message); 
	     if (err)
	     {
			  res.json(500,{error: "Mail Server Error"});
	     }
		 else{
             res.json(200,{success: "Success"});
		 }
	   });

	}
});
  
}

var getMessage= function(emailaddr)
{
	var msg = {
   text:    "Password Reset", 
   from:    "Nana <nanatecltd@gmail.com>", 
   to:      emailaddr, 
   subject: "Password Reset",
   attachment: 
   [
      {data:"<html>Your new Password is Test</html>", alternative:true},
   ]
};
	
	return msg;
}


exports.sendWelcomeMail = function(emailaddr, callback) {
	console.log("Sending Welcome Mail.......to "+emailaddr);
	var msg = {
		   text:    "Welcome", 
		   from:    "Nana <nanatecltd@gmail.com>", 
		   to:      emailaddr, 
		   subject: "Welcome to Nana ",
		   attachment: 
		   [
			  {data:WelcomemessageHtml, alternative:true},
		   ]
		};


  	 server.send(msg, function(err, message) { 
			console.log(err || message); 
	     if (err)
	     {
			  callback(err,null);
	     }
		 else{
             callback(null,"ok");
		 }
	   });
};
