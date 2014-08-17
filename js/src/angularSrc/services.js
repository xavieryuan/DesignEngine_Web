/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-23
 * Time: 下午3:38
 * To change this template use File | Settings | File Templates.
 */
var services=angular.module("services",["ngResource","toaster"]);

/* *
 * constant类型的service中的值不会被改变，value定义的service中的值可以被改变
 */
services.constant("Config",{
    thumbs:{
        defaultThumb:"images/app/default_thumb_500.png",
        smallThumb:"images/app/default_small_thumb.png"
    },
    perLoadCount:10,//作品、评论、资源等每次加载的个数
    hasNoMoreFlag:-1,//作品、评论、资源等没有更多的标志,当没有更多的时候将其的loadId设置为-1
    qNUploadDomain:'http://qiniu-plupload.qiniudn.com/',
    qNBucketDomain:"http://id-channel-1.qiniudn.com/",
    mainMenu:{
        project:"project",
        box:"box"
    },
    titles:{
        "signIn":"登陆",
        "signUp":"注册",
        "forgetPwd":"忘记密码",
        "editPwd":"修改密码",
        "editInfo":"修改资料",
        "search":"探索"
    },
    templateUrls:{
        "signIn":"views/signIn.html",
        "signUp":"views/signUp.html",
        "forgetPwd":"views/forgetPwd.html",
        "editPwd":"views/changePwd.html",
        "editInfo":"views/editInfo.html",
        "search":"views/searchPanel.html",
        "projectDetail":"views/projectDetail.html"
    },
    urls:{  //用到的路径
        "projects":"/projects",
        "boxes":"/boxes",
        "boxDetail":"/box/:boxId",
        "home":"/",
        "projectDetail":"/project/:projectId",
        "projectDetailReg":/\/project\/\d?/,
        "signIn":"/login",
        "signUp":"/register",
        "editPwd":"change/password",
        "editInfo":"change/info",
        "userHome":"/user/{userId}",
        "search":"/search",
        "searchResult":"/search/:content",
        "searchResultReg":/\/search\/*?/,
        "forgetPwd":"/forgetPassword"
    },
    imageScale:{
        ThumbSmall:"-200x200",
        previewSmall:"-400x300"
    },
    uploadSize:{
        maxMediaSize:"300m", //最大的媒体文件上传大小
        maxImageSize:"2m"//最大的图片文件上传大小
    },
    mediaFilters:{  //媒体类型格式刷选器
        image:"jpg,gif,png,jpeg",
        ppt:"pptx",
        pdf:"pdf",
        mp4:"mp4",
        _3d:"3d",
        zip:"zip",
        flash:"swf"
    },
    mediaTypes:{  //媒体类型
        image:"image",
        ppt:"ppt",
        pdf:"pdf",
        _3d:"_3d",
        mp4:"mp4",
        zip:"zip",
        webVideo:"webVideo",
        flash:"swf"
    },
    mediaTitles:{
        image:"图片",
        ppt:"ppt文件",
        pdf:"pdf文件",
        _3d:"3d文件",
        mp4:"视频",
        zip:"压缩文件",
        webVideo:"网络视频",
        flash:"swf动画"
    },
    mediaSetPanelUrl:"views/mediaSet.html",
    mediaIdPrefixes:{
        image:"img_",
        ppt:"ppt_",
        pdf:"pdf_",
        _3d:"3d_",
        mp4:"mp4_",
        zip:"zip_",
        webVideo:"networkVideo_",
        swf:"swf_"
    },
    mediaObj:{  //媒体对象
        mediaTitle:"mediaTitle",
        mediaMemo:"mediaMemo",
        mediaType:"mediaType",
        mediaThumbFilename:"mediaThumbFilename",
        mediaThumbFilePath:"mediaThumbFilePath",
        mediaFilename:"mediaFilename",
        mediaFilePath:"mediaFilePath"
    },
    userStatus:{   //用户状态（禁言、激活）
        enabled:"enabled",
        disabled:"disabled"
    },
    emailStatus:{
        pending:"pending",
        invalid:"invalid",
        actively:"actively"
    },
    scrollScreenType:{ //当前在哪个页面滚动
        project:"project",
        box:"box",
        searchResult:"searchResult",
        boxDetail:"boxDetail",
        userDetail:"userDetail" //用户页的用户作品,
    },
    validError:{
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
    },
    messages:{  //错误提示
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
    },
    errorCode:{
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
    },
    ajaxUrls:{
        signIn:"#",
        upload:"http://localhost/idchannel/chinese/wp-admin/admin-ajax.php?action=getUploadToken",
        getAllProjects:"data/projects.json", //获取首页作品媒体文件)
        getProjectDetail:"post/info/:id", //获取作品（资源）详情
        deleteProject:"post/remove/:id",
        getSimilarProjects:"post/similar",
        getAllComments:"data/commentsManage.json",
        getAllBoxes:"data/boxes.json",
        getCompleteUrl:"data/autocomplete.json"
    },
    roles:{   //角色
        admin:"admin",
        user:"user",
        vip:"vip"
    }
});
services.constant("App",{
    version:"1.0"
});
/*services.provider("App",function(){
    //调用的时候返回的是一个包含$get函数的对象
    return {
        $get: function() {
            return {
                showLoading:function(){
                    //$rootScope.showLoading=true;
                },
                hideLoading:function(){
                    //$rootScope.showLoading=false;
                }
            };
        }

    };
});*/
/*services.provider("App",function(){
    //调用的时候返回的是一个包含$get函数的对象
    this.$get=function() {
        return {
            showLoading:function(){
                //$rootScope.showLoading=true;
            },
            hideLoading:function(){
                //$rootScope.showLoading=false;
            }
        };
    }
});*/
/*services.provider("App",{
    //调用的时候返回的是一个包含$get函数的对象
    $get: function() {
        return {
            showLoading:function(){
                //$rootScope.showLoading=true;
            },
            hideLoading:function(){
                //$rootScope.showLoading=false;
            }
        };
    }
});*/

services.service("AjaxErrorHandler",["toaster","Config",function(toaster,Config){
    this.ajaxReturnErrorHandler=function(data){
        toaster.pop('error',Config.messages.errorTitle,Config.messages.networkError,null,null);
    };

    this.ajaxErrorHandler=function(){
        toaster.pop('error',Config.messages.errorTitle,Config.messages.networkError,null,null);
    };
}]);

services.service("CFunctions",["$rootScope","$location","$http","toaster","Config",function($rootScope,$location,$http,toaster,Config){

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
     * @param {Object} params 对象属性formUrl:"表单提交地址",formParam:"表单数据对象",successCb:"提交成功后回调函数"
     */
    this.ajaxSubmit=function(params){
        $http.post(params.formUrl,params.formParam).
            success(function(data, status, headers, config){
                params.successCb(data);
            }).error(function(data, status, headers, config){
                params.errorCb();
            });

        $http.post(param.formUrl,param.formParam,postCfg). success(param.successCb).
            error(function(data, status, headers, config){
                console.log(data);
            });
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
    this.getPathParam=function(){
        var path=$location.path();
        var pos=path.lastIndexOf("/");
        return path.substring(pos+1);
    };

    this.hideProjectDetail=function(refreshScope){
        var target=$(".de_screen_project_detail");
        var header=target.find(".de_project_header");
        var detail=target.find(".de_project_detail");
        TweenMax.to(header,0.3,{y:-100});
        TweenMax.to(detail,0.3,{y:100});
        TweenMax.to(target,0.4,{opacity:0,onComplete:function(){
            refreshScope();
        }});
    }
	
}]);

services.service("Storage",function(){
    this.currentPage=1;
    this.scrollTimer=null;
    this.currentScrollScreenType="";

    this.clearScrollData=function(currentScrollScreenType){
        this.currentPage=1;
        this.scrollTimer=null;
        this.currentScrollScreenType=currentScrollScreenType?currentScrollScreenType:"";
    };

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

services.service('LocationChanger', ['$location', '$route', '$rootScope',"CFunctions","Config",
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


}]);

/* $resource default actions
{ 'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} };
    */
services.factory("Project",["$rootScope","$resource","Storage","CFunctions","Config",
    function($rootScope,$resource,Storage,CFunctions,Config){
        return {
            getProjects:function(){
                return this.resource.query({"page":Storage.currentPage},function(data){
                    //console.log("In services");
                    if(data.success){
                        if(Storage.currentPage==data.total){
                            Storage.currentPage=Config.hasNoMoreFlag;
                        }else{
                            Storage.currentPage++;
                        }
                    }
                });
            },
            resource: $resource(Config.ajaxUrls.getAllProjects,{},{
                query:{params:{"page":1,"count":10}},
                get:{url:Config.ajaxUrls.getProjectDetail,params:{id:3}},
                remove:{url:Config.ajaxUrls.deleteProject,params:{id:3}},
                save:{url:Config.ajaxUrls.deleteProject},
                getSearchResult:{method:"get",url:"#",params:{content:"search"}},
                getSimilar:{method:"get",url:Config.ajaxUrls.getSimilarProjects,params:{id:3}}
            })
        };
}]);
services.factory("User",["$rootScope","$resource","Config",function($rootScope,$resource,Config){
    return $resource(Config.ajaxUrls.getAllProjects,{},{
        query:{params:{"length":10}},
        get:{method:"get",url:Config.ajaxUrls.getProjectDetail,params:{id:3}},
        remove:{url:Config.ajaxUrls.deleteProject,params:{id:3}},
        add:{method:"put"},
        getSimilarProjects:{method:"get",url:Config.ajaxUrls.getSimilarProjects,params:{id:3}}
    });
}]);
services.factory("Box",["$rootScope","$resource","Config","Storage","CFunctions",
    function($rootScope,$resource,Config,Storage,CFunctions){
        return {
            getBoxes:function($scope){
                this.resource.query({"page":Storage.currentPage},function(data){

                    if(data.success){
                        $scope.boxes=$scope.boxes.concat(data.boxes);
                        if(Storage.currentPage==data.total){
                            Storage.currentPage=Config.hasNoMoreFlag;
                        }else{
                            Storage.currentPage++;
                        }
                    }else{
                        CFunctions.ajaxReturnErrorHandler(data);
                    }

                },function(data){
                    CFunctions.ajaxErrorHandler();
                });
            },
            getBoxProjects:function($scope){
                $scope.mainFlags.showLoading=true;
                this.resource.getBoxProjects({"page":Storage.currentPage},function(data){
                    if(data.success){
                        $scope.projects=$scope.projects.concat(data.projects);
                        if(Storage.currentPage==data.total){
                            Storage.currentPage=Config.hasNoMoreFlag;
                        }else{
                            Storage.currentPage++;
                        }
                    }else{
                        CFunctions.ajaxReturnErrorHandler(data);
                    }
                    $scope.mainFlags.showLoading=false;
                },function(data){
                    $scope.mainFlags.showLoading=false;
                    CFunctions.ajaxErrorHandler();
                })
            },
            resource:$resource(Config.ajaxUrls.getAllBoxes,{},{
                query:{params:{"page":1,"count":Config.perLoadCount}},
                get:{method:"get",url:Config.ajaxUrls.getProjectDetail,params:{id:3}},
                remove:{url:Config.ajaxUrls.deleteProject,params:{id:3}},
                add:{method:"put"},
                lock:{method:"post",url:Config.ajaxUrls.getSimilarProjects,params:{id:3}},
                getBoxProjects:{method:"get",url:Config.ajaxUrls.getAllProjects,params:{page:1,count:Config.perLoadCount}}
            })
        };
}]);
services.factory("Comment",["$rootScope","$resource","Config",function($rootScope,$resource,Config){
    return $resource(Config.ajaxUrls.getAllComments,{},{
        query:{params:{"count":10}},
        get:{url:Config.ajaxUrls.getProjectDetail,params:{id:3}},
        remove:{url:Config.ajaxUrls.deleteProject,params:{id:3}},
        getCommentsByProject:{method:"get",url:Config.ajaxUrls.deleteProject,params:{projectId:13}},
        add:{method:"put"}
    });
}]);
