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
 $scope.showSpinner=false;
 $scope.disableComponents=true;

$scope.AddLandlord=function(){
   $scope.disableComponents=false;
     $scope.landlord.id="";
	 $scope.landlord.names="";
		 $scope.landlord.occupation="";
		 $scope.landlord.email="";
		 $scope.landlord.contact="";
         $scope.userExist=false;
}
$scope.Clear=function(){
	 $scope.landlord.id="";
	 $scope.landlord.names="";
		 $scope.landlord.occupation="";
		 $scope.landlord.email="";
		 $scope.landlord.contact="";
}

$scope.CheckidExists=function(){
 $scope.showSpinner=true;
          var dt={"idnumber":$scope.landlord.id};
          $http.post('/CheckLandlordidExists',dt)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.userExist=true;
							        $scope.disableComponents=true;
									$scope.landlord.id="";
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



$scope.SaveLandlord=function(){
      $scope.landlord._id= $scope.landlord.id
         var data={"update":{ "LandlordDet":$scope.landlord, "CredentialDet":{"_id":$scope.landlord.id,"password":$scope.landlord.id,"role":"landlord","identifier" : $scope.landlord.id,"email":$scope.landlord.email} }};
             	$http.post('/CreateLandlord',data)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;
								   $scope.disableComponents=true;
								   $scope.landlord.id="";
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							   $scope.disableComponents=true;
							     $scope.landlord.id="";
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
