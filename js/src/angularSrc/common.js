/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-17
 * Time: 下午2:08
 * To change this template use File | Settings | File Templates.
 */
var common=angular.module("common",[]);

common.service("Config",["$rootScope",function($rootScope){
    this.defualtEntityThumb="images/app/default_thumb_500.png";
    this.perLoadCount=10;//作品、评论、资源等每次加载的个数
    this.hasNoMoreFlag=-1;//作品、评论、资源等没有更多的标志,当没有更多的时候将其的loadId设置为-1
    this.uploadDomain='http://qiniu-plupload.qiniudn.com/';
    this.popTitles={
        "signIn":"登陆",
        "signUp":"注册",
        "forgetPwd":"忘记密码",
        "editPwd":"修改密码",
        "editProfile":"修改资料"
    };
    this.popTemplateUrls={
        "signIn":"views/signIn.html",
        "signUp":"views/signUp.html",
        "forgetPwd":"views/forgetPwd.html",
        "editPwd":"views/changePwd.html",
        "editProfile":"views/editProfile.html"
    };
    this.imageSize={
        ThumbSmall:"-200x200",
        previewSmall:"-400x300"
    };
    this.uploadSize={
        maxMediaSize:"300m", //最大的媒体文件上传大小
            maxImageSize:"2m"//最大的图片文件上传大小
    };
    this.uploadFilters={  //媒体类型格式刷选器
        imageFilter:"jpg,gif,png,jpeg",
        pptFilter:"pptx",
        mp4Filter:"mp4",
        _3dFilter:"3d",
        pdfFiler:"pdf",
        zipFiler:"zip",
        swfFilter:"swf"
    };
    this.uploadMediaTypes={  //媒体类型
        image:"img",
        ppt:"ppt",
        _3d:"3d",
        mp4:"mp4",
        zip:"zip",
        networkVideo:"networkVideo",
        swf:"swf"
    };
    this.mediaObj={  //媒体对象
        mediaTitle:"title",
        mediaMemo:"memo",
        mediaType:"type",
        mediaThumbFilename:"thumbFilename",
        mediaThumbFilePath:"thumbFilePath",
        mediaFilename:"filename",
        mediaFilePath:"filePath"
    };
    this.userStatus={   //用户状态（禁言、激活）
        enabled:"enabled",
        disabled:"disabled"
    };
    this.emailStatus={
        pending:"pending",
        invalid:"invalid",
        actively:"actived"
    };
    this.scrollScreenType={ //当前在哪个页面滚动
        project:"project",
        boxes:"boxes",
        userEntity:"userEntity" //用户页的用户作品,
    };
    this.validError={
        required:"请输入此字段！",
        email:"请输入正确的邮箱格式！",
        emailExistWithLogin:"此邮箱已注册，请<a id='de_direct_login' class='de_direct_login' href='#'>直接登录</a>或更换邮箱！",
        emailExist:"邮箱已经存在！",
        maxLength:"此字段最多输入${value}个字！",
        minLength:"此字段最少输入${value}个字！",
        pwdRequired:"请输入密码！",
        pwdLengthError:"请输入6-20位的密码！",
        oldPwdRequired:"请输入旧密码！",
        newPwdRequired:"请输入新密码！",
        pwdEqualError:"两次输入的密码不一致，请重新输入！",
        usernameRequired:"请输入用户名！",
        usernameExist:"用户名已经被注册，请填写其他用户名！",
        validCodeRequired:"请输入验证码！",
        descriptionLengthError:"最多输入140个字！"
    };
    this.messages={  //错误提示
        errorTitle:"错误提示",
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
        stepOneUnComplete:"标题、标签、描述、缩略图等没有填写完整！",
        pptHasNotUploaded:"此资源还没有被上传到资源服务器，暂时不能查看！",
        pptUploadError:"此资源上传到资源服务器出错，无法查看！",
        uploadSizeError:"最大文件大小",
        uploadExtensionError:"只允许上传",
        uploadIOError:"服务器端异常，请刷新后重试！",
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
        uploadFileUrl:"/pinwall/upload", //文件上传,如果不加design，有时候会出错和flash有关
        uploadAction:"post/create-by-form", //作品（资源）提交
        editUploadAction:"post/edit-by-form", //作品（资源）提交
        getAllProjects:"post/work/firstpage", //获取首页作品
        getAllResource:"post/resource/firstpage", //获取首页资源
        getEntityMedias:"data/medias.json",  //修改的时候获取作品（资源）已经上传的媒体文件
        deleteEntity:"post/remove", //删除作品（资源）
        showOrHideEntity:"post/visible", //隐藏作品（资源）
        getEntityAttachments:"post/attachments", //获取作品（资源）附件（媒体文件)
        getEntityDetail:"post/info", //获取作品（资源）详情
        getEntitiesBySearch:"query/search", //根据搜索内容获取作品（资源)
        getTags:"term/frequence", //获取系统标签
        addPraise:"post/add-score", //添加赞（勋章）
        deletePraise:"post/remove-score", //删除赞（勋章）
        getSimilarEntities:"query/moreLikeThis", //获取相似作品
        //getSimilarEntities:"data/similarEntities.json", //获取相似作品
        getComments:"post/comments", //获取评论
        postComment:"post/add-comment", //发表评论
        showOrHideComment:"admin/toggle-post-comment",
        deleteComment:"post/remove-comment", //删除评论
        getHotUsersOrder:"account/rank",
        getHotUsers:"account/hot", //获取人点用户
        getUserById:"account/info", //根据id获取用户
        getUserEntities:"account/posts", //获取用户的作品（资源）
        login:"login", //登录
        logOut:"logout",
        checkHasBind:"associate/is-bind",
        checkLogin:"account/current", //判断是否登录
        sendOpenId:"login", //发送openId
        bindOldAccount:"associate/bind", //绑定旧账户
        unBindAccount:"associate/unbind",
        getValidCode:"captcha.jpg", //获取验证码
        register:"register", //注册
        changePassword:"account/change-password", //修改密码
        forgetPassword:"resetpwd/send-email", //忘记密码
        changeProfile:"account/change-profile", //修改资料
        changeEmail:"account/change-email",
        getNewEmail:"account/pending-email",
        emailValidate:"account-email-unique",
        usernameValidate:"account-fullname-unique",
        termSuggest:"query/termSuggest",
        searchSuggest:"query/searchSuggest",
        getAllUsers:"admin/list-account",
        getAllComments:"admin/list-comment",
        getAllEntities:"admin/list-post",
        setUserRole:"admin/update-account-role",
        setUserStatus:"admin/toggle-account-comment"
    };
    this.urls={ //用到的路径

    };
    this.roles={   //角色
        admin:"admin",
        user:"user",
        vip:"vip"
    };
}]);

common.service("Storage",function(){
    this.projectLoadedId=0; //分页加载，最后一个作品的时间，-1代表没有更多
    this.searchLoadedCount=0;
    this.currentEditEntityId=0; //当前编辑的作品、资源的id
    this.currentScrollScreenType=""; //当前需要滚动加载的类型
    this.userEntitiesShowCount=0; //查看用户那里的作品，已经显示的个数，本地分页
    this.uploadedMedias={}; //上传作品、资源时已经上传的媒体文件

    this.currentUser={  //当前登录的用户信息
        userId:0,
        name:"",
        figure:"",
        role:"",
        description:"",
        email:"",
        status:"",
        regLocked:true
    };
    this.clearCurrentUser=function(){
        this.currentUser.userId=0;
        this.currentUser.name="";
        this.currentUser.figure="";
        this.currentUser.role="";
        this.currentUser.email="";
        this.currentUser.description="";
        this.currentUser.status="";
        this.currentUser.regLocked=true;
    };
    this.initCurrentUser=function(data){
        this.currentUser.userId=data.userId?data.userId:this.currentUser.userId;
        this.currentUser.figure=data.figure?data.figure:this.currentUser.figure;
        this.currentUser.role=data.role?data.role:this.currentUser.role;
        this.currentUser.name=data.name?data.name:this.currentUser.name;
        this.currentUser.email=data.email?data.email:this.currentUser.email;
        this.currentUser.description=typeof data.description!=="undefined"?data.description:this.currentUser.description;
        this.currentUser.status=data.status?data.status:this.currentUser.status;
        this.currentUser.regLocked=typeof data.regLocked!=="undefined"?data.regLocked:this.currentUser.regLocked;
    };
});

common.service("CFunctions",["config",function(config){
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
        DE.UIManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.networkError);
        DE.UIManager.hideLoading();
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
    this.createUploader=function(param){
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',    //上传模式,依次退化
            browse_button: param.browseButton,       //上传选择的点选按钮，**必需**
            uptoken_url: ajaxurl+"?action=getUploadToken",
            multi_selection:false,
            domain: config.uploadDomain,
            container: param.container,           //上传区域DOM ID，默认是browser_button的父元素，
            filters: {
                mime_types : [
                    { title : "media files", extensions : param.filter }
                ]
                //max_file_size:'1m'
            },
            multipart_params:params.multipartParams,
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
                    var type=up.getOption("videoType");

                    //如果是Flash需要填写文件夹名称
                    if(type==2&&$("#FlashName").val()==""){
                        alert(config.message.flashHasNoDir);
                        up.stop();
                    }
                },
                'UploadProgress': function(up, file) {
                    // 每个文件上传时,处理相关的事情
                    $("#uploadProgress").html(file.name+"----"+file.percent+"%");
                },
                'FileUploaded': function(up, file, info) {

                    $("#uploadProgress").html(config.message.inHand);

                    var res = JSON.parse(info);
                    var sourceLink = config.srcDomain + res.key; //获取上传成功后的文件的Url
                    var type=up.getOption("videoType");

                    var param={
                        name:file.name,
                        key_name:res.key,
                        url:sourceLink,
                        type:type,
                        status:0,
                        action:"addVideo"
                    };

                    if(type==1){
                        param.status=2;
                    }

                    addVideoToBackend(param);


                },
                'Error': function(up, err, errTip) {
                    alert(errTip);
                },
                'Key': function(up, file) {

                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    var random=Math.floor(Math.random()*10+1)*(new Date().getTime());
                    var type=up.getOption("videoType");
                    var key=random+"-"+file.name;

                    if(type==2){
                        //如果是Flash需要加上路径
                        key=$("#FlashName").val()+"/"+key;
                    }


                    // do something with key here
                    return key
                }
            }
        });

        return uploader;
    }
}]);
