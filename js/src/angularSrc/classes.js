/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-23
 * Time: 下午3:38
 * To change this template use File | Settings | File Templates.
 */
var classes=angular.module("classes",["ngResource","toaster"]);

classes.service("Config",["$rootScope",function($rootScope){
    this.thumbs={
        defaultThumb:"images/app/default_thumb_500.png",
        smallThumb:"images/app/default_small_thumb.png"
    };
    this.perLoadCount=10;//作品、评论、资源等每次加载的个数
    this.hasNoMoreFlag=-1;//作品、评论、资源等没有更多的标志,当没有更多的时候将其的loadId设置为-1
    this.qNUploadDomain='http://qiniu-plupload.qiniudn.com/';
    this.qNBucketDomain="http://id-channel-1.qiniudn.com/";
    this.classNames={
        mainMenuActive:"active",
        extMenuActive:"de_ext_nav_active",
        uploadStepActive:"current",
        mediaMenuActive:"zy_add_media_menu_active"
    };
    this.titles={
        "signIn":"登陆",
        "signUp":"注册",
        "forgetPwd":"忘记密码",
        "editPwd":"修改密码",
        "editInfo":"修改资料",
        "search":"探索"
    };
    this.templateUrls={
        "signIn":"views/signIn.html",
        "signUp":"views/signUp.html",
        "forgetPwd":"views/forgetPwd.html",
        "editPwd":"views/changePwd.html",
        "editInfo":"views/editInfo.html",
        "search":"views/searchPanel.html",
        "projectDetail":"views/projectDetail.html"
    };
    this.urls={  //用到的路径
        "projects":"/project",
        "boxes":"/boxes",
        "boxDetail":"/box/:boxId",
        "home":"/",
        "projectDetail":"/project/:projectId",
        "projectDetailReg":/\/project\/\d*/,
        "signIn":"/login",
        "signUp":"/register",
        "editPwd":"change/password",
        "editInfo":"change/info",
        "userHome":"/user/{userId}",
        "search":"/search",
        "searchResult":"/search/{content}",
        "forgetPwd":"/forgetPassword"
    };
    this.imageScale={
        ThumbSmall:"-200x200",
        previewSmall:"-400x300"
    };
    this.uploadSize={
        maxMediaSize:"300m", //最大的媒体文件上传大小
        maxImageSize:"2m"//最大的图片文件上传大小
    };
    this.mediaFilters={  //媒体类型格式刷选器
        image:"jpg,gif,png,jpeg",
        ppt:"pptx",
        pdf:"pdf",
        mp4:"mp4",
        _3d:"3d",
        zip:"zip",
        flash:"swf"
    };
    this.mediaTypes={  //媒体类型
        image:"image",
        ppt:"ppt",
        pdf:"pdf",
        _3d:"_3d",
        mp4:"mp4",
        zip:"zip",
        webVideo:"webVideo",
        flash:"swf"
    };
    this.mediaTitles={
        image:"图片",
        ppt:"ppt文件",
        pdf:"pdf文件",
        _3d:"3d文件",
        mp4:"视频",
        zip:"压缩文件",
        webVideo:"网络视频",
        flash:"swf动画"
    };
    this.mediaSetPanelUrl="views/mediaSet.html";
    this.mediaIdPrefixes={
        image:"img_",
        ppt:"ppt_",
        pdf:"pdf_",
        _3d:"3d_",
        mp4:"mp4_",
        zip:"zip_",
        webVideo:"networkVideo_",
        swf:"swf_"
    };
    this.mediaObj={  //媒体对象
        mediaTitle:"mediaTitle",
        mediaMemo:"mediaMemo",
        mediaType:"mediaType",
        mediaThumbFilename:"mediaThumbFilename",
        mediaThumbFilePath:"mediaThumbFilePath",
        mediaFilename:"mediaFilename",
        mediaFilePath:"mediaFilePath"
    };
    this.userStatus={   //用户状态（禁言、激活）
        enabled:"enabled",
        disabled:"disabled"
    };
    this.emailStatus={
        pending:"pending",
        invalid:"invalid",
        actively:"actively"
    };
    this.scrollScreenType={ //当前在哪个页面滚动
        project:"project",
        boxes:"boxes",
        search:"search",
        boxDetail:"boxDetail",
        userDetail:"userDetail" //用户页的用户作品,
    };
    this.validError={
        required:"请输入此字段！",
        email:"请输入正确的邮箱格式！",
        emailExist:"邮箱已经存在！",
        maxLength:"此字段最多输入${value}个字！",
        minLength:"此字段最少输入${value}个字！",
        pwdEqualError:"两次输入的密码不一致，请重新输入！",
        usernameRequired:"请输入用户名！",
        usernameExist:"用户名已经被注册，请填写其他用户名！",
        validCodeRequired:"请输入验证码！",
        descriptionLengthError:"最多输入140个字！"
    };
    this.messages={  //错误提示
        errorTitle:"错误提示",
        clickToSet:"点击上传完成的媒体文件进行设置！",
        deleteConfirm:"确定删除吗？",
        successTitle:"成功提示",
        operationSuccess:"操作成功，请关闭后选择其他操作！",
        registerSuccess:"注册成功，如果您是非QQ登录用户，请进入邮箱激活账户，否则无法登录！",
        timeout:"登录超时，请关闭后刷新页面并登录！",
        networkError:"网络连接失败，请稍后重试！",
        validCodeError:"验证码错误！",
        operationError:"操作失败，请稍后重试！",
        imgSizeError:"图片不是1:1比例！",
        loadDataError:"请求数据失败！",
        filenameError:"文件名必须是数字下划线汉字字母,且不能以下划线开头！",
        nameOrPwdError:"用户名或者密码错误！",
        emailNotConfirm:"请登录邮箱进行激活！",
        notFound:"页面资源未发现，2秒后跳转到首页！",
        changePwdSuccess:"密码修改成功，2秒后跳转到首页并退出！",
        emailNotExist:"输入的邮箱不存在！",
        emailSendSuccess:"操作成功，请进入邮箱查看邮件！",
        emailChangeSuccess:"绑定成功，请进入邮箱确认！",
        mediaHasNoThumb:"有媒体文件没有上传缩略图，请上传后再预览！",
        hasNoMedia:"没有上传媒体文件或者有上传错误的媒体文件，请上传或者删除后再预览！",
        boxUnComplete:"标题、标签、描述等没有填写完整",
        stepOneUnComplete:"标题、标签、描述、缩略图等没有填写完整！",
        pptHasNotUploaded:"此资源还没有被上传到资源服务器，暂时不能查看！",
        pptUploadError:"此资源上传到资源服务器出错，无法查看！",
        uploadSizeError:"最大文件大小",
        uploadExtensionError:"只允许上传",
        uploadIOError:"上传插件异常，请刷新后重试！",
        emailPending:"你的新邮箱${email}没有激活，请进入邮箱激活！",
        emailInvalid:"你提交的新邮箱${email},已被其他人激活，如需修改邮箱，请提交另外一个邮箱！"
    };
    this.errorCode={
        captchaUnMatch:"captcha_unmatches",
        accountUpdateFail:"account_update_fail",
        emailNotConfirm:"email_not_confirm",
        accountRequired:"account_required",
        accountFullNameRequired:"account_fullname_required",
        authenticationError:"authentication_error",
        uploadException:"upload_exception",
        timeout:"timeout",
        thumbHeightNotEqualsWidth:"thumb_height_not_equals_width",
        notFound:"not_found"
    };
    this.ajaxUrls={
        signIn:"#",
        upload:"http://localhost/idchannel/chinese/wp-admin/admin-ajax.php?action=getUploadToken",
        getAllProjects:"data/projects.json", //获取首页作品媒体文件)
        getProjectDetail:"post/info/:id", //获取作品（资源）详情
        deleteProject:"post/remove/:id",
        getSimilarProjects:"post/similar",
        getAllComments:"data/commentsManage.json"
    };
    this.roles={   //角色
        admin:"admin",
        user:"user",
        vip:"vip"
    };
}]);

classes.service("Storage",function(){
    this.currentProjectLoadedDate=0; //分页加载，最后一个作品的时间，-1代表没有更多
    this.scrollTimer=null;
    this.currentScrollScreenType="";

    this.currentUser={  //当前登录的用户信息
        id:0,
        name:"",
        figure:"",
        role:"",
        description:"",
        email:"",
        status:""
    };
    this.clearCurrentUser=function(){
        this.currentUser.id=0;
        this.currentUser.name="";
        this.currentUser.profile="";
        this.currentUser.role="";
        this.currentUser.email="";
        this.currentUser.description="";
        this.currentUser.status="";
    };
    this.initCurrentUser=function(data){
        this.currentUser.id=data.userId?data.userId:this.currentUser.userId;
        this.currentUser.profile=data.profile?data.profile:this.currentUser.profile;
        this.currentUser.role=data.role?data.role:this.currentUser.role;
        this.currentUser.name=data.name?data.name:this.currentUser.name;
        this.currentUser.email=data.email?data.email:this.currentUser.email;
        this.currentUser.description=typeof data.description!=="undefined"?data.description:this.currentUser.description;
        this.currentUser.status=data.status?data.status:this.currentUser.status;
    };
});

classes.service("CFunctions",["$rootScope","$http","toaster","Config",function($rootScope,$http,toaster,Config){

    var postCfg={
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        transformRequest:this.transform
    };

    /**
     * 序列化参数
     * @param obj
     * @returns {string}
     */
    function param(obj){
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    }

    /**
     * 发送post请求时的数据处理操作
     * @param data
     * @returns {string}
     */
    function transform(data){
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }

    /**
     * 提交表单
     * @param {Object} $scope
     * @param {Object} params 对象属性formUrl:"表单提交地址",formParam:"表单数据对象",successCb:"提交成功后回调函数"
     */
    this.ajaxSubmit=function($scope,params){
        var me=this;
        $scope.mainFlags.showBlackOut=true;
        $http.post(params.formUrl,params.formParam).
            success(function(data, status, headers, config){
                $scope.mainFlags.showBlackOut=false;
                params.successCb(data);
            }).error(function(data, status, headers, config){
                $scope.mainFlags.showBlackOut=false;
                me.ajaxReturnErrorHandler(data);
            });

        /*$http.post(param.formUrl,param.formParam,postCfg). success(param.successCb).
             error(function(data, status, headers, config){
                console.log(data);
             });*/
    };

    this.setMenuStatus=function(){
        var path=location.href;
        var menuStatus={};

        switch(path){
            case Config.urls.home:
                menuStatus={
                    "projectsClass":Config.classNames.mainMenuActive,
                    "boxesClass":""
                };
                break;
            case Config.urls.projects:
                menuStatus={
                    "projectsClass":Config.classNames.mainMenuActive,
                    "boxesClass":""
                };
                break;
            case Config.urls.boxes:
                menuStatus={
                    "projectsClass":"",
                    "boxesClass":Config.classNames.mainMenuActive
                };
                break;
            default:
                menuStatus={
                    "projectsClass":"",
                    "boxesClass":""
                };
                break;
        }

        return menuStatus;
    };

    this.ajaxReturnErrorHandler=function(data){
        if(data.errorCode||data.resultCode){
            if(data.errorCode==config.errorCode.notFound){
                DE.UIManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.notFound);
                setTimeout(function(){
                    window.location.href=document.baseURI||$("#de_base_url").attr("href");
                },2000);
            }else if(data.errorCode==config.errorCode.timeout){
                DE.UIManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.timeout);
            }else if(data.errorCode==config.errorCode.thumb_height_not_equals_width){
                DE.UIManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.imgSizeError);
            }else{
                DE.UIManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.operationError);
            }

        }else{
            DE.UIManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.loadDataError);
        }

        DE.UIManager.hideLoading();
    };

    this.ajaxErrorHandler=function(){
        toaster.pop('error',Config.messages.errorTitle,Config.messages.networkError,null,null);
    };

    this.checkMobile=function(){
        var userAgentList = new Array("2.0 MMP", "240320", "AvantGo","BlackBerry", "Blazer",
            "Cellphone", "Danger", "DoCoMo", "Elaine/3.0", "EudoraWeb", "hiptop", "IEMobile", "KYOCERA/WX310K", "LG/U990",
            "MIDP-2.0", "MMEF20", "MOT-V", "NetFront", "Newt", "Nintendo Wii", "Nitro", "Nokia",
            "Opera Mini", "Opera Mobi",
            "Palm", "Playstation Portable", "portalmmm", "Proxinet", "ProxiNet",
            "SHARP-TQ-GX10", "Small", "SonyEricsson", "Symbian OS", "SymbianOS", "TS21i-10", "UP.Browser", "UP.Link",
            "Windows CE", "WinWAP", "Android", "iPhone", "iPod", "iPad", "Windows Phone", "HTC"/*, "GTB"*/);
        var appNameList = new Array("Microsoft Pocket Internet Explorer");

        var userAgent = navigator.userAgent.toString();
        var appName = navigator.appName.toString();
        var agentLength=userAgentList.length,appLength=appNameList.length;
        var i= 0,j=0;

        for (; i<agentLength; i++) {
            if (userAgent.indexOf(userAgentList[i]) >= 0) {
                return true;
            }
        }

        for (; j<appLength; j++) {
            if (appName.indexOf(appNameList[j]) >= 0) {
                return true;
            }
        }

        return false;
    };

    this.getRandom=function(){
        var date = new Date();
        var mo = (date.getMonth() + 1) < 10 ? ('0' + '' + (date.getMonth() + 1)) : date.getMonth() + 1;
        var dd = date.getDate() < 10 ? ('0' + '' + date.getDate()) : date.getDate();
        var hh = date.getHours() < 10 ? ('0' + '' + date.getHours()) : date.getHours();
        var mi = date.getMinutes() < 10 ? ('0' + '' + date.getMinutes()) : date.getMinutes();
        var ss = date.getSeconds() < 10 ? ('0' + '' + date.getSeconds()) : date.getSeconds();
        var retValue = date.getFullYear() + '' + mo + '' + dd + '' + hh + '' + mi + '' + ss + '';
        for (var j = 0; j < 4; j++) {
            retValue += '' + parseInt(10 * Math.random()) + '';
        }
        if (arguments.length == 1) {
            return arguments[0] + '' + retValue;
        }else{
            return retValue;
        }
    };

    this.drag=function(){
        var targetOl = document.getElementById("mediaList");//容器元素
        var eleDrag = null;//被拖动的元素

        targetOl.onselectstart=function(event){
            if(event.target.className.match("mediaItem")!==null){

                event.preventDefault();
                event.stopPropagation();
            }
        };
        targetOl.ondragstart=function(event){
            if(event.target.className.match("mediaItem")!==null){
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text","移动中");
                eleDrag = event.target||event.srcElement;

                return true;
            }
        };
        targetOl.ondragend=function(event){
            if(event.target.className.match("mediaItem")!==null){
                eleDrag=null;

                event.preventDefault();
                event.stopPropagation();
            }
        };

        //在元素中滑过
        targetOl.ondragover = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };

        targetOl.ondrop=function(event){

            event.preventDefault();
            event.stopPropagation();
        };

        //ol作为最大的容器也要处理拖拽事件，当在li上滑动的时候放到li的前面，当在ol上滑动的时候放到ol的最后面
        targetOl.ondragenter = function (event) {
            var target=event.toElement||event.target;
            var targetParent=target.parentNode;
            if (target == targetOl) {
                targetOl.appendChild(eleDrag);
            }else{
                if(target.tagName=="LI"){
                    targetOl.insertBefore(eleDrag, target);
                }else{
                    targetOl.insertBefore(eleDrag, targetParent);
                }
            }

            event.preventDefault();
            event.stopPropagation();
        };
    };

    this.createUploader=function(param){
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',    //上传模式,依次退化
            browse_button: param.browseButton,       //上传选择的点选按钮，**必需**
            uptoken_url:  Config.ajaxUrls.upload,
            multi_selection:param.multiSelection,
            domain: Config.qNUploadDomain,
            container: param.container,           //上传区域DOM ID，默认是browser_button的父元素，
            filters: {
                mime_types : [
                    { title : "media files", extensions : param.filter }
                ]
                //max_file_size:'1m'
            },
            multipart_params:param.multipartParams,
            max_file_size: param.maxSize,           //最大文件体积限制,qiniu中需要写在这里，而不是卸载filters中
            flash_swf_url: '../lib/Moxie.swf',  //引入flash,相对路径
            max_retries: 3,                   //上传失败最大重试次数
            chunk_size: '4mb',                //分块上传时，每片的体积
            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            init: {
                'Init':function(up,info){
                    //console.log(up.getOption("max_file_size"));
                },
                'FilesAdded': function(up, files) {
                    if(typeof param.fileAddCb==="function"){
                        param.fileAddCb(up,files);
                    }
                },
                'UploadProgress': function(up, file) {
                    if(typeof param.progressCb==="function"){
                        param.progressCb(up,file);
                    }
                },
                'FileUploaded': function(up, file, info) {
                    if(typeof param.uploadedCb==="function"){
                        param.uploadedCb(file,info);
                    }
                },
                'Error': function(up, err, errTip) {
                    toaster.pop('error',Config.messages.errorTitle,errTip,null,null);

                    //由于qiniu处理了错误信息，在这里要调用$apply来通知view改变状态
                    $rootScope.$apply();

                    up.refresh();
                },
                'Key': function(up, file) {

                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    var random=Math.floor(Math.random()*10+1)*(new Date().getTime());
                    var key=random+"-"+file.name;


                    // do something with key here
                    return key
                }
            }
        });

        return uploader;
    };
    this.getPathId=function(){
        var path=window.location.href;
        var pos=path.lastIndexOf("/");
        return path.substring(pos+1);
    };

    this.hideProjectDetail=function($scope,goBack){
        var target=$(".de_animation_project_detail");
        var header=target.find(".de_project_header");
        var detail=target.find(".de_project_detail");
        TweenMax.to(header,0.3,{y:-100});
        TweenMax.to(detail,0.3,{y:100});
        TweenMax.to(target,0.4,{opacity:0,onComplete:function(){
			//重置de_project_detail位置到页面顶端
			window.scrollTo(0,0);
            $scope.mainFlags.showProjectDetailFlag=false;
            $scope.mainFlags.projectDetailTemplate="";
            $scope.mainFlags.showMainWrapper=true;
            $scope.$apply();

            if(goBack){
                history.back();
            }
        }});
    }

}]);

classes.service('LocationChanger', ['$location', '$route', '$rootScope',"CFunctions","Config",
    function ($location, $route, $rootScope,CFunctions,Config) {

        this.rootScopeEvent=null;

        //阻止ngView的刷新,返回this是方便链式调用
        this.skipReload = function () {
            var lastRoute = $route.current;

            //这里绑定过后面会一直响应，关闭弹出层的时候要取消绑定，绑定的时候会返回取消绑定的函数
            this.rootScopeEvent=$rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
            });

            return this;
        };

        this.canReload=function(){

            //取消$rootScope.$on('$locationChangeSuccess'的绑定
            if(typeof this.rootScopeEvent ==="function"){
                this.rootScopeEvent();
            }

            return this;
        };

        this.withReplace = function (url, doesReplace) {
            if(doesReplace){
                $location.path(url).replace();
            }
            else {
                $location.path(url || '/');
            }

            return this;
        };

        this.initLocationPage=function($scope){
            var path=$location.path();
            $scope.popFlags.showPop=true;
            $scope.mainFlags.showBlackOut=true;
            $scope.mainFlags.extMenuActive=false;

            if(path.indexOf(Config.urls.editPwd)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.editPwd;
            }else if(path.indexOf(Config.urls.signIn)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.signIn;
            }else if(path.indexOf(Config.urls.signUp)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.signUp;
            }else if(path.indexOf(Config.urls.editInfo)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.editInfo;
            }else if(path.match(Config.urls.projectDetailReg)!==null){
                $scope.mainFlags.showProjectDetailFlag=true;
                $scope.mainFlags.showMainWrapper=false;
                $scope.mainFlags.showBlackOut=false;
                $scope.mainFlags.projectDetailTemplate=Config.templateUrls.projectDetail;
            }else if(path.indexOf(Config.urls.search)!==-1){
                $scope.popFlags.popTemplateUrl=Config.templateUrls.search;
            }else{
                $scope.popFlags.showPop=false;
                $scope.popFlags.popTemplateUrl="";
                $scope.mainFlags.showBlackOut=false;

                //关闭作品详情需要执行动画
                CFunctions.hideProjectDetail($scope,false);
            }
            $scope.$apply();

            return this;
        };

        this.windowHistoryChange=function($scope){
            var me=this;

            window.onpopstate=function(event){
                //console.log("d");
                me.initLocationPage($scope);
                me.canReload();
            };

            return this;
        }

}]);



/* $resource default actions
{ 'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} };
    */
classes.factory("Project",["$rootScope","$resource","Config",function($rootScope,$resource,Config){
    return $resource(Config.ajaxUrls.getAllProjects,{},{
        query:{params:{"length":10}},
        get:{url:Config.ajaxUrls.getProjectDetail,params:{id:3}},
        remove:{url:Config.ajaxUrls.deleteProject,params:{id:3}},
        save:{url:Config.ajaxUrls.deleteProject},
        getSimilar:{method:"get",url:Config.ajaxUrls.getSimilarProjects,params:{id:3}}
    })
}]);
classes.factory("User",["$rootScope","$resource","Config",function($rootScope,$resource,Config){
    return $resource(Config.ajaxUrls.getAllProjects,{},{
        query:{params:{"length":10}},
        get:{method:"get",url:Config.ajaxUrls.getProjectDetail,params:{id:3}},
        remove:{url:Config.ajaxUrls.deleteProject,params:{id:3}},
        add:{method:"put"},
        getSimilarProjects:{method:"get",url:Config.ajaxUrls.getSimilarProjects,params:{id:3}}
    });
}]);
classes.factory("Box",["$rootScope","$resource","Config",function($rootScope,$resource,Config){
    return $resource(Config.ajaxUrls.getAllProjects,{},{
        query:{params:{"length":10}},
        get:{method:"get",url:Config.ajaxUrls.getProjectDetail,params:{id:3}},
        remove:{url:Config.ajaxUrls.deleteProject,params:{id:3}},
        add:{method:"put"},
        lock:{method:"post",url:Config.ajaxUrls.getSimilarProjects,params:{id:3}},
        getProjectsByBox:{method:"get",url:Config.ajaxUrls.getSimilarProjects,params:{id:3}}
    });
}]);
classes.factory("Comment",["$rootScope","$resource","Config",function($rootScope,$resource,Config){
    return $resource(Config.ajaxUrls.getAllComments,{},{
        query:{params:{"length":10}},
        get:{url:Config.ajaxUrls.getProjectDetail,params:{id:3}},
        remove:{url:Config.ajaxUrls.deleteProject,params:{id:3}},
        getCommentsByProject:{method:"get",url:Config.ajaxUrls.deleteProject,params:{projectId:13}},
        add:{method:"put"}
    });
}]);
