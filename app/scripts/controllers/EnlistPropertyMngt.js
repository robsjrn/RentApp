'use strict';

var EnlistPropertyMngt= angular.module('RentmngtAppEnlistProperty', ['ngResource','ui.bootstrap','ngRoute'] ); 

 EnlistPropertyMngt.controller('MainCtrl', function ($scope,$http) {

	 $scope.Measurements=["Ha","sqft","M","Inches"]
   $scope.Property={};
	  $scope.loc = [
      {name:'Nairobi'},
      {name:'Kahawa'},
      {name:'Buru Buru'},
      {name:'Kiambu'},
      {name:'Kasarani'}
    ];

	 $scope.type = [
      {name:'House'},
      {name:'Land'},
      {name:'Flat'},
      {name:'Farm'},
      {name:'Apartments'},
	  {name:'Villas'},
	  {name:'Condos'},
      {name:'Loft'},
      {name:'Duplexes'}
    ];

	     $scope.Property.type = $scope.type[0];  
         $scope.Property.location = $scope.loc[0]; 


		$scope.selectMeasurements=function(measure){
			$scope.Property.Size=  $scope.Property.Size+" "+measure;
		};

		 $scope.Save=function(){
    
			   $http.post('/PropertyRegistration', $scope.Property)
						 .success(function(data) {
                                 $scope.saved=true;
							     
							 }) 
						 .error(function(data) {
				                 $scope.error=true;
							 });

     };

	$scope. clear=function(){

	};
                
		 
	
  });
