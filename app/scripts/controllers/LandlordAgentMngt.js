'use strict';

var LandlordAgentMngt= angular.module('RentmngtAppLandlordAgent', ['ngResource','ui.bootstrap','ngRoute'] ); 


LandlordAgentMngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/landlord', {
     templateUrl: '/templates/landlord.html',   
      controller: 'landlordctrl'
        })
  .when('/Agents', {
     templateUrl: '/templates/Agents.html',   
     controller: 'Agentsctrl'
        })
	.otherwise({
         redirectTo: '/landlord'
      });

});



LandlordAgentMngt.controller('landlordctrl', function ($scope,$http) {
$scope.landlord={};

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

LandlordAgentMngt.controller('Agentsctrl', function ($scope,$http) {

	$scope.search={};
	    $scope.loc = [
		  {name:'Nairobi'},
		  {name:'Kahawa'},
		  {name:'Buru Buru'},
		  {name:'Kiambu'},
		  {name:'Kasarani'}
        ];
	  $scope.search.agent=$scope.loc[0];
  });
