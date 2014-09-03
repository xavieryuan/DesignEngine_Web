/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午4:12
 * To change this template use File | Settings | File Templates.
 */
var pinWall=angular.module("pinWall",["ngRoute","services","viewControllers","popControllers","filters","directives","animations"]);

pinWall.config(["$routeProvider","$locationProvider","$httpProvider","App",
    function($routeProvider,$locationProvider,$httpProvider,App){


        //默认使用的时候hash模式，如果要使用rest风格，需要设置下面这一句，注意$locationProvider需要注入
        $locationProvider.html5Mode(true);
        //$locationProvider.hashPrefix("!");
        $routeProvider.when("/",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/artifacts",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/artifacts/create",{templateUrl: 'views/projectUpdate.html',controller:"projectUpdate"}).
            when("/artifacts/:projectId",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/topics",{templateUrl: 'views/showBoxes.html',controller:"boxes"}).
            when("/topics/create",{templateUrl: 'views/boxUpdate.html',controller:"boxUpdate"}).
            when("/topics/:boxId/update",{templateUrl: 'views/boxUpdate.html',controller:"boxUpdate"}).
            when("/box/:boxId",{templateUrl: 'views/showBoxDetail.html',controller:"boxDetail"}).
            when("/adminHome/comments",{templateUrl: 'views/admin/commentsManage.html',controller:"commentsManage"}).
            when("/topic/:boxId/artifact",{templateUrl: 'views/projectUpdate.html',controller:"projectUpdate"}).
            when("/artifacts/:projectId/update",{templateUrl: 'views/projectUpdate.html',controller:"projectUpdate"}).
            when("/search",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/search/:content",{templateUrl: 'views/searchResult.html',controller:"searchResult"}).
            when("/users/:userId",{templateUrl: 'views/userHome.html',controller:"userHome"}).
            when("/login",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/register",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/users/:userId/update",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/change_password",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/forgetPassword",{templateUrl: 'views/showProjects.html',controller:"projects"})/*.
            otherwise({redirectTo: '/'});*/

        //ajax的一些默认配置，全局启用loading
        $httpProvider.defaults.transformRequest.push(function (data) {
            App.showLoading();
            return data;
        });

        $httpProvider.defaults.transformResponse.push(function (data) {
            App.hideLoading();
            return data;
        });

        //对返回的数据进行拦截，直接全局处理出错信息
        $httpProvider.interceptors.push(function () {
            return {
                request:function(config){
                    config.url=config.url.replace(/\\/,"/");

                    return config||App.$q.reject(config);
                },
                response: function (res) {
                    if(typeof res.data.success!="undefined"&&res.data.success==false){
                        App.ajaxReturnErrorHandler(res.data);
                        return App.$q.reject(res.data);
                    }else{
                        return res;
                    }
                },
                responseError: function (res) {
                    App.ajaxErrorHandler();
                    return App.$q.reject(res);
                }
            };
        });

    }]);

//在run中做一些扩展,扩展App模块，从而可以在config中使用
pinWall.run(["$rootScope","$q","App","AjaxErrorHandler",function($rootScope,$q,App,AjaxErrorHandler){
    $rootScope.rootFlags={
        showLoading:false,
        showBlackOut:false
    };
    angular.extend(App,AjaxErrorHandler);

    App.showBlackOut=function(){
        $rootScope.rootFlags.showBlackOut=true;
    };
    App.hideBlackOut=function(){
        $rootScope.rootFlags.showBlackOut=false;
    };
    App.showLoading=function(){
        App.showBlackOut();
        $rootScope.rootFlags.showLoading=true;
    };
    App.hideLoading=function(){
        App.hideBlackOut();
        $rootScope.rootFlags.showLoading=false;
    };

    App.$q=$q;

}]);

pinWall.controller("super",["$scope","$location","Config","CFunctions","Storage","User","LocationChanger","toaster","App",
    function($scope,$location,Config,CFunctions,Storage,User,LocationChanger,toaster,App){

        //使用对象，子scope可以直接覆盖（对象地址）
        $scope.mainFlags={
            "currentMenu":Config.mainMenu.project,
            "showMainWrapper":true,
            "extMenuActive":false, //是否显示个人菜单
            "showProjectDetailFlag":false,  //是否显示作品详情
            "projectDetailTemplate":"",
            "showPlayMedialPanel":false,   //是否显示视频播放界面
            "showWebVideoPanel":false   //控制显示网络视频输入界面S
        };
        $scope.popFlags={
            "title":"",
            "popTemplateUrl":"" //弹窗需要加载的页面url
        };

        $scope.validMessage={
            "required":Config.validError.required,
            "email":Config.validError.email,
            "emailExist":Config.validError.emailExist,
            "maxLength":Config.validError.maxLength,
            "minLength":Config.validError.minLength,
            "pwdEqualError":Config.validError.pwdEqualError
        };

        $scope.currentUser=Storage.currentUser;
        //$scope.currentUser.id=1;

        $scope.closePop=function(notGoBack){
            $scope.popFlags.title="";
            $scope.popFlags.popTemplateUrl="";

            $scope.hideBlackOut();

            if(!notGoBack){
                history.back();
            }
        };

        $scope.showBlackOut=function(){
            App.showBlackOut();
        };
        $scope.hideBlackOut=function(){
            App.hideBlackOut();
        };
        /**
         *点击登陆菜单
         */
        $scope.login=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.signIn;
            LocationChanger.skipReload().withReplace(Config.urls.signIn,false);
        };
        $scope.toSearch=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.search;
            LocationChanger.skipReload().withReplace(Config.urls.search,false);
        };

        $scope.showProjectDetail=function(id,replaceUrl){
            replaceUrl=!!replaceUrl;
            $scope.mainFlags.showMainWrapper=false;
            $scope.mainFlags.showProjectDetailFlag=true;
            $scope.mainFlags.projectDetailTemplate=Config.templateUrls.projectDetail;
            LocationChanger.skipReload().withReplace(Config.urls.projectDetail.replace(":projectId",id),replaceUrl);
        };
        $scope.closeProjectDetailPanel=function(){
            $scope.mainFlags.showProjectDetailFlag=false;
            $scope.mainFlags.projectDetailTemplate="";
            $scope.mainFlags.showMainWrapper=true;
        };


        /**
         *显示更多菜单
         */
        $scope.toggleExtMenu=function(event){
            $scope.mainFlags.extMenuActive=!$scope.mainFlags.extMenuActive;
            event.stopPropagation();
        };


        /**
         *点击修改密码菜单
         */
        $scope.editPwd=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.editPwd;
            LocationChanger.skipReload().withReplace(Config.urls.editPwd,false);
        };

        /**
         *点击修改资料菜单
         */
        $scope.editInfo=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.editInfo;
            LocationChanger.skipReload().withReplace(Config.urls.editInfo.replace(":userId",$scope.currentUser.id),false);
        };

        //播放媒体文件界面
        $scope.closePlayMediaPanel=function(){
            $scope.mainFlags.showPlayMedialPanel=false;
            $scope.hideBlackOut();
        };
        $scope.closeWebVideoPanel=function(){
            $scope.mainFlags.showWebVideoPanel=false;
            $scope.hideBlackOut();
        };

        $scope.initPage=function(){
            var path=$location.path();

            if(path.indexOf(Config.urls.editPwd)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.editPwd;
            }else if(path.indexOf(Config.urls.signIn)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.signIn;
            }else if(path.indexOf(Config.urls.signUp)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.signUp;
            }else if(path.match(Config.urls.editInfoReg)!==null){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.editInfo;
            }else if(path.match(Config.urls.projectDetailReg)!==null){
                $scope.mainFlags.projectDetailTemplate=Config.templateUrls.projectDetail;
            }else if(path.indexOf(Config.urls.search)!==-1&&path.match(Config.urls.searchResultReg)==null){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.search;
            }else{
                $scope.closePop(true);
                CFunctions.hideProjectDetail(function(){
                    $scope.closeProjectDetailPanel();
                    $scope.$apply();
                });
            }
        };

        $scope.activeAccount=function(){
            User.resource.setUserActive({email:Storage.currentUser.email},function(data){
                toaster.pop('success',Config.messages.successTitle,Config.messages.activeSuccess,null,null);
            });
        };

        $scope.initPage();
        //初始化登陆用户
        User.resource.getCurrentUser(function(data){
            if(data.user){
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
            }
        });

    }]);
