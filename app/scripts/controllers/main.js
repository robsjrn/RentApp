'use strict';

var Rentmngt= angular.module('RentmngtApp', ['ngCookies','ngSanitize','ngResource','ngRoute'] ); 

Rentmngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/home', {
     templateUrl: '/templates/home.html',   
      controller: 'Tenantsctrl'
        })
  .when('/news', {
     templateUrl: '/templates/news.html',   
     controller: 'landlordsctrl'
        })
   .when('/Services', {
       templateUrl: '/templates/services.html',   
       controller: 'Agentsctrl'
        })
   .when('/about', {
       templateUrl: '/templates/about.html',   
       controller: 'Agentsctrl'
        })
	.when('/contacts', {
       templateUrl: '/templates/contact.html',   
       controller: 'Agentsctrl'
        })
  
		.otherwise({
         redirectTo: '/home'
      });

});

 Rentmngt.controller('MainCtrl', function ($scope,$http,$window) {
    $scope.awesomeThings = ['HTML5 Boilerplate','AngularJS','Karma' ];
     $scope.Userlogin=function(){
    
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

