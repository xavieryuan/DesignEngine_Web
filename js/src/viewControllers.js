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
var viewControllers=angular.module("viewControllers",["services","toaster","directives","ngTable"]);

viewControllers.controller("projects",['$scope',"$interval","Config","Storage","Project","CFunctions",function($scope,$interval,Config,Storage,Project,CFunctions){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.mainFlags.currentMenu=Config.mainMenu.project;
    $scope.mainFlags.extMenuActive=false;


    Storage.clearScrollData(Config.scrollScreenType.project);


    $scope.projects=[];
    Project.getProjects().$promise.then(function(data){
        //console.log("In views");
        var count= 0,length=data.artifacts.length;
        var inter=$interval(function(){
            if(count<length){
                $scope.projects.push(data.artifacts[count]);
                count++;
            }else{
                $interval.cancel(inter);
            }
        },200);
    });
}]);

viewControllers.controller("projectDetail",["$scope","$window","Storage","Config","CFunctions","Project","Comment","toaster",
    function($scope,$window,Storage,Config,CFunctions,Project,Comment,toaster){

        function loadMore(){
            var count=Config.perLoadCount;
            if($scope.commentObj.allComments.length<Config.perLoadCount){
                count=$scope.commentObj.allComments.length;
            }

            $scope.commentObj.showComments=
                $scope.commentObj.showComments.concat($scope.commentObj.allComments.splice(0,count));

            //判断是否还有
            if($scope.commentObj.allComments.length==0){
                $scope.commentObj.hasMore=false;
            }

        }

        var projectId=CFunctions.getPathParam();
        //console.log(projectId);

        $scope.mainFlags.extMenuActive=false;
        $scope.mainFlags.showProjectDetailFlag=true;
        $scope.mainFlags.showMainWrapper=false;

        $scope.hideProjectDetail=function(){
            CFunctions.hideProjectDetail(function(){
                //重置de_project_detail位置到页面顶端

                $scope.closeProjectDetailPanel();

                history.back();
            });
        };

        $scope.project={};
        Project.resource.getProjectDetail({id:projectId},function(data){
            $scope.project=data.artifact;
            $scope.project.boxId=data.artifact.topic_id||data.user.id;
            $scope.project.praised=data.praised;
            $scope.project.user=data.user;
        });

        /*$scope.attachments=[];
        Project.resource.getProjectAttachments({id:projectId},function(data){
            $scope.attachments=data.attachments;
        });*/

        $scope.commentObj={
            newComment:"",
            allComments:[],
            showComments:[],
            hasMore:true
        };
        Comment.getCommentsByProject({projectId:projectId},function(data){
            $scope.commentObj.allComments=data.comments;
            loadMore();
        });

        $scope.loadMoreComments=function(){
            loadMore();
        };
        $scope.addComment=function(content){

            Comment.add({content:content},function(data){
                $scope.commentObj.showComments.unshift({
                    comment:{
                        id:data.id,
                        content:content,
                        commented_at:CFunctions.formatDate()
                    },
                    user:{
                        id:Storage.currentUser.id,
                        fullname:Storage.currentUser.name,
                        setting:{
                            profile_image:Storage.currentUser.profile
                        }
                    }
                });

                $scope.commentObj.newComment="";
            });
        };
        $scope.deleteComment=function(id,index){
            Comment.delete({id:id},function(data){
                $scope.commentObj.showComments.splice(index,1);
                toaster.pop('success',Config.messages.successTitle,Config.messages.operationSuccess,null,null);
            });
        };

        $scope.similarProjects=[];
        Project.resource.getSimilarProjects({id:projectId},function(data){
            $scope.similarProjects=data.artifacts;
        });

        $scope.deleteProject=function(id){
            Project.resource.delete({id:id},function(data){
                toaster.pop('success',Config.messages.successTitle,Config.messages.operationSuccess,null,null);
            });
        };

        $scope.toggleShowProject=function(id,showFlag){
            Project.resource.delete({id:id,show:showFlag},function(data){
                $scope.project.show=showFlag;
                toaster.pop('success',Config.messages.successTitle,Config.messages.operationSuccess,null,null);
            });
        };
}]);

viewControllers.controller("projectUpdate",["$scope","$routeParams","$http","$route","toaster","Config","Storage","CFunctions","Project",
    function($scope,$routeParams,$http,$route,toaster,Config,Storage,CFunctions,Project){

        function addTag(tag){
            if($scope.project.terms.indexOf(tag)===-1){
                $scope.project.terms.push(tag);
            }

            $scope.project.newTag="";
        }
        function fileAddedCb(files,type){
            var fileLength=files.length;
            var random="";
            for (var i = 0; i < fileLength; i++) {
                random=CFunctions.getRandom(Config.mediaIdPrefixes.image);
                $scope.project.medias[random]={};
                $scope.project.medias[random][Config.mediaObj.mediaThumbFilePath]=Config.thumbs.smallThumb;
                $scope.project.medias[random][Config.mediaObj.mediaFilename]="0%";
                $scope.project.medias[random][Config.mediaObj.mediaType]=type;

                fileIdToMediaIdHash[files[i]["id"]]=random;


            }
            $scope.mediaMenuActive=false;
            $scope.$apply();
        }
        function progressCb(up,file){
            $scope.project.medias[fileIdToMediaIdHash[file.id]][Config.mediaObj.mediaFilename]=file.percent+"%";
            $scope.$apply();
        }
        function fileUploadedCb(file,info,type){
            var res = JSON.parse(info);
            var path = Config.qNBucketDomain + res.key; //获取上传成功后的文件的Url
            var mediaId=fileIdToMediaIdHash[file.id];

            switch(type){
                case Config.mediaTypes.image:
                    $scope.project.medias[mediaId][Config.mediaObj.mediaThumbFilePath]=path;
                    $scope.project.medias[mediaId][Config.mediaObj.mediaFilename]=file.name;
                    $scope.project.medias[mediaId][Config.mediaObj.mediaFilePath]=path;
                    $scope.project.medias[mediaId][Config.mediaObj.mediaMemo]="";
                    $scope.project.medias[mediaId][Config.mediaObj.mediaTitle]="";

                    break;
                default:
                    $scope.project.medias[mediaId][Config.mediaObj.mediaFilename]=file.name;
                    $scope.project.medias[mediaId]["noThumb"]=true;
                    $scope.project.medias[mediaId][Config.mediaObj.mediaFilePath]=path;
                    $scope.project.medias[mediaId][Config.mediaObj.mediaMemo]="";
                    $scope.project.medias[mediaId][Config.mediaObj.mediaTitle]="";

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
                case Config.mediaTypes.swf:
                    filter=Config.mediaFilters.swf;
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

        function initProjectData(Id){
            Project.get({id:Id},function(data){

            },function(data){
                CFunctions.ajaxErrorHandler();
            });
        }

        function initBoxData(Id){

        }

        var fileIdToMediaIdHash={};

        $scope.project={
            id:0,
            profile_image:Config.thumbs.defaultThumb,
            medias:{},
            terms:[],
            assets:[],
            user_id:Storage.currentUser.id,
            user_profile_image:Storage.currentUser.profile,
            user_fullname:Storage.currentUser.name,
            name:"",
            description:""
        };
        $scope.box={
            id:0,
            name:""
        };

        $scope.box.id=$routeParams.boxId;
        initBoxData($scope.box.id);


        $scope.currentEditMediaId=0;
        $scope.mediaSetPanelUrl="";
        $scope.currentMediaType="";
        $scope.mediaSetTitle=Config.messages.clickToSet;
        $scope.uploadMediaMenuActive=false;
        $scope.currentTab=1;
        $scope.mainFlags.extMenuActive=false;

        Storage.clearScrollData();

        if($routeParams.projectId){
            initProjectData($routeParams.projectId);
        }


        $scope.getPreviewMedias=function(mediaClass,attr){

            //每次都重新获取
            $scope.project.assets=[];
            var mediaItems=document.getElementsByClassName(mediaClass);
            var length=mediaItems.length;
            var mediaId="";
            for(var i=0;i<length;i++){

                //console.log(mediaItems[i].getAttribute('data-media-id'));
                mediaId=mediaItems[i].getAttribute(attr);
                $scope.project.medias[mediaId][Config.mediaObj.mediaPos]=i+1;
                $scope.project.assets.push($scope.project.medias[mediaId]);

            }
        };

        $scope.setTabActive=function(index){

            //判断是否数据都填写完整,才能执行界面转换
            if(index>1){
                if(!$scope.project.name||$scope.project.terms.length==0||
                    $scope.project.profile_image==Config.thumbs.defaultThumb||!$scope.project.description){

                    toaster.pop('error',Config.messages.errorTitle,Config.messages.stepOneUnComplete,null,null);
                    return false;
                }
            }else if(index==3){
                var noMedia=false,someMediaHasNoThumb=false,hasUnCompleteMedia=false;

                //判断媒体文件是否上传完整
                if(angular.equals({},$scope.project.medias)){
                    noMedia=true;
                }else{
                    var cObj=null;
                    for(var obj in $scope.project.medias){
                        cObj=  $scope.project.medias[obj];
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
                $scope.project.medias[$scope.currentEditMediaId]["active"]=undefined;
                delete $scope.project.medias[$scope.currentEditMediaId]["active"];
                $scope.currentEditMediaId=0;
                $scope.currentMediaType="";
                $scope.mediaSetTitle=Config.messages.clickToSet;
                $scope.mediaSetPanelUrl="";
            }

            //设置状态
            $scope.currentTab=index;

        };

        $scope.deleteTag=function(index){
            $scope.project.terms.splice(index,1);
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
                            $scope.project.profile_image = src;
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
            $scope.uploadMediaMenuActive=true;
        };
        $scope.hideMediaMenu=function(){
            $scope.uploadMediaMenuActive=false;
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
        $scope.createSwfUploader=function(buttonId,containerId){
            createMediaUploader(buttonId,containerId,Config.mediaTypes.swf);
        };
        $scope.deleteMedia=function(mediaId){
            if(confirm(Config.messages.deleteConfirm)){
                $scope.project.medias[mediaId]=undefined;
                delete $scope.project.medias[mediaId];

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
                $scope.project.medias[$scope.currentEditMediaId]["active"]=undefined;
                delete  $scope.project.medias[$scope.currentEditMediaId]["active"];
            }

            $scope.currentEditMediaId=mediaId;
            $scope.currentMediaType=$scope.project.medias[mediaId][Config.mediaObj.mediaType];

            //由于共用了一个页面，如果地址不改变，页面不会重新加载
            $scope.mediaSetPanelUrl=Config.mediaSetPanelUrl+"?"+new Date().getTime();
            $scope.mediaSetTitle=Config.mediaTitles[mediaType];
            $scope.currentThumbSrc=$scope.project.medias[mediaId][Config.mediaObj.mediaThumbFilePath];
            $scope.currentFilename=$scope.project.medias[mediaId][Config.mediaObj.mediaFilename];
            $scope.project.medias[mediaId]["active"]=true;
        };

        $scope.setMediaTitle=function(title){
            $scope.project.medias[$scope.currentEditMediaId][Config.mediaObj.mediaTitle]=title;
        };
        $scope.setMediaMemo=function(memo){
            $scope.project.medias[$scope.currentEditMediaId][Config.mediaObj.mediaMemo]=memo;
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
                    $scope.project.medias[$scope.currentEditMediaId][Config.mediaObj.mediaThumbFilePath] =path;
                    $scope.project.medias[$scope.currentEditMediaId]["noThumb"]=undefined;
                    delete $scope.project.medias[$scope.currentEditMediaId]["noThumb"];
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
                case Config.mediaTypes.swf:
                    filter=Config.mediaFilters.swf;
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
                    $scope.project.medias[$scope.currentEditMediaId][Config.mediaObj.mediaFilename] =file.name;
                    $scope.project.medias[$scope.currentEditMediaId][Config.mediaObj.mediaFilePath] =path;

                    $scope.$apply();
                }
            });
        };

        $scope.uploadFormSubmit=function(){

        }
    }]);

viewControllers.controller("projectsManage",['$scope',"ngTableParams","Project","CFunctions",
    function($scope,ngTableParams,Project,CFunctions){

        $scope.tableParams= new ngTableParams({
            count:3,
            page:1,
            sorting: {
                name: 'asc'     // initial sorting
            },
            filter:{
                name:"ty",
                age:"13"
            }
        },{
            total:0,
            getData:function($defer,params){
                Project.query(params.url(), function(data) {

                    // update table params
                    params.total(data.total);

                    // set new data
                    $defer.resolve(data.result);
                },function(data){
                    CFunctions.ajaxErrorHandler();
                });
            }
        });

    }]);

viewControllers.controller("commentsManage",['$scope',"toaster","ngTableParams","Comment","CFunctions","Config",
    function($scope,toaster,ngTableParams,Comment,CFunctions,Config){
        $scope.mainFlags.currentMenu="";


        $scope.searchType="";
        $scope.searchContent="";

        $scope.mainFlags.extMenuActive=false;

        $scope.table= new ngTableParams({
            count:Config.perLoadCount,
            page:1,
            sorting: {
                name: 'asc'     // initial sorting
            },
            filter:{
                type:$scope.searchType,
                content:$scope.searchContent
            }
        },{
            total:0,
            getData:function($defer,params){
                Comment.query(params.url(), function(data) {
                    if(data.success){
                        // update table params
                        params.total(data.total);

                        // set new data
                        $defer.resolve(data.result);
                    }else{
                        CFunctions.ajaxReturnErrorHandler(data);
                    }
                },function(data){
                    CFunctions.ajaxErrorHandler();
                });
            }
        });

        $scope.tableSearch=function(){
            $scope.table.page(1);

            $scope.table.filter({
                type:$scope.searchType,
                content:$scope.searchContent
            });

            //$scope.table.reload();//这个函数不会动态更改filter
        }

    }]);

viewControllers.controller("boxes",['$scope',"$interval","Config","Storage","Box",function($scope,$interval,Config,Storage,Box){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.mainFlags.currentMenu=Config.mainMenu.box;
    $scope.mainFlags.extMenuActive=false;

    Storage.clearScrollData(Config.scrollScreenType.box);

    $scope.boxes=[];
    Box.getBoxes().$promise.then(function(data){
        //$scope.boxes=$scope.boxes.concat(data.topics);
		
		//console.log("In views");
        var count= 0,length=data.topics.length;
        var inter=$interval(function(){
            if(count<length){
                $scope.boxes.push(data.topics[count]);
                count++;
            }else{
                $interval.cancel(inter);
            }
        },200);
		
    });
}]);

viewControllers.controller("boxDetail",['$scope',"$routeParams","Box","Storage","Config",function($scope,$routeParams,Box,Storage,Config){


    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.boxId=$routeParams.boxId;
    $scope.mainFlags.currentMenu="";
    $scope.mainFlags.extMenuActive=false;


    Storage.clearScrollData(Config.scrollScreenType.boxDetail);

    $scope.box={};
    Box.resource.get({id:$scope.boxId},function(data){
        $scope.box=data.topic;
        $scope.box.user=data.user;
        $scope.box.projects=data.artifacts;
    });

    $scope.projects=[];
    Box.getBoxProjects($scope.boxId).$promise.then(function(data){
        $scope.projects=$scope.projects.concat(data.projects);
    });
}]);

viewControllers.controller("boxUpdate",["$scope","$routeParams","toaster","CFunctions","Config","Box",
    function($scope,$routeParams,toaster,CFunctions,Config,Box){
        function addTag(tag){
            if($scope.box.tags.indexOf(tag)===-1){
                $scope.box.tags.push(tag);
            }

            $scope.box.newTag="";
        }

        function initData($scope,Id){
            Box.get({id:id},function(data){
                $scope.box.title=data.title;
                $scope.box.open=data.open;
                $scope.box.tags=data.tags;
            },function(data){
                CFunctions.ajaxErrorHandler();
            });
        }

        $scope.mainFlags.currentMenu="";
        $scope.mainFlags.extMenuActive=false;
        $scope.box={
            id:0,
            tags:[],
            open:true
        };

        //修改的时候需要初始化数据
        if($routeParams.boxId){
            initData($scope,$routeParams.boxId);
        }

        $scope.deleteTag=function(index){
            $scope.box.tags.splice(index,1);
        };

        $scope.deleteBox=function(id){
            if(confirm(Config.messages.deleteConfirm)){

            }
        };

        $scope.keyDownAddTag=function($event,tag){
            if($event.which==13){
                addTag(tag);
            }
        };
        $scope.blurAddTag=function(tag){
            addTag(tag);
        };

        $scope.boxCreateSubmit=function(){
            if($scope.box.title&&$scope.box.description&&$scope.box.tags.length!=0){
                CFunctions.ajaxSubmit($scope,{
                    formUrl:Config.ajaxUrls.signIn,
                    formParam:$scope.box,
                    successCb:function(data){

                        $scope.mainFlags.showBlackOut=false;
                    }
                });
            }else{
                toaster.pop('error',Config.messages.errorTitle,Config.messages.boxUnComplete,null,null);
                return false;
            }
        };
}]);

viewControllers.controller("boxesManage",['$scope',"ngTableParams","Box","CFunctions",
    function($scope,ngTableParams,Box,CFunctions){

        $scope.tableParams= new ngTableParams({
            count:3,
            page:1,
            sorting: {
                name: 'asc'     // initial sorting
            },
            filter:{
                name:"ty",
                age:"13"
            }
        },{
            total:0,
            getData:function($defer,params){
                Box.query(params.url(), function(data) {

                    // update table params
                    params.total(data.total);

                    // set new data
                    $defer.resolve(data.result);
                },function(data){
                    CFunctions.ajaxErrorHandler();
                });
            }
        });

    }]);

viewControllers.controller("userHome",['$scope',function($scope){

    //覆盖了super里面的，一定要分开写，不然无法覆盖（这样可以覆盖的原理是因为对象是地址类型）
    $scope.mainFlags.currentMenu="";

    $scope.mainFlags.extMenuActive=false;

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

viewControllers.controller("usersManage",['$scope',"ngTableParams","User","CFunctions",
    function($scope,ngTableParams,User,CFunctions){

        $scope.tableParams= new ngTableParams({
            count:3,
            page:1,
            sorting: {
                name: 'asc'     // initial sorting
            },
            filter:{
                name:"ty",
                age:"13"
            }
        },{
            total:0,
            getData:function($defer,params){
                User.query(params.url(), function(data) {

                    // update table params
                    params.total(data.total);

                    // set new data
                    $defer.resolve(data.result);
                },function(data){
                    CFunctions.ajaxErrorHandler();
                });
            }
        });

    }]);

viewControllers.controller("searchResult",["$scope","$routeParams","Project","Config","Storage",
    function($scope,$routeParams,Project,Config,Storage){
        $scope.searchContent=$routeParams.content;

        $scope.mainFlags.currentMenu="";

        $scope.mainFlags.extMenuActive=false;

        Storage.clearScrollData(Config.scrollScreenType.searchResult,searchContent);

        $scope.closePop(true);

        $scope.projects=[];
        Project.getSearchResult($scope.searchContent).$promise.then(function(data){
            $scope.projects=$scope.projects.concat(data.projects);
        });
}]);







