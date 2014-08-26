'use strict';

var Propertymngt= angular.module('RentmngtAppNews', ['ngCookies','ngSanitize','ngResource','ngRoute','ui.bootstrap'] ); 



Propertymngt.controller('MainNewsCtrl', function($scope,$http,$rootScope,$window) {

 $scope.Data=[{"date":"19-05-2013","headline":"Testing"}
 
            ];


});

