landlordtmngt.config(function($routeProvider,$locationProvider)	{

	$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/tenants', {
     templateUrl: 'resources/lib/partials/tenantlogin.html',   
      controller: 'Tenantsctrl'
        })
  .when('/landlords', {
     templateUrl: 'resources/lib/partials/landlordlogin.html',   
     controller: 'landlordsctrl'
        })
   .when('/agents', {
       templateUrl: 'resources/lib/partials/agentlogin.html',   
       controller: 'Agentsctrl'
        })
  
		.otherwise({
         redirectTo: '/tenants'
      });

});