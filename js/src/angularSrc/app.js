/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午4:12
 * To change this template use File | Settings | File Templates.
 */
var pinWall=angular.module("pinWall",["ngRoute","classes","viewControllers","popControllers","filters","directives","animations"]);

pinWall.config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){

    //默认使用的时候hash模式，如果要使用rest风格，需要设置下面这一句，注意$locationProvider需要注入
    $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix("!");
    $routeProvider.when("/",{templateUrl: 'views/showProjects.html',controller:"projects"}).
        when("/projects",{templateUrl: 'views/showProjects.html',controller:"projects"}).
        when("/project/:projectId",{templateUrl: 'views/showProjects.html',controller:"projects"}).
        when("/boxes",{templateUrl: 'views/showBoxes.html',controller:"boxes"}).
        when("/box/create",{templateUrl: 'views/boxCreate.html',controller:"boxCreate"}).
        when("/box/:id",{templateUrl: 'views/showBoxDetail.html',controller:"boxDetail"}).
        when("/upload/:boxId",{templateUrl: 'views/uploadProject.html',controller:"uploadProject"}).
        when("/search",{templateUrl: 'views/showProjects.html',controller:"projects"}).
        when("/search/:content",{templateUrl: 'views/searchResult.html',controller:"searchResult"}).
        when("/user/:userId",{templateUrl: 'views/userHome.html',controller:"userHome"}).
        when("/login",{templateUrl: 'views/showProjects.html',controller:"projects"}).
        when("/register",{templateUrl: 'views/showProjects.html',controller:"projects"}).
        when("/forgetPassword",{templateUrl: 'views/showProjects.html',controller:"projects"})/*.
        otherwise({redirectTo: '/'});*/
}]);

pinWall.controller("super",["$scope","$location","Config","CFunctions","Storage","LocationChanger",
    function($scope,$location,Config,CFunctions,Storage,LocationChanger){


        //弹出层使用的变量，绑定在body的controller上，在其下的controller会继承这些变量
        var path=$location.path();
        $scope.menuStatus=CFunctions.setMenuStatus(path);

        //使用对象，子scope可以直接覆盖（对象地址）
        $scope.mainFlags={
            "showMainWrapper":true,
            "extMenuActive":"", //是否显示个人菜单
            "showProjectDetailFlag":false,  //是否显示作品详情
            "projectDetailTemplate":"",
            "showPlayMedialPanel":false,   //是否显示视频播放界面
            "showWebVideoPanel":false,   //控制显示网络视频输入界面
            "showBlackOut":false,   //控制显示遮盖层
            "showLoading":false    //控制显示loading
        };
        $scope.popFlags={
            "title":"",
            "popTemplateUrl":"", //弹窗需要加载的页面url
            "showPop":false  //是否显示弹窗
        };

        $scope.currentUser=Storage.currentUser;
        $scope.currentUser.id=1;

        //CFunctions.initPage($scope);

        $scope.closePop=function(){
            $scope.popFlags.showPop=false;
            $scope.mainFlags.showBlackOut=false;
            $scope.popFlags.popTemplateUrl="";

            LocationChanger.goBack();
        };

        $scope.validMessage={
            "required":Config.validError.required,
            "email":Config.validError.email,
            "emailExist":Config.validError.emailExist,
            "maxLength":Config.validError.maxLength,
            "minLength":Config.validError.minLength,
            "pwdEqualError":Config.validError.pwdEqualError
        };

        /**
         *点击登陆菜单
         */
        $scope.login=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.signIn;
            LocationChanger.skipReload().withoutRefresh(Config.urls.login,false);
        };
        $scope.toSearch=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.search;
            LocationChanger.skipReload().withoutRefresh(Config.urls.search,false);
        };

        $scope.showProjectDetail=function(id){
            $scope.mainFlags.showMainWrapper=false;
            $scope.mainFlags.showProjectDetailFlag=true;
            $scope.mainFlags.projectDetailTemplate=Config.templateUrls.projectDetail;
            LocationChanger.skipReload().withoutRefresh(Config.urls.projectDetail.replace("{projectId}",id),false);
        };

        /**
         *显示更多菜单
         */
        $scope.showExtMenu=function(event){
            $scope.mainFlags.extMenuActive==""?
                $scope.mainFlags.extMenuActive=Config.classNames.extMenuActive:$scope.mainFlags.extMenuActive="";
            event.stopPropagation();
        };


        /**
         *点击修改密码菜单
         */
        $scope.editPwd=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.editPwd;
            LocationChanger.skipReload().withoutRefresh(Config.urls.editPwd,false);
        };

        /**
         *点击修改资料菜单
         */
        $scope.editInfo=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.editInfo;
            LocationChanger.skipReload().withoutRefresh(Config.urls.editInfo,false);
        };

        //播放媒体文件界面
        $scope.closePlayMediaPanel=function(){
            $scope.mainFlags.showPlayMedialPanel=false;
            $scope.mainFlags.showBlackOut=false;
        };
        $scope.closeWebVideoPanel=function(){
            $scope.mainFlags.showWebVideoPanel=false;
            $scope.mainFlags.showBlackOut=false;
        }
}]);