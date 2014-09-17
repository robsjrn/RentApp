'use strict';

var RecoverpwdMngt= angular.module('RentmngtAppRecoverpwd', ['ngResource'] );


 RecoverpwdMngt.controller('recoverPwd', function ($scope,$http,$window) {
$scope.ErrorpwdRecovered=false;
$scope.pwdRecovered=false;
	      $scope.RecoverPassword=function(){
             $http.post('/Recoverpwd',$scope.user)
				 .success(function(data) {
				        if (data.success)
				        { $scope.msg=data.success; }
						else{
							$scope.msg="Request Received but Sms not Sent ..Kindly  Retry Later";
						}
                           $scope.pwdRecovered=true;
						  $scope.ErrorpwdRecovered=false;
                         
					 })
				.error(function(data) {
                       $scope.ErrorpwdRecovered=true;
					   $scope.pwdRecovered=false;
						  })
	  }


	   });