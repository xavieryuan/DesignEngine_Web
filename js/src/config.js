/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-5
 * Time: 上午9:22
 * 配置文件,包括一些变量和出错处理函数以及失踪儿童数据
 */
var DE=DE||{};
DE.config={
    defualtEntityThumb:"images/default_thumb_500.png",
    perLoadCount:10, //作品、评论、资源等每次加载的个数
    hasNoMoreFlag:-1, //作品、评论、资源等没有更多的标志,当没有更多的时候将其的loadId设置为-1
    uploadSize:{
        maxMediaSize:"200m", //最大的媒体文件上传大小
        maxImageSize:"2m"//最大的图片文件上传大小
    },
    uploadFilters:{  //媒体类型格式刷选器
        imageFilter:"jpg,gif,png,jpeg",
        pptFilter:"pptx",
        _3dFilter:"3d",
        videoFilter:"mp4",
        fileFilter:"zip,pdf",
        flashFilter:"swf"
    },
    uploadMediaTypes:{  //媒体类型
        image:"zy_image",
        ppt:"zy_ppt",
        _3d:"zy_3d",
        localVideo:"zy_location_video",
        file:"zy_file",
        webVideo:"zy_network_video",
        flash:"zy_flash"
    },
    mediaObj:{  //媒体对象
        mediaTitle:"zy_media_title",
        mediaMemo:"zy_media_memo",
        mediaType:"zy_media_type",
        mediaThumbFilename:"zy_media_thumb_filename",
        mediaThumbFilepath:"zy_media_thumb_filepath",
        mediaFilename:"zy_media_filename",
        mediaFilepath:"zy_media_filepath"
    },
    imgSize:{
        small:"-200x200",
        middle:"-400x400"
    },
    userStatus:{   //用户状态（禁言、激活）
        enabled:"enabled",
        disabled:"disabled"
    },
    scrollScreenType:{ //当前在哪个页面滚动
        hotUser:"hotUser",
        project:"project",
        resource:"resource",
        userEntity:"userEntity" //用户页的用户作品,
    },
    validError:{
        emailRequired:"请输入邮箱！",
        emailFormatError:"请输入正确的邮箱格式！",
        emailExistWithLogin:"此邮箱已注册，请<a id='de_direct_login' class='de_direct_login' href='#'>直接登录</a>或更换邮箱！",
        emailExist:"邮箱已经存在！",
        pwdRequired:"请输入密码！",
        pwdLengthError:"请输入6-20位的密码！",
        oldPwdRequired:"请输入旧密码！",
        newPwdRequired:"请输入新密码！",
        pwdEqualError:"两次输入的密码不一致，请重新输入！",
        usernameRequired:"请输入用户名！",
        usernameExist:"用户名已经被注册，请填写其他用户名！",
        validCodeRequired:"请输入验证码！",
        descriptionLengthError:"最多输入140个字！"
    },
    messageCode:{  //错误提示
        errorTitle:"错误提示",
        successTitle:"成功提示",
        operationSuccess:"操作成功，请关闭后选择其他操作！",
        registerSuccess:"注册成功，如果您是非QQ登录用户，请进入邮箱激活账户，否则无法登录！",
        timeout:"登陆超时，请关闭后刷新页面并登录！",
        networkError:"网络连接失败，请稍后重试！",
        validCodeError:"验证码错误！",
        operationError:"操作失败，请稍后重试！",
        imgSizeError:"图片不是1:1比例！",
        loadDataError:"请求数据失败！",
        filenameError:"文件名必须是数字下划线汉字字母,且不能以下划线开头！",
        nameOrPwdError:"用户名或者密码错误！",
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
        uploadIOErrror:"服务器端异常，请稍后重试！",
        emailPending:"你的新邮箱${email}没有激活，请进入邮箱激活！",
        emailInvalid:"你提交的新邮箱${email},已被其他人激活，如需修改邮箱，请提交另外一个邮箱！"
    },
    resultCode:{
        account_register_succ:"account_register_succ",
        account_login_succ:"account_login_succ",
        assoicate_email_exists:"assoicate_email_exists",
        associate_sumbit_mail:"associate_sumbit_mail",
        bind_succ:"bind_succ",
        unbind_succ:"unbind_succ",
        resource_create_succ:"resource_create_succ",
        post_create_succ:"post_create_succ",
        post_remove_succ:"post_remove_succ",
        term_add_succ:"term_add_succ",
        term_remove_succ:"term_remove_succ",
        praise_add_succ:"praise_add_succ",
        praise_remove_succ:"praise_remove_succ",
        visible_set_succ:"visible_set_succ",
        honor_add_succ:"honor_add_succ",
        honor_remove_succ:"honor_remove_succ",
        comment_add_succ:"comment_add_succ",
        comment_remove_succ:"comment_remove_succ",
        password_change_succ:"password_change_succ",
        password_reset_succ:"password_reset_submit_succ",
        password_reset_invalid_email:"password_reset_invalid_email",
        account_update_succ:"account_update_succ",
        unauthorized_operation:"unauthorized_operation",
        pptx_upload_error:"pptx_upload_error",
        pptx_upload_wait:"pptx_upload_wait",
        email_status:{
            pending:"pending",
            invalid:"invalid",
            actived:"actived"
        }
    },
    errorCode:{
        captcha_unmatches:"captcha_unmatches",
        account_update_fail:"account_update_fail",
        account_required:"account_required",
        account_fullname_required:"account_fullname_required",
        authentication_error:"authentication_error",
        upload_exception:"upload_exception",
        application_exception:"application_exception",
        json_serialize_exception:"json_serialize_exception",
        json_deserialize_exception:"json_deserialize_exception",
        smile_serialize_exception:"smile_serialize_exception",
        smile_deserialize_exception:"smile_deserialize_exception",
        timeout:"timeout",
        fastdfs_client_exception:"fastdfs_client_exception",
        im4j_exception:"im4j_exception",
        thumb_height_not_equals_width:"thumb_height_not_equals_width",
        notFound:"not_found"
    },
    ajaxUrls:{
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
        searchSuggest:"query/searchSuggest"
        //autoComplete:"http://192.168.2.167:8393/solr/termSuggest"
    },
    entityTypes:{  //实体类型
        project:"project",
        resource:"resource"
    },
    urls:{  //history的url
        indexProject:"project/all", //首页作品
        indexResource:"resource/all", //首页资源
        tagEntities:"tag/tagName", //点击标签
        hotUsers:"user/hot", //热门用户
        userDetail:"user/userId", //用户页
        search:"search/searchContent", //搜索页
        uploadEntity:"upload/entity",  //上传页
        editEntity:"edit/entityId",  //修改页
        entityDetail:"entity/entityId"
    },
    topMenus:{ //顶部菜单类型
        user:"user", //热门用户,不写为hotUser是为了配合url地址
        project:"project", //首页作品
        resource:"resource", //首页资源
        upload:"upload" //上传
    },
    roles:{   //角色
        admin:"admin",
        user:"user",
        vip:"vip"
    },
    ajaxReturnErrorHandler:function(data){
        if(data.errorCode==this.errorCode.notFound){
            DE.UIManager.showMsgPopout(this.messageCode.errorTitle,this.messageCode.notFound);
            setTimeout(function(){
                window.location.href=document.baseURI||$("#de_base_url").attr("href");
            },2000);
        }else if(data.errorCode==this.errorCode.timeout){
            DE.UIManager.showMsgPopout(this.messageCode.errorTitle,this.messageCode.timeout);
        }else if(data.errorCode==this.errorCode.thumb_height_not_equals_width){
            DE.UIManager.showMsgPopout(this.messageCode.errorTitle,this.messageCode.imgSizeError);
        }else if(data.errorCode||data.resultCode){
            DE.UIManager.showMsgPopout(this.messageCode.errorTitle,this.messageCode.operationError);
        }else{
            DE.UIManager.showMsgPopout(this.messageCode.errorTitle,this.messageCode.loadDataError);
        }

        DE.UIManager.hideLoading();
    },
    ajaxErrorHandler:function(){
        DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.networkError);
        DE.UIManager.hideLoading();
    }

};
Object.freeze(DE.config);

//获取腾讯的失踪儿童数据
$.getScript("http://qzone.qq.com/gy/404/data.js");