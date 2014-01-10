/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * 登陆、注册、忘记密码、绑定旧账号
 */
var DE=DE||{};
DE.loginManager=(function(uiManager,config,historyManager){
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
                       required:DE.config.validError.emailRequired,
                       email:DE.config.validError.emailFormatError
                   },
                   de_login_pwd: DE.config.validError.pwdRequired

               },
               submitHandler:function(form) {

                   me.rememberMeHandler();
                   DE.uiManager.showLoading();

                   $(form).ajaxSubmit({
                       url:DE.config.ajaxUrls.login,
                       dataType:"json",
                       success:function (data) {

                           if(data.success&&data.resultCode==DE.config.resultCode.account_login_succ){
                               DE.storeManager.initCurrentUser({
                                   role:data.userinfo.userRoles[0],
                                   figure:data.userinfo.userProfileImg,
                                   name:data.userinfo.userName,
                                   userId:data.userinfo.userId,
                                   description:data.userinfo.userDescribe,
                                   email:data.userinfo.userEmail,
                                   status:data.userinfo.userStatus,
                                   regLocked:data.userinfo.regLocked
                               });

                               DE.uiManager.showLoginMenu({user:DE.storeManager.currentUser});
                               DE.uiManager.hideAllMenuAndPopouts();

                               $(form).clearForm();

                               //成功后如果在用户页面需要重新加载数据
                               var href=window.location.href;
                               if((href.indexOf("user")!=-1&&href.indexOf("hot")==-1)||href.indexOf("item")!=-1){
                                   DE.historyManager.initDatas();
                               }
                           }else{
                               if(data.errorCode&&data.errorCode===DE.config.errorCode.email_not_confirm){
                                   $("#de_login_error").text(DE.config.messageCode.emailNotConfirm);
                               }else{
                                   $("#de_login_error").text(DE.config.messageCode.nameOrPwdError);
                               }
                           }

                           DE.uiManager.hideLoading();
                       },
                       error:function (data) {
                           DE.config.ajaxErrorHandler();
                       }
                   });
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
               if(!DE.storeManager.currentUser.userId){
                   QC.Login.getMe(function(openId, accessToken){
                       $.ajax({
                           url:DE.config.ajaxUrls.sendOpenId,
                           data:{
                               openId:openId,
                               accessToken:accessToken,
                               openIdSource:"qq"
                           },
                           type:"post",
                           dataType:"json",
                           success:function(data){
                               if(data.success&&data.resultCode==DE.config.resultCode.account_login_succ){

                                   DE.storeManager.initCurrentUser({
                                       role:data.userinfo.userRoles[0],
                                       figure:data.userinfo.userProfileImg,
                                       name:data.userinfo.userName,
                                       userId:data.userinfo.userId,
                                       description:data.userinfo.userDescribe,
                                       email:data.userinfo.userEmail,
                                       status:data.userinfo.userStatus,
                                       regLocked:data.userinfo.regLocked
                                   });


                                   DE.uiManager.showLoginMenu({user:DE.storeManager.currentUser});
                                   DE.uiManager.hideAllMenuAndPopouts();

                                   //成功后如果在用户页面需要重新加载数据
                                   var href=window.location.href;
                                   if((href.indexOf("user")!=-1&&href.indexOf("hot")==-1)||href.indexOf("item")!=-1){
                                       DE.historyManager.initDatas();
                                   }

                               }else{
                                   if(data.errorCode==DE.config.errorCode.account_required){

                                       //记录下openId，然后再注册的时候带回给后台
                                       DE.storeManager.currentUser.openId=openId;
                                       DE.storeManager.currentUser.accessToken=accessToken;
                                       DE.uiManager.showRegPopout();
                                   }else{
                                       DE.uiManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.operationError);

                                   }
                               }

                               QC.Login.signOut();
                           },
                           error:function(){
                               DE.config.ajaxErrorHandler();
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
                       url:DE.config.ajaxUrls.bindOldAccount,
                       data:{
                           openId:openId,
                           accessToken:accessToken,
                           openIdSource:"qq"
                       },
                       type:"post",
                       dataType:"json",
                       success:function(data){
                           if(data.success&&data.resultCode==DE.config.resultCode.bind_succ){

                               //显示绑定成功
                               $("#de_bind_account_btn").addClass("de_hidden");
                               $("#de_remove_bind").removeClass("de_hidden");
                               $("#de_has_bind").removeClass("de_hidden");
                           }else{
                               DE.uiManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.operationError);

                           }

                           //让QQ登出
                           QC.Login.signOut();
                       },
                       error:function(){
                           DE.config.ajaxErrorHandler();
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
               url:DE.config.ajaxUrls.unBindAccount,
               type:"post",
               dataType:"json",
               success:function(data){
                    if(data.success&&data.resultCode==DE.config.resultCode.unbind_succ){

                        $("#de_has_bind").addClass("de_hidden");
                        $("#de_bind_account_btn").removeClass("de_hidden");
                        $("#de_remove_bind").addClass("de_hidden");

                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }

                   //让QQ登出
                   QC.Login.signOut();
               },
               error:function(data){
                   DE.config.ajaxErrorHandler();
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
                       remote : DE.config.ajaxUrls.usernameValidate //后台处理程序
                   },
                   de_reg_email:{
                       required:true,
                       email:true,
                       remote : DE.config.ajaxUrls.emailValidate //后台处理程序
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
                       required:DE.config.validError.usernameRequired,
                       remote:DE.config.validError.usernameExist
                   },
                   de_reg_email:{
                       required:DE.config.validError.emailRequired,
                       email:DE.config.validError.emailFormatError,
                       remote:DE.config.validError.emailExistWithLogin
                   },
                   de_reg_pwd:{
                       required:DE.config.validError.pwdRequired,
                       rangelength:DE.config.validError.pwdLengthError
                   },
                   de_reg_code:{
                       required:DE.config.validError.validCodeRequired
                   }
               },
               submitHandler:function(form) {

                   DE.uiManager.showLoading();
                   $(form).ajaxSubmit({
                       url:DE.config.ajaxUrls.register,
                       type:"post",
                       data:{
                           openId:DE.storeManager.currentUser.openId,
                           openIdSource:DE.storeManager.currentUser.openIdSource,
                           accessToken:DE.storeManager.currentUser.accessToken
                       },
                       dataType:"json",
                       success:function (data) {
                           if(data.success&&data.resultCode==DE.config.resultCode.account_register_succ){

                               //通过qq登录的才设置store的currentUser，显示用户菜单，关闭弹出层，清空form
                               if(DE.storeManager.currentUser.openId){

                                   //重新获取登录用户
                                   me.checkLogin();

                                   //DE.uiManager.showLoginMenu({user:DE.storeManager.currentUser});

                                   //隐藏弹出层
                                   //DE.uiManager.hideAllMenuAndPopouts();
                               }

                               DE.uiManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.registerSuccess);
                               $(form).clearForm();

                           }else{
                               if(data.errorCode=="captcha_unmatches"){
                                   $("#de_reg_error").text(DE.config.messageCode.validCodeError);
                               }else{
                                   $("#de_reg_error").text(DE.config.messageCode.operationError);
                               }
                           }

                           //不管注册成功或者失败，都需要重新刷一次验证码
                           $("#de_captcha_img").removeAttr("src").attr("src",DE.config.ajaxUrls.getValidCode);

                           DE.uiManager.hideLoading();
                       },
                       error:function (data) {
                           DE.config.ajaxErrorHandler();
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
                       required:DE.config.validError.emailRequired,
                       email:DE.config.validError.emailFormatError
                   }
               },
               submitHandler:function(form) {
                   DE.uiManager.showLoading();
                   $(form).ajaxSubmit({
                       url:DE.config.ajaxUrls.forgetPassword,
                       type:"post",
                       dataType:"json",
                       success:function (data) {
                           if(data.success&&data.resultCode==DE.config.resultCode.password_reset_succ){
                               DE.uiManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.emailSendSuccess);
                           }else if(data.success&&data.resultCode==DE.config.resultCode.password_reset_invalid_email){
                               DE.uiManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.emailNotExist);
                           }else{
                                DE.config.ajaxReturnErrorHandler(data);
                           }

                           DE.uiManager.hideLoading();
                       },
                       error:function (data) {
                           DE.config.ajaxErrorHandler();
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
               url:DE.config.ajaxUrls.logOut,
               type:"post",
               dataType:"json",
               success:function(data){
                   if(data.success){

                       //qq登出
                       QC.Login.signOut();

                       //跳转页面
                       window.location.href=document.baseURI||$("#de_base_url").attr("href");
                   }else{
                       DE.uiManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.operationError);
                   }
               },
               error:function(){
                   DE.config.ajaxErrorHandler();
               }

           });
       },

       /**
        * 记住我
        */
       rememberMeHandler:function(){
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
               url:DE.config.ajaxUrls.checkLogin,
               type:"post",
               dataType:"json",
               success:function(data){
                    if(data.success){
                        DE.storeManager.initCurrentUser({
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
                    if(!DE.storeManager.currentUser.openId){

                       //每次进入页面都需要根据地址取数据,需要在login那里的checkLogin里面调用
                       DE.historyManager.initDatas();
                    }

                    //不管是否登录都初始化登陆菜单
                    DE.uiManager.showLoginMenu({user:DE.storeManager.currentUser});

               },
               error:function(){

                   //只有不存在openid是才初始化数据，如果存在是从QQ登录来的，此时已经有数据了
                   if(!DE.storeManager.currentUser.openId){
                       //每次进入页面都需要根据地址取数据,需要在login那里的checkLogin里面调用
                       DE.historyManager.initDatas();
                   }

                   //不管是否登录都初始化登陆菜单
                   DE.uiManager.showLoginMenu({user:DE.storeManager.currentUser});

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
})(DE.uiManager,DE.config,DE.historyManager);
