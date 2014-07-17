/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午3:42
 * To change this template use File | Settings | File Templates.
 */
var popControllers=angular.module("popControllers",["formHandler","common","ngCookies"]);
popControllers.controller("login",["$scope,Form,Config",function($scope,Form,Config){

    $scope.title=Config.popTitles.signIn;
    $scope.toRegPanel=function(){

        //继承自body上的controller
        $scope.popControllerName=Config.popControllerNames.signUp;
        $scope.templateUrl=Config.popTemplateUrls.signUp;
    };

    $scope.rememberMe=function(){
        var email= $scope.login.email;
        var password=$scope.login.password;
        var obj={
            "email":email,
            "password":password
        };
        document.cookie = encodeURIComponent(JSON.stringify(obj))+"; max-age=7*24*60*60; path=/";
    };

    if(document.cookie){
        $scope.hasCookie=true;

        var obj=JSON.parse(decodeURIComponent(document.cookie));
        $scope.login.email=obj.email;
        $scope.login.password=obj.password;
    }

    $scope.loginSubmit=function(){

    };
}]);
