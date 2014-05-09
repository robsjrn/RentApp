'use strict';

var Rentmngt= angular.module('RentmngtApp', ['ngCookies','ngSanitize','ngResource','ngRoute'] ); 

Rentmngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/home', {
     templateUrl: '/templates/home.html',   
      controller: 'homectrl'
        })
  .when('/news', {
     templateUrl: '/templates/news.html',   
     controller: 'newsctrl'
        })
   .when('/Services', {
       templateUrl: '/templates/services.html',   
       controller: 'Servicesctrl'
        })
   .when('/about', {
       templateUrl: '/templates/about.html',   
       controller: 'aboutctrl'
        })
	.when('/contacts', {
       templateUrl: '/templates/contact.html',   
       controller: 'contactsctrl'
        })
     .when('/login', {
       templateUrl: '/templates/login.html',   
       controller: 'MainCtrl'
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


