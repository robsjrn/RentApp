'use strict';

var LoginMngt= angular.module('RentmngtAppLogin', ['ngResource'] ); 

 LoginMngt.controller('loginCtrl', function ($scope,$http,$window) {
   
       $scope.Userlogin=function(){
    
                $http.post('/Login',$scope.user)
				 		 .success(function(data) {
								     $scope.invalidcredential=false;
									 $window.sessionStorage.token = data.token;
									  if (data.role=="tenant")
									  { $window.location.href='/Tenant.html';}
                                      if (data.role=="landlord")
									  { $window.location.href='/Landlord.html';}
									  if (data.role=="admin")
									  { $window.location.href='/Admin.html';}
									   if (data.role=="agent")
									  { $window.location.href='/Agent.html';}						   
							 }) 
						 .error(function(data) {
							   $scope.invalidcredential=true;
							    delete $window.sessionStorage.token;
							 });	
      };

	   });