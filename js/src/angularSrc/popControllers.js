/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午3:42
 * To change this template use File | Settings | File Templates.
 */
var popControllers=angular.module("popControllers",["formHandler","common"]);
popControllers.controller("signIn",["$scope","Form","Config","LocationChanger",function($scope,Form,Config,LocationChanger){

    $scope.loginError="";
    $scope.popFlags.title=Config.popTitles.signIn;
    $scope.popFlags.showPop=true;
    $scope.mainFlags.showBlackOut=true;

    $scope.toRegPanel=function(){
        $scope.popFlags.popTemplateUrl=Config.popTemplateUrls.signUp;
        LocationChanger.skipReload().withoutRefresh("/register",false);
    };
    $scope.forgetPwd=function(){
        $scope.popFlags.popTemplateUrl=Config.popTemplateUrls.forgetPwd;
        LocationChanger.skipReload().withoutRefresh("/forgetPassword",false);
    };

    if(document.cookie){
        var obj=JSON.parse(decodeURIComponent(document.cookie));
        $scope.login.email=obj.email;
        $scope.login.password=obj.password;
        $scope.login.rememberMe=true;
    }

    //记住我
    function rememberMe(){
        if($scope.login.rememberMe){
            var email= $scope.login.email;
            var password=$scope.login.password;
            var obj={
                "email":email,
                "password":password
            };
            document.cookie = encodeURIComponent(JSON.stringify(obj))+"; max-age=7*24*60*60; path=/";
        }else{
            document.cookie="";
        }
    }
    $scope.loginSubmit=function(){
        rememberMe();
    };


}]);

popControllers.controller("signUp",["$scope","Form","Config",function($scope,Form,Config){
    $scope.popFlags.title=Config.popTitles.signUp;
    $scope.popFlags.showPop=true;
    $scope.mainFlags.showBlackOut=true;
    $scope.registerError="";
    $scope.captcha="captcha.jpg";

    $scope.refreshCaptcha=function(){
        $scope.captha=$scope.captha+"?"+Math.random();
    };

    $scope.registerSubmit=function(){

    };
}]);


popControllers.controller("forgetPwd",["$scope","Form","Config",function($scope,Form,Config){
    $scope.popFlags.title=Config.popTitles.forgetPwds;
    $scope.popFlags.showPop=true;
    $scope.mainFlags.showBlackOut=true;

    $scope.forgetPwdSubmit=function(){

    };

}]);

