var mongo = require('mongodb');



var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('RentalDB', server);


db.open(function(err, db) {
if(!err) {
console.log("Connected to RentalDB database");
db.collection('Tenant', {strict:true}, function(err, collection) {
if (err) {
console.log(err);
console.log("The Tenant collection doesn't exist.");
}
});
}
});



exports.CreateTenant = function(req, res) {
db.collection('Tenant', function(err, collection) {
collection.insert(req.body, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{res.json(200,{success: "Succesfull"});	}
});
});
};


exports.CreateHouse = function(req, res) {
 console.log("The Hse Amount is .."+req.body.amount);

db.collection('House', function(err, collection) {
collection.insert(req.body, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{updatenohse(req.user.identifier,1,req.body.amount,function(ok,status) {if (ok){res.json(200,{success: "Succesfull"}); }	
   });}

});
});
};




exports.listoftenant = function(req, res) {
 db.collection('Tenant', function(err, collection) {
 collection.find({"plot.name":"kahawa_2"}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};


exports.listofHouse = function(req, res) {
 db.collection('House', function(err, collection) {
 collection.find({"plot.name":"kahawa_2"}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};



exports.listofUnbookedtenant = function(req, res) {
 db.collection('Tenant', function(err, collection) {
 collection.find({"plot.name":"kahawa_2","hsestatus":0}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};


exports.listofbookedtenant = function(req, res) {
 db.collection('Tenant', function(err, collection) {
 collection.find({"plot.name":"kahawa_2","hsestatus":1}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};




exports.listofVacantHouse = function(req, res) {
 db.collection('House', function(err, collection) {
 collection.find({"plot.name":"kahawa_2","status":"vacant"}).toArray( function(err, item){
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
	console.log("Tenants");
   db.collection('Tenant', function(err, collection) {
    collection.update({"_id" : tenantid},{$set:tenantdetails},{safe:true}, function(err, item) {
     if(err){return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};



var updateTenantBal=function (tenantbal,tenantid ,callback){
   db.collection('Tenant', function(err, collection) {
    collection.update({"_id" : tenantid},{$inc:{balance:-tenantbal}},{safe:true}, function(err, item) {
     if(err){return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};


var updateAccessStatus=function (tenantid ,callback){
	  console.log("Acess Status for  " +tenantid );

   db.collection('Tenant', function(err, collection) {
    collection.update({"_id" : tenantid},{$set:{"AccessStatus" : 1}},{safe:true}, function(err, item) {
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
db.collection('Transaction', function(err, collection) {
collection.insert(req.body, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{updateTenantBal(req.body.tranAmount,req.body.tenantid,function(ok,status) {if (ok){res.json(200,{success: "Succesfull"}); }	
   });}
});
});
};


exports.tenantStatement = function(req, res) {
 db.collection('Transaction', function(err, collection) {
 collection.find({"tenantid":req.user.identifier}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};



exports.tenantDetails = function(req, res) {
    db.collection('Tenant', function(err, collection) {
     collection.findOne({"_id":req.user.identifier},function(err, item) {
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






exports.getCredentials=function(userid,fn){
 db.collection('Credential', function(err, collection) {
  collection.findOne({'_id':userid}, function(err, user) {
	 console.log("Getting User Credentials.." + userid);
	  if(user){ return fn(null, user); }
	  else{  return fn(null, null); }
});
});
};



exports.LandLordDetails = function(req, res) {
    db.collection('Landlord', function(err, collection) {
     collection.findOne({"_id":req.user.identifier},function(err, item) {
	   if(item){res.send(item);
	   }else{res.send(401);}
});
});

};




exports.Accessrequest = function(req, res) {
 db.collection('Tenant', function(err, collection) {
 collection.find({"AccessStatus":0}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};

exports.GrantAccess = function(req, res) {
	console.log("Giving Acces to Sytem to .." + req.body.identifier);
 db.collection('Credential', function(err, collection) {
  collection.insert(req.body, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{updateAccessStatus(req.body.identifier,function(ok,status) {if (ok){res.json(200,{success: "Succesfull"}); }	
   });}
});
});
};


exports.LandLordConfiguration = function(req, res) {
 db.collection('Configuration', function(err, collection) {
 collection.findOne({"_id":"RentalConfiguration"},function(err, item) {
  if(item){console.log("Items ..." + item);res.send(item);}
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
 db.collection('Landlord', function(err, collection) {
 collection.update({"_id":req.user.identifier},{$addToSet:{plots : req.body},  $inc:{noplots:1}},{safe:true}, function(err, item) {
   if (err) {console.log(err);res.json(500,{error: "database Error"});}
   else{res.json(200);}
});
});
};





exports.CreateLandlord = function(req, res) {
    var update=req.body.update;
	var LandlordDet=update.LandlordDet;
	var CredentialDet= update.CredentialDet;

 db.collection('Landlord', function(err, collection) {
 collection.insert(LandlordDet,{safe:true}, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{GrantLandlordAccess(CredentialDet,function(ok,status) {if (ok){res.json(200,{success: "Succesfull"}); }	
   });}

});
});
};


var GrantLandlordAccess=function (CredentialDet ,callback){
   db.collection('Credential', function(err, collection) {
    collection.insert(CredentialDet,{safe:true}, function(err, item) {
     if(err){return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};



var updatenohse=function (landlordid,no,Amount ,callback){
    console.log("Updating the hse Details" +landlordid + ".."+ no+".."+ Amount );

   db.collection('Landlord', function(err, collection) {
    collection.update({"_id" : landlordid},{ $inc:{expcMonthlyIncome:Amount,nohse:no}},{safe:true}, function(err, item) {
     if(err){console.log(err);return callback(false,err);}
	  else{ return callback(true,null);}
      });
   });
};

