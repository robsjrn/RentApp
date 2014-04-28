'use strict';

var Rentmngt= angular.module('RentmngtApp', ['ngCookies','ngSanitize','ngResource','ngRoute'] ); 

Rentmngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/tenants', {
     templateUrl: 'views/partials/tenantlogin.html',   
      controller: 'Tenantsctrl'
        })
  .when('/landlords', {
     templateUrl: 'views/partials/landlordlogin.html',   
     controller: 'landlordsctrl'
        })
   .when('/agents', {
       templateUrl: 'views/partials/agentlogin.html',   
       controller: 'Agentsctrl'
        })
  
		.otherwise({
         redirectTo: '/tenants'
      });

});

 Rentmngt.controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = ['HTML5 Boilerplate','AngularJS','Karma' ];
  });


 Rentmngt.controller('Tenantsctrl', function($scope,$http,$window) {

   $scope.Tenantlogin=function(){

        $http.post('/login',$scope.user)
				 		 .success(function(data) {
								    $scope.invalidcredential=false;
                                     $window.location.href='/LoginRedirect';							   
							 }) 
						 .error(function(data) {
							   $scope.invalidcredential=true;
							 });	
   };
  
});

 Rentmngt.controller('landlordsctrl', function($scope,$http,$window) {
   
   $scope.Landlordlogin=function(){

                  $http.post('/login',$scope.landlord)
				 		 .success(function(data) {
								    $scope.invalidcredential=false;
                                     $window.location.href='/LoginRedirect';							   
							 }) 
						 .error(function(data) {
							   $scope.invalidcredential=true;
							 });	
   };


  
});

 Rentmngt.controller('Agentsctrl', function($scope,$http,$window) {
   

   $scope.Agentlogin=function(){

                  $http.post('/login',$scope.agent)
				 		 .success(function(data) {
								    $scope.invalidcredential=false;
                                     $window.location.href='/LoginRedirect';							   
							 }) 
						 .error(function(data) {
							   $scope.invalidcredential=true;
							 });	
   };


  
});

