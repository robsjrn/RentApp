'use strict';

var LoginMngt= angular.module('RentmngtAppLogin', ['ngResource'] ); 

 LoginMngt.controller('loginCtrl', function ($scope,$http,$window) {
   
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