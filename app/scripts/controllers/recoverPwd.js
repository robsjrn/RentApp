'use strict';

var RecoverpwdMngt= angular.module('RentmngtAppRecoverpwd', ['ngResource'] );


 RecoverpwdMngt.controller('recoverPwd', function ($scope,$http,$window) {
$scope.ErrorpwdRecovered=false;
$scope.pwdRecovered=false;
	      $scope.RecoverPassword=function(){
             $http.post('/sendmail',$scope.user)
				 .success(function(data) {
                         $scope.pwdRecovered=true;
						 $scope.ErrorpwdRecovered=false;
					 })
				.error(function(data) {
                       $scope.ErrorpwdRecovered=true;
					   $scope.pwdRecovered=false;
						  })
	  }


	   });