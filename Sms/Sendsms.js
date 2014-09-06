var twilio = require('twilio');
var S = require('string');
 
// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient('AC5dabe402352ad3b7eadad650dccd3c8c', '4ffa6f3ff6fb7f461996e4a992e24b93');
 
// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.



exports.SendWelcomeSMS=function(phoneNumber,msg,fn){
	try
	{
		var phone ="+254" +S(phoneNumber).right(9).s;
	    console.log("The whole phone number is "+ phone);
	}
	catch (ex)
	{
		console.log("Error Mbaya sana"+ex);;
	}
	
  client.sms.messages.create({
    to:phone,
    from:'+17746332190',
    body:msg
}, function(error, message) {
    // The HTTP request to Twilio will run asynchronously. This callback
    // function will be called when a response is received from Twilio
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
    if (!error) {
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request. In this case, it is the
        // information about the text messsage you just sent:
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
