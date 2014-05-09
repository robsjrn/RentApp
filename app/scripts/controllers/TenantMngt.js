var Tenantmngt= angular.module('TenantmngtApp', ['ngResource','ngRoute','ui.bootstrap'] ); 

Tenantmngt.controller('MainTenantsctrl', function($scope,$http) {
  
  $scope.doc={"txt":"I {{TenantData.name}} Agree to Take House {{TenantData.housename}} And Maintain it Well"};

  $http.get('/tenantDetails').success(function (data){$scope.TenantData=data; $scope.dialogShown=$scope.TenantData.AgreementStatus; });
  


  $scope.CancelTerms=function(){
	   
	   alert("You need to Agree to the Terms");

  }

  $scope.AgreeTerms=function(){
            
			 $http.get('/UpdateTenantAgreement')
	   
                      .success(function(data) {
							 $scope.dialogShown=false;
							 }) 
						 .error(function(data) {

					           alert("Something Went Wrong");
							 });	

			
  }
 
 
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

 $scope.emails = {};



  $scope.emails = [{
        "from": "Steve Jobs",
        "subject": "Greetings",
        "msg": "I think I'm holding my phone wrong :/",
        "date": "2013-10-01T08:05:59Z"
    },{
        "from": "Ellie Goulding",
        "subject": "I've got Starry Eyes, lulz",
		"msg": "I've got Starry Eyes, lulz",
        "date": "2013-09-21T19:45:00Z"
    },{
        "from": "Michael Stipe",
        "subject": "Hurt",
		"msg": "Everybody hurts, sometimes.",
        "date": "2013-09-12T11:38:30Z"
    },{
        "from": "Jeremy Clarkson",
        "subject": "",
		"msg": "Think I've found the best car... In the world",
        "date": "2013-09-03T13:15:11Z"
    }];


$scope.Sentemails= [{
        "to": "Manager",
        "subject": "Thanks",
        "msg": "Welcome :/",
        "date": "2013-10-01T08:05:59Z"
    },{
        "to": "Manager",
        "subject": "Test",
		"msg": "I've got Starry Eyes, lulz",
        "date": "2013-09-21T19:45:00Z"
    }
   ];
  
});

Tenantmngt.controller('pwdchangectrl', function($scope) {



   
  
});







Tenantmngt.provider("ngModalDefaults", function() {    return {      options: {        closeButtonHtml: "<span class='ng-modal-close-x'>X</span>"      },      $get: function() {        return this.options;      },      set: function(keyOrHash, value) {        var k, v, _results;        if (typeof keyOrHash === 'object') {          _results = [];          for (k in keyOrHash) {            v = keyOrHash[k];            _results.push(this.options[k] = v);          }          return _results;        } else {          return this.options[keyOrHash] = value;        }      }    };  });
Tenantmngt.directive('modalDialog', [    'ngModalDefaults', '$sce', function(ngModalDefaults, $sce) {      return {        restrict: 'E',        scope: {          show: '=',          dialogTitle: '@',          onClose: '&?'        },        replace: true,        transclude: true,        link: function(scope, element, attrs) {          var setupCloseButton, setupStyle;          setupCloseButton = function() {            return scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml);          };          setupStyle = function() {            scope.dialogStyle = {};            if (attrs.width) {              scope.dialogStyle['width'] = attrs.width;            }            if (attrs.height) {              return scope.dialogStyle['height'] = attrs.height;            }          };          scope.hideModal = function() {            return scope.show = false;          };          scope.$watch('show', function(newVal, oldVal) {            if (newVal && !oldVal) {              document.getElementsByTagName("body")[0].style.overflow = "hidden";            } else {              document.getElementsByTagName("body")[0].style.overflow = "";            }            if ((!newVal && oldVal) && (scope.onClose != null)) {              return scope.onClose();            }          });          setupCloseButton();          return setupStyle();        },        template: "<div class='ng-modal' ng-show='show'>\n  <div class='ng-modal-overlay' ng-click='hideModal()'></div>\n  <div class='ng-modal-dialog' ng-style='dialogStyle'>\n    <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>\n    <div class='ng-modal-close' ng-click='hideModal()'>\n      <div ng-bind-html='closeButtonHtml'></div>\n    </div>\n    <div class='ng-modal-dialog-content' ng-transclude></div>\n  </div>\n</div>"      };    }  ]);





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
.when('/pwdchange', {
     templateUrl: 'views/partials/TenantPwdChange.html',   
     controller: 'pwdchangectrl'
        })
			
  
		.otherwise({
         redirectTo: '/statements'
      });


});