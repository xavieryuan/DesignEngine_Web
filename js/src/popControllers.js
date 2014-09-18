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
        $scope.popFlags.title=Config.titles.signIn;
        $scope.showBlackOut();

        $scope.mainFlags.extMenuActive=false;

        $scope.toRegPanel=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.signUp+"?dc="+new Date().getTime();
            LocationChanger.skipReload().withReplace(Config.urls.signUp,true);
        };
        $scope.forgetPwd=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.forgetPwd+"?dc="+new Date().getTime();
            LocationChanger.skipReload().withReplace(Config.urls.forgetPwd,true);
        };

        if($document.cookie){
            var obj=JSON.parse(decodeURIComponent($document.cookie));
            $scope.user.email=obj.email;
            $scope.user.password=obj.password;
            $scope.user.rememberMe=true;
        }

        //记住我
        function rememberMe(){
            if($scope.user.rememberMe){
                var email= $scope.user.email;
                var password=$scope.user.password;
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
            User.resource.login($scope.user,function(data){
                Storage.initCurrentUser({
                    id:data.user.id,
                    roles:data.user.roles,
                    name:data.user.fullname,
                    active:data.user.active,
                    email:data.user.email,
                    setting:{
                        profile_image:data.user.setting&&data.user.setting.profile_image?
                            data.user.setting.profile_image:Config.thumbs.defaultUserProfile,
                        description:data.user.setting&&data.user.setting.description?
                            data.user.setting.description:"",
                        comment_active:data.user.setting&&data.user.setting.comment_active?
                            data.user.setting.comment_active:true
                    }
                });

                $scope.closePop();
            });
        };


    }]);

popControllers.controller("signUp",["$scope","CFunctions","Config","User","toaster",function($scope,CFunctions,Config,User,toaster){

    $scope.popFlags.title=Config.titles.signUp;
    $scope.showBlackOut();
    $scope.registerError="";
    $scope.captcha=Config.captcha;
    $scope.emailUrl="";

    $scope.mainFlags.extMenuActive=false;
    $scope.refreshCaptcha=function(){
        $scope.captcha=Config.captcha+"?"+Math.random();
    };

    $scope.registerSubmit=function(){
        User.resource.add($scope.user,function(data){
            $scope.emailUrl=Config.emailUrls[CFunctions.getEmailDomain($scope.user.email)];
            toaster.pop("success",Config.messages.successTitle,Config.messages.activeSuccess,null,null);
            //$scope.closePop();
        });
    };
}]);

popControllers.controller("forgetPwd",["$scope","toaster","CFunctions","Config","User",function($scope,toaster,CFunctions,Config,User){
    $scope.popFlags.title=Config.titles.forgetPwd;
    $scope.showBlackOut();

    $scope.mainFlags.extMenuActive=false;
    $scope.emailUrl="";

    $scope.forgetPwdSubmit=function(){
        User.resource.forgetPwd({email:$scope.email},function(data){
            $scope.emailUrl=Config.emailUrls[CFunctions.getEmailDomain($scope.email)];
            toaster.pop("success",Config.messages.successTitle,Config.messages.operationSuccess,null,null);
        });
    };

}]);

popControllers.controller("search",["$scope","AutoComplete","Config","LocationChanger",function($scope,AutoComplete,Config,LocationChanger){
    $scope.popFlags.title=Config.titles.search;
    $scope.showBlackOut();

    $scope.mainFlags.extMenuActive=false;

    AutoComplete.autoComplete({
        url:Config.ajaxUrls.getCompleteUrl,
        selectedEvent:function(content){
            $scope.toSearch(content);
        }
    });

    $scope.toSearch=function(content){
        LocationChanger.withReplace(Config.urls.searchResult.replace(":content",content),true);

    }

}]);

popControllers.controller("editPwd",["$scope","CFunctions","Config","User","toaster",function($scope,CFunctions,Config,User,toaster){
    $scope.popFlags.title=Config.titles.editPwd;
    $scope.showBlackOut();
    $scope.mainFlags.extMenuActive=false;

    $scope.editPwdSubmit=function(){
        console.log($scope.user);
        User.resource.changePwd($scope.user,function(data){
            toaster.pop("success",Config.messages.successTitle,Config.messages.operationSuccess,null,null);
            $scope.closePop();
        })
    };

}]);

popControllers.controller("editInfo",["$scope","$http","CFunctions","Config","Storage","User","toaster",function($scope,$http,CFunctions,Config,Storage,User,toaster){
    $scope.popFlags.title=Config.titles.editInfo;
    $scope.showBlackOut();
    $scope.user={
        userId:Storage.currentUser.id,
        email:Storage.currentUser.email,
        setting:{
            profile_image:Storage.currentUser.profile,
            description:Storage.currentUser.description
        }
    };

    $scope.mainFlags.extMenuActive=false;
    $scope.editInfoSubmit=function(){
        User.resource.save({userId:$scope.user.userId},$scope.user.setting,function(data){
            Storage.initCurrentUser({
                setting:{
                    profile_image:$scope.user.setting.profile_image,
                    description:$scope.user.setting.description
                }
            });
            toaster.pop("success",Config.messages.successTitle,Config.messages.operationSuccess,null,null);
            $scope.closePop();
        })
    };

    $scope.createProfileUploader=function(buttonId,containerId){
        CFunctions.createUploader({
            browseButton:buttonId,
            multiSelection:true,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxImageSize,
            filter:Config.mediaFilters.image,
            progressCb:null,
            uploadedCb:function(file,info){
                var res = JSON.parse(info);
                var src = Config.qNBucketDomain + res.key;

                //判断是否是1：1
                $http.get(src+"?imageInfo",{
                    transformRequest:function(data, headersGetter){
                        return JSON.stringify(data);
                    },
                    transformResponse:function(data, headersGetter){
                        return JSON.parse(data);
                    }
                }).success(function(data,status,headers,config,statusText ){
                    //console.log(data);
                    if(data.width===data.height){
                        $scope.user.setting.profile_image=src;
                        //$scope.$apply();
                    }else{
                        toaster.pop('error',Config.messages.errorTitle,Config.messages.imgSizeError,null,null);
                    }
                });

            }
        });
    }

}]);

