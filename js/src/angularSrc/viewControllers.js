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
var viewControllers=angular.module("viewControllers",["classes","toaster","directives"]);

viewControllers.controller("projects",['$scope',"Config","Project","CFunctions",function($scope,Config,Project,CFunctions){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.menuStatus.projectsClass=Config.classNames.mainMenuActive;
    $scope.menuStatus.boxesClass="";

    Project.query({"start":10},function(data){
        $scope.projects=data.projects;
    },function(data){
        CFunctions.ajaxErrorHandler();
    });


}]);

viewControllers.controller("boxes",['$scope',"Config",function($scope,Config){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.menuStatus.projectsClass="";
    $scope.menuStatus.boxesClass=Config.classNames.mainMenuActive;

    $scope.boxes=[
        {
            "id":1,
            "honorCount":34,
            "projectCount":55,
            "disabledUpload":false,
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
            "disabledUpload":true,
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

viewControllers.controller("boxDetail",['$scope',function($scope){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.menuStatus.projectsClass="";
    $scope.menuStatus.boxesClass="";

    $scope.box={
        "id":1,
        "honorCount":34,
        "projectCount":55,
        "disabledUpload":true,
        "userProfile":"data/people1.jpg",
        "userName":"涛涛",
        "userId":1,
        "title":"测试数据",
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

viewControllers.controller("boxCreate",["$scope",function($scope){
    function addTag(tag){
        if($scope.box.tags.indexOf(tag)===-1){
            $scope.box.tags.push(tag);
        }

        $scope.box.newTag="";
    }


    $scope.menuStatus.projectsClass="";
    $scope.menuStatus.boxesClass="";

    $scope.box={
        id:0,
        tags:[]
    };

    $scope.deleteTag=function(index){
        $scope.box.tags.splice(index,1);
    };


    $scope.keyDownAddTag=function($event,tag){
        if($event.which==13){
            addTag(tag);
        }
    };
    $scope.blurAddTag=function(tag){
        addTag(tag);
    };
}]);

viewControllers.controller("userHome",['$scope',function($scope){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.menuStatus.projectsClass="";
    $scope.menuStatus.boxesClass="";

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


viewControllers.controller("projectDetail",["$scope","LocationChanger",function($scope,LocationChanger){

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

viewControllers.controller("searchResult",["$scope","LocationChanger",function($scope,LocationChanger){
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

viewControllers.controller("uploadProject",["$scope","$http","$route","toaster","Config","CFunctions",
    function($scope,$http,$route,toaster,Config,CFunctions){

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
                    $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaFilePath]=path;
                    $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaMemo]="";
                    $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaTitle]="";

                    break;
                default:
                    /*$scope.uploadProject.medias[mediaId][Config.mediaObj.mediaThumbFilePath]=path;
                    $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaThumbFilename]=file.name;*/
                    $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaFilename]=file.name;
                    $scope.uploadProject.medias[mediaId]["noThumb"]=true;
                    $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaFilePath]=path;
                    $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaMemo]="";
                    $scope.uploadProject.medias[mediaId][Config.mediaObj.mediaTitle]="";

                    break;
            }

            $scope.$apply();
        }
        function createMediaUploader(buttonId,containerId,type){
            var filter=Config.mediaFilters.image;
            var maxSize=Config.uploadSize.maxMediaSize;
            switch(type){
                case Config.mediaTypes.image:
                    maxSize=Config.uploadSize.maxImageSize;
                    break;
                case Config.mediaTypes.mp4:
                    filter=Config.mediaFilters.mp4;
                    break;
                case Config.mediaTypes.pdf:
                    filter=Config.mediaFilters.pdf;
                    break;
                case Config.mediaTypes.ppt:
                    filter=Config.mediaFilters.ppt;
                    break;
                case Config.mediaTypes.zip:
                    filter=Config.mediaFilters.zip;
                    break;
                case Config.mediaTypes.flash:
                    filter=Config.mediaFilters.flash;
                    break;
            }

            CFunctions.createUploader({
                browseButton:buttonId,
                multiSelection:true,
                container:containerId,
                multipartParams:null,
                maxSize:maxSize,
                filter:filter,
                fileAddCb:function(up,files){
                    fileAddedCb(files,type);
                },
                progressCb:progressCb,
                uploadedCb:function(file,info){
                    fileUploadedCb(file,info,type);
                }
            });
        }

        //CFunctions.drag();


        var fileIdToMediaIdHash={};

        $scope.uploadProject={
            mediaOrders:[],
            thumb:Config.thumbs.defaultThumb,
            tags:[],
            medias:{}
        };

        $scope.currentEditMediaId=0;
        $scope.mediaSetPanelUrl="";
        $scope.currentMediaType="";
        $scope.previewMedias=[];
        $scope.mediaSetTitle=Config.messages.clickToSet;
        $scope.mediaMenuActive=Config.classNames.mediaMenuActive;
        $scope.stepClass=[Config.classNames.uploadStepActive,"",""];
        $scope.stepPanelIndex=0;

        $scope.getPreviewMedias=function(mediaClass,attr){

            //每次都重新获取
            $scope.uploadProject.mediaOrders=[];
            $scope.previewMedias=[];
            var mediaItems=document.getElementsByClassName(mediaClass);
            var length=mediaItems.length;
            var mediaId="";
            for(var i=0;i<length;i++){

                //console.log(mediaItems[i].getAttribute('data-media-id'));
                mediaId=mediaItems[i].getAttribute(attr);
                $scope.uploadProject.mediaOrders.push(mediaId);
                $scope.previewMedias.push($scope.uploadProject.medias[mediaId]);
            }
        };

        $scope.setStepActive=function(index){

            //判断是否数据都填写完整,才能执行界面转换
            if(index>=1){
                if(!$scope.uploadProject.title||$scope.uploadProject.tags.length==0||
                    $scope.uploadProject.thumb==Config.thumbs.defaultThumb||!$scope.uploadProject.description){

                    toaster.pop('error',Config.messages.errorTitle,Config.messages.stepOneUnComplete,null,null);
                    return false;
                }
            }else if(index==2){
                var noMedia=false,someMediaHasNoThumb=false,hasUnCompleteMedia=false;

                //判断媒体文件是否上传完整
                if(angular.equals({},$scope.uploadProject.medias)){
                    noMedia=true;
                }else{
                    var cObj=null;
                    for(var obj in $scope.uploadProject.medias){
                        cObj=  $scope.uploadProject.medias[obj];
                        if(cObj.noThumb){
                            someMediaHasNoThumb=true;
                            break;
                        }else if(cObj[Config.mediaObj.mediaFilename].indexOf("%")!==-1){
                            hasUnCompleteMedia=true;
                            break;
                        }
                    }
                }

                if(noMedia||hasUnCompleteMedia){
                    toaster.pop('error',Config.messages.errorTitle,Config.messages.hasNoMedia,null,null);
                    return false;
                }else if(someMediaHasNoThumb){
                    toaster.pop('error',Config.messages.errorTitle,Config.messages.mediaHasNoThumb,null,null);
                    return false;
                }
            }

            //在点击的时候需要去掉媒体文件的active状态
            if($scope.currentEditMediaId&&index!=2){
                $scope.uploadProject.medias[$scope.currentEditMediaId]["active"]=undefined;
                delete $scope.uploadProject.medias[$scope.currentEditMediaId]["active"];
                $scope.currentEditMediaId=0;
                $scope.currentMediaType="";
                $scope.mediaSetTitle=Config.messages.clickToSet;
                $scope.mediaSetPanelUrl="";
            }

            //设置状态
            for(var i =0;i<3;i++){
                if(index==i){
                    $scope.stepClass[i]=Config.classNames.uploadStepActive;
                    $scope.stepPanelIndex=i;
                }else{
                    $scope.stepClass[i]="";
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

        $scope.createThumbUploader=function(buttonId,containerId){
            CFunctions.createUploader({
                browseButton:buttonId,
                multiSelection:false,
                container:containerId,
                multipartParams:null,
                maxSize:Config.uploadSize.maxImageSize,
                fileAddCb:null,
                progressCb:null,
                filter:Config.mediaFilters.image,
                uploadedCb:function(file,info){
                    var res = JSON.parse(info);
                    var src= Config.qNBucketDomain + res.key; //获取上传成功后的文件的Url

                    //判断是否是1：1
                    $http.get(src+"?imageInfo").success(function(data,status,headers,config,statusText ){
                        //console.log(data);
                        if(data.width===data.height){
                            $scope.uploadProject.thumb = src;
                            //$scope.$apply();
                        }else{
                            toaster.pop('error',Config.messages.errorTitle,Config.messages.imgSizeError,null,null);
                        }

                    }).error(function(data,status,headers,config,statusText){
                            CFunctions.ajaxErrorHandler();
                        });
                }
            });
        };

        $scope.showMediaMenu=function(){
            $scope.mediaMenuActive=Config.classNames.mediaMenuActive;
        };
        $scope.hideMediaMenu=function(){
            $scope.mediaMenuActive="";
        };

        $scope.createImageUploader=function(buttonId,containerId){
            createMediaUploader(buttonId,containerId,Config.mediaTypes.image);
        };

        $scope.createPptUploader=function(buttonId,containerId){
            createMediaUploader(buttonId,containerId,Config.mediaTypes.ppt);
        };

        $scope.createPdfUploader=function(buttonId,containerId){
            createMediaUploader(buttonId,containerId,Config.mediaTypes.pdf);
        };

        $scope.createZipUploader=function(buttonId,containerId){
            createMediaUploader(buttonId,containerId,Config.mediaTypes.zip);
        };

        $scope.createMp4Uploader=function(buttonId,containerId){
            createMediaUploader(buttonId,containerId,Config.mediaTypes.mp4);
        };
        $scope.createFlashUploader=function(buttonId,containerId){
            createMediaUploader(buttonId,containerId,Config.mediaTypes.flash);
        };
        $scope.deleteMedia=function(mediaId){
            if(confirm("确定删除此媒体文件吗？")){
                $scope.uploadProject.medias[mediaId]=undefined;
                delete $scope.uploadProject.medias[mediaId];

                if($scope.currentEditMediaId===mediaId){
                    $scope.currentEditMediaId=0;
                    $scope.mediaSetPanelUrl="";
                    $scope.currentMediaType="";
                    $scope.mediaSetTitle=Config.messages.clickToSet;
                }
            }
        };

        /*****************媒体设置部分********************/
        $scope.showSetPanel=function(mediaId,mediaType){

            //移除原来的元素的活动状态
            if($scope.currentEditMediaId){
                $scope.uploadProject.medias[$scope.currentEditMediaId]["active"]=undefined;
                delete  $scope.uploadProject.medias[$scope.currentEditMediaId]["active"];
            }

            $scope.currentEditMediaId=mediaId;
            $scope.currentMediaType=$scope.uploadProject.medias[mediaId][Config.mediaObj.mediaType];

            //由于共用了一个页面，如果地址不改变，页面不会重新加载
            $scope.mediaSetPanelUrl=Config.mediaSetPanelUrl+"?"+new Date().getTime();
            $scope.mediaSetTitle=Config.mediaTitles[mediaType];
            $scope.currentThumbSrc=$scope.uploadProject.medias[mediaId][Config.mediaObj.mediaThumbFilePath];
            $scope.currentFilename=$scope.uploadProject.medias[mediaId][Config.mediaObj.mediaFilename];
            $scope.uploadProject.medias[mediaId]["active"]=true;
        };

        $scope.setMediaTitle=function(title){
            $scope.uploadProject.medias[$scope.currentEditMediaId][Config.mediaObj.mediaTitle]=title;
        };
        $scope.setMediaMemo=function(memo){
            $scope.uploadProject.medias[$scope.currentEditMediaId][Config.mediaObj.mediaMemo]=memo;
        };

        $scope.mediaSetThumbUploader=function(buttonId,containerId){
            CFunctions.createUploader({
                browseButton:buttonId,
                multiSelection:false,
                container:containerId,
                multipartParams:null,
                maxSize:Config.uploadSize.maxImageSize,
                fileAddCb:null,
                progressCb:null,
                filter:Config.mediaFilters.image,
                uploadedCb:function(file,info){
                    var res = JSON.parse(info);
                    var path=Config.qNBucketDomain + res.key; //获取上传成功后的文件的Url
                    $scope.uploadProject.medias[$scope.currentEditMediaId][Config.mediaObj.mediaThumbFilePath] =path;
                    $scope.uploadProject.medias[$scope.currentEditMediaId]["noThumb"]=undefined;
                    delete $scope.uploadProject.medias[$scope.currentEditMediaId]["noThumb"];
                    $scope.currentThumbSrc=path;

                    $scope.$apply();
                }
            });
        };

        $scope.mediaSetUploader=function(buttonId,containerId){
            var filter="";
            switch($scope.currentMediaType){
                case Config.mediaTypes.mp4:
                    filter=Config.mediaFilters.mp4;
                    break;
                case Config.mediaTypes.ppt:
                    filter=Config.mediaFilters.ppt;
                    break;
                case Config.mediaTypes.pdf:
                    filter=Config.mediaFilters.pdf;
                    break;
                case Config.mediaTypes.zip:
                    filter=Config.mediaFilters.zip;
                    break;
                case Config.mediaTypes.flash:
                    filter=Config.mediaFilters.flash;
                    break;
            }

            CFunctions.createUploader({
                browseButton:buttonId,
                multiSelection:false,
                container:containerId,
                multipartParams:null,
                filter:filter,
                maxSize:Config.uploadSize.maxMediaSize,
                fileAddCb:function(up,files){
                    $scope.currentFilename=files[0].name+"----0%";
                    $scope.$apply();
                },
                progressCb:function(up,file){
                    $scope.currentFilename=file.name+file.percent+"%";
                    $scope.$apply();
                },
                uploadedCb:function(file,info){
                    var res = JSON.parse(info);
                    var path=Config.qNBucketDomain + res.key; //获取上传成功后的文件的Url

                    $scope.currentFilename =file.name;
                    $scope.uploadProject.medias[$scope.currentEditMediaId][Config.mediaObj.mediaFilename] =file.name;
                    $scope.uploadProject.medias[$scope.currentEditMediaId][Config.mediaObj.mediaFilePath] =path;

                    $scope.$apply();
                }
            });
        };
}]);




