'use strict';

var Adminmngt= angular.module('AdminmngtApp', ['ngCookies','ngSanitize','ngResource','ngRoute'] ); 


   	Adminmngt.factory('authInterceptor', function ($rootScope, $q, $window) {
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

Adminmngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});



Adminmngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/Dashboard', {
     templateUrl: 'views/partials/AdminDashboard.html',   
      controller: 'Dashboardctrl'
        })
  .when('/Reports', {
     templateUrl: 'views/partials/ReportDashboard.html',   
     controller: 'Reportsctrl'
        })
   .when('/Users', {
       templateUrl: 'views/partials/AdminUsers.html',   
       controller: 'Usersctrl'
        })
    .when('/SystemSettings', {
       templateUrl: 'views/partials/AdminSystemSettings.html',   
       controller: 'SystemSettingsctrl'
        })
     .when('/CreateLandlord', {
       templateUrl: 'views/partials/CreateLandlord.html',   
       controller: 'CreateLandlordctrl'
        })

		.otherwise({
         redirectTo: '/Dashboard'
      });

});



Adminmngt.controller('Mainctrl', function ($scope,$http,$window) {
  
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

Adminmngt.controller('Usersctrl', function ($scope,$http) {

	$scope.AccessGranted=false;
	$scope.Acesserror=false;
    $scope.req={};
	
  
 $http.get('/AccessRequest').success(function (data){
	           $scope.users=data
		 });

$scope.GrantAccess=function(user,index){
		 
	 $http.post('/GrantAccess', user)
						 .success(function(data) {
							   $scope.AccessGranted=true; 
							   $scope.users.splice(index, 1);
							 }) 
						 .error(function(data) {

							  $scope.Acesserror=true;
							 });
      };

	
 	});

Adminmngt.controller('SystemSettingsctrl', function ($scope,$http) {

$scope.SuccessStatus=false;
$scope.ErrorStatus=false;

$scope.SaveHseType=function(){
     $http.post('/HseTypeConfiguration',$scope.Hsetype)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;							   
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							 });	
}

$scope.SavePaymentMethod=function(){

	 $http.post('/PaymentmethodConfiguration',$scope.paymethod)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;							   
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							 });	

}

$scope.SaveTrxnType=function(){

	 $http.post('/TransactiontypeConfiguration',$scope.trantype)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;							   
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							 });	

}
$scope.SaveExpenseType=function(){

	$http.post('/ExpenseTypeConfiguration',$scope.exptype)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;							   
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							 });	

}





	});

	
Adminmngt.controller('Dashboardctrl', function ($scope,$http) {

});
Adminmngt.controller('CreateLandlordctrl', function ($scope,$http) {

	$scope.SaveLandlord=function(){
      $scope.landlord._id= $scope.landlord.id
var data={"update":{ "LandlordDet":$scope.landlord, "CredentialDet":{"_id":$scope.landlord.id,"password":$scope.landlord.id,"role":"landlord","identifier" : $scope.landlord.id} }};

		

			
             	$http.post('/CreateLandlord',data)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;							   
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							 });	



	}
	
	});