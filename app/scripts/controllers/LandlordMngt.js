var landlordtmngt= angular.module('LandlordmngtApp', ['ngResource','ngRoute','ui.bootstrap','angularCharts','angularFileUpload','ngProgress','textAngular','google-maps'] ); 



 
	landlordtmngt.factory('authInterceptor', function ($rootScope, $q, $window) {
		  return {
			request: function (config) {
				
			  config.headers = config.headers || {};
			  if ($window.sessionStorage.token) {
				config.headers.token=  $window.sessionStorage.token;
			  }
			   else{
				   // no token in Store
                    $window.location.href = "Error.html";
			  }
			  return config;
			},
			response: function (response) {
			  if (response.status === 401) {
				// handle the case where the user is not authenticated
				$window.location.href = "Error.html";
			  }
			  return response || $q.when(response);
			}
		  };
		});

landlordtmngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

var ModalInstanceCtrl = function ($scope, $modalInstance, lat, lng, $timeout) {

  $scope.map = {
    center: {
        latitude: lat,
        longitude: lng
    },
    zoom: 8,
	control: {},
    marker: {
		 latitude: lat,
          longitude: lng
		}
};



  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

$scope.$watch("visible", function(newvalue) {
        $timeout(function() {
             var map = $scope.map.control.refresh();
        }, 0);
    });
                                                   

};


landlordtmngt.controller('MainLandlordctrl', function($scope,$http,$rootScope,$window,ngProgress) {
$scope.firsttimelogin=true;


 $http.get('/LandLordDetails',{ cache: true })
	 .success(function (data){
			ngProgress.start();
				 $rootScope.landlordDetails=data;
				 if (typeof data.plots!="undefined")
			{
					  $rootScope.plot=data.plots;	
			} else{

              
				$rootScope.plot=[];
			}	 
	 });
  $http.get('/LandLordConfiguration',{ cache: true }).success(function (data)
	  {
	   $scope.config=data;
	  $rootScope.expenseType=$scope.config.expenseType;
      $rootScope.paymentMethod=$scope.config.paymentmethod;
	  $rootScope.TransactionType=$scope.config.transactiontype;
	  $rootScope.hsetype=$scope.config.hsetype;
     ngProgress.complete();
  });
  $scope.emails = {};


$http.get('/Viewmail',{ cache: true })
	.success(function (data){
		$scope.UserMail=data; 
		$scope.emails.messages=$scope.UserMail.Received;
		ngProgress.complete();
       })
   .error(function(data) {
	 ngProgress.complete();
   });

 
 $scope.Logout=function(){
            $http.get('/logout')
              .success(function(data) {
			    	delete $window.sessionStorage.token;
					$window.location.href = "/";
					}) 
				 .error(function(data) {
				   delete $window.sessionStorage.token;
					$window.location.href = "/";
					});	

       } 


	  
});


landlordtmngt.controller('Noticectrl', function($scope,$rootScope,$http,ngProgress) {
       $scope.noticeSent=false;
		$scope.noticeSentError=false;
		$scope.btndisable=false;
$scope.noticelist=[];

		$http.get(' /GetLandlordNotice')
			.success(function (data){
					$scope.noticelist=data;
				   //  $scope.notice=$scope.noticelist[0];
				ngProgress.complete();
			   })
		   .error(function(data) {
			   ngProgress.complete();
		   });

 $scope.selectnotice=function(not){
	 $scope.noticeSent=false;
	 $scope.noticeSentError=false;
      $scope.notice=not;
 };

  $scope.updateNotificationStatus=function(index){
     
$scope.btndisable=true;
	  
		    var dt={"tenantid":$scope.notice.Tenantid};
          $http.post('/LandlordNoticeUpdate',dt)
				 		 .success(function(data) {
			                    $scope.btndisable=false;
			                    $scope.noticeSent=true;
								$scope.noticelist.splice(index, 1);
								$scope.notice="";
							 }) 
						 .error(function(data) {
								    $scope.btndisable=false;
								 	$scope.noticeSentError=true;
							   
			});
 };
   

});


landlordtmngt.controller('editTenantCtrl', function modalController ($scope, $modalInstance, Tenant) {
    $scope.Tenant = Tenant;
    $scope.ok = function () {
        $modalInstance().close($scope.Tenant);
    };
    $scope.cancel = function () {
        $modalInstance().dismiss('cancel');
  
    };
});





landlordtmngt.controller('tenantctrl', function($scope,$modal,$rootScope,$http,tenantlist,ngProgress) {
 $scope.tenantcreated=false;
 $scope.tenanterror=false;
 $scope.plots=$rootScope.plot;
 $scope.showSpinner=false;
 $scope.ContactSpinner=false;
 $scope.Tenant={};
  $scope.Tnt={};
 $scope.Tnt.plot=$scope.plots[0];

 $scope.disableComponents=true;

$scope.CheckidExists=function(){
 $scope.showSpinner=true;
          var dt={"idnumber":$scope.Tenant._id};
          $http.post('/CheckidExists',dt)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.userExist=true;
							        $scope.disableComponents=true;
									$scope.Tenant._id="";
							      }
							   else{ $scope.userExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.showSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							    $scope.showSpinner=false;
			});
};


$scope.CheckPhonenumberExists=function(){
$scope.ContactSpinner=true;
var qerr={"phonenumber":"+254"+$scope.Tenant.contact};
$http.post('/CheckPhonenumberExists',qerr)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.contactExist=true;
							        $scope.disableComponents=true;
									$scope.Tenant.contact="";
							      }
							   else{ $scope.contactExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.ContactSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							    $scope.ContactSpinner=false;
			});
};




           $scope.addTenant=function(){
				    $scope.tenantcreated=false;
					$scope.tenanterror=false;
                    $scope.disableComponents=false;
					$scope.userExist=false; 
					$scope.Tenant="";
		   };
                 $scope.clearTenant=function(){
                  $scope.Tenant="";
				  $scope.userExist=false; 
				 
		   };

		   
            $scope.saveTenant=function(){
         
			       $scope.Tenant.plot={};
				   $scope.Tenant.Landlordid=$rootScope.landlordDetails._id;
				   $scope.Tenant.plot.Plotname =$scope.Tnt.plot.Plotname;
				   $scope.disableComponents=true;
				   $scope.Tenant.AccessStatus=0;
				   $scope.Tenant.hsestatus=0;
				   $scope.Tenant.role="tenant";
				   $scope.Tenant.AgreementStatus=false;
				   $scope.Tenant.datecreated=new Date().toISOString();
 //change this later
            $scope.Tenant.password= $scope.Tenant._id;

				   ngProgress.start();
                   $http.post('/createTenant', $scope.Tenant)
						 .success(function(data) {
							    $scope.tenantcreated=true;
								$scope.msg=data.success;
								ngProgress.complete();
							 }) 
						 .error(function(data) {
							 $scope.tenanterror=true;
							 $scope.msg=data.error;
							 ngProgress.complete();
							 });	

                     }

    $scope.open = function (TenantDetails) {
        var modalInstance = $modal.open({
            templateUrl: 'views/partials/landlordEditTenantDetails.html',
            controller: 'editTenantCtrl',
            resolve: {
                '$modalInstance': function() { return function() { return modalInstance; } },
                'Tenant': function() { return TenantDetails; }
            }
        });
    
        modalInstance.result.then(function (response) {
            $scope.selected = response;
        }, function () {
			//console.log("Cancell Cliked 3we");
        });
    }; 
  
});


landlordtmngt.controller('housemngtctrl', function($scope,$rootScope,$http,ngProgress) {
   $scope.House={};
     $scope.housecreated=false;
	 $scope.houseterror=false;
	  $scope.disableComponents=true;
	   $scope.showSpinner=false;
 
    $scope.House.status="vacant";
	$scope.plot=$rootScope.plot;
 
	$scope.hsetype=$rootScope.hsetype;


     $scope.addHouse=function(){
          $scope.disableComponents=false; 
		  $scope.housecreated=false;
			 $scope.houseterror=false;
			    $scope.House.plot=$scope.plot[0];
				$scope.House.type=$scope.hsetype[0];

				$scope.House.number="";
				$scope.House.amount="";
                $scope.House.description="";
				$scope.HsenoExist=false;
	 };
$scope.CheckHseNoExists=function(){
           
      $scope.showSpinner=true;
          var dt={"hseno":$scope.House.number,"plotname":$scope.House.plot.Plotname};
          $http.post('/CheckHseNoExists',dt)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.HsenoExist=true;
							        $scope.disableComponents=true;
									$scope.House.number="";
							      }
							   else{ $scope.HsenoExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.showSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.houseterror=true;
							    $scope.showSpinner=false;
								$scope.House.number="";
			});

};

  $scope.clearTenant=function(){
         $scope.House="";
  };
          $scope.saveHouse=function(){
			     $scope.disableComponents=true;
				 ngProgress.start();
				 $scope.House.landlordid=$rootScope.landlordDetails._id;
                   $http.post('/createHouse', $scope.House)
						 .success(function(data) {
							    $scope.housecreated=true;
								$scope.msg=data.success;

                               if (typeof $rootScope.landlordDetails.nohse=="undefined")
							   {$rootScope.landlordDetails.nohse=1; $rootScope.landlordDetails.expcMonthlyIncome=1;}
							   else{
								$rootScope.landlordDetails.nohse =$rootScope.landlordDetails.nohse + 1;
                                $rootScope.landlordDetails.expcMonthlyIncome=$rootScope.landlordDetails.expcMonthlyIncome+ $scope.House.amount;
								   }

								
							   
								ngProgress.complete();
							 }) 
						 .error(function(data) {
							 $scope.houseterror=true;
							 $scope.msg=data.error;
							 ngProgress.complete();
							 });	
                     }





  
});
landlordtmngt.controller('plotmngtctrl', function($scope,$http,$rootScope,ngProgress,$modal) {
	$scope.LandlordPlot={};
 $scope.enablemap=true;
 $scope.map = {
    center: {
        latitude: 10,
        longitude: -20
    },
    zoom: 8,
	control: {},
    marker: {}
};


 $scope.codeAddress = function () {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': $scope.LandlordPlot.address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        $scope.map.control.getGMap().setCenter(results[0].geometry.location);
        $scope.map.marker.latitude = results[0].geometry.location.lat();
        $scope.map.marker.longitude = results[0].geometry.location.lng();

		$scope.LandlordPlot.location.longitude=results[0].geometry.location.lng();
        $scope.LandlordPlot.location.latitude=results[0].geometry.location.lat();
		$scope.enablemap=false;
      } else {
		  $scope.enablemap=true;
       console.log("geo code not Successfull..")
      }
    });
    return;
  };

	

	$scope.disableComponents=true;
   $scope.LandlordPlot.location={};
  $scope.showSpinner=false;
   $scope.showmap=function(){
	  var modalInstance = $modal.open({
      templateUrl: 'map.html',
      controller: ModalInstanceCtrl,
      resolve: {
        lat: function () {
          return $scope.LandlordPlot.location.latitude;
        },
        lng: function () {
          return $scope.LandlordPlot.location.longitude;
        }
      }


    });

    modalInstance.result.then(function (selectedItem) {
    }, function () {
     // $log.info('Modal dismissed at: ' + new Date());
    });
  };




$scope.CheckplotExists=function(){ 
  
   $scope.showSpinner=true;
          var dt={"plotname":$scope.LandlordPlot.Plotname};
          $http.post('/CheckPlotExist',dt)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.plotExist=true;
							        $scope.disableComponents=true;
									$scope.LandlordPlot.Plotname="";
							      }
							   else{ $scope.plotExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.showSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.ploterror=true;
							    $scope.showSpinner=false;
			});

}

 $scope.loc = [
		  {name:'Nairobi'},
		  {name:'Kahawa'},
		  {name:'Buru Buru'},
		  {name:'Kiambu'},
		  {name:'Kasarani'}
        ];
	  $scope.LandlordPlot.location=$scope.loc[0];
	   $scope.Addplot=function(){ 
        $scope.disableComponents=false;
		$scope.LandlordPlot.Plotname="";
		$scope.plotExist=false;
	   }
   $scope.Saveplot=function(){  

		  $http.post('/LandlordAddPlots', $scope.LandlordPlot)
			  
						 .success(function(data) {
							  ngProgress.start();
							   $scope.plotSuccess=true; 
							   if (typeof $rootScope.landlordDetails.noplots=="undefined")
							   {$rootScope.landlordDetails.noplots=1; }
							   else{$rootScope.landlordDetails.noplots =$rootScope.landlordDetails.noplots+ 1;}
                                $rootScope.plot.push($scope.LandlordPlot);
								ngProgress.complete();
								 $scope.disableComponents=true;
							 }) 
						 .error(function(data) {

							  $scope.ploterror=true;
							  ngProgress.complete();
							 });
}
  
});


landlordtmngt.controller('trxnmngtctrl', function($scope,$http,$rootScope,ngProgress) {

$scope.paymentposted=false;
$scope.paymenterror=false;
$scope.disableComponents=true;
$scope.crit={};
$scope.Tenant={};


 $scope.landlordplots=$rootScope.plot;
 try{
 $scope.Tenant.plot=$scope.landlordplots[0];
 }catch(e){
	 alert("You Have to Add a Plot First..");
 }

   $scope.GetDetails=function(){
 // have this in a nested Promise
 ngProgress.start();
     $http.get('/tenantList/'+$scope.Tenant.plot.Plotname).success(function (data){$scope.Tenants=data ;ngProgress.complete();}); 
}



$scope.Transaction={};
$scope.Transaction.date=new Date();
$scope.paymentmethod=$rootScope.paymentMethod;
$scope.Transaction.paymentmethod=$scope.paymentmethod[0];

$scope.transactiontype=$rootScope.TransactionType;
$scope.Transaction.transactiontype=$scope.transactiontype[0];

 $scope.AddPayment=function(){
	 $scope.disableComponents=false;

	     $scope.Transaction.amount="";
		 $scope.Transaction.comments="";
		  $scope.crit.balance="";
 };

 $scope.ClearPayment=function(){
	     $scope.Transaction.amount=""
		 $scope.Transaction.comments=""
		 $scope.crit.balance="";
 };


$scope.postPayment=function(){
ngProgress.start();
 $scope.disableComponents=true;


  $scope.Payment={
	              "receiptno":$scope.Transaction.receiptno,
	              "tenantid":$scope.crit._id,
	              "housenumber":$scope.crit.housename,
	              "plotnumber":$scope.crit.plot.Plotname,
	              "transactiondate":new Date().toISOString(),
	              "transactiontype":$scope.Transaction.transactiontype.name,
	              "paymentmethod":$scope.Transaction.paymentmethod.name,
	              "Description":$scope.Transaction.comments,
	              "tranAmount":$scope.Transaction.amount,
	              "balcf":$scope.crit.balance-$scope.Transaction.amount
	 
 };


                  $http.post('/RentalPayment', $scope.Payment)
						 .success(function(data) {
							    $scope.paymentposted=true;
								$scope.msg=data.success;
								ngProgress.complete();
							 }) 
						 .error(function(data) {
							 $scope.paymenterror=true;
							 $scope.msg=data.error;
							 ngProgress.complete();
							 });

       }


});




landlordtmngt.controller('expensemngtctrl', function($scope,$http,$rootScope,ngProgress) {

$scope.paymentposted=false;
$scope.paymenterror=false;
$scope.disableComponents=true;
$scope.Tenant={};

 $scope.landlordplots=$rootScope.plot;
 $scope.Tenant.plot=$scope.landlordplots[0];

    $scope.GetDetails=function(){
 // have this in a nested Promise
 ngProgress.start();
     $http.get('/tenantList/'+$scope.Tenant.plot.Plotname,{ cache: true }).success(function (data){$scope.Tenants=data ;ngProgress.complete();}); 
}


$scope.Expense=[];
$scope.crit={};


$scope.expensetype=$rootScope.expenseType;

 $scope.Expense.type=$scope.expensetype[0];
 $scope.Expense.date=new Date();

$scope.AddExpense=function(){
	 $scope.disableComponents=false;

	    $scope.Expense.amount="";
		 $scope.Expense.description="";
 };

 $scope.ClearExpense=function(){
	     $scope.Expense.amount="";
		 $scope.Expense.description="";
	
 };
 

 $scope.PostExpense=function(){

ngProgress.start();
  $scope.expense={"tenantid":$scope.crit._id,
	              "housenumber":$scope.crit.housename,
	              "plotnumber":$scope.crit.plot.Plotname,
	              "transactiondate":new Date(),
	              "transactiontype":"Expense Posting",
	              "Description":$scope.Expense.description,
	              "tranAmount":-$scope.Expense.amount,
	              "balcf": $scope.Expense.amount + $scope.crit.balance 
	 
 };

         

  $http.post('/RentalPayment', $scope.expense)
						 .success(function(data) {
							    $scope.paymentposted=true;
								$scope.msg=data.success;
								ngProgress.complete();
							 }) 
						 .error(function(data) {
							 $scope.paymenterror=true;
							 $scope.msg=data.error;
							 ngProgress.complete();
							 });

$scope.disableComponents=true;

 };



  
});


landlordtmngt.controller('summarymngtctrl', function($scope) {

$scope.chartType = 'bar';
$scope.messages = [];
   $scope.data = {
		series: ['Expense', 'Income'],
		data : [
		{
			x : "Jan",
			y: [210, 384]
		
		},
		{
			x : "Feb",
			y: [ 289, 456]
		},
		{
			x : "March",
			y: [ 170, 255]
		},
		{
			x : "April",
			y: [ 341, 879]
		},
		{
			x : "May",
			y: [ 500, 900]
		}
			
			]     
	}


$scope.config = {
		labels: false,
		title : "Amount",
		legend : {
			display: true,
			position:'right'
		},
		click : function(d) {
			$scope.messages.push('clicked!');
		}
	}



});


landlordtmngt.controller('documentmngtctrl', function($scope,$http,$rootScope,ngProgress) {
   $scope.landlordplots=$rootScope.plot;
  $scope.documents=[{"name":"Tenant Agreement Doc","type":"TenantAgreement"},
	                {"name":"Water Agreement Doc","type":"WaterAgreement"}
	               ];
	$scope.doc={};
  $scope.showdoc=false;
   $scope.documenterror=false;
   $scope.documenterror=false;
  $scope.btndisabled=false;

	 $scope.selectdocType=function(docType) { 
		 $scope.doc.docType=docType.name;
	 };
  
 $scope.adddoc=function(){
	 if ($scope.doc.docType) { $scope.showdoc=true; }
	 else{alert("Choose a Document..");}
	 
 };
 $scope.clearEdit=function(){
   $scope.doctext="";
 }
 
 $scope.SaveDoc=function(pname){
	 if (typeof pname =="undefined") {
	   alert("Kindly Select a Plot..");
	 }
	 else{
      $scope.btndisabled=true;
	  ngProgress.start();
	    var Details={
			         "plotName": pname,
			         "DocumentType":$scope.doc.docType,
			         "DocumentText":$scope.doctext,
			         "DocumentDate":new Date().toISOString()
		  }
                  $http.post('/SaveDocument',Details )
				 		 .success(function(data) {
                                ngProgress.complete();
                                $scope.documentSaved=true;
							 }) 
						 .error(function(data) {
								 ngProgress.complete();
							    $scope.msg=data.error;
								 $scope.documenterror=true;
							 });	
   };
	 
 }
});

landlordtmngt.controller('ReportsPortalctrl', function($scope,$http,$rootScope,ngProgress) {

     $scope.numPerPage=6;

	 
     $scope.showError=false;
	 $scope.showSearchBar=true;

$scope.ShowHideBar=function(){
	if($scope.showSearchBar){
	  $scope.showSearchBar=false;
	}else{
		 $scope.showSearchBar=true;
	}
}

				  $scope.reportType= $rootScope.TransactionType;
				  $scope.plots=$rootScope.plot;
				 $scope.showData=false;
				 $scope.today = function() {
						$scope.fromdt = new Date();
						$scope.todt= new Date();
					  };
			  $scope.today();

			  $scope.clear = function () {
				$scope.fromdt = null;
				$scope.todt= null;
			  };

  // Disable weekend selection
			  $scope.disabled = function(date, mode) {
				return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
			  };

			  $scope.toggleMin = function() {
				$scope.minDate = $scope.minDate ? null : new Date();
			  };
			  $scope.toggleMin();

			  $scope.Fromopen = function($event) {
				$event.preventDefault();
				$event.stopPropagation();

				$scope.Fromopened = true;
			  };



				 $scope.Toopen = function($event) {
					$event.preventDefault();
					$event.stopPropagation();

					$scope.Toopened = true;
				  };



				  $scope.dateOptions = {
					formatYear: 'yy',
					startingDay: 1
				  };

				  $scope.initDate = new Date('2016-15-20');
				  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
				  $scope.format = $scope.formats[0];




$scope.getReport=function(){

ngProgress.start();

  $scope.reportData={"startdate" :$scope.fromdt,
	                  "enddate":$scope.todt,
	                   "ReportType" :$scope.reportTypename.name,
	                   "plot":$scope.plot.name
  };

     $http.post('/Report', $scope.reportData)
						 .success(function(data) {
						 ngProgress.complete();
		                     $scope.data=data;
								 if ($scope.data.length==0)
								 {
									  $scope.showError=true;
									   $scope.showData=false;
                                 
								 }else{
									 $scope.showError=false;
							      	  $scope.bigTotalItems= $scope.data.length;
									   $scope.bigCurrentPage = 1;
                                        $scope.showData=true;

										 $scope.$watch('bigCurrentPage', function() {
										var begin = (($scope.bigCurrentPage - 1) * $scope.numPerPage)
											, end = begin + $scope.numPerPage;
										   $scope.reportData =$scope.data.slice(begin,end );
											});
								 }	;
							 }) 
						 .error(function(data) {
								  $scope.showData=false;
								  ngProgress.complete();
							 });



}

  
});

landlordtmngt.controller('Dashboardctrl', function($scope) {
//anything here should be cached...,{ cache: true }
  
});

landlordtmngt.controller('RentPostingctrl', function($scope,$rootScope,$http) {
   $scope.Months=[{"month":"1","value":"January"},
	              {"month":"2","value":"February"},
	              {"month":"3","value":"March"},
	              {"month":"4","value":"April"},
				  {"month":"5","value":"May"},
				  {"month":"6","value":"June"},
	              {"month":"7","value":"July"},
				  {"month":"8","value":"August"},
                  {"month":"9","value":"September"},
                  {"month":"10","value":"October"},
				  {"month":"11","value":"November"},
                  {"month":"12","value":"December"}
          ] ;
   $scope.Landlord={};
 
    
   $scope.rentPosted=false;
   $scope.rentPostedError=false;
   $scope.plot=$rootScope.plot;
   $scope.Landlord.plot=$scope.plot[0];
    $scope.Landlord.dateChoosen=$scope.Months[0];

  // $scope.Landlord;
   $scope.PostMonthlyRent=function(){ 
ngProgress.start();
	    var Details={"plotName": $scope.Landlord.plot.Plotname,
			         "Month":$scope.Landlord.dateChoosen.value,
			         "ReceiptNo":$scope.Landlord.receipt,
			         "PostDateTime":new Date().toISOString()
		  }
                  $http.post('/MonthlyRentPosting',Details )
				 		 .success(function(data) {
                                ngProgress.complete();
								$scope.rentPosted=true;
							 }) 
						 .error(function(data) {
								 ngProgress.complete();
							   $scope.rentPostedError=true;
							   $scope.msg=data.error;
							 });	
   }

});


landlordtmngt.controller('inboxctrl', function($scope,$http,$rootScope,ngProgress) {

$scope.Sentemails=[];

$http.get('/LandlordTenants',{ cache: true }).success(function (data){ $scope.MailTo=data});

$http.get('/Viewmail',{ cache: true }).success(function (data){
	$scope.UserMail=data; 
	$scope.emails = $scope.UserMail.Received;
	$scope.Sentemails= $scope.UserMail.Sent;
	});



$scope.Mail={};
$scope.UserMail={};


 $scope.viewMail=false;
 $scope.viewSentMail=false;


 $scope.emails = {};

 $scope.ShowMailpopUp=function(mailinbox){
        $scope.viewMail=true;
		$scope.Mail=mailinbox;
 }

$scope.ShowSentMailpopUp=function(mailinbox){
        $scope.viewSentMail=true;
		$scope.Mail=mailinbox;
 }


 $scope.CloseViewMailpopup=function(){
        $scope.viewMail=false;
 }


 $scope.SendMail=function(){
  ngProgress.start();
    var mail ={"update":{
		"senderDetails":{         
		 "to": $scope.Mail.to.name,
         "subject": $scope.Mail.subject,
         "msg": $scope.Mail.msg,
         "date": new Date()
		},
         "ReceiverId":$scope.Mail.to._id,
         "ReceiverDetails":{
		   "from": $rootScope.landlordDetails.names,
           "subject": $scope.Mail.subject,
           "msg": $scope.Mail.msg,
           "date": new Date()

		}
	  }
	}

                  $http.post('/Mail',mail )
				 		 .success(function(data) {
							ngProgress.complete();
								   $scope.SuccessStatus=true;
								   $scope.Sentemails.push(mail.update.senderDetails );							 
							 }) 
						 .error(function(data) {
								 ngProgress.complete();
							   $scope.ErrorStatus=true;
							 });	

	 

 }
 

});



landlordtmngt.controller('vacatectrl', function($scope,$http,$rootScope,ngProgress) {


 $scope.disableComponents=true;
  $scope.vacateupdate=false;
  $scope.vacateerror=false;

$scope.crit={};
$scope.Tenant={};

 $scope.landlordplots=$rootScope.plot;
 $scope.Tenant.plot=$scope.landlordplots[0];


   $scope.GetDetails=function(){
 ngProgress.start();
     $http.get('/bookedtenantList/'+$scope.Tenant.plot.Plotname,{ cache: true }).success(function (data){$scope.tenantdata=data;ngProgress.complete(); }); 
}



$scope.Add=function(){
    $scope.disableComponents=false;
};

$scope.Update=function(){

ngProgress.start();

	 data={"update":{
		 "tenantupdate":{"hsestatus":0,"housename":$scope.crit.housename},
		 "houseUpdate":{"status":"vacant","tenantid":$scope.crit._id},
		 "details":{"_id":$scope.crit._id,"number":$scope.crit.housename}
               }
		  };


      $http.post('/vacate', data)
	.success(function(data){
		  ngProgress.complete();
      $scope.vacateupdate=true;
       
  })
	.error(function(data) {
	  ngProgress.complete();
		$scope.vacateerror=true;
		$scope.msg=data.error;
	 });
	 
	  $scope.disableComponents=true;


};


});



landlordtmngt.controller('LandlordProfilectrl', function($scope,$http,$rootScope,$upload,ngProgress) {

  $scope.onFileSelect = function($files) {
	  ngProgress.start();
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/Landlordphotoupload', //upload.php script, node.js route, or servlet url
        method: 'POST',
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: {myObj: $scope.myModelObj},
        file: file, // or list of files: $files for html5 only
        /* set the file formData name ('Content-Desposition'). Default is 'file' */
        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
       // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
		//update landlord image
		ngProgress.complete();
		$scope.Profileupdate=true;
		  $rootScope.landlordDetails.Details.imageUrl=data.imageUrl;
        
      });
      //.error(...)
      //.then(success, error, progress); 
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  };

});

landlordtmngt.controller('rentctrl', function($scope,$http,$rootScope,ngProgress) {
$scope.Tenant={};
$scope.House={};
$scope.housetaken=false;
$scope.housetakenerror=false;
 $scope.disableComponents=true;


 $scope.landlordplots=$rootScope.plot;
$scope.Tenant.plot=$scope.landlordplots[0];


$scope.GetDetails=function(){
 // have this in a nested Promise
ngProgress.start();

   $http.get('/UnbookedtenantList/'+ $scope.Tenant.plot.Plotname).success(function (data){$scope.tenantdata=data ;$scope.Tenant.names=$scope.tenantdata[0];});
   $http.get('/VacanthouseList/'+$scope.Tenant.plot.Plotname).success(function (data){$scope.housedata=data;$scope.Tenant.housename=$scope.housedata[0]; ngProgress.complete();});
 
}


 $scope.Add=function(){
	  $scope.disableComponents=false;

 };
 $scope.save=function(){
ngProgress.start();

	  data={"update":{
		 "tenantupdate":{"AgreementStatus":true,"AccessStatus":0,"hsestatus":1,"housename":$scope.House.housename.number,"balance":($scope.House.housename.amount * 2)},
		 "houseUpdate":{"status":"rented","tenantid":$scope.Tenant.names._id},
         "Trxn":{"tenantid":$scope.Tenant.names._id, "housenumber":$scope.House.housename.number,
	             "plotnumber":$scope.Tenant.plot.name,"transactiondate":new Date(),
	              "transactiontype":"Posting", "Description":"Rent And Deposit",
	              "tranAmount":($scope.House.housename.amount * 2)},
		 "details":{"_id":$scope.Tenant.names._id,"number":$scope.House.housename.number}
               }
		  };

  $http.post('/Rent', data)
	.success(function(data){
	  ngProgress.complete();
      $scope.housetaken=true;

       
  })
	.error(function(data) {
	  ngProgress.complete();
		$scope.housetakenerror=true;
		$scope.msg=data.error;
	 });	
	  
   $scope.disableComponents=true;
 }
  
});




//Directives


landlordtmngt.directive("clickToEdit", function() {
    var editorTemplate = '<div class="click-to-edit">' +
        '<div ng-hide="view.editorEnabled">' +
            '{{value}} ' +
            '<a ng-click="enableEditor()">Edit</a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
            '<input ng-model="view.editableValue">' +
            '<a href="#" ng-click="save()">Save</a>' +
            ' or ' +
            '<a ng-click="disableEditor()">cancel</a>.' +
        '</div>' +
    '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEdit",
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
});





landlordtmngt.provider("ngModalDefaults", function() {    return {      options: {        closeButtonHtml: "<span class='ng-modal-close-x'>X</span>"      },      $get: function() {        return this.options;      },      set: function(keyOrHash, value) {        var k, v, _results;        if (typeof keyOrHash === 'object') {          _results = [];          for (k in keyOrHash) {            v = keyOrHash[k];            _results.push(this.options[k] = v);          }          return _results;        } else {          return this.options[keyOrHash] = value;        }      }    };  });
landlordtmngt.directive('modalDialog', [    'ngModalDefaults', '$sce', function(ngModalDefaults, $sce) {      return {        restrict: 'E',        scope: {          show: '=',          dialogTitle: '@',          onClose: '&?'        },        replace: true,        transclude: true,        link: function(scope, element, attrs) {          var setupCloseButton, setupStyle;          setupCloseButton = function() {            return scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml);          };          setupStyle = function() {            scope.dialogStyle = {};            if (attrs.width) {              scope.dialogStyle['width'] = attrs.width;            }            if (attrs.height) {              return scope.dialogStyle['height'] = attrs.height;            }          };          scope.hideModal = function() {            return scope.show = false;          };          scope.$watch('show', function(newVal, oldVal) {            if (newVal && !oldVal) {              document.getElementsByTagName("body")[0].style.overflow = "hidden";            } else {              document.getElementsByTagName("body")[0].style.overflow = "";            }            if ((!newVal && oldVal) && (scope.onClose != null)) {              return scope.onClose();            }          });          setupCloseButton();          return setupStyle();        }, template: "<div class='ng-modal' ng-show='show'>\n  <div class='ng-modal-overlay' ng-click='hideModal()'></div>\n  <div class='ng-modal-dialog' ng-style='dialogStyle'>\n    <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>\n    <div class='ng-modal-close' ng-click='hideModal()'>\n      <div ng-bind-html='closeButtonHtml'></div>\n    </div>\n    <div class='ng-modal-dialog-content' ng-transclude></div>\n  </div>\n</div>"      };    }  ]);


//Services
//{

landlordtmngt.factory('tenantcreation', function($resource) {
  return $resource('/createTenant', {}, {
      create: {method:'POST', params:{}}
   });
});

landlordtmngt.factory('tenantlist', function($resource) {
  return $resource('/tenantList/:crit', {}, {
      query: {method:'GET', params:{"plot.name":"kahawa_2"}, isArray:true}
   });
});




landlordtmngt.controller('pwdchangectrl', function($scope,$http) {

$scope.btnStatus=true;
$scope.pwdchanged=false;
$scope.pwderror=false;
$scope.SubmitPwd=function(){
	ngProgress.start();
    $http.post('/ChangePwd',$scope.pwd )
		   .success(function(data) {
		   // console.log(data.success)
		   ngProgress.complete();
		    $scope.pwdchanged=true;
		     }) 
			.error(function(data) {
				 ngProgress.complete();
				 $scope.pwderror=true;	 
				});	
}


$scope.CheckPwd=function(){
	$scope.busy=true;
     $http.post('/CheckPwd',$scope.pwd )
		   .success(function(data) {
		     if (data.success)
		     {
				 $scope.busy=false; 
				 $scope.btnStatus=false;
				 $scope.invalidcredential=false;
				 
		     }
			 else{$scope.invalidcredential=true;}
				
							 }) 
			.error(function(data) {
					  $scope.invalidcredential=true;
					  $scope.msg=data.error
				});	
}
     
});

landlordtmngt.controller('TenantPaidReportctrl', function($scope,$http,$rootScope,$window,ngProgress,ngProgress) {
   //todo
   $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
   $scope.numPerPage=10;
  $scope.showData=false;
   $scope.showError=false;
   $scope.GetDetails=function(name){
	   ngProgress.start();
           $scope.Plotname=name;
	    $scope.reportData={
	                   "plot":name
                    };
	  
               $http.post('/TenantPaidReport', $scope.reportData)
						 .success(function(data) {
				              ngProgress.complete();
								$scope.data=data;
								 if ($scope.data.length==0)
								 {
									  
									  $scope.showError=true;
									   $scope.showData=false;
                                 
								 }else{
							      	  $scope.bigTotalItems= $scope.data.length;
									   $scope.bigCurrentPage = 1;
                                        $scope.showData=true;
                                          $scope.showError=false;
										 $scope.$watch('bigCurrentPage', function() {
										var begin = (($scope.bigCurrentPage - 1) * $scope.numPerPage)
											, end = begin + $scope.numPerPage;
										   $scope.PaidTenant =$scope.data.slice(begin,end );
											});
								 }
										
							 }) 
						 .error(function(data) {
							//  console.log(data)
							ngProgress.complete();
								  $scope.showData=false;
							 });
							   
	
   
}

 
});
landlordtmngt.controller('TenantUnpaidReportctrl', function($scope,$http,$rootScope,$window,ngProgress) {

     $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;

   $scope.GetDetails=function(name){
	    ngProgress.start();
           $scope.Plotname=name;
	    $scope.reportData={
	                   "plot":name
                    };
	  
               $http.post('/TenantUnpaidReport', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
								$scope.data=data;

								 if ($scope.data.length==0)
								 {
									  $scope.showError=true;
									     $scope.showData=false;
                                 
								 }else{
							      	  $scope.bigTotalItems= $scope.data.length;
									   $scope.bigCurrentPage = 1;
                                        $scope.showData=true;
                                          $scope.showError=false;
										 $scope.$watch('bigCurrentPage', function() {
										var begin = (($scope.bigCurrentPage - 1) * $scope.numPerPage)
											, end = begin + $scope.numPerPage;
										   $scope.PaidTenant =$scope.data.slice(begin,end );
											});
								 }	
							 }) 
						 .error(function(data) {
							//  console.log(data)
							 ngProgress.complete();
								  $scope.showData=false;
							 });
							   
	
   }
});

landlordtmngt.controller('TenantListReportctrl', function($scope,$http,$rootScope,$window,ngProgress) {

     $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;

   $scope.GetDetails=function(name){
	    ngProgress.start();
           $scope.Plotname=name;
	    $scope.reportData={
	                   "plot":name
                    };
	  
               $http.post('/TenantListReport', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
								$scope.data=data;

								 if ($scope.data.length==0)
								 {
									  $scope.showError=true;
									   $scope.showData=false;
                                 
								 }else{
							      	  $scope.bigTotalItems= $scope.data.length;
									   $scope.bigCurrentPage = 1;
                                        $scope.showData=true;
                                         $scope.showError=false;
										 $scope.$watch('bigCurrentPage', function() {
										var begin = (($scope.bigCurrentPage - 1) * $scope.numPerPage)
											, end = begin + $scope.numPerPage;
										   $scope.PaidTenant =$scope.data.slice(begin,end );
											});
								 }	
							 }) 
						 .error(function(data) {
							//  console.log(data)
							 ngProgress.complete();
								  $scope.showData=false;
							 });
							   
	
   }
});


landlordtmngt.controller('OccupiedHousectrl', function($scope,$http,$rootScope,$window,ngProgress) {
	    $scope.landlordplots=$rootScope.plot;
		   $scope.numPerPage=6;
			$scope.showData=false;
			$scope.showError=false;
			$scope.reportData=[];
		$scope.GetReportDetails=function(name){
			 ngProgress.start();
			    $scope.Plotname=name;
				$scope.reportData={
	                   "plot":name
                    };


               $http.post('/OccupiedHouseReport', $scope.reportData)
						 .success(function(data) {
							 ngProgress.complete();
								$scope.data=data;
                               // console.log(data);
								 if ($scope.data.length==0)
								 {
									   $scope.showError=true;
									   $scope.showData=false;
                                 
								 }else{
							      	  $scope.bigTotalItems= $scope.data.length;
									   $scope.bigCurrentPage = 1;
                                        $scope.showData=true;
                                         $scope.showError=false;
										 $scope.$watch('bigCurrentPage', function() {
										var begin = (($scope.bigCurrentPage - 1) * $scope.numPerPage)
											, end = begin + $scope.numPerPage;
										   $scope.reportData =$scope.data.slice(begin,end );
											});
								 }	
							 }) 
						 .error(function(data) {
							//  console.log(data)
							 ngProgress.complete();
								  $scope.showData=false;
							 });







         }
});
landlordtmngt.controller('VacantHousectrl', function($scope,$http,$rootScope,$window,ngProgress) {

	  $scope.landlordplots=$rootScope.plot;
		   $scope.numPerPage=6;
			$scope.showData=false;
			$scope.showError=false;
			$scope.reportData=[];
		$scope.GetReportDetails=function(name){
			 ngProgress.start();
			    $scope.Plotname=name;
				$scope.reportData={
	                   "plot":name
                    };


               $http.post('/vacantHouseReport', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
								$scope.data=data;
                              //  console.log(data);
								 if ($scope.data.length==0)
								 {
									   $scope.showError=true;
									   $scope.showData=false;
                                 
								 }else{
							      	  $scope.bigTotalItems= $scope.data.length;
									   $scope.bigCurrentPage = 1;
                                        $scope.showData=true;
                                         $scope.showError=false;
										 $scope.$watch('bigCurrentPage', function() {
										var begin = (($scope.bigCurrentPage - 1) * $scope.numPerPage)
											, end = begin + $scope.numPerPage;
										   $scope.reportData =$scope.data.slice(begin,end );
											});
								 }	
							 }) 
						 .error(function(data) {
							//  console.log(data)
							 ngProgress.complete();
								  $scope.showData=false;
							 });
		}
});


//}

//Routes 

landlordtmngt.config(function($routeProvider,$locationProvider)	{

  $locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/tenantsmngt', {
     templateUrl: 'views/partials/landlordTenantmngt.html',   
      controller: 'tenantctrl'
        })
  .when('/housemngt', {
     templateUrl: 'views/partials/landlordHousemngt.html',   
     controller: 'housemngtctrl'
        })
   .when('/plotmngt', {
       templateUrl: 'views/partials/landlordPlotmngt.html',   
       controller: 'plotmngtctrl'
        })
   .when('/trxnmngt', {
       templateUrl: 'views/partials/landlordTrxnmgt.html',   
       controller: 'trxnmngtctrl'
        })
    .when('/expensemngt', {
       templateUrl: 'views/partials/landlordExpensemngt.html',   
       controller: 'expensemngtctrl'
        })
	.when('/summarymngt', {
       templateUrl: 'views/partials/landlordSummarymngt.html',   
       controller: 'summarymngtctrl'
        })
    .when('/documentmngt', {
       templateUrl: 'views/partials/landlordDocumentmngt.html',   
       controller: 'documentmngtctrl'
        })
    .when('/inbox', {
       templateUrl: 'views/partials/landlordMessageInbox.html',   
       controller: 'inboxctrl'
        })

    .when('/rent', {
       templateUrl: 'views/partials/landlordRent.html',   
       controller: 'rentctrl'
        })

      .when('/vacate', {
       templateUrl: 'views/partials/LandlordVacate.html',   
       controller: 'vacatectrl'
        })

    .when('/pwdchange', {
     templateUrl: 'views/partials/PwdChange.html',   
     controller: 'pwdchangectrl'
        })

    .when('/profile', {
     templateUrl: 'views/partials/LandlordProfile.html',   
     controller: 'LandlordProfilectrl'
        })
	.when('/ReportsPortal', {
     templateUrl: 'views/partials/ReportsViews/ReportsPortal.html',   
     controller: 'ReportsPortalctrl'
        })		
	.when('/Dashboard', {
     templateUrl: 'views/partials/LandlordDashboard.html',   
     controller: 'Dashboardctrl'
        })

	.when('/RentPosting', {
     templateUrl: 'views/partials/RentPosting.html',   
     controller: 'RentPostingctrl'
        })
	.when('/TenantPaidReport', {
     templateUrl: 'views/partials/ReportsViews/TenantPaidReport.html',   
     controller: 'TenantPaidReportctrl'
        })	
 .when('/TenantUnPaidReport', {
     templateUrl: 'views/partials/ReportsViews/TenantUnpaidReport.html',   
     controller: 'TenantUnpaidReportctrl'
        })	
 .when('/TenantListReport', {
     templateUrl: 'views/partials/ReportsViews/TenantListReport.html',   
     controller: 'TenantListReportctrl'
        })
.when('/OccupiedHouseReport', {
     templateUrl: 'views/partials/ReportsViews/OccupiedHouseReport.html',   
     controller: 'OccupiedHousectrl'
        })	
  .when('/VacantHouseReport', {
     templateUrl: 'views/partials/ReportsViews/VacantHouseReport.html',   
     controller: 'VacantHousectrl'
        })
.when('/Notice', {
     templateUrl: 'views/partials/LandlordNotice.html',   
     controller: 'Noticectrl'
        })
			
		
		
	.otherwise({
         redirectTo: '/plotmngt'
      });

});