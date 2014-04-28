'use strict';

var Adminmngt= angular.module('AdminmngtApp', ['ngCookies','ngSanitize','ngResource','ngRoute'] ); 


Adminmngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/Dashboard', {
     templateUrl: 'views/partials/AdminDashboard.html',   
      controller: 'Dashboardctrl'
        })
  .when('/Reports', {
     templateUrl: 'views/partials/ReportDashboard.html',   
     controller: 'Reportsctrl'
        })
   .when('/Users', {
       templateUrl: 'views/partials/AdminUsers.html',   
       controller: 'Usersctrl'
        })
    .when('/SystemSettings', {
       templateUrl: 'views/partials/AdminSystemSettings.html',   
       controller: 'SystemSettingsctrl'
        })

		.otherwise({
         redirectTo: '/Dashboard'
      });

});





Adminmngt.controller('Usersctrl', function ($scope,$http) {

	$scope.AccessGranted=false;
	$scope.Acesserror=false;
  
 $http.get('/AccessRequest').success(function (data){$scope.users=data });

$scope.GrantAccess=function(user){



     $scope.Access={"_id":user.housename,
	              "password":"test",
	              "role":"tenant",
	              "identifier":user._id	 
 };


	 $http.post('/GrantAccess', $scope.Access)
						 .success(function(data) {
							   $scope.AccessGranted=true; 
							 }) 
						 .error(function(data) {

							  $scope.Acesserror=true;
							 });
}

	
  


	});

Adminmngt.controller('SystemSettingsctrl', function ($scope,$http) {

$scope.SuccessStatus=false;
$scope.ErrorStatus=false;

$scope.SaveHseType=function(){
     $http.post('/HseTypeConfiguration',$scope.Hsetype)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;							   
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							 });	
}

$scope.SavePaymentMethod=function(){

	 $http.post('/PaymentmethodConfiguration',$scope.paymethod)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;							   
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							 });	

}

$scope.SaveTrxnType=function(){

	 $http.post('/TransactiontypeConfiguration',$scope.trantype)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;							   
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							 });	

}
$scope.SaveExpenseType=function(){

	$http.post('/ExpenseTypeConfiguration',$scope.exptype)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;							   
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							 });	

}





	});
