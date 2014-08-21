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
            when("/projects",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/project/:projectId",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/boxes",{templateUrl: 'views/showBoxes.html',controller:"boxes"}).
            when("/box/create",{templateUrl: 'views/boxUpdate.html',controller:"boxUpdate"}).
            when("/box/edit/:boxId",{templateUrl: 'views/boxUpdate.html',controller:"boxUpdate"}).
            when("/box/:boxId",{templateUrl: 'views/showBoxDetail.html',controller:"boxDetail"}).
            when("/adminHome/comments",{templateUrl: 'views/admin/commentsManage.html',controller:"commentsManage"}).
            when("/project/create/:boxId",{templateUrl: 'views/projectUpdate.html',controller:"projectUpdate"}).
            when("/project/update/:boxId/:projectId",{templateUrl: 'views/projectUpdate.html',controller:"projectUpdate"}).
            when("/search",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/search/:content",{templateUrl: 'views/searchResult.html',controller:"searchResult"}).
            when("/user/:userId",{templateUrl: 'views/userHome.html',controller:"userHome"}).
            when("/login",{templateUrl: 'views/showProjects.html',controller:"projects"}).
            when("/register",{templateUrl: 'views/showProjects.html',controller:"projects"}).
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
                response: function (res) {
                    if(res.data.success&&res.data.success==false){
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
        showLoading:true
    };
    angular.extend(App,AjaxErrorHandler);

    App.showLoading=function(){
        $rootScope.rootFlags.showLoading=true;
    };
    App.hideLoading=function(){
        $rootScope.rootFlags.showLoading=false;
    };

    App.$q=$q;

}]);

pinWall.controller("super",["$scope","$location","Config","CFunctions","Storage","LocationChanger",
    function($scope,$location,Config,CFunctions,Storage,LocationChanger){

        //使用对象，子scope可以直接覆盖（对象地址）
        $scope.mainFlags={
            "currentMenu":Config.mainMenu.project,
            "showMainWrapper":true,
            "extMenuActive":false, //是否显示个人菜单
            "showProjectDetailFlag":false,  //是否显示作品详情
            "projectDetailTemplate":"",
            "showPlayMedialPanel":false,   //是否显示视频播放界面
            "showWebVideoPanel":false,   //控制显示网络视频输入界面
            "showBlackOut":false
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
        $scope.currentUser.id=1;
        $scope.currentUser.profile="data/people1.jpg";
        $scope.currentUser.name="测试用户";
        $scope.currentUser.roles=[Config.roles.admin,Config.roles.vip];

        $scope.closePop=function(notGoBack){
            $scope.popFlags.title="";
            $scope.popFlags.popTemplateUrl="";
            $scope.mainFlags.showBlackOut=false;

            if(!notGoBack){
                history.back();
            }
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
            LocationChanger.skipReload().withReplace(Config.urls.editInfo,false);
        };

        //播放媒体文件界面
        $scope.closePlayMediaPanel=function(){
            $scope.mainFlags.showPlayMedialPanel=false;
            $scope.mainFlags.showBlackOut=false;
        };
        $scope.closeWebVideoPanel=function(){
            $scope.mainFlags.showWebVideoPanel=false;
            $scope.mainFlags.showBlackOut=false;
        };

        $scope.initPage=function(){
            var path=$location.path();

            if(path.indexOf(Config.urls.editPwd)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.editPwd;
            }else if(path.indexOf(Config.urls.signIn)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.signIn;
            }else if(path.indexOf(Config.urls.signUp)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.signUp;
            }else if(path.indexOf(Config.urls.editInfo)!==-1){
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

        $scope.initPage();

    }]);
