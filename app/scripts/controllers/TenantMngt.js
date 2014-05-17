var Tenantmngt= angular.module('TenantmngtApp', ['ngResource','ngRoute','ui.bootstrap'] ); 

Tenantmngt.controller('MainTenantsctrl', function($scope,$http,$rootScope) {
  
  $scope.doc={"txt":"I {{TenantData.name}} Agree to Take House {{TenantData.housename}} And Maintain it Well"};

  $http.get('/tenantDetails').success(function (data){
	  $rootScope.Tenant=data
	  $scope.TenantData= $rootScope.Tenant; 
	  $scope.dialogShown=$scope.TenantData.AgreementStatus;
	  });
  


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

Tenantmngt.controller('inboxsctrl', function($scope,$http, $rootScope) {


$scope.Mail={};
$scope.UserMail={};
$scope.Sentemails={};

 $scope.viewMail=false;
 $scope.ComposeMail=false;
 $scope.viewSentMail=false;

 $scope.MailTo=[{"name":"Landlord"}];

 $scope.Mail.to=$scope.MailTo[0];
 



 $scope.emails = {};

 $scope.ShowMailpopUp=function(mailinbox){
        $scope.viewMail=true;
		$scope.Mail=mailinbox;
 }

$scope.ShowSentMailpopUp=function(mailinbox){
        $scope.viewSentMail=true;
		$scope.Mail=mailinbox;
 }


 $scope.CloseViewMailpopup=function(){
        $scope.viewMail=false;
 }

 $scope.ComposeMailpopup=function(){
        $scope.ComposeMail=true;
 }

  $scope.CloseComposeMailpopup=function(){
       $scope.ComposeMail=false;
 }

  $http.get('/Viewmail').success(function (data){$scope.UserMail=data; $scope.emails = $scope.UserMail.Received; $scope.Sentemails= $scope.UserMail.Sent;});


 $scope.SendMail=function(){

    var mail ={"update":{
		"senderDetails":{         
		 "to": $rootScope.Tenant.Owner.name,
         "subject": $scope.Mail.subject,
         "msg": $scope.Mail.msg,
         "date": new Date()
		},
         "ReceiverId":$rootScope.Tenant.Owner.id,
         "ReceiverDetails":{
		   "from": $rootScope.Tenant.name,
           "subject": $scope.Mail.subject,
           "msg": $scope.Mail.msg,
           "date": new Date()

		}
	  }
	}

                  $http.post('/Mail',mail )
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;
								   $scope.ComposeMail=false;
								   $scope.Sentemails.push(mail.update.senderDetails );							 
								 
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							   console.log("Erororro" + data);
							 });	

	 

 }
 

 




});

Tenantmngt.controller('pwdchangectrl', function($scope,$http) {

$scope.btnStatus=true;
$scope.pwdchanged=false;
$scope.pwderror=false;
$scope.SubmitPwd=function(){
    $http.post('/ChangePwd',$scope.pwd )
		   .success(function(data) {
		    console.log(data.success)
		    $scope.pwdchanged=true;
		     }) 
			.error(function(data) {
				 $scope.pwderror=true;	 
				});	
}


$scope.CheckPwd=function(){
	$scope.busy=true;
     $http.post('/CheckPwd',$scope.pwd )
		   .success(function(data) {
		     if (data.success)
		     {
				 $scope.busy=false; 
				 $scope.btnStatus=false;
				 $scope.invalidcredential=false;
				 
		     }
			 else{$scope.invalidcredential=true;}
				
							 }) 
			.error(function(data) {
					  $scope.invalidcredential=true;
					  $scope.msg=data.error
				});	
}
     
});





   Tenantmngt.directive('match', [function () {
		 return {
			 require: 'ngModel',
			 link: function (scope, elem, attrs, ctrl) {     
			 scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function(value){
			 ctrl.$setValidity('match', value[0] === value[1] );
			   }, true);
	    }
		 }
	}]);




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
     templateUrl: 'views/partials/PwdChange.html',   
     controller: 'pwdchangectrl'
        })
			
  
		.otherwise({
         redirectTo: '/statements'
      });


});