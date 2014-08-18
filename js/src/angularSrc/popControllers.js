/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-8-5
 * Time: 上午9:52
 * To change this template use File | Settings | File Templates.
 */
var popControllers=angular.module("popControllers",["services","autoComplete"]);
popControllers.controller("signIn",["$scope","$document","Config","LocationChanger","Storage","User",
    function($scope,$document,Config,LocationChanger,Storage,User){

        $scope.loginError="";
        $scope.popFlags.title=Config.titles.signIn;
        $scope.mainFlags.showBlackOut=true;

        $scope.mainFlags.extMenuActive=false;
        $scope.toRegPanel=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.signUp;
            LocationChanger.skipReload().withReplace(Config.urls.register,false);
        };
        $scope.forgetPwd=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.forgetPwd;
            LocationChanger.skipReload().withReplace(Config.urls.forgetPwd,false);
        };

        if($document.cookie){
            var obj=JSON.parse(decodeURIComponent($document.cookie));
            $scope.loginObj.email=obj.email;
            $scope.loginObj.password=obj.password;
            $scope.loginObj.rememberMe=true;
        }

        //记住我
        function rememberMe(){
            if($scope.loginObj.rememberMe){
                var email= $scope.loginObj.email;
                var password=$scope.loginObj.password;
                var obj={
                    "email":email,
                    "password":password
                };
                $document.cookie = encodeURIComponent(JSON.stringify(obj))+"; max-age=7*24*60*60; path=/";
            }else{
                $document.cookie="";
            }
        }
        $scope.loginSubmit=function(){
            rememberMe();

            //登陆
            User.login($scope.loginObj,function(data){
                Storage.initCurrentUser({
                    userId:2,
                    profile:"data/people1.jpg",
                    role:"admin",
                    name:"测试用户",
                    email:"csboyty@163.com",
                    description:"测试用户的说明"
                });

                $scope.closePop();
            });
        };


    }]);

popControllers.controller("signUp",["$scope","CFunctions","Config",function($scope,CFunctions,Config){

    $scope.popFlags.title=Config.titles.signUp;
    $scope.mainFlags.showBlackOut=true;
    $scope.registerError="";
    $scope.captcha="captcha.jpg";

    $scope.mainFlags.extMenuActive=false;
    $scope.refreshCaptcha=function(){
        $scope.captha=$scope.captha+"?"+Math.random();
    };

    $scope.registerSubmit=function(){

    };
}]);

popControllers.controller("forgetPwd",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.popFlags.title=Config.titles.forgetPwd;
    $scope.mainFlags.showBlackOut=true;

    $scope.mainFlags.extMenuActive=false;

    $scope.forgetPwdSubmit=function(){

    };

}]);

popControllers.controller("search",["$scope","AutoComplete","Config","LocationChanger",function($scope,AutoComplete,Config,LocationChanger){
    $scope.popFlags.title=Config.titles.search;
    $scope.mainFlags.showBlackOut=true;

    $scope.mainFlags.extMenuActive=false;

    AutoComplete.autoComplete({
        url:Config.ajaxUrls.getCompleteUrl,
        selectedEvent:function(content){
            $scope.toSearch(content);
        }
    });

    $scope.toSearch=function(content){
        LocationChanger.canReload().withReplace(Config.urls.searchResult.replace(":content",content),false);
        $scope.mainFlags.showBlackOut=false;
        $scope.popFlags.popTemplateUrl="";
    }

}]);

popControllers.controller("editPwd",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.popFlags.title=Config.titles.editPwd;
    $scope.mainFlags.showBlackOut=true;

    $scope.mainFlags.extMenuActive=false;
    $scope.editPwdSubmit=function(){

    };

}]);

popControllers.controller("editInfo",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.popFlags.title=Config.titles.editInfo;
    $scope.mainFlags.showBlackOut=true;
    $scope.editInfo.profile=$scope.currentUser.profile;
    $scope.editInfo.description=$scope.currentUser.description;


    $scope.mainFlags.extMenuActive=false;
    $scope.editInfoSubmit=function(){

    };

}]);

