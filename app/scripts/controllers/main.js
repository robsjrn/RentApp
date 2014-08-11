'use strict';

var Rentmngt= angular.module('RentmngtApp', ['ngCookies','ngSanitize','ngResource','ngRoute','ui.bootstrap'] ); 


 Rentmngt.controller('MainCtrl', function ($scope,$http,$window,$modal) {

  $scope.items = ['item1', 'item2', 'item3'];
  $scope.locations = ['Kahawa', 'Kiambu', 'Ruiru'];
$scope.selectLocation=function(loc){
	alert(loc);
}
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


   Rentmngt.controller('homectrl', function ($scope) {
    

  });

  Rentmngt.controller('Servicesctrl', function ($scope) {
    

  });


   Rentmngt.controller('newsctrl', function ($scope) {
    

  });

  Rentmngt.controller('contactsctrl', function ($scope) {
    

  });

  Rentmngt.controller('aboutctrl', function ($scope) {
    

  });

