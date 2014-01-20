/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * 登陆、注册、忘记密码、绑定旧账号
 */
var DE=DE||{};
DE.loginManager=(function(uiManager,config,historyManager,storeManager){

    /**
     * 记住我
     */
    function rememberMeHandler(){
        var emailValue=$("#de_login_email").val();
        if(!$.cookie("email")||$.cookie("email")!=emailValue){
            var expiration = new Date((new Date()).getTime() + 7*24*60* 60000);//设置时间
            $.cookie("email", emailValue, { expires: expiration }); // 存储一个带15分钟期限的 cookie
        }
        if ($("#de_remember_me").prop("checked")) {
            var password = $("#de_login_pwd").val();
            var expiration = new Date((new Date()).getTime() + 7*24*60* 60000);//设置时间
            $.cookie("remember", "true", { expires: expiration }); // 存储一个带15分钟期限的 cookie
            $.cookie("password", password, { expires: expiration }); // 存储一个带15分钟期限的 cookie
        }else {
            $.cookie("remember", "false", { expires: -1 });
            //$.cookie("username", '', { expires: -1 });
            $.cookie("password", '', { expires: -1 });
        }
    }

    function refreshValidCode(){
        $("#de_captcha_img").removeAttr("src").attr("src",config.ajaxUrls.getValidCode);
        //$(#de_captcha_img).attr('src')+'?'+Math.random()
    }
    /**
     * 重新加载数据
     */
    function reloadData(){

        //成功后如果在用户页面、作品详情页需要重新加载数据
        var href=window.location.href;
        if((href.indexOf("user")!==-1&&href.indexOf("hot")===-1)||href.indexOf("item")!==-1){
            historyManager.initDatas();
        }
    }

    /**
     * 登录ajax提交
     * @param {Object} targetForm 需要提交的form
     * @param {String} url 提交的地址
     * @param {Function} callback 提交后执行的操作
     */
    function loginSubmitHandler(targetForm,url,callback){

        rememberMeHandler();
        uiManager.showLoading();

        targetForm.ajaxSubmit({
            url:url,
            dataType:"json",
            success:function (data) {
                callback(data,targetForm);
            },
            error:function (data) {
                config.ajaxErrorHandler();
            }
        });
    }

    /**
     * 登录提交后执行的操作（回调函数）
     * @param {Object} data 后台的json数据
     * @param {Object} targetForm 提交的form
     */
    function loginCallback(data,targetForm){
        if(data.success&&data.resultCode==config.resultCode.account_login_succ){
            storeManager.initCurrentUser({
                role:data.userinfo.userRoles[0],
                figure:data.userinfo.userProfileImg,
                name:data.userinfo.userName,
                userId:data.userinfo.userId,
                description:data.userinfo.userDescribe,
                email:data.userinfo.userEmail,
                status:data.userinfo.userStatus,
                regLocked:data.userinfo.regLocked
            });

            uiManager.showLoginMenu({user:storeManager.currentUser});
            uiManager.hideAllMenuAndPopouts();

            targetForm.clearForm();

            reloadData();
        }else{
            if(data.errorCode&&data.errorCode===config.errorCode.email_not_confirm){
                $("#de_login_error").text(config.messageCode.emailNotConfirm);
            }else{
                $("#de_login_error").text(config.messageCode.nameOrPwdError);
            }
        }

        uiManager.hideLoading();
    }

    /**
     * 发送openId到后台
     * @param {String} url 发送地址
     * @param {Object} params 参数{openId,accessToken,openIdSource}
     * @param {Function} callback 完成后执行的操作
     */
    function sendOpenId(url,params,callback){
        $.ajax({
            url:url,
            data:params,
            type:"post",
            dataType:"json",
            success:function(data){
                callback(data,params);
            },
            error:function(){
                config.ajaxErrorHandler();
                QC.Login.signOut();
            }
        });
    }

    /**
     * 发送openId的回调函数
     * @param {Object} data 后台返回的json数据
     * @param {Object} params 参数{openId,accessToken,openIdSource}
     */
    function sendOpenIdCallback(data,params){

        if(data.success&&data.resultCode==config.resultCode.account_login_succ){

            //非第一次登录
            storeManager.initCurrentUser({
                role:data.userinfo.userRoles[0],
                figure:data.userinfo.userProfileImg,
                name:data.userinfo.userName,
                userId:data.userinfo.userId,
                description:data.userinfo.userDescribe,
                email:data.userinfo.userEmail,
                status:data.userinfo.userStatus,
                regLocked:data.userinfo.regLocked
            });


            uiManager.showLoginMenu({user:storeManager.currentUser});
            uiManager.hideAllMenuAndPopouts();


            reloadData();
        }else{

            //第一次登录
            if(data.errorCode==config.errorCode.account_required){

                //记录下openId，然后再注册的时候带回给后台
                storeManager.currentUser.openId=params.openId;
                storeManager.currentUser.accessToken=params.accessToken;
                uiManager.showRegPopout();
            }else{
                uiManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.operationError);

            }
        }

        //获取到信息后登出QQ，以免影响系统本身逻辑
        QC.Login.signOut();
    }

    /**
     * 绑定账户
     * @param {String} url 发送地址
     * @param {Object} params 参数{openId,accessToken,openIdSource}
     * @param {Function} callback 完成后执行的操作
     */
    function bindCount(url,params,callback){
        $.ajax({
            url:url,
            data:params,
            type:"post",
            dataType:"json",
            success:function(data){
                callback(data);
            },
            error:function(){
                config.ajaxErrorHandler();
                QC.Login.signOut();
            }
        });
    }

    /**
     * 绑定账户回调函数
     * @param {Object} data 后台返回的json数据
     */
    function bindCountCallback(data){

        if(data.success&&data.resultCode==config.resultCode.bind_succ){

            //显示绑定成功
            $("#de_bind_account_btn").addClass("de_hidden");
            $("#de_remove_bind").removeClass("de_hidden");
            $("#de_has_bind").removeClass("de_hidden");
        }else{
            uiManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.operationError);

        }

        //让QQ登出
        QC.Login.signOut();
    }

    function unBind(url,callback){
        $.ajax({
            url:url,
            type:"post",
            dataType:"json",
            success:function(data){
                callback(data);
            },
            error:function(data){
                config.ajaxErrorHandler();
                QC.Login.signOut();
            }
        });
    }

    function unBindCallback(data){
        if(data.success&&data.resultCode==config.resultCode.unbind_succ){

            $("#de_has_bind").addClass("de_hidden");
            $("#de_bind_account_btn").removeClass("de_hidden");
            $("#de_remove_bind").addClass("de_hidden");

        }else{
            config.ajaxReturnErrorHandler(data);
        }

        //让QQ登出
        QC.Login.signOut();
    }

    /**
     * 登录ajax提交
     * @param {Object} targetForm 需要提交的form
     * @param {String} url 提交的地址
     * @param {Object} params 参数{openId,accessToken,openIdSource}
     * @param {Function} callback 提交后执行的操作
     */
    function registerSubmitHandler(targetForm,url,params,callback){

        uiManager.showLoading();
        targetForm.ajaxSubmit({
            url:url,
            type:"post",
            data:params,
            dataType:"json",
            success:function (data) {
                callback(data);
            },
            error:function (data) {
                config.ajaxErrorHandler();
            }
        });
    }

    /**
     * 登录提交后执行的操作（回调函数）
     * @param {Object} data 后台的json数据
     * @param {Object} targetForm 提交的form
     */
    function registerCallback(data,targetForm){
        if(data.success&&data.resultCode===config.resultCode.account_register_succ){

            //通过qq登录的才去获取用户信息
            if(storeManager.currentUser.openId){

                //重新获取登录用户
                checkLogin(config.ajaxUrls.checkLogin,checkLoginCallBack);

            }

            uiManager.showMsgPopout(config.messageCode.successTitle,config.messageCode.registerSuccess);
            targetForm.clearForm();

        }else{
            if(data.errorCode==config.errorCode.captcha_unmatches){
                $("#de_reg_error").text(config.messageCode.validCodeError);
            }else{
                $("#de_reg_error").text(config.messageCode.operationError);
            }
        }

        //不管注册成功或者失败，都需要重新刷一次验证码
        refreshValidCode();

        uiManager.hideLoading();
    }

    function showDataAndLoginMenu(){

        //不管是否登录，只有不存在openid时才初始化数据，如果存在是从QQ登录来的，此时已经有数据了
        if(!storeManager.currentUser.openId){

            //每次进入页面都需要根据地址取数据
            historyManager.initDatas();
        }

        //不管是否登录都初始化登陆菜单
        uiManager.showLoginMenu({user:storeManager.currentUser});
    }

    /**
     *每次进入页面都需要判断用户是否登录来初始化用户信息和界面数据
     * @param {String} url 获取登录信息的地址
     * @param {Function} callback 获取后的逻辑操作
     */
    function checkLogin(url,callback){
        $.ajax({
            url:url,
            type:"post",
            dataType:"json",
            success:function(data){
                 callback(data);
            },
            error:function(){

                //失败了也需要进行数据的初始化
                showDataAndLoginMenu();

            }
        });
    }

    function checkLoginCallBack(data){

        //如果已经登陆，则需要初始化用户信息
        if(data.success){
            storeManager.initCurrentUser({
                role:data.user.userRoles[0],
                figure:data.user.userProfileImg,
                name:data.user.userName,
                userId:data.user.userId,
                description:data.user.userDescribe,
                email:data.user.userEmail,
                status:data.user.userStatus,
                regLocked:data.user.regLocked
            });
        }

        showDataAndLoginMenu();
    }

    function forgetPwdSubmit(url,targetForm,callback){
        uiManager.showLoading();
        targetForm.ajaxSubmit({
            url:url,
            type:"post",
            dataType:"json",
            success:function (data) {
                callback(data);

            },
            error:function (data) {
                config.ajaxErrorHandler();
            }
        });
    }
    function forgetPwdSubmitCallback(data){
        if(data.success&&data.resultCode==config.resultCode.password_reset_succ){
            uiManager.showMsgPopout(config.messageCode.successTitle,config.messageCode.emailSendSuccess);
        }else if(data.success&&data.resultCode==config.resultCode.password_reset_invalid_email){
            uiManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.emailNotExist);
        }else{
            config.ajaxReturnErrorHandler(data);
        }

        uiManager.hideLoading();
    }

    function logout(url,callback){
        $.ajax({
            url:url,
            type:"post",
            dataType:"json",
            success:function(data){
                callback(data);
            },
            error:function(){
                config.ajaxErrorHandler();
            }

        });
    }
    function logoutCallback(data){
        if(data.success){

            //qq登出
            QC.Login.signOut();

            //跳转页面
            window.location.href=document.baseURI||$("#de_base_url").attr("href");
        }else{
            uiManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.operationError);
        }
    }

    return {
        checkLogin:checkLogin,
        checkLoginCallback:checkLoginCallBack,

        /**
        * 登录
        */
        ajaxLogin:function(){
           $("#de_login_form").validate({
               rules: {
                   de_login_email:{
                       required:true,
                       email:true
                   },
                   de_login_pwd: "required"

               },
               messages: {
                   de_login_email: {
                       required:config.validError.emailRequired,
                       email:config.validError.emailFormatError
                   },
                   de_login_pwd:config.validError.pwdRequired

               },
               submitHandler:function(form) {
                   loginSubmitHandler($(form),config.ajaxUrls.login,loginCallback);
               }
           });

        },

        /**
        * QQ登录函数
        * @constructor
        */
        QQLoginHandler:function(){
           QC.Login({
               btnId:"de_qq_login"    //插入按钮的节点id
           },function(reqData, oOpts){

               //如果已经登录，不发请求，绑定那里也会引起这里发请求
               if(!storeManager.currentUser.userId){
                   QC.Login.getMe(function(openId, accessToken){

                       sendOpenId(config.ajaxUrls.sendOpenId,{
                           openId:openId,
                           accessToken:accessToken,
                           openIdSource:"qq"
                       },sendOpenIdCallback);

                   });
               }
           });
        },

        /**
        * 老用户绑定
        */
        QQBindHandler:function(){
           QC.Login({
               btnId:"de_bind_account_btn"    //插入按钮的节点id
           },function(reqData, oOpts){

               QC.Login.getMe(function(openId, accessToken){

                   bindCount(config.ajaxUrls.bindOldAccount,{
                       openId:openId,
                       accessToken:accessToken,
                       openIdSource:"qq"
                   },bindCountCallback);

               });
           });
        },

        /**
        * 解除绑定
        */
        unBindHandler:function(){
           unBind(config.ajaxUrls.unBindAccount,unBindCallback);
        },

        /**
        * 注册
        */
        ajaxRegister:function(){
           $("#de_register_form").validate({
               rules:{
                   de_reg_username:{
                       required:true,
                       remote : config.ajaxUrls.usernameValidate //后台处理程序
                   },
                   de_reg_email:{
                       required:true,
                       email:true,
                       remote : config.ajaxUrls.emailValidate //后台处理程序
                   },
                   de_reg_pwd:{
                       required:true,
                       rangelength:[6,20]
                   },
                   de_reg_code:{
                       required:true
                   }
               },
               messages:{
                   de_reg_username:{
                       required:config.validError.usernameRequired,
                       remote:config.validError.usernameExist
                   },
                   de_reg_email:{
                       required:config.validError.emailRequired,
                       email:config.validError.emailFormatError,
                       remote:config.validError.emailExistWithLogin
                   },
                   de_reg_pwd:{
                       required:config.validError.pwdRequired,
                       rangelength:config.validError.pwdLengthError
                   },
                   de_reg_code:{
                       required:config.validError.validCodeRequired
                   }
               },
               submitHandler:function(form) {

                   registerSubmitHandler($(form),config.ajaxUrls.register,{
                       openId:storeManager.currentUser.openId,
                       openIdSource:storeManager.currentUser.openIdSource,
                       accessToken:storeManager.currentUser.accessToken
                   },registerCallback);
               }
           });
        },

        /**
        * 忘记密码
        */
        forgetPassword:function(){
           $("#de_form_recover_pwd").validate({
               rules:{
                   email:{
                       required:true,
                       email:true
                   }
               },
               messages:{
                   email:{
                       required:config.validError.emailRequired,
                       email:config.validError.emailFormatError
                   }
               },
               submitHandler:function(form) {
                   forgetPwdSubmit(config.ajaxUrls.forgetPassword,$(form),forgetPwdSubmitCallback);
               }
           });
        },

        /**
        * 登出
        */
        logoutHandler:function(){
            logout(config.ajaxUrls.logOut,logoutCallback);
        },



        /**
        *初始化登录form,主要是从cookie中取数据并设置
        */
        initLoginForm:function(){
            $("#de_login_email").val($.cookie("email"));
            if ($.cookie("remember") == "true") {
                 $("#de_remember_me").prop("checked",true);
                $("#de_login_pwd").val($.cookie("password"));
            }
        },

        loginBtnClickHandler:function(){
            this.initLoginForm();
            uiManager.showLoginPopout();
        },
        regBtnClickHandler:function(){
            uiManager.showRegPopout();
        },
        forgetPasswordClickHandler:function(){
            uiManager.showRecoverPwdPopout();
        },
        validCodeRefreshHandler:function(){
            refreshValidCode();
        },
        pwdInputKeyDownHandler:function(keyCode){
             if (keyCode == 13) {
                 $("#de_login_form").submit();
             }
        }
    }
})(DE.uiManager,DE.config,DE.historyManager,DE.storeManager);
