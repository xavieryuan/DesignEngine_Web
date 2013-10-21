/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-5
 * Time: 上午9:22
 * 配置文件
 */
var DE=DE||{};
DE.config={
    root:"/DesignEngine_Web", //项目名
    maxMediaSize:"200m", //最大的媒体文件上传大小
    maxImageSize:"2m", //最大的图片文件上传大小
    defualtEntityThumb:"images/default_thumb_500.png",
    perLoadCount:10, //作品、评论、资源等每次加载的个数
    hasNoMoreFlag:-1, //作品、评论、资源等没有更多的标志,当没有更多的时候将其的loadId设置为-1
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
        userEntity:"userEntity" //用户页的用户作品
    },
    messageCode:{  //错误提示
        errorTitle:"错误提示",
        successTitle:"成功提示",
        operationSuccess:"操作成功，请关闭后选择其他操作！",
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
        emailSendSuccess:"操作成功，请进入邮箱查看邮件！"
    },
    resultCode:{
        account_register_succ:"account_register_succ",
        account_login_succ:"account_login_succ",
        assoicate_email_exists:"assoicate_email_exists",
        associate_sumbit_mail:"associate_sumbit_mail",
        associate_succ:"associate_succ",
        unassociate_succ:"unassociate_succ",
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
        password_reset_succ:"password_reset_succ",
        password_reset_invalid_email:"password_reset_invalid_email",
        account_update_succ:"account_update_succ",
        unauthorized_operation:"unauthorized_operation"
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
        uploadFileUrl:"/design/upload", //文件上传
        uploadAction:"/design/post/create-by-form", //作品（资源）提交
        editUploadAction:"/design/post/edit-by-form", //作品（资源）提交
        getAllProjects:"/DesignEngine_Web/data/projects.json", //获取首页作品
        getAllResource:"/DesignEngine_Web/data/resource.json", //获取首页资源
        getEntityMedias:"/design/data/medias.json",  //修改的时候获取作品（资源）已经上传的媒体文件
        deleteEntity:"/design/post/remove", //删除作品（资源）
        showOrHideEntity:"/design/post/visible", //隐藏作品（资源）
        getEntityAttachments:"/DesignEngine_Web/data/attachments.json", //获取作品（资源）附件（媒体文件)
        getEntityDetail:"/DesignEngine_Web/data/entityDetail.json", //获取作品（资源）详情
        getEntitiesBySearch:"/DesignEngine_Web/data/similarEntities.json", //根据搜索内容获取作品（资源)
        getTags:"/DesignEngine_Web/data/tags.json", //获取系统标签
        addPraise:"/design/post/add-score", //添加赞（勋章）
        deletePraise:"/design/post/remove-score", //删除赞（勋章）
        getSimilarEntities:"/design/data/similarEntities.json", //获取相似作品
        getComments:"/DesignEngine_Web/data/comments.json", //获取评论
        postComment:"/design/post/add-comment", //发表评论
        deleteComment:"/design/post/remove-comment", //删除评论
        getHotUsers:"/DesignEngine_Web/data/hotUsers.json", //获取人点用户
        getUserById:"/DesignEngine_Web/data/user.json", //根据id获取用户
        getUserEntities:"/DesignEngine_Web/data/userEntities.json", //获取用户的作品（资源）
        login:"/design/login", //登录
        logOut:"/design/logout",
        checkLogin:"/DesignEngine_Web", //判断是否登录
        sendOpenId:"/design/login", //发送openId
        bindOldAccount:"/design/associate/bind", //绑定旧账户
        unBindAccount:"design/associate/unbind",
        getValidCode:"/DesignEngine_Web/data/kaptcha.jpg", //获取验证码
        register:"/design/register", //注册
        changePassword:"/design/account/change-password", //修改密码
        forgetPassword:"/design/resetpwd/send-email", //忘记密码
        changeProfile:"/design/account/change-info", //修改资料
        emailValidate:"/design/account-email-unique",
        usernameValidate:"/design/account-fullname-unique"
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
        editEntity:"edit/entityId"  //修改页
    },
    topMenus:{ //顶部菜单类型
        user:"user", //热门用户
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
                window.location.href=this.root;
            },2000);
        }else if(data.errorCode==this.errorCode.timeout){
            DE.UIManager.showMsgPopout(this.messageCode.errorTitle,this.messageCode.timeout);
        }else if(data.errorCode==this.errorCode.thumb_height_not_equals_width){
            DE.UIManager.showMsgPopout(this.messageCode.errorTitle,this.messageCode.imgSizeError);
        }else if(data.errorCode){
            DE.UIManager.showMsgPopout(this.messageCode.errorTitle,this.messageCode.operationError);
        }else{
            DE.UIManager.showMsgPopout(this.messageCode.errorTitle,this.messageCode.loadDataError);
        }

        DE.UIManager.showLoading();
    },
    ajaxErrorHandler:function(){
        DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.networkError);
        DE.UIManager.hideLoading();
    }

};
Object.freeze(DE.config);