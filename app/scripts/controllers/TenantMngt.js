var Tenantmngt= angular.module('TenantmngtApp', ['ngResource','ngRoute','ui.bootstrap','ngAnimate' ,'angularFileUpload'] ); 

		Tenantmngt.factory('authInterceptor', function ($rootScope, $q, $window) {
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


Tenantmngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});





Tenantmngt.controller('MainTenantsctrl', function($scope,$http,$rootScope,$window) {
  
  $scope.doc={"txt":"I {{TenantData.name}} Agree to Take House {{TenantData.housename}} And Maintain it Well"};

  $http.get('/tenantDetails').success(function (data){


	  $rootScope.Tenant=data
	  $scope.TenantData= $rootScope.Tenant; 
	//  console.log($scope.TenantData.Details.imageUrl);
	  $scope.dialogShown=$scope.TenantData.AgreementStatus;
	  });

   $scope.emails = {};
   
$http.get('/Viewmail').success(function (data){
	$scope.UserMail=data;
	$scope.emails.messages=$scope.UserMail.Received;
});




  $scope.CancelTerms=function(){
	   
	   alert("You need to Agree to the Terms");

  }

  $scope.AgreeTerms=function(){
            
			 $http.get('/UpdateTenantAgreement')
	   
                      .success(function(data) {
							 $scope.dialogShown=false;
							 }) 
						 .error(function(data) {

							 });	

			
  }
  
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

Tenantmngt.controller('statementsctrl', function($scope,$http,$window) {
 
  $http.get('/tenantStatement')
	   
                      .success(function(data) {
							   $scope.statement=data;
							 }) 
						 .error(function(data) {
							 });	



});





Tenantmngt.controller('Profilectrl', function($scope,$http,$window,$upload,$rootScope) {
 
 $scope.details={};
 $scope.mstatus=[{"Status":"Single"},{"Status":"Married"}];
  $scope.Profileupdate=false;

 $scope.details.Marital=$scope.mstatus[0];
$scope.showChild=false;
 $scope.showme=function(status){
	
      $scope.showChild=status;
 };

$scope.updateUserDetails=function(){

 
 $http.post('/updateTenantData',$scope.det )
		   .success(function(data) {
              $scope.Profileupdate=true;
		    
		     }) 
			.error(function(data) {

				});
	

}

$scope.uploadFiles= function($files) {
	alert($files);
}

$scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: '/photoupload', //upload.php script, node.js route, or servlet url
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

		$rootScope.Tenant.Details.imageUrl=data.imageUrl;
 
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


Tenantmngt.controller('nyumbakumictrl', function($scope,$http,$window,$rootScope) {
 

$scope.showNeighbour=function(tenant){

    $http.get('/TenantInfo/',{params:{tenant_id:tenant._id}})
	   
                      .success(function(data) {
						//	console.log(data);
								$scope.details=data;
									 // if ($scope.details.Details.view=="undefined"){$scope.details.Details.view=false;}
									 try{
								           $scope.isInfoPublic=$scope.details.Details.view;
									 }
								 catch(e){$scope.isInfoPublic=false;}
							 }) 
						 .error(function(data) {
					        	//console.log(data)
							 });	



	$scope.viewTenantDetails=true;

}

				 $http.get('/Findneighbours',{params:{plot_name:$rootScope.Tenant.plot.Plotname}})   
                      .success(function(data) {
					      //   console.log(data);
							    $scope.Neighbours=data;
							 }) 
						 .error(function(data) {
							 });	
 });



Tenantmngt.controller('Termsctrl', function($scope,$http,$window,$rootScope) {

});

Tenantmngt.controller('Aboutctrl', function($scope,$http,$window,$rootScope) {

});

Tenantmngt.controller('Helpctrl', function($scope,$http,$window,$rootScope) {

});

Tenantmngt.controller('inboxsctrl', function($scope,$http, $rootScope) {


$scope.Mail={};
$scope.UserMail={};
$scope.Sentemails={};

 $scope.viewMail=false;
 $scope.ComposeMail=false;
 $scope.viewSentMail=false;

 $scope.MailTo=[{"name":"Landlord"}];

 $scope.Mail.to=$scope.MailTo[0];
 



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

 $scope.ComposeMailpopup=function(){
        $scope.ComposeMail=true;
 }

  $scope.CloseComposeMailpopup=function(){
       $scope.ComposeMail=false;
 }

  $http.get('/Viewmail').success(function (data){$scope.UserMail=data; $scope.emails = $scope.UserMail.Received; $scope.Sentemails= $scope.UserMail.Sent;});


 $scope.SendMail=function(){

    var mail ={"update":{
		"senderDetails":{         
		 "to": $rootScope.Tenant.Owner.name,
         "subject": $scope.Mail.subject,
         "msg": $scope.Mail.msg,
         "date": new Date()
		},
         "ReceiverId":$rootScope.Tenant.Owner.id,
         "ReceiverDetails":{
		   "from": $rootScope.Tenant.name,
           "subject": $scope.Mail.subject,
           "msg": $scope.Mail.msg,
           "date": new Date()

		}
	  }
	}

                  $http.post('/Mail',mail )
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;
								   $scope.ComposeMail=false;
								   $scope.Sentemails.push(mail.update.senderDetails );							 
								 
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							  // console.log("Erororro" + data);
							 });	

	 

 }
 

 




});

Tenantmngt.controller('pwdchangectrl', function($scope,$http) {

$scope.btnStatus=true;
$scope.pwdchanged=false;
$scope.pwderror=false;
$scope.SubmitPwd=function(){
    $http.post('/ChangePwd',$scope.pwd )
		   .success(function(data) {
		  //  console.log(data.success)
		    $scope.pwdchanged=true;
		     }) 
			.error(function(data) {
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





   Tenantmngt.directive('match', [function () {
		 return {
			 require: 'ngModel',
			 link: function (scope, elem, attrs, ctrl) {     
			 scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function(value){
			 ctrl.$setValidity('match', value[0] === value[1] );
			   }, true);
	    }
		 }
	}]);




Tenantmngt.provider("ngModalDefaults", function() {    return {      options: {        closeButtonHtml: "<span class='ng-modal-close-x'>X</span>"      },      $get: function() {        return this.options;      },      set: function(keyOrHash, value) {        var k, v, _results;        if (typeof keyOrHash === 'object') {          _results = [];          for (k in keyOrHash) {            v = keyOrHash[k];            _results.push(this.options[k] = v);          }          return _results;        } else {          return this.options[keyOrHash] = value;        }      }    };  });
Tenantmngt.directive('modalDialog', [    'ngModalDefaults', '$sce', function(ngModalDefaults, $sce) {      return {        restrict: 'E',        scope: {          show: '=',          dialogTitle: '@',          onClose: '&?'        },        replace: true,        transclude: true,        link: function(scope, element, attrs) {          var setupCloseButton, setupStyle;          setupCloseButton = function() {            return scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml);          };          setupStyle = function() {            scope.dialogStyle = {};            if (attrs.width) {              scope.dialogStyle['width'] = attrs.width;            }            if (attrs.height) {              return scope.dialogStyle['height'] = attrs.height;            }          };          scope.hideModal = function() {            return scope.show = false;          };          scope.$watch('show', function(newVal, oldVal) {            if (newVal && !oldVal) {              document.getElementsByTagName("body")[0].style.overflow = "hidden";            } else {              document.getElementsByTagName("body")[0].style.overflow = "";            }            if ((!newVal && oldVal) && (scope.onClose != null)) {              return scope.onClose();            }          });          setupCloseButton();          return setupStyle();        },        template: "<div class='ng-modal' ng-show='show'>\n  <div class='ng-modal-overlay' ng-click='hideModal()'></div>\n  <div class='ng-modal-dialog' ng-style='dialogStyle'>\n    <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>\n    <div class='ng-modal-close' ng-click='hideModal()'>\n      <div ng-bind-html='closeButtonHtml'></div>\n    </div>\n    <div class='ng-modal-dialog-content' ng-transclude></div>\n  </div>\n</div>"      };    }  ]);

Tenantmngt.directive('tnPrivacyCheck', function() {
  return {
   
    template: '<label>Public</label>Yes <input type="radio" name="view" value="true" ng-model="details.view">No <input type="radio" name="view" value="false" ng-model="details.view"> '
  };
});



Tenantmngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/statements', {
     templateUrl: 'views/partials/tenantstatements.html',   
      controller: 'statementsctrl'
        })
  .when('/inbox', {
     templateUrl: 'views/partials/tenantinbox.html',   
     controller: 'inboxsctrl'
        })
.when('/pwdchange', {
     templateUrl: 'views/partials/PwdChange.html',   
     controller: 'pwdchangectrl'
        })

.when('/nyumbakumi', {
     templateUrl: 'views/partials/nyumbakumiTenant.html',   
     controller: 'nyumbakumictrl'
        })
.when('/Profile', {
     templateUrl: 'views/partials/TenantProfile.html',   
     controller: 'Profilectrl'
        })
.when('/Terms', {
     templateUrl: 'views/partials/Terms.html',   
     controller: 'Termsctrl'
        })  
.when('/about', {
     templateUrl: 'views/partials/About.html',   
     controller: 'Aboutctrl'
        }) 	
			
.when('/help', {
     templateUrl: 'views/partials/Help.html',   
     controller: 'Helpctrl'
        }) 

  
		.otherwise({
         redirectTo: '/statements'
      });


});