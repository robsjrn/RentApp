var nodemailer = require('nodemailer');
var path           = require('path')
  , templatesDir   = path.join(__dirname, 'Templates')
  , emailTemplates = require('email-templates');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nanatecltd@gmail.com',
        pass: 'sebastian123!'
    }
});

console.log("Mail Template Path "+templatesDir );

exports.WelcomeMail = function(req, res) {
		emailTemplates(templatesDir, function(err, template) {
		  if (err) {
			console.log(err);
			res.json(200,{error:err });
		  } else {

			var locals = {
			  email: 'mamma.mia@spaghetti.com',
			  name: {
				first: 'Robertoo',
				last: 'Njoroge'
			  }
			};
		  template('welcome', locals, function(err, html, text) {
			  if (err) {
				console.log(err);
			  } else {
				transporter.sendMail({
				  from: 'nanatecltd@gmail.com',
				  to: 'robsjrn@gmail.com',
				  subject: 'Welcome to Nana',
				  html: html,
				  // generateTextFromHTML: true,
				  text: text
				}, function(err, responseStatus) {
				  if (err) {
					console.log(err);
					res.json(200,{error_note:err });
				  } else {
					console.log("Welcome Msg Sent");
					res.json(200,{success: responseStatus.message});
				  }
				});
			  }
			});

		  }
		  });
  };

 exports.NewLandlordMail = function(req, res) {
		emailTemplates(templatesDir, function(err, template) {
		  if (err) {
			console.log(err);
			res.json(200,{error:err });
		  } else {

			var locals = {
			  email: 'mamma.mia@spaghetti.com',
			  name: {
				first: 'Robertoo',
				last: 'Njoroge'
			  }
			};
		  template('NewLandlord', locals, function(err, html, text) {
			  if (err) {
				console.log(err);
			  } else {
				transporter.sendMail({
				  from: 'nanatecltd@gmail.com',
				  to: 'robsjrn@gmail.com',
				  subject: 'Testing',
				  html: html,
				  // generateTextFromHTML: true,
				  text: text
				}, function(err, responseStatus) {
				  if (err) {
					console.log(err);
					res.json(200,{error_note:err });
				  } else {
					console.log("Welcome Msg Sent");
					res.json(200,{success: responseStatus.message});
				  }
				});
			  }
			});

		  }
		  });
  };

 exports.NewTenant = function(req, res) {
		emailTemplates(templatesDir, function(err, template) {
		  if (err) {
			console.log(err);
			res.json(200,{error:err });
		  } else {

			var locals = {
			  email: 'mamma.mia@spaghetti.com',
			  name: {
				first: 'Robertoo',
				last: 'Njoroge'
			  }
			};
		  template('NewTenant', locals, function(err, html, text) {
			  if (err) {
				console.log(err);
			  } else {
				transporter.sendMail({
				  from: 'nanatecltd@gmail.com',
				  to: 'robsjrn@gmail.com',
				  subject: 'Testing',
				  html: html,
				  // generateTextFromHTML: true,
				  text: text
				}, function(err, responseStatus) {
				  if (err) {
					console.log(err);
					res.json(200,{error_note:err });
				  } else {
					console.log("Welcome Msg Sent");
					res.json(200,{success: responseStatus.message});
				  }
				});
			  }
			});

		  }
		  });
  };


exports.PasswordReset = function(req, res) {
		emailTemplates(templatesDir, function(err, template) {
		  if (err) {
			console.log(err);
			res.json(200,{error:err });
		  } else {

			var locals = {
			  email: 'mamma.mia@spaghetti.com',
			  name: {
				first: 'Robertoo',
				last: 'Njoroge'
			  }
			};
		  template('PasswordReset', locals, function(err, html, text) {
			  if (err) {
				console.log(err);
			  } else {
				transporter.sendMail({
				  from: 'nanatecltd@gmail.com',
				  to: 'robsjrn@gmail.com',
				  subject: 'Testing',
				  html: html,
				  // generateTextFromHTML: true,
				  text: text
				}, function(err, responseStatus) {
				  if (err) {
					console.log(err);
					res.json(200,{error_note:err });
				  } else {
					console.log("Welcome Msg Sent");
					res.json(200,{success: responseStatus.message});
				  }
				});
			  }
			});

		  }
		  });
  };

exports.Promotional = function(req, res) {
		emailTemplates(templatesDir, function(err, template) {
		  if (err) {
			console.log(err);
			res.json(200,{error:err });
		  } else {

			var locals = {
			  email: 'mamma.mia@spaghetti.com',
			  name: {
				first: 'Robertoo',
				last: 'Njoroge'
			  }
			};
		  template('Promotional', locals, function(err, html, text) {
			  if (err) {
				console.log(err);
			  } else {
				transporter.sendMail({
				  from: 'nanatecltd@gmail.com',
				  to: 'robsjrn@gmail.com',
				  subject: 'Testing',
				  html: html,
				  // generateTextFromHTML: true,
				  text: text
				}, function(err, responseStatus) {
				  if (err) {
					console.log(err);
					res.json(200,{error_note:err });
				  } else {
					console.log("Welcome Msg Sent");
					res.json(200,{success: responseStatus.message});
				  }
				});
			  }
			});

		  }
		  });
  };
