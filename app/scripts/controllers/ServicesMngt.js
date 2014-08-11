

'use strict';

var ServiceMngt= angular.module('RentmngtAppServices', ['ngResource','ui.bootstrap','ngRoute'] ); 


ServiceMngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/enlistService', {
     templateUrl: '/templates/Enlist.html',   
      controller: 'Enlistctrl'
        })
  .when('/ViewService', {
     templateUrl: '/templates/ViewServices.html',   
     controller: 'ViewServicectrl'
        })
	.otherwise({
         redirectTo: '/ViewService'
      });

});

 ServiceMngt.controller('mainctrl', function ($scope,$http) {

	
  });

 ServiceMngt.controller('ViewServicectrl', function ($scope,$http) {

	
  });
  

 ServiceMngt.controller('Enlistctrl', function ($scope,$http) {
   
    $scope.service={};
    $scope.isCollapsed = true;
	$scope.loc = [
      {name:'Nairobi'},
      {name:'Kahawa'},
      {name:'Buru Buru'},
      {name:'Kiambu'},
      {name:'Kasarani'}
    ];
    $scope.service.location = $scope.loc[0]; 
    $scope.clear=function(){
			$scope.service.servicenames="";
		   $scope.service.contact="";
			$scope.service.details="";
     };

$scope.add=function(){
        $http.post('/ServiceRegistration', $scope.service)
						 .success(function(data) {
                                 $scope.saved=true;
							     
							 }) 
						 .error(function(data) {
				                 $scope.error=true;
							 });

     };
  
     
 });