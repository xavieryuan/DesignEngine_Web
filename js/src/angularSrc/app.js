/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午4:12
 * To change this template use File | Settings | File Templates.
 */
var pinWall=angular.module("pinWall",["ngRoute","common","viewControllers","popControllers"]);

pinWall.config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){

    //默认使用的时候hash模式，如果要使用rest风格，需要设置下面这一句，注意$locationProvider需要注入
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("!");
    $routeProvider.when("/",{templateUrl: 'views/showProjects.html',controller:"showProjects"}).
        otherwise({redirectTo: '/'});
}]);

pinWall.controller("super",["$scope","Config","Storage","PopControllers",function($scope,Config,Storage,PopControllers){

    //弹出层使用的变量，绑定在body的controller上，在其下的controller会继承这些变量
    $scope.popController=PopControllers.signIn; //弹窗的控制器名称
    $scope.popTemplateUrl=Config.popTemplateUrls.signIn; //弹窗需要加载的页面url
    $scope.showPop=false; //是否显示弹窗
    $scope.showMoreMenuFlag=false; //是否显示个人菜单
    $scope.showProjectDetail=false; //是否显示作品详情
    $scope.showPlayMedialPanel=false; //是否显示视频播放界面
    $scope.showWebVideoPanel=false; //控制显示网络视频输入界面
    $scope.showBlackOut=false; //控制显示遮盖层
    $scope.showLoading=false; //控制显示loading

    $scope.currentUser=Storage.currentUser;

    $scope.closePop=function(){
        $scope.showPop=false;
    };

    $scope.validateMessages={
        "required":Config.messages.required,
        "email":Config.messages.email,
        "emailExist":Config.messages.emailExist,
        "maxLength":Config.messages.maxLength,
        "minLength":Config.messages.minLength
    };

    /**
     *点击登陆菜单
     */
    $scope.login=function(){
        $scope.showPop=true;
        $scope.popController=PopControllers.signIn;
        $scope.popTemplateUrl=Config.popTemplateUrls.signIn;
    };

    /**
     *显示更多菜单
     */
    $scope.showMoreMenu=function(){
        $scope.showMoreMenuFlag=!$scope.showMoreMenuFlag;
    };

    /**
     *点击修改密码菜单
     */
    $scope.editPwd=function(){
        $scope.popController=PopControllers.editPwd;
        $scope.popTemplateUrl=Config.popTemplateUrls.editPwd;
        $scope.showPop=true;
    };

    /**
     *点击修改资料菜单
     */
    $scope.editProfile=function(){
        $scope.popController=PopControllers.editProfile;
        $scope.popTemplateUrl=Config.popTemplateUrls.editProfile;
        $scope.showPop=true;
    };

    $scope.closePlayMediaPanel=function(){
        $scope.showPlayMedialPanel=false;
        $scope.showBlackOut=false;
    };
    $scope.closeWebVideoPanel=function(){
        $scope.showWebVideoPanel=false;
        $scope.showBlackOut=false;
    }
}]);
