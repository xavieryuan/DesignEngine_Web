/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-8-5
 * Time: 上午9:52
 * To change this template use File | Settings | File Templates.
 */
var popControllers=angular.module("popControllers",["classes"]);
popControllers.controller("signIn",["$scope","Config","LocationChanger","Storage","CFunctions",
    function($scope,Config,LocationChanger,Storage,CFunctions){

        $scope.loginError="";
        $scope.mainFlags.extMenuActive="";
        $scope.popFlags.title=Config.titles.signIn;
        $scope.mainFlags.showBlackOut=true;

        $scope.toRegPanel=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.signUp;
            LocationChanger.skipReload().withReplace(Config.urls.register,false);
        };
        $scope.forgetPwd=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.forgetPwd;
            LocationChanger.skipReload().withReplace(Config.urls.forgetPwd,false);
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

            //登陆
            CFunctions.ajaxSubmit($scope,{
                formUrl:Config.ajaxUrls.signIn,
                formParam:$scope.login,
                successCb:function(data){
                    Storage.initCurrentUser({
                        userId:2,
                        profile:"data/people1.jpg",
                        role:"admin",
                        name:"测试用户",
                        email:"csboyty@163.com",
                        description:"测试用户的说明"
                    });

                    $scope.goBack();
                }
            });
        };


    }]);

popControllers.controller("signUp",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.mainFlags.extMenuActive="";
    $scope.popFlags.title=Config.titles.signUp;
    $scope.mainFlags.showBlackOut=true;
    $scope.registerError="";
    $scope.captcha="captcha.jpg";

    $scope.refreshCaptcha=function(){
        $scope.captha=$scope.captha+"?"+Math.random();
    };

    $scope.registerSubmit=function(){

    };
}]);

popControllers.controller("forgetPwd",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.popFlags.title=Config.titles.forgetPwd;
    $scope.mainFlags.showBlackOut=true;
    $scope.mainFlags.extMenuActive="";

    $scope.forgetPwdSubmit=function(){

    };

}]);

popControllers.controller("search",["$scope","Config","LocationChanger",function($scope,Config,LocationChanger){
    $scope.popFlags.title=Config.titles.search;
    $scope.mainFlags.showBlackOut=true;
    $scope.mainFlags.extMenuActive="";

    $scope.toSearch=function(href){
        LocationChanger.canReload().withoutRefresh(href,false);
        $scope.mainFlags.showBlackOut=false;
        $scope.popFlags.popTemplateUrl="";
    }

}]);

popControllers.controller("editPwd",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.popFlags.title=Config.titles.editPwd;
    $scope.mainFlags.showBlackOut=true;
    $scope.mainFlags.extMenuActive="";

    $scope.editPwdSubmit=function(){

    };

}]);

popControllers.controller("editInfo",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.popFlags.title=Config.titles.editInfo;
    $scope.mainFlags.extMenuActive="";
    $scope.mainFlags.showBlackOut=true;
    $scope.editInfo.profile=$scope.currentUser.profile;
    $scope.editInfo.description=$scope.currentUser.description;

    $scope.editInfoSubmit=function(){

    };

}]);

