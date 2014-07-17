/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午4:12
 * To change this template use File | Settings | File Templates.
 */
var pinWall=angular.module("pinWall",["ngRoute","common","formHandler"]);

pinWall.config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){

    //默认使用的时候hash模式，如果要使用rest风格，需要设置下面这一句，注意$locationProvider需要注入
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("!");
    $routeProvider.when("/",{templateUrl: 'route-phone-list.html',controller:"routePhoneListCtrl"}).
        when('/phones',{templateUrl: 'route-phone-list.html',controller:"routePhoneListCtrl"}).
        when("/phones/:phoneId",{templateUrl:"route-phone-detail.html",controller:"routePhoneDetailCtrl"}).
        otherwise({redirectTo: '/'});
}]);

pinWall.controller("parentController",["$scope,Config",function($scope,Config){

    //弹出层使用的变量，绑定在body的controller上，在其下的controller会继承这些变量
    $scope.popControllerName=Config.popControllerNames.signIn;
    $scope.templateUrl=Config.popTemplateUrls.signIn;
    $scope.showPop=false;

    $scope.closePop=function(){
        $scope.showPop=true;
    };
}]);
