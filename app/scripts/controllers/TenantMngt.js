var Tenantmngt= angular.module('TenantmngtApp', ['ngResource','ngRoute'] ); 

Tenantmngt.controller('MainTenantsctrl', function($scope,$http) {

  $http.get('/tenantDetails').success(function (data){console.log(data);$scope.TenantData=data; });

});


Tenantmngt.controller('statementsctrl', function($scope,$http,$window) {
 
  $http.get('/tenantStatement')
	   
                      .success(function(data) {
							   $scope.statement=data;
							 }) 
						 .error(function(data) {
					           alert("Errorrrrs..");
							 });	



});

Tenantmngt.controller('inboxsctrl', function($scope) {



   
  
});




Tenantmngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/statements', {
     templateUrl: 'views/partials/tenantstatements.html',   
      controller: 'statementsctrl'
        })
  .when('/inbox', {
     templateUrl: 'views/partials/tenantinbox.html',   
     controller: 'inboxsctrl'
        })
  
		.otherwise({
         redirectTo: '/statements'
      });


});