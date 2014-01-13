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

            //成功后如果在用户页面需要重新加载数据
            var href=window.location.href;
            if((href.indexOf("user")!=-1&&href.indexOf("hot")==-1)||href.indexOf("item")!=-1){
                historyManager.initDatas();
            }
        }else{
            if(data.errorCode&&data.errorCode===config.errorCode.email_not_confirm){
                $("#de_login_error").text(config.messageCode.emailNotConfirm);
            }else{
                $("#de_login_error").text(config.messageCode.nameOrPwdError);
            }
        }

        uiManager.hideLoading();
    }

    return {

       /**
        * 登录
        */
       ajaxLogin:function(){
           var me=this;
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
                       $.ajax({
                           url:config.ajaxUrls.sendOpenId,
                           data:{
                               openId:openId,
                               accessToken:accessToken,
                               openIdSource:"qq"
                           },
                           type:"post",
                           dataType:"json",
                           success:function(data){
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

                                   //成功后如果在用户页面需要重新加载数据
                                   var href=window.location.href;
                                   if((href.indexOf("user")!=-1&&href.indexOf("hot")==-1)||href.indexOf("item")!=-1){
                                       historyManager.initDatas();
                                   }

                               }else{
                                   if(data.errorCode==config.errorCode.account_required){

                                       //记录下openId，然后再注册的时候带回给后台
                                       storeManager.currentUser.openId=openId;
                                       storeManager.currentUser.accessToken=accessToken;
                                       uiManager.showRegPopout();
                                   }else{
                                       uiManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.operationError);

                                   }
                               }

                               QC.Login.signOut();
                           },
                           error:function(){
                               config.ajaxErrorHandler();
                               QC.Login.signOut();
                           }
                       })

                   });
               }
           });
       },

       /**
        *老用户绑定
        */
       QQBindHandler:function(){
           QC.Login({
               btnId:"de_bind_account_btn"    //插入按钮的节点id
           },function(reqData, oOpts){

               QC.Login.getMe(function(openId, accessToken){
                   $.ajax({
                       url:config.ajaxUrls.bindOldAccount,
                       data:{
                           openId:openId,
                           accessToken:accessToken,
                           openIdSource:"qq"
                       },
                       type:"post",
                       dataType:"json",
                       success:function(data){
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
                       },
                       error:function(){
                           config.ajaxErrorHandler();
                           QC.Login.signOut();
                       }
                   })

               });
           });
       },

       /**
        * 解除绑定
        */
       unBindHandler:function(){
           $.ajax({
               url:config.ajaxUrls.unBindAccount,
               type:"post",
               dataType:"json",
               success:function(data){
                    if(data.success&&data.resultCode==config.resultCode.unbind_succ){

                        $("#de_has_bind").addClass("de_hidden");
                        $("#de_bind_account_btn").removeClass("de_hidden");
                        $("#de_remove_bind").addClass("de_hidden");

                    }else{
                        config.ajaxReturnErrorHandler(data);
                    }

                   //让QQ登出
                   QC.Login.signOut();
               },
               error:function(data){
                   config.ajaxErrorHandler();
                   QC.Login.signOut();
               }
           });
       },

       /**
        * 注册
        */
       ajaxRegister:function(){
           var me=this;
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

                   uiManager.showLoading();
                   $(form).ajaxSubmit({
                       url:config.ajaxUrls.register,
                       type:"post",
                       data:{
                           openId:storeManager.currentUser.openId,
                           openIdSource:storeManager.currentUser.openIdSource,
                           accessToken:storeManager.currentUser.accessToken
                       },
                       dataType:"json",
                       success:function (data) {
                           if(data.success&&data.resultCode==config.resultCode.account_register_succ){

                               //通过qq登录的才设置store的currentUser，显示用户菜单，关闭弹出层，清空form
                               if(storeManager.currentUser.openId){

                                   //重新获取登录用户
                                   me.checkLogin();

                                   //uiManager.showLoginMenu({user:storeManager.currentUser});

                                   //隐藏弹出层
                                   //uiManager.hideAllMenuAndPopouts();
                               }

                               uiManager.showMsgPopout(config.messageCode.successTitle,config.messageCode.registerSuccess);
                               $(form).clearForm();

                           }else{
                               if(data.errorCode=="captcha_unmatches"){
                                   $("#de_reg_error").text(config.messageCode.validCodeError);
                               }else{
                                   $("#de_reg_error").text(config.messageCode.operationError);
                               }
                           }

                           //不管注册成功或者失败，都需要重新刷一次验证码
                           $("#de_captcha_img").removeAttr("src").attr("src",config.ajaxUrls.getValidCode);

                           uiManager.hideLoading();
                       },
                       error:function (data) {
                           config.ajaxErrorHandler();
                       }
                   });
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
                   uiManager.showLoading();
                   $(form).ajaxSubmit({
                       url:config.ajaxUrls.forgetPassword,
                       type:"post",
                       dataType:"json",
                       success:function (data) {
                           if(data.success&&data.resultCode==config.resultCode.password_reset_succ){
                               uiManager.showMsgPopout(config.messageCode.successTitle,config.messageCode.emailSendSuccess);
                           }else if(data.success&&data.resultCode==config.resultCode.password_reset_invalid_email){
                               uiManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.emailNotExist);
                           }else{
                                config.ajaxReturnErrorHandler(data);
                           }

                           uiManager.hideLoading();
                       },
                       error:function (data) {
                           config.ajaxErrorHandler();
                       }
                   });
               }
           });
       },

       /**
        * 登出
        */
       logout:function(){
           $.ajax({
               url:config.ajaxUrls.logOut,
               type:"post",
               dataType:"json",
               success:function(data){
                   if(data.success){

                       //qq登出
                       QC.Login.signOut();

                       //跳转页面
                       window.location.href=document.baseURI||$("#de_base_url").attr("href");
                   }else{
                       uiManager.showMsgPopout(config.messageCode.errorTitle,config.messageCode.operationError);
                   }
               },
               error:function(){
                   config.ajaxErrorHandler();
               }

           });
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

       /*
       * 每次进入页面都需要向后台请求是否登录,后台根据session判断是否登录
       * */
       checkLogin:function(){

           $.ajax({
               url:config.ajaxUrls.checkLogin,
               type:"post",
               dataType:"json",
               success:function(data){
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

                    //只有不存在openid时才初始化数据，如果存在是从QQ登录来的，此时已经有数据了
                    if(!storeManager.currentUser.openId){

                       //每次进入页面都需要根据地址取数据,需要在login那里的checkLogin里面调用
                       historyManager.initDatas();
                    }

                    //不管是否登录都初始化登陆菜单
                    uiManager.showLoginMenu({user:storeManager.currentUser});

               },
               error:function(){

                   //只有不存在openid是才初始化数据，如果存在是从QQ登录来的，此时已经有数据了
                   if(!storeManager.currentUser.openId){
                       //每次进入页面都需要根据地址取数据,需要在login那里的checkLogin里面调用
                       historyManager.initDatas();
                   }

                   //不管是否登录都初始化登陆菜单
                   uiManager.showLoginMenu({user:storeManager.currentUser});

               }
           });
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
           $("#de_captcha_img").removeAttr("src").attr("src", config.ajaxUrls.getValidCode);

           //$(#de_captcha_img).attr('src')+'?'+Math.random()
       },
       pwdInputKeyDownHandler:function(keyCode){
           if (keyCode == 13) {
               $("#de_login_form").submit();
           }
       },
       stateChangeHandler:function(){
           historyManager.stateChange(event);
       }
    }
})(DE.uiManager,DE.config,DE.historyManager,DE.storeManager);
