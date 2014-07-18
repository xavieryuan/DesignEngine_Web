/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午3:42
 * To change this template use File | Settings | File Templates.
 */
var popControllers=angular.module("popControllers",["formHandler","common"]);
popControllers.service("PopControllers",["$rootScope","Form","Config",function($rootScope,Form,Config){
    this.signIn=function($scope){
        $scope.title=Config.popTitles.signIn;
        $scope.loginError="";

        $scope.toRegPanel=function(){

            //继承自body上的controller
            $scope.popController=this.signUp;
            $scope.popTemplateUrl=Config.popTemplateUrls.signUp;
        };

        $scope.forgetPwd=function(){
            $scope.popController=this.forgetPwd;
            $scope.popTemplateUrl=Config.popTemplateUrls.forgetPwd;
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
    };

    this.signUp=function($scope){
        $scope.title=Config.popTitles.signUp;
        $scope.registerError="";
        $scope.captcha="captcha.jpg";

        $scope.refreshCaptcha=function(){
            $scope.captha=$scope.captha+"?"+Math.random();
        };

        $scope.registerSubmit=function(){

        };
    };

    this.forgetPwd=function($scope){
        $scope.title=Config.popTitles.forgetPwd;

        $scope.forgetPwdSubmit=function(){

        };
    }
}]);
