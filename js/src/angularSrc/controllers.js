/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:12
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午3:42
 * To change this template use File | Settings | File Templates.
 */
var controllers=angular.module("controllers",["classes"]);
controllers.controller("signIn",["$scope","Config","LocationChanger","Storage","CFunctions",
    function($scope,Config,LocationChanger,Storage,CFunctions){

        $scope.loginError="";
        $scope.popFlags.title=Config.titles.signIn;
        $scope.popFlags.showPop=true;
        $scope.mainFlags.showBlackOut=true;

        $scope.toRegPanel=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.signUp;
            LocationChanger.skipReload().withoutRefresh(Config.urls.register,false);
        };
        $scope.forgetPwd=function(){
            $scope.popFlags.popTemplateUrl=Config.templateUrls.forgetPwd;
            LocationChanger.skipReload().withoutRefresh(Config.urls.forgetPwd,false);
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
            //rememberMe();
            Storage.initCurrentUser({
                userId:2,
                profile:"data/people1.jpg",
                role:"admin",
                name:"测试用户",
                email:"csboyty@163.com",
                description:"测试用户的说明"
            });

            $scope.closePop();
        };


    }]);

controllers.controller("signUp",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
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

controllers.controller("forgetPwd",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.popFlags.title=Config.titles.forgetPwd;
    $scope.popFlags.showPop=true;
    $scope.mainFlags.showBlackOut=true;

    $scope.forgetPwdSubmit=function(){

    };

}]);

controllers.controller("search",["$scope","Config","LocationChanger",function($scope,Config,LocationChanger){
    $scope.popFlags.title=Config.titles.search;
    $scope.popFlags.showPop=true;
    $scope.mainFlags.showBlackOut=true;
    $scope.mainFlags.extMenuClass="";

    $scope.toSearch=function(href){
        LocationChanger.canReload().withoutRefresh(href,false);
        $scope.popFlags.showPop=false;
        $scope.mainFlags.showBlackOut=false;
        $scope.popFlags.popTemplateUrl="";
    }

}]);

controllers.controller("editPwd",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.popFlags.title=Config.titles.editPwd;
    $scope.popFlags.showPop=true;
    $scope.mainFlags.showBlackOut=true;

    $scope.editPwdSubmit=function(){

    };

}]);
controllers.controller("editInfo",["$scope","CFunctions","Config",function($scope,CFunctions,Config){
    $scope.popFlags.title=Config.titles.editInfo;
    $scope.popFlags.showPop=true;
    $scope.mainFlags.showBlackOut=true;
    $scope.editInfo.profile=$scope.currentUser.profile;
    $scope.editInfo.description=$scope.currentUser.description;

    $scope.editInfoSubmit=function(){

    };

}]);

controllers.controller("showProjects",['$scope',"Config","Project","CFunctions",function($scope,Config,Project,CFunctions){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.menuStatus.projectsClass=Config.classNames.mainMenuActive;
    $scope.menuStatus.boxesClass="";
    $scope.mainFlags.extMenuClass="";

    Project.query({"start":10},function(data){
        $scope.projects=data.projects;
    },function(data){
        CFunctions.ajaxErrorHandler();
    });


}]);

controllers.controller("showBoxes",['$scope',"Config",function($scope,Config){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.menuStatus.projectsClass="";
    $scope.menuStatus.boxesClass=Config.classNames.mainMenuActive;
    $scope.mainFlags.extMenuClass="";

    $scope.boxes=[
        {
            "id":1,
            "honorCount":34,
            "projectCount":55,
            "disabledUpload":true,
            "userProfile":"data/people1.jpg",
            "userName":"涛涛",
            "userId":1,
            "date":"2013-07-08",
            "title":"书香文化",
            "description":"这个还一个很友好的作品",
            projects:[
                {
                    "id":1,
                    "thumb":"data/pic1.png",
                    "praiseCount":34,
                    "commentCount":45,
                    "userProfile":"data/people1.jpg",
                    "userName":"涛涛",
                    "userId":1,
                    "date":"2013-07-08",
                    "title":"书香文化"
                },
                {
                    "id":2,
                    "thumb":"data/pic2.png",
                    "praiseCount":34,
                    "commentsCount":45,
                    "userProfile":"data/people2.jpg",
                    "userName":"涛涛",
                    "userId":1,
                    "date":"2013-07-08",
                    "title":"书香文化"
                },
                {
                    "id":3,
                    "thumb":"data/pic3.png",
                    "praiseCount":34,
                    "commentsCount":45,
                    "userProfile":"data/people3.jpg",
                    "userName":"涛涛",
                    "userId":1,
                    "date":"2013-07-08",
                    "title":"书香文化"
                }]
        },
        {
            "id":2,
            "honorCount":34,
            "projectCount":55,
            "disabledUpload":false,
            "userProfile":"data/people2.jpg",
            "userName":"涛涛",
            "userId":2,
            "date":"2013-07-08",
            "title":"书香文化",
            "description":"这个还一个很友好的作品",
            projects:[
                {
                    "id":1,
                    "thumb":"data/pic1.png",
                    "praiseCount":34,
                    "commentCount":45,
                    "userProfile":"data/people1.jpg",
                    "userName":"涛涛",
                    "userId":1,
                    "date":"2013-07-08",
                    "title":"书香文化"
                },
                {
                    "id":2,
                    "thumb":"data/pic2.png",
                    "praiseCount":34,
                    "commentsCount":45,
                    "userProfile":"data/people2.jpg",
                    "userName":"涛涛",
                    "userId":1,
                    "date":"2013-07-08",
                    "title":"书香文化"
                },
                {
                    "id":3,
                    "thumb":"data/pic3.png",
                    "praiseCount":34,
                    "commentsCount":45,
                    "userProfile":"data/people3.jpg",
                    "userName":"涛涛",
                    "userId":1,
                    "date":"2013-07-08",
                    "title":"书香文化"
                }]
        },
        {
            "id":3,
            "honorCount":34,
            "projectCount":55,
            "disabledUpload":false,
            "userProfile":"data/people3.jpg",
            "userName":"涛涛",
            "userId":3,
            "date":"2013-07-08",
            "title":"书香文化",
            "description":"这个还一个很友好的作品",
            projects:[
                {
                    "id":1,
                    "thumb":"data/pic1.png",
                    "praiseCount":34,
                    "commentCount":45,
                    "userProfile":"data/people1.jpg",
                    "userName":"涛涛",
                    "userId":1,
                    "date":"2013-07-08",
                    "title":"书香文化"
                },
                {
                    "id":2,
                    "thumb":"data/pic2.png",
                    "praiseCount":34,
                    "commentsCount":45,
                    "userProfile":"data/people2.jpg",
                    "userName":"涛涛",
                    "userId":1,
                    "date":"2013-07-08",
                    "title":"书香文化"
                },
                {
                    "id":3,
                    "thumb":"data/pic3.png",
                    "praiseCount":34,
                    "commentsCount":45,
                    "userProfile":"data/people3.jpg",
                    "userName":"涛涛",
                    "userId":1,
                    "date":"2013-07-08",
                    "title":"书香文化"
                }]
        }
    ];

}]);

controllers.controller("userHome",['$scope',function($scope){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.menuStatus.projectsClass="";
    $scope.menuStatus.boxesClass="";
    $scope.mainFlags.extMenuClass="";

    $scope.user={
        "id":1,
        "honorCount":34,
        "projectCount":55,
        "disabledUpload":true,
        "profile":"data/people1.jpg",
        "name":"涛涛",
        "date":"2013-07-08",
        "description":"这个还一个很友好的作品",
        "projects":[
            {
                "id":1,
                "thumb":"data/pic1.png",
                "praiseCount":34,
                "commentCount":45,
                "userProfile":"data/people1.jpg",
                "userName":"涛涛",
                "userId":1,
                "date":"2013-07-08",
                "title":"书香文化"
            },
            {
                "id":2,
                "thumb":"data/pic2.png",
                "praiseCount":34,
                "commentsCount":45,
                "userProfile":"data/people2.jpg",
                "userName":"涛涛",
                "userId":1,
                "date":"2013-07-08",
                "title":"书香文化"
            },
            {
                "id":3,
                "thumb":"data/pic3.png",
                "praiseCount":34,
                "commentsCount":45,
                "userProfile":"data/people3.jpg",
                "userName":"涛涛",
                "userId":1,
                "date":"2013-07-08",
                "title":"书香文化"
            }]
    };
    $scope.projects=[
        {
            "id":1,
            "thumb":"data/pic1.png",
            "praiseCount":34,
            "commentCount":45,
            "userProfile":"data/people1.jpg",
            "userName":"涛涛",
            "userId":1,
            "date":"2013-07-08",
            "title":"书香文化"
        },
        {
            "id":2,
            "thumb":"data/pic2.png",
            "praiseCount":34,
            "commentsCount":45,
            "userProfile":"data/people2.jpg",
            "userName":"涛涛",
            "userId":1,
            "date":"2013-07-08",
            "title":"书香文化"
        },
        {
            "id":3,
            "thumb":"data/pic3.png",
            "praiseCount":34,
            "commentsCount":45,
            "userProfile":"data/people3.jpg",
            "userName":"涛涛",
            "userId":1,
            "date":"2013-07-08",
            "title":"书香文化"
        }
    ];

}]);

controllers.controller("projectDetail",["$scope","LocationChanger",function($scope,LocationChanger){

    $scope.project={
        "praised":true,
        "canDoHidden":true,
        "toHome":false,
        "title":"测试数据",
        "date":"2012-09-09",
        "userName":"涛涛",
        "userId":1,
        "userProfile":"data/people3.jpg",
        "honorCount":33,
        "praiseCount":20,
        "commentsCount":45,
        "description":"这个还一个很友好的作品"
    };

    $scope.closeProjectDetail=function(){
        $scope.mainFlags.showMainWrapper=true;
        $scope.mainFlags.showProjectDetailFlag=false;
        $scope.mainFlags.projectDetailTemplate="";
        LocationChanger.canReload();
        history.go(-1);
    };

    $scope.attachments=[
        {
            "attachmentMediaLocation":"data/01.jpg",
            "type":"image",
            "attachmentId":1,
            "attachmentPreviewLocation":"data/01.jpg",
            "attachmentDescription":"关于图片的书名"
        },
        {
            "attachmentMediaLocation":"data/01.jpg",
            "type":"video",
            "attachmentId":2,
            "attachmentPreviewLocation":"data/02.jpg",
            "attachmentDescription":"关于图片的书名"
        },
        {
            "attachmentMediaLocation":"data/01.jpg",
            "type":"flash",
            "attachmentId":3,
            "attachmentPreviewLocation":"data/03.jpg",
            "attachmentDescription":"关于图片的书名"
        },
        {
            "attachmentMediaLocation":"data/01.jpg",
            "type":"ppt",
            "attachmentId":4,
            "attachmentPreviewLocation":"data/03.jpg",
            "attachmentDescription":"关于图片的书名"
        },
        {
            "attachmentMediaLocation":"data/01.jpg",
            "type":"3d",
            "attachmentId":5,
            "attachmentPreviewLocation":"data/02.jpg",
            "attachmentDescription":"关于图片的书名"
        }
    ];
    $scope.comments=[
        {
            "id":0,
            "userId":0,
            "userName":"ssss",
            "userProfile":"data/people1.jpg",
            "commentContent":"ssssssssssss",
            "commentTime":"2012-09-09 23:23:23"
        },
        {
            "id":0,
            "userId":0,
            "userName":"ssss",
            "userProfile":"data/people2.jpg",
            "commentContent":"ssssssssssss",
            "commentTime":"2012-09-09 23:23:23"
        },
        {
            "id":0,
            "userId":0,
            "userName":"ssss",
            "userProfile":"data/people3.jpg",
            "commentContent":"ssssssssssss",
            "commentTime":"2012-09-09 23:23:23"
        },
        {
            "id":0,
            "userId":0,
            "userName":"ssss",
            "userProfile":"data/people4.jpg",
            "commentContent":"ssssssssssss",
            "commentTime":"2012-09-09 23:23:23"
        }
    ];
    $scope.similarProjects=[
        {
            "id":1,
            "thumb":"data/pic1.png",
            "praiseCount":34,
            "commentCount":45,
            "userProfile":"data/people1.jpg",
            "userName":"涛涛",
            "userId":1,
            "date":"2013-07-08",
            "title":"书香文化"
        },
        {
            "id":2,
            "thumb":"data/pic2.png",
            "praiseCount":34,
            "commentsCount":45,
            "userProfile":"data/people2.jpg",
            "userName":"涛涛",
            "userId":1,
            "date":"2013-07-08",
            "title":"书香文化"
        },
        {
            "id":3,
            "thumb":"data/pic3.png",
            "praiseCount":34,
            "commentsCount":45,
            "userProfile":"data/people3.jpg",
            "userName":"涛涛",
            "userId":1,
            "date":"2013-07-08",
            "title":"书香文化"
        }
    ];
}]);

controllers.controller("searchResult",["$scope","LocationChanger",function($scope,LocationChanger){
    $scope.menuStatus.projectsClass="";
    $scope.menuStatus.boxesClass="";

    $scope.projects=[
        {
            "id":1,
            "thumb":"data/pic1.png",
            "praiseCount":34,
            "commentCount":45,
            "userProfile":"data/people1.jpg",
            "userName":"涛涛",
            "userId":1,
            "date":"2013-07-08",
            "title":"书香文化"
        },
        {
            "id":2,
            "thumb":"data/pic2.png",
            "praiseCount":34,
            "commentsCount":45,
            "userProfile":"data/people2.jpg",
            "userName":"涛涛",
            "userId":1,
            "date":"2013-07-08",
            "title":"书香文化"
        }
    ];
}]);

controllers.controller("uploadProject",["$scope","$route","Config","CFunctions",function($scope,$route,Config,CFunctions){
    $scope.uploadProject={
        thumb:Config.defualtProjectThumb,
        tags:[]
    };

    $scope.stepClass=[Config.classNames.uploadStepActive,"",""];
    $scope.stepPanelClass=["",Config.classNames.hidden,Config.classNames.hidden];

    $scope.setStepActive=function(index){
        for(var i =0;i<3;i++){
            if(index==i){
                $scope.stepClass[i]=Config.classNames.uploadStepActive;
                $scope.stepPanelClass[i]="";
            }else{
                $scope.stepClass[i]="";
                $scope.stepPanelClass[i]=Config.classNames.hidden;
            }
        }
    };

    $scope.deleteTag=function(index){
        $scope.uploadProject.tags.splice(index,1);
    };

    $scope.addTag=function($event,tag){
        if($event.which==13){
            if($scope.uploadProject.tags.indexOf(tag)===-1){
                $scope.uploadProject.tags.push(tag);
                $scope.uploadProject.newTag="";
            }
        }
    };

    $scope.createThumbUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multi:false,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxImageSize,
            fileAddCb:null,
            progress:null,
            filter:Config.uploadFilters.imageFilter
        });
    };

    $scope.createImageUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multi:true,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxImageSize,
            fileAddCb:null,
            progress:null,
            filter:Config.uploadFilters.imageFilter
        });
    };

    $scope.createFileUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multi:false,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxMediaSize,
            fileAddCb:null,
            progress:null,
            filter:Config.uploadFilters.zipFiler
        });
    };
    $scope.createPptUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multi:false,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxMediaSize,
            fileAddCb:null,
            progress:null,
            filter:Config.uploadFilters.pptFilter
        });
    };
    $scope.createVideoUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multi:true,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxMediaSize,
            fileAddCb:null,
            progress:null,
            filter:Config.uploadFilters.mp4Filter
        });
    };
    $scope.createFlashUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multi:true,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxMediaSize,
            fileAddCb:null,
            progress:null,
            filter:Config.uploadFilters.swfFilter
        });
    }

}]);




