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
    $scope.popFlags.title=Config.titles.signUp;
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

    function addTag(tag){
        if($scope.uploadProject.tags.indexOf(tag)===-1){
            $scope.uploadProject.tags.push(tag);
        }

        $scope.uploadProject.newTag="";
    }
    function fileAddedCb(files,type){
        var fileLength=files.length;
        var random="";
        for (var i = 0; i < fileLength; i++) {
            random=CFunctions.getRandom(Config.mediaIdPrefixes.image);
            $scope.uploadProject.medias[random]={};
            $scope.uploadProject.medias[random][Config.mediaObj.mediaThumbFilePath]=Config.thumbs.smallThumb;
            $scope.uploadProject.medias[random][Config.mediaObj.mediaFilename]="0%";
            $scope.uploadProject.medias[random][Config.mediaObj.mediaType]=type;

            fileIdToMediaIdHash[files[i]["id"]]=random;


        }
        $scope.mediaMenuActive="";
        $scope.$apply();
    }
    function progressCb(up,file){
        $scope.uploadProject.medias[fileIdToMediaIdHash[file.id]][Config.mediaObj.mediaFilename]=file.percent+"%";
        $scope.$apply();
    }
    function fileUploadedCb(file,info,type){
        var res = JSON.parse(info);
        var path = Config.qNBucketDomain + res.key; //获取上传成功后的文件的Url
        var mediaId=fileIdToMediaIdHash[file.id];

        switch(type){
            case Config.mediaTypes.image:
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaThumbFilePath]=path;
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaThumbFilename]=file.name;
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaFilename]=file.name;
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaFilepath]=path;
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaMemo]="";
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaTitle]="";

                break;
            default:
                /*$scope.uploadProject.medias[mediaId][Config.mediaObj.mediaThumbFilePath]=path;
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaThumbFilename]=file.name;*/
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaFilename]=file.name;
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaFilepath]=path;
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaMemo]="";
                $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaTitle]="";

                break;
        }

        $scope.$apply();
    }

    CFunctions.drag();
    var fileIdToMediaIdHash={};

    $scope.uploadProject={
        currentEditMediaId:"",
        thumb:Config.thumbs.defaultThumb,
        tags:[],
        medias:{}
    };

    $scope.mediaMenuActive=Config.classNames.mediaMenuActive;
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


    $scope.keyDownAddTag=function($event,tag){
        if($event.which==13){
            addTag(tag);
        }
    };
    $scope.blurAddTag=function(tag){
        addTag(tag);
    };

    $scope.createThumbUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multiSelection:false,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxImageSize,
            fileAddCb:null,
            progressCb:null,
            filter:Config.mediaFilters.imageFilter,
            uploadedCb:function(file,info){
                var res = JSON.parse(info);
                $scope.uploadProject.thumb = Config.qNBucketDomain + res.key; //获取上传成功后的文件的Url
                //console.log($scope.uploadProject.thumb);
                $scope.$apply();
            }
        });
    };

    $scope.showMediaMenu=function(){
        $scope.mediaMenuActive=Config.classNames.mediaMenuActive;
    };
    $scope.hideMediaMenu=function(){
        $scope.mediaMenuActive="";
    };
    $scope.deleteMedia=function(mediaId){
        if(confirm("确定删除此媒体文件吗？")){
            $scope.uploadProject.medias[mediaId]=undefined;
            delete $scope.uploadProject.medias[mediaId];
        }
    };

    $scope.createImageUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multiSelection:true,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxImageSize,
            filter:Config.mediaFilters.imageFilter,
            fileAddCb:function(up,files){
                fileAddedCb(files,Config.mediaTypes.image);
            },
            progressCb:progressCb,
            uploadedCb:function(file,info){
                fileUploadedCb(file,info,Config.mediaTypes.image);
            }
        });
    };

    $scope.createFileUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multiSelection:false,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxMediaSize,
            filter:Config.mediaFilters.zipFiler,
            fileAddCb:function(up,files){
                fileAddedCb(files,Config.mediaTypes.zip);
            },
            progressCb:progressCb,
            uploadedCb:function(file,info){
                fileUploadedCb(file,info,Config.mediaTypes.zip);
            }

        });
    };
    $scope.createPptUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multiSelection:false,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxMediaSize,
            filter:Config.mediaFilters.pptFilter,
            fileAddCb:function(up,files){
                fileAddedCb(files,Config.mediaTypes.ppt);
            },
            progressCb:progressCb,
            uploadedCb:function(file,info){
                fileUploadedCb(file,info,Config.mediaTypes.ppt);
            }
        });
    };
    $scope.createVideoUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multiSelection:true,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxMediaSize,
            filter:Config.mediaFilters.mp4Filter,
            fileAddCb:function(up,files){
                fileAddedCb(files,Config.mediaTypes.mp4);
            },
            progressCb:progressCb,
            uploadedCb:function(file,info){
                fileUploadedCb(file,info,Config.mediaTypes.mp4);
            }
        });
    };
    $scope.createFlashUploader=function(id,containerId){
        CFunctions.createUploader({
            browseButton:id,
            multiSelection:true,
            container:containerId,
            multipartParams:null,
            maxSize:Config.uploadSize.maxMediaSize,
            filter:Config.mediaFilters.swfFilter,
            fileAddCb:function(up,files){
                fileAddedCb(files,Config.mediaTypes.swf);
            },
            progressCb:progressCb,
            uploadedCb:function(file,info){
                fileUploadedCb(file,info,Config.mediaTypes.swf);
            }
        });
    }

}]);




