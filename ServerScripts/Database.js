var mongo = require('mongodb');
var mail=require('../ServerScripts/mail.js');
var sms=require('../Sms/Sendsms.js');
var fs = require('fs');
var util     = require('util')
var path     = require('path');
var async =require('async');
var bcrypt = require('bcrypt');

var Db = require('mongodb').Db,
 Server = require('mongodb').Server;

var MongoClient = require('mongodb').MongoClient;
var db;
BSON = mongo.BSONPure;


// Initialize connection once
// When using db locally

MongoClient.connect("mongodb://localhost:27017/RentalDB", function(err, database) {
  if(err) throw err;
  
  db=database;
  
  
	 db.collection('counters',{strict:true}, function(err, collection) {
      if (err) { 
		   console.error('counters Collection Does not Exists: %s', err);
		   configureCounters();
	   }
	   });
	   db.collection('Configuration',{strict:true}, function(err, collection) {
	   if (err) { 
		   console.error('Configuration Collection Does not Exists: %s', err);
		   configureDB();
		   }
	   else{
		   console.log("Everything Configured DB up..."); 
		       }

		  });

});


/*
MongoClient.connect("mongodb://robert:sebastian123!@proximus.modulusmongo.net:27017/h8oSorad", function(err, database) {
  if(err) throw err;
  db = database;
  console.log("Rental Database is Up ..");
});
*/


exports.getCredentials=function(userid,pwd,fn){	
 db.collection('user', function(err, collection) { 
     collection.findOne({$and: [ {"_id":userid},{"AccessStatus" : 1}]},function(err, item) {
	   if(item){
		 bcrypt.compare(pwd, item.password, function(err, res) {
              if (res) { return fn(null,item); }
			  else{return fn(null,null);}
         });  	   
	   }else{return fn(null,null);}
});
	  
 
});		
};



exports.CreateTenant = function(req, res) {
req.body.contact="+254"+req.body.contact;
 bcrypt.hash(req.body._id, 10, function(err, hash) {
	req.body.password=hash;
		db.collection('user', function(err, collection) {
		collection.insert(req.body, function(err, item) {
		   if (err) {res.json(500,{error: "database Error"});}
		   else{	   
			   res.json(200,{success: "Succesfull"});	   
			   }
			});
			});

 });

};


exports.CreateHouse = function(req, res) {
// console.log("The Hse Amount is .."+req.body.amount);
db.collection('House', function(err, collection) {
collection.insert(req.body, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{updatenohse(req.user._id,1,req.body.amount,function(ok,status) {if (ok){res.json(200,{success: "Succesfull"}); }	
   });}

});
});
};




exports.listoftenant = function(req, res) {

 db.collection('user', function(err, collection) {
 collection.find({"plot.Plotname":req.params.plot}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};


exports.listofHouse = function(req, res) {
 db.collection('House', function(err, collection) {
 collection.find({"plot.Plotname":req.params.plot}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};



exports.listofUnbookedtenant = function(req, res) {
	
 db.collection('user', function(err, collection) {
 collection.find({"plot.Plotname":req.params.plot,"hsestatus":0},{names:1}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};


exports.listofbookedtenant = function(req, res) {
 db.collection('user', function(err, collection) {
 collection.find({"plot.Plotname":req.params.plot,"hsestatus":1}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};




exports.listofVacantHouse = function(req, res) {
 db.collection('House', function(err, collection) {
 collection.find({"plot.Plotname":req.params.plot,"status":"vacant"},{number:1,amount:1}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};



exports.Rent = function(req, res) {
var update=req.body.update;
var houseupdate=update.houseUpdate;
var tenantupdate= update.tenantupdate;
var Trxn =update.Trxn;
var details= update.details;

 updateHouse(houseupdate,details.number,function(ok,status){ 
	   if(ok){ updateTenant (tenantupdate,details._id,function(ok,status)
		       { if(ok){ CreateTrxn(Trxn,function(ok,status){
                 if(ok){ res.json(200,{sucess:"successfull" }); }
				  });
	            }	           
			   });
	         }
   });

};


var updateHouse=function (housedetails ,hsenumber,callback){
   db.collection('House', function(err, collection) {
    collection.update({"number" : hsenumber},{$set:housedetails},{safe:true}, function(err, item) {
     if(err){return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};

var updateTenant=function (tenantdetails,tenantid ,callback){

   db.collection('user', function(err, collection) {
    collection.update({"_id" : tenantid},{$set:tenantdetails},{safe:true}, function(err, item) {
     if(err){return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};






var updateAccessStatus=function (userid ,callback){
   db.collection('user', function(err, collection) {
    collection.update({"_id" : userid},{$set:{"AccessStatus" : 1}},{safe:true}, function(err, item) {
     if(err){return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};


var CreateTrxn=function (Trxn,callback){
db.collection('Transaction', function(err, collection) {
collection.insert(Trxn, function(err, item) {
     if(err){return callback(false,err);}
	  else{ return callback(true,null);}
      });
   }); 
};




exports.postTransaction = function(req, res) {

	postTran(req,function(ok,status) {
	    if (ok) {res.json(200,{Status: "Ok"});}
		else{res.json(500,{error: "Database Error"});}
	});

};

var postTran=function(req,callback){

if (req.body.receiptno==null)
{  //no receipt so get receipt
	getNextSequenceValue("transactionid",function(err,receiptnumber){
	 if(receiptnumber){
       req.body.receiptno=receiptnumber;
		db.collection('Transaction', function(err, collection) {
		collection.save(req.body,{safe:true}, function(err, item) {
		   if (err) {return callback(false,err);}
		   else{
			   updateTenantBal(req.body.tranAmount,req.body.tenantid,function(ok,status) {if (ok){return callback(true,null); }	
		   });}
		   });
		   });
	     }
      });
}else{

	db.collection('Transaction', function(err, collection) {
		collection.save(req.body,{safe:true}, function(err, item) {
		   if (err) {return callback(false,err);}
		   else{
			   updateTenantBal(req.body.tranAmount,req.body.tenantid,function(ok,status) {if (ok){return callback(true,null); }	
	 });}
	});
	});

}
 
};

var updateTenantBal=function (tenantbal,tenantid ,callback){
   db.collection('user', function(err, collection) {
    collection.update({"_id" : tenantid},{$inc:{balance:-tenantbal}},{safe:true}, function(err, item) {
     if(err){return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};






exports.tenantStatement = function(req, res) {
 db.collection('Transaction', function(err, collection) {
 collection.find({"tenantid":req.user._id}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};



exports.tenantDetails = function(req, res) {
    db.collection('user', function(err, collection) {
     collection.findOne({"_id":req.user._id},function(err, item) {
	   if(item){res.send(item);
	   }else{res.send(401);}
});
});

};


exports.vacate = function(req, res) {
var update=req.body.update;
var houseupdate=update.houseUpdate;
var tenantupdate= update.tenantupdate;
var details= update.details;


updateHouse(houseupdate,details.number,function(ok,status){ 
	   if(ok){ updateTenant (tenantupdate,details._id,function(ok,status)
		       { if(ok){ res.json(200,{sucess:"successfull" }); }           
			  });
	         }
   });
};



exports.LandLordDetails = function(req, res) {
    db.collection('user', function(err, collection) {
     collection.findOne({"_id":req.user._id},function(err, item) {
	   if(item){res.send(item);
	   }else{res.send(401);}
});
});

};




exports.Accessrequest = function(req, res) {
 db.collection('user', function(err, collection) {
 collection.find({"AccessStatus":0},{names:1,email:1,contact:1,_id:1,housename:1}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};

exports.GrantAccess = function(req, res) {

    updateAccessStatus(req.body._id,function(ok,status) {
      if (ok){
		   mail.sendWelcomeMail(req.body.email,function(err,ok){
			    if (err){console.log("Welcome email not sent ..."); }
				else{console.log("Welcome email sent ...");}
		   });
     var msg ="Hi "+req.body.names +" Welcome to Nanatec visit our site at http://104.131.30.17:4000/ use your Id number as your Username and Password .. enjoy "
			sms.SendWelcomeSMS(req.body.contact,msg,function(ok,status){
			     if (!ok){console.log("Welcome sms not sent ..."); }
				  else{console.log("Welcome sms sent ...");}
		   });
                    
		   
		   res.json(200,{success: "Succesfull"});
	   
	   }	

 

	});
};


exports.LandLordConfiguration = function(req, res) {
 db.collection('Configuration', function(err, collection) {
 collection.findOne({"_id":"RentalConfiguration"},function(err, item) {
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};

exports.HseTypeConfiguration = function(req, res) {
 db.collection('Configuration', function(err, collection) {
 collection.update({"_id":"RentalConfiguration"},{$addToSet:{hsetype : req.body}},{safe:true}, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{res.json(200);}
});
});
};

exports.PaymentmethodConfiguration = function(req, res) {
 db.collection('Configuration', function(err, collection) {
 collection.update({"_id":"RentalConfiguration"},{$addToSet:{paymentmethod : req.body}},{safe:true}, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{res.json(200);}
});
});
};


exports.TransactiontypeConfiguration = function(req, res) {
 db.collection('Configuration', function(err, collection) {
 collection.update({"_id":"RentalConfiguration"},{$addToSet:{transactiontype : req.body}},{safe:true}, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{res.json(200);}
});
});
};


exports.ExpenseTypeConfiguration = function(req, res) {
 db.collection('Configuration', function(err, collection) {
 collection.update({"_id":"RentalConfiguration"},{$addToSet:{expenseType : req.body}},{safe:true}, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{res.json(200);}
});
});
};


exports.LandlordAddPlots = function(req, res) {
 db.collection('user', function(err, collection) {
 collection.update({"_id":req.user._id},{$addToSet:{plots : req.body},  $inc:{noplots:1}},{safe:true}, function(err, item) {
   if (err) {console.log(err);res.json(500,{error: "database Error"});}
   else{res.json(200);}
});
});
};





exports.CreateLandlord = function(req, res) {
   req.body.LandlordDet.contact="+254"+req.body.LandlordDet.contact;
   bcrypt.hash(req.body.LandlordDet.password, 10, function(err, hash) {
	req.body.LandlordDet.password=hash;
    db.collection('user', function(err, collection) {
    collection.insert(req.body.LandlordDet,{safe:true}, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{
	     var msg ="Hi "+req.body.LandlordDet.names +" Welcome to Nanatec visit our site at http://104.131.30.17:4000/login.html use your Id number as your Username ... enjoy "
			sms.SendWelcomeSMS(req.body.LandlordDet.contact,msg,function(ok,status){
			     if (!ok){console.log("Welcome sms not sent ..."); }
				  else{console.log("Welcome sms sent ...");}
		   });
	   res.json(200,{success: "Succesfull"});   
	   }	
   });
  }); 
});

 
};




var GrantLandlordAccess=function (CredentialDet ,callback){
   db.collection('Credential', function(err, collection) {
    collection.insert(CredentialDet,{safe:true}, function(err, item) {
     if(err){return callback(false,err);}
	  else{
		  // send welcome sms to landlord
		  getUser(CredentialDet.identifier,function(no,landlord){
                  if (no)
                  {
		               var msg ="Hi "+landlord.names +" Welcome to Nana use Your id as your Username and Password Change after Login.. enjoy "
					   sms.LandlordWelcmeSMS(landlord.contact,msg,function(ok,status){
			           if (ok){console.log("Landlord Welcome sms not sent ..."); }
				         else{console.log("Landlord Welcome sms sent ...");}
		                  });
				  }
				  });
		  return callback(true,null);}
      });
   });
};



var updatenohse=function (landlordid,no,Amount ,callback){
   db.collection('user', function(err, collection) {
    collection.update({"_id" : landlordid},{ $inc:{expcMonthlyIncome:Amount,nohse:no}},{safe:true}, function(err, item) {
     if(err){console.log(err);return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};



exports.UpdateTenantAgreement=function (req, res){
   db.collection('user', function(err, collection) {
    collection.update({"_id" : req.user._id},{$set:{"AgreementStatus" : false}},{safe:true}, function(err, item) {
   if (err) {console.log(err);res.json(500,{error: "database Error"});}
   else{res.json(200);}
});
});
};



exports.updateTenantData=function (req, res){
   db.collection('user', function(err, collection) {
    collection.update({"_id" : req.user._id},{$set:{"Details" : req.body.details}}, {}, function(err, item) {
   if (err) {console.log(err);res.json(500,{error: "database Error"});}
   else{res.json(200);}
});
});
};



exports.TestMobile=function(req, res) {

 //console.log("Params is " +req.params); 
// console.log("Variable is " +req.params.id );
 console.log("Received Request" );
	 res.json(200,{status:"Good Response"});
};


exports.TestMobilePost=function(req, res) {

 //console.log("Params is " +req.params); 
console.log("Request Body id " +req.body.id );
 console.log("Received Request" );
	 res.json(200,{status:"well done"});
};


exports.TenantInfo=function(req, res) {

 db.collection('user', function(err, collection) {
  collection.findOne({"_id":req.query.tenant_id},{Details:1,name:1,email:1,contact:1,occupation:1},function(err, item){
  if(item){res.send(item); }
  if (err) {res.json(500,{error: "database Error"});}

});
});
};


exports.CreateMail=function(req, res) {
       var update=req.body.update;
	   var senderDetails=update.senderDetails;
	   var ReceiverDetails =update.ReceiverDetails;
	   var ReceiverID =update.ReceiverId;

     UpdateSenderInbox(req.user._id ,senderDetails,function(ok,status){
             if (ok){
				 	 UpdateReceiverInbox(ReceiverID,ReceiverDetails,function(ok,status){
                          if (ok){res.json(200,{success: "Succesfull"})}; 		
						   if(status){res.json(500,{error: "Database Error"})};
	                  });		
			 }; 
			 if(status){res.json(500,{error: "Database Error"})};		
	      });	 
};


var UpdateReceiverInbox=function (id,ReceiverDet ,callback){
    db.collection('Inbox', function(err, collection) {
     collection.update({"_id" : id},{$addToSet: {"Received":ReceiverDet}}, { upsert: true }, function(err, item) {
     if(err){return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};


var UpdateSenderInbox=function (id,SenderDet,callback){
   db.collection('Inbox', function(err, collection) {
    collection.update({"_id" :id},{$addToSet: {"Sent":SenderDet}}, { upsert: true }, function(err, item) {
     if(err){return callback(false,err);}
	  else{return callback(true,null);}
      });
   });
	
};


exports.Viewmail=function(req, res) {
 db.collection('Inbox', function(err, collection) {
  collection.find({"_id":req.user._id}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};







exports.LandlordTenants=function(req, res) {
 db.collection('user', function(err, collection) {
 collection.find({"Landlordid":req.user._id},{name:1}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};




exports.CheckPwd= function(req, res) {
    db.collection('user', function(err, collection) {
     collection.findOne({"_id":req.user._id},function(err, item) {
	   if(item){
		     
			 if (item.password==req.body.oldpwd)
			 {
              res.json(200,{success: true});
			 }
			 else{
				 res.json(200,{success: false});
				 }

		   
	   }else{res.json(500,{error: "database Error"});}
});
});

};


exports.ChangePwd=function(req, res) {
    db.collection('user', function(err, collection) {
   collection.update({"_id":req.user._id},{$set:{"password" : req.body.password}},{safe:true}, function(err, item) {
   if (err) {
	   console.log(err);res.json(500,{error: "database Error"});
	   }
   else{
	   res.json(200,{success: true});
	   }
});
});

     

};


    exports.logout = function(req, res) {
         res.send(200);
	};

exports.Findneighbours = function(req, res) {
 // console.log("plot name is ..."+req.query.plot_name);
 db.collection('user', function(err, collection) {
 collection.find({$and: [ {"plot.Plotname":req.query.plot_name},{"hsestatus" : 1}]},{name:1,housename:1,_id:1}).toArray( function(err, item){
   if (err) {
   res.json(500,{error: "database Error"});}
   else{res.send(item);}
});
});
};

exports.photoupload = function(req, res) {

   var tmp_path = req.files.file.path;

    console.log("The path is "+req.files.file.path);
    // set where the file should actually exists - in this case it is in the "images" directory
   // var target_path = __dirname +  "/"  + req.files.file.name; 

	  var target_path = './app/images/Photos/' + req.files.file.name;
	  var dbpath='./images/Photos/'+req.files.file.name;
	

	//  console.log("The Target path is "+target_path);
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;


             //      console.log("Updating Tenant Photo Details for " +req.user.identifier.toString() );
				   db.collection('user', function(err, collection) {
					collection.update({"_id" : req.user._id},{$set:{"Details.imageUrl" : dbpath}}, { upsert: true }, function(err, item) {
				   if (err) {//console.log(err);
				   res.json(500,{error: "database Error"});}
				   else{res.json(200,{imageUrl:dbpath});}
				});
				});

         
        });
    });




};





exports.Landlordphotoupload = function(req, res) {

   var tmp_path = req.files.file.path;

    // set where the file should actually exists - in this case it is in the "images" directory
   // var target_path = __dirname +  "/"  + req.files.file.name; 

	  var target_path = './app/images/Photos/' + req.files.file.name;
	  var dbpath='./images/Photos/'+req.files.file.name;
	
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;


              //     console.log("Updating Landlord Photo Details for " +req.user.identifier );
				   db.collection('user', function(err, collection) {
					collection.update({"_id" : req.user._id},{$set:{"Details.imageUrl" : dbpath}}, { upsert: true }, function(err, item) {
				   if (err) {
					   //console.log(err);
				   res.json(500,{error: "database Error"});}
				   else{res.json(200,{imageUrl:dbpath});}
				});
				});

         
        });
    });




};
exports.Report= function(req, res) {

var start =req.body.startdate;
var end=req.body.enddate;
var reportType=req.body.ReportType;
var plot=req.body.plot;
//console.log("Start Date .. " + start  +"  End Date .." + end + "Report Type... " +reportType + "And the plot is .." + plot);
  db.collection('Transaction', function(err, collection) {
 collection.find({$and: [{transactiondate: {$gte: start, $lt: end}},{transactiontype:reportType}]}).toArray( function(err, item){
  if(item){
	//  console.log(item);
	  res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
	};


exports.TenantPaidReport= function(req, res) {
  var plot=req.body.plot;
  db.collection('user', function(err, collection) {
 collection.find({$and: [{"plot.Plotname": plot},{"balance":{$lte: 0}}]}).toArray( function(err, item){
  if(item){
	 // console.log(item);
	  res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};

exports.TenantUnpaidReport= function(req, res) {
  var plot=req.body.plot;
  db.collection('user', function(err, collection) {
 collection.find({$and: [{"plot.Plotname": plot},{"balance":{$gte: 0}}]}).toArray( function(err, item){
  if(item){
	  //console.log(item);
  res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};

exports.TenantListReport= function(req, res) {
  var plot=req.body.plot;
  db.collection('user', function(err, collection) {
 collection.find({$and: [{"plot.Plotname": plot},{"hsestatus":1}]}).toArray( function(err, item){
  if(item){
	  //console.log(item);
  res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};

exports.OccupiedHouseReport= function(req, res) {
  var plot=req.body.plot;
  db.collection('House', function(err, collection) {
 collection.find({$and: [{"plot.Plotname": plot},{"status":"rented"}]},{plot:0,status:0,_id:0}).toArray( function(err, item){
  if(item){
	 // console.log(item);
	  res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};

exports.vacantHouseReport= function(req, res) {
  var plot=req.body.plot;
  db.collection('House', function(err, collection) {
 collection.find({$and: [{"plot.Plotname": plot},{"status":"vacant"}]},{plot:0,status:0,_id:0}).toArray( function(err, item){
  if(item){//console.log(item);
	  res.send(item);
	  }
  if (err) {res.json(500,{error: "database Error"});}

});
});
};




exports.MonthlyRentPosting= function(req, res) {
 
var plotname =req.body.plotName;
var month =req.body.Month;
//console.log("Posting Rent.... for "+plotname);
 db.collection('MonthlyPosting', function(err, collection) {
  collection.findOne({"plotname":plotname},function(err, item){

  if(item){
    
    // no errors but check for the month
	  if(item.Month==month) {
	     // Already Posted
           // console.log("Already Posted");
			res.json(500,{error: "Rent Already Posted"});
		  
	  }
	  else {
	        // Not Posted
            //  console.log("Not Posted");
						var ReceiptNo =req.body.ReceiptNo;
						var PostDateTime  =req.body.PostDateTime;
						var det={};
						var req1={};
						var i=0;
						var length;
						det.receiptno=ReceiptNo ;
						det.transactiontype="Posting";
						det.plotnumber=plotname;
						det.transactiondate=new Date().toISOString();
						det.Description="Rent for "+month;

			  db.collection('House', function(err, collection) {
				var cursor  =collection.find({$and:[{"plot.Plotname":plotname},{"status":"rented"}]},{amount:1,tenantid:1,_id:0,number:1});
				 
				 cursor.toArray(function (err,items){
					//  console.log("Cursor Length.." + items.length);  
					  length =items.length;


                    
					   async.eachSeries(items,
							function(item,callback){
								//call posting here it is async
								det.tranAmount=item.amount;
								det.tenantid=item.tenantid;
								det.housenumber=item.number;

								// constuct the _id
								det._id=PostDateTime+ReceiptNo+month+i;
								req1.body=det;	
										i=i+1;
									//	console.log("Record loop posted " + i +" for " + item.tenantid );
								  
									
								  doPosting(req1,function(status,err){
									 // console.log("The status is .. " + status);		    
											if (status){
												//console.log("Error from posting Transactions...");
												callback('error');
												}
											else {
												
												 if (i==length)
													 {
													//	console.log("Everything was posted");
														callback('ok');                    
													 }
												   else{
													   //proceed to the next record
													   callback();
													   }
												}
									   });

								
								 } ,
							   function(err){
								   if(err=='error'){
									//   console.log("Errrors ");
									   ErrorPostNotification(res);
									   }
									else{
										//console.log("Everything is ok ..responding to user");
										SuccessPostNotification(res)
										}
								 }

						 );
				 
					   });

					   });
               
          //Not Posted Ends
	     }
	  
	  }
  if (err) {

    // other errors
	  res.json(500,{error: "database Error"});
	  
	  }

});
});
  }; 




function doPosting(req1,callback){

     postTran(req1,function(ok,err)
			      {
				    if(ok){callback(false,null);}
					else{
						console.log("The Error is "+ err);
					callback(true,err);}
	                });
	             
 }

 function SuccessPostNotification(res){
    res.json(200,{Status: "Ok"});
 }

  function ErrorPostNotification(res){
    res.json(501,{Error: "Database Error"});
 }



 function BatchPosting(req,callback1)
 {
  
  //  console.log("Inserting Transaction for " +req.body.tenantid);
    db.collection('Transaction', function(err, collection) {
    collection.insert(req.body,{safe:true}, function(err, item) {
         if (err) {return callback1(true,err);} 
		  else   {callback1(false,null)}
    });
});

 }


 exports.Viewmail2=function(id, res) {
 db.collection('Inbox', function(err, collection) {
  collection.findOne({"_id":100},function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};



exports.ServiceRegistration=function(req, res) {
db.collection('Services', function(err, collection) {
collection.insert(req.body, function(err, item) {
     if(err){res.json(500,{error: "database Error"});}
	  else{ res.json(200,{Success: "Success"});}
      });
   }); 
};


exports.ServiceListing=function(req, res) {
//	console.log("The Location " +req.body.location.name );
//	console.log("The Type " +req.body.type.name );
db.collection('Services', function(err, collection) {
 collection.find({$and:[{"location.name":req.body.location.name},{"type.name":req.body.type.name}]}).toArray( function(err, item){
  if(item){
	  //console.log("Querry Data "+ item);
  res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}
    });
  });
};

exports.PropertyRegistration=function(req, res) {
db.collection('Property', function(err, collection) {
collection.insert(req.body, function(err, item) {
     if(err){res.json(500,{error: "database Error"});}
	  else{ res.json(200,{Success: "Success"});}
      });
   }); 
}

exports.PropertyListing=function(req, res) {
db.collection('Property', function(err, collection) {
 collection.find({$and:[{"location.name":req.body.location.name},{"type.name":req.body.Propertytype.name}]}).toArray( function(err, item){
  if(item){
	  //console.log("Querry Data "+ item);
  res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}
    });
  });
};

exports.VacantRentalListing=function(req, res) {
var min=parseInt(req.body.Amount.Min);
var max=parseInt(req.body.Amount.Max);

  console.log("Min Amount" + min);
 // console.log("Max Amount" + max);
db.collection('House', function(err, collection) {
 collection.find({$and:[{"status":"vacant"},req.body.querry,{"amount":{$gte:min,$lte:max}}]}).toArray( function(err, item){
   
    console.log("Checking rental listing ....");
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}
    });
  });
};



exports.LoginRedirect=function(req, res) {
	  // console.log("The User Role is." +req.user.role );
           
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

};

exports.findEmail=function(id,callback) {
	db.collection('Credential', function(err, collection) {
			  collection.findOne({"identifier":id},function(err, item){
			  if(item){callback(null,item)}
			  else  {callback(null,null);}
	});
	});
	
  
};



exports.CheckPlotExist=function(req, res) {
	//console.log("Cheking plotname .."+req.body.plotname)
 db.collection('user', function(err, collection) {
  collection.findOne({"plots.Plotname":req.body.plotname},function(err, item){
  if(item){ res.json(200,{exist: true}); }
   else { res.json(200,{exist: false}); };
  if (err) {res.json(500,{error: "database Error"});}
});
});
};

exports.CheckHseNoExists=function(req, res) {
//	console.log("Cheking Houseno.."+req.body.hseno)
 db.collection('House', function(err, collection) {
  collection.findOne({$and: [ {"number":req.body.hseno},{"plot.Plotname" : req.body.plotname}]},function(err, item){
  if(item){ res.json(200,{exist: true}); }
   else { res.json(200,{exist: false}); };
  if (err) {res.json(500,{error: "database Error"});}
});
});
};


exports.idExists=function(req, res) {
 db.collection('user', function(err, collection) {
  collection.findOne({"id":req.body.idnumber},function(err, item){
  if(item){ res.json(200,{exist: true}); }
   else { res.json(200,{exist: false}); };
  if (err) {res.json(500,{error: "database Error"});}
});
});
};


exports.phonenumber=function(req, res) {
 db.collection('user', function(err, collection) {
  collection.findOne({"contact":req.body.phonenumber},function(err, item){
  if(item){ res.json(200,{exist: true}); }
   else { res.json(200,{exist: false}); };
  if (err) {res.json(500,{error: "database Error"});}
});
});
};


exports.Documents=function(req, res) {
 db.collection('Documents', function(err, collection) {
collection.insert(req.body, function(err, item) {
     if(err){res.json(500,{error: "database Error"});}
	  else{ res.json(200,{Success: "Success"});}
      });
   }); 
};

exports.VacateNotice=function(req, res) {
 db.collection('VacateNotice', function(err, collection) {
collection.insert(req.body, function(err, item) {
     if(err){res.json(500,{error: "database Error"});}
	  else{ res.json(200,{Success: "Success"});}
      });
   }); 
};


exports.GetLandlordNotice=function(req, res) {
 db.collection('VacateNotice', function(err, collection) {
collection.find({$and: [ {"Landlordid":req.user._id},{"LandlordProcessed" : 0}]}).toArray(function(err, item) {
     if(err){res.json(500,{error: "database Error"});}
	  else{ res.send(item);}
      });
   }); 
};

exports.LandlordNoticeUpdate=function(req, res) {
 db.collection('VacateNotice', function(err, collection) {
 collection.update({"Tenantid" : req.body.tenantid},{$set:{"LandlordProcessed":1}},{safe:true},function(err, item) {
     if(err){res.json(500,{error: "database Error"});}
	  else{ res.json(200,{success: "success"});}
      });
   }); 
};


exports.GetDocument=function(req, res) {
 db.collection('Documents', function(err, collection) {
 collection.find({"plotName": req.query.plot_name}).toArray( function(err, item){
  if(item){//console.log(item);
	  res.send(item);
	  }
  if (err) {res.json(500,{error: "database Error"});}

});
});
};




var getTenantDetails=function(tid,callback){

 db.collection('user', function(err, collection) {
  collection.findOne({"_id":tid},function(err, item){
  if(item){ callback( "ok",item); }
   else { callback( null,null); };
  if (err) {callback( null,null);}
});
});
}

var getUser=function(lid,callback){

 db.collection('user', function(err, collection) {
  collection.findOne({"_id":lid},function(err, item){
  if(item){ callback( "ok",item); }
   else { callback( null,null); };
  if (err) {callback( null,null);}
});
});
}

exports.findPhoneNumber=function(phonenumber,callback) {
   db.collection('user', function(err, collection) {
  collection.findOne({"contact":phonenumber},function(err, item){
     if(item){ callback( "ok",item); }
       else { callback( null,null); };
      });
   });
}


exports.Recoverpwd=function(req, res) {
// generate new password here
     getUser(req.body.id,function(no,user){
                  if (no)
                  {
		               var msg ="Hi "+user.names +" Your Password has Been Reset Use Test. Change after Login  "
					   sms.sendPassword(user.contact,msg,function(ok,status){
			           if (ok){ console.log("Pwd Sms Sent"); }
				         else{console.log("Pwd Sms Not Sent");}
		                  });
				  }
				  });

				  {res.json(200,{success: "Request Received"})};
	
}



var getNextSequenceValue=function (sequenceName,callback){

        db.collection('counters', function(err, collection) {
		  collection.findAndModify( {"_id": sequenceName },{},{$inc:{"sequence_value":1}},{new:true, upsert:true}, function(err, item) {
		   if (err) {
			   console.log("Error getting Sequence db..."+err);
		       callback(null,null);
		   }
		   else{
			   console.log("The sequence is .."+item.sequence_value );
			   callback(null,item.sequence_value);
			   }
		  });
		  });  
};

 

function configureCounters(){
 var rec={"_id":"transactionid","sequence_value":0};
  db.collection('counters', function(err, collection) {
  collection.insert(rec, function(err, item) {
   if (err) {console.log("Error in Counter Configuratio");}
   else{console.log("Counter Collection Created..");}
  });
  });
};
function configureDB(){
	var rec={
        "_id" : "RentalConfiguration",
        "expenseType" : [{"_id" : "1","name" : "Deposit Refund" },
                {"_id" : "2","name" : "Damages"},
                {"_id" : "3","name" : "Materials" },
                {"_id" : "4","name" : "Others" }
                         ],
        "hsetype" : [
                {
                        "name" : "One Bedroom"
                },
                {
                        "name" : "Two Bedroom"
                },
                {
                        "name" : "BedSitter"
                },
                {
                        "name" : "Three Bedroom"
                }
        ],
        "paymentmethod" : [
                {
                        "_id" : "1",
                        "name" : "Cash"
                },
                {
                        "_id" : "2",
                        "name" : "Mpesa"
                },
                {
                        "_id" : "3",
                        "name" : "Bank Deposit"
                }
        ],
        "transactiontype" : [
                {
                        "_id" : "1",
                        "name" : "Rent Payment"
                },
                {
                        "_id" : "2",
                        "name" : "Deposit Payment"
                },
                {
                        "_id" : "3",
                        "name" : "Arrears Payment"
                },
                {
                        "_id" : "3",
                        "name" : "Damage Payment"
                },
                {
                        "name" : "Posting"
                }
        ]
};
	db.collection('Configuration', function(err, collection) {
 collection.insert(rec, function(err, item) {
   if (err) {console.log("Error Configuring db...");}
   else{console.log("Configuration collection Created...");}
  });
  });

  //configure admin
var det={
	     "_id" : "roba",
	     "name" : "roba",
        "AccessStatus" : 1,
        "email" : "nanatec@gmail.com",
        "password": "$2a$10$IaQpkGxJpWxjyoi7wgp5ku.0.xlG8Gw.EmSjDhEA1O83Dxtkjogqa",
        "role" : "admin"
}
    db.collection('user', function(err, collection) {
 collection.insert(det, function(err, item) {
   if (err) {console.log("Error Configuring Admin...");}
   else{console.log("Admin Configured..");}
  });
  });
}; 