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
db.collection('House', function(err, collection) {
collection.insert(req.body, function(err, item) {
   if (err) {res.json(500,{error: "database Error"});}
   else{res.json(200,{success: "Succesfull"});	}
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
 console.log("Statement "+ req.params.param);
 db.collection('Transaction', function(err, collection) {
 collection.find({"tenantid":"22829756"}).toArray( function(err, item){
  if(item){res.send(item);}
  if (err) {res.json(500,{error: "database Error"});}

});
});
};



exports.tenantDetails = function(req, res) {
    db.collection('Tenant', function(err, collection) {
     collection.findOne({"_id":"22829756"},function(err, item) {
	   if(item){res.send(item);
	   }else{res.send("Error "+err);}
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


exports.loginTenant = function(req, res) {
 db.collection('Tenant', function(err, collection) {
 collection.findOne({'housename':req.body.housenumber}, function(err, item){
  if(item){
			 if (item._id==req.body.pwd)
	         {   
				 req.session.user=item.username;
				 res.json(200,{sucess:"successfull" });
	         }
	         else { res.json(403,{error: true});}
	  }
  if (err) {res.json(500,{error: "database Error"});}

});
});
};




exports.getCredentials=function(userid,fn){
 db.collection('Credential', function(err, collection) {
  collection.findOne({'username':userid}, function(err, user) {
	    console.log("Finding user" + user );
	  if(user){ return fn(null, user); }
	  else{  return fn(null, null); }
});
});
};

