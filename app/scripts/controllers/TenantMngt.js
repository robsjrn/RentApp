var Tenantmngt= angular.module('TenantmngtApp', ['ngResource','ngRoute'] ); 

Tenantmngt.controller('MainTenantsctrl', function($scope,$http) {


   $scope.names="Robert Njoroge Muthumbi";
  //  $scope.TenantData={"_id":"1000","tenant":{"names":"Robert Njoroge Muthumbi","ID":"22829756","occupation":{"name":"Banking","location":"Upperhill"},"balance":"20000","plot":{"name":"lrt25","housenumber":"5000"}}};

  $http.get('/tenantDetails').success(function (data){console.log(data);$scope.TenantData=data; });

});


Tenantmngt.controller('statementsctrl', function($scope,$http) {
 
  $http.get('/tenantStatement')
	  .success(function (data){$scope.statement=data; });
      .error(function(data) {   $window.location.href='/404';);

  
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