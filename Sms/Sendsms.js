var twilio = require('twilio');
var S = require('string');
 
// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient('AC5dabe402352ad3b7eadad650dccd3c8c', '4ffa6f3ff6fb7f461996e4a992e24b93');
 
// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.



exports.SendWelcomeSMS=function(phoneNumber,msg,fn){

	
  client.sms.messages.create({
    to:phoneNumber,
    from:'+17746332190',
    body:msg
}, function(error, message) {

    if (!error) {
   /// to do save this message to the DB
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
 
        console.log('Message sent on:');
        console.log(message.dateCreated);
		fn(message.sid,message.sid);//correct this late
    } else {
        console.log('Oops! There was an error.'+error);
        fn(null,null);
    }
}); 
};


exports.sendPassword=function(phoneNumber,msg,fn){

	console.log("the phone numbers is "+ phoneNumber)
  client.sms.messages.create({
    to:phoneNumber,
    from:'+17746332190',
    body:msg
}, function(error, message) {
   
    if (!error) {
    /// to do save this message to the DB
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);

        console.log('Message sent on:');
        console.log(message.dateCreated);
		fn(message.sid,message.sid);//correct this late
    } else {
        console.log('Oops! There was an error.' + error);
        fn(null,null);
    }
}); 
};



exports.LandlordWelcmeSMS=function(phoneNumber,msg,fn){

  client.sms.messages.create({
    to:phoneNumber,
    from:'+17746332190',
    body:msg
}, function(error, message) {
  
    if (!error) {
   // save to db later
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
 
        console.log('Message sent on:');
        console.log(message.dateCreated);
		fn(message.sid,message.sid);//correct this late
    } else {
        console.log('Oops! There was an error.');
        fn(null,null);
    }
}); 
};