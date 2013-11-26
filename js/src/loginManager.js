/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * 登陆、注册、忘记密码、绑定旧账号
 */
var DE=DE||{};
DE.login=(function(){
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
                       required:"请输入邮箱！",
                       email:"请输入正确的邮箱格式！"
                   },
                   de_login_pwd: "请输入密码！"

               },
               submitHandler:function(form) {

                   me.rememberMeHandler();
                   DE.UIManager.showLoading();

                   $(form).ajaxSubmit({
                       url:DE.config.ajaxUrls.login,
                       dataType:"json",
                       success:function (data) {

                           if(data.success&&data.resultCode==DE.config.resultCode.account_login_succ){
                               DE.store.initCurrentUser({
                                   role:data.userinfo.userRoles[0],
                                   figure:data.userinfo.userProfileImg,
                                   name:data.userinfo.userName,
                                   userId:data.userinfo.userId,
                                   description:data.userinfo.userDescribe,
                                   email:data.userinfo.userEmail,
                                   status:data.userinfo.userStatus
                               });

                               DE.UIManager.showLoginMenu({user:DE.store.currentUser});
                               DE.UIManager.hideAllMenuAndPopouts();

                               $(form).clearForm();

                               //成功后如果在用户页面需要重新加载数据
                               if(window.location.href.indexOf("user")!=-1&&window.location.href.indexOf("hot")==-1){
                                   DE.history.initDatas();
                               }
                           }else{
                               $("#de_login_error").text(DE.config.messageCode.nameOrPwdError);
                           }

                           DE.UIManager.hideLoading();
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
               if(!DE.store.currentUser.userId){
                   QC.Login.getMe(function(openId, accessToken){
                       $.ajax({
                           url:DE.config.ajaxUrls.sendOpenId,
                           data:{
                               openId:openId,
                               openIdSource:"qq"
                           },
                           type:"post",
                           dataType:"json",
                           success:function(data){
                               if(data.success&&data.resultCode==DE.config.resultCode.account_login_succ){

                                   DE.store.initCurrentUser({
                                       role:data.userinfo.userRoles[0],
                                       figure:data.userinfo.userProfileImg,
                                       name:data.userinfo.userName,
                                       userId:data.userinfo.userId,
                                       description:data.userinfo.userDescribe,
                                       email:data.userinfo.userEmail,
                                       status:data.userinfo.userStatus
                                   });


                                   DE.UIManager.showLoginMenu({user:DE.store.currentUser});
                                   DE.UIManager.hideAllMenuAndPopouts();

                                   //成功后如果在用户页面需要重新加载数据
                                   if(window.location.href.indexOf("user")!=-1&&window.location.href.indexOf("hot")==-1){
                                       DE.history.initDatas();
                                   }

                               }else{
                                   if(data.errorCode==DE.config.errorCode.account_required){

                                       //记录下openId，然后再注册的时候带回给后台
                                       DE.store.currentUser.openId=openId;
                                       DE.store.currentUser.accessToken=accessToken;
                                       DE.UIManager.showRegPopout();
                                   }else{
                                       DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.operationError);

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
                               DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.operationError);

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
                       required:"请输入用户名！",
                       remote:"用户名已经被注册，请填写其他用户名！"
                   },
                   de_reg_email:{
                       required:"请输入邮箱！",
                       email:"请输入正确的邮箱格式！",
                       remote:"此邮箱已注册，请<a id='de_direct_login' class='de_direct_login' href='#'>直接登录</a>或更换邮箱！"
                   },
                   de_reg_pwd:{
                       required:"请输入密码！",
                       rangelength:"请输入6-20位的密码！"
                   },
                   de_reg_code:{
                       required:"请输入验证码！"
                   }
               },
               submitHandler:function(form) {

                   DE.UIManager.showLoading();
                   $(form).ajaxSubmit({
                       url:DE.config.ajaxUrls.register,
                       type:"post",
                       data:{
                           openId:DE.store.currentUser.openId,
                           openIdSource:DE.store.currentUser.openIdSource,
                           accessToken:DE.store.currentUser.accessToken
                       },
                       dataType:"json",
                       success:function (data) {
                           if(data.success&&data.resultCode==DE.config.resultCode.account_register_succ){

                               //通过qq登录的才设置store的currentUser，显示用户菜单，关闭弹出层，清空form
                               if(DE.store.currentUser.openId){

                                   //重新获取登录用户
                                   me.checkLogin();

                                   //DE.UIManager.showLoginMenu({user:DE.store.currentUser});

                                   //隐藏弹出层
                                   //DE.UIManager.hideAllMenuAndPopouts();
                               }

                               DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.operationSuccess);
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

                           DE.UIManager.hideLoading();
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
                       required:"请输入邮箱！",
                       email:"请输入正确的邮箱格式！"
                   }
               },
               submitHandler:function(form) {
                   DE.UIManager.showLoading();
                   $(form).ajaxSubmit({
                       url:DE.config.ajaxUrls.forgetPassword,
                       type:"post",
                       dataType:"json",
                       success:function (data) {
                           if(data.success&&data.resultCode==DE.config.resultCode.password_reset_succ){
                               DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.emailSendSuccess);
                           }else if(data.success&&data.resultCode==DE.config.resultCode.password_reset_invalid_email){
                               DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.emailNotExist);
                           }else{
                                DE.config.ajaxReturnErrorHandler(data);
                           }

                           DE.UIManager.hideLoading();
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
                       DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.operationError);
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
                        DE.store.initCurrentUser({
                            role:data.user.userRoles[0],
                            figure:data.user.userProfileImg,
                            name:data.user.userName,
                            userId:data.user.userId,
                            description:data.user.userDescribe,
                            email:data.user.userEmail,
                            status:data.user.userStatus
                        });
                    }

                    //只有不存在openid是才初始化数据，如果存在是从QQ登录来的，此时已经有数据了
                    if(!DE.store.currentUser.openId){

                       //每次进入页面都需要根据地址取数据,需要在login那里的checkLogin里面调用
                       DE.history.initDatas();
                    }

                    //不管是否登录都初始化登陆菜单
                    DE.UIManager.showLoginMenu({user:DE.store.currentUser});

               },
               error:function(){

                   //只有不存在openid是才初始化数据，如果存在是从QQ登录来的，此时已经有数据了
                   if(!DE.store.currentUser.openId){
                       //每次进入页面都需要根据地址取数据,需要在login那里的checkLogin里面调用
                       DE.history.initDatas();
                   }

                   //不管是否登录都初始化登陆菜单
                   DE.UIManager.showLoginMenu({user:DE.store.currentUser});

               }
           });
       }
   }
})();

$(document).ready(function(){
    //DE.login.checkLogin();//放到getTags里面

    //注册按钮点击
    $("#de_reg_btn").click(function(){

        DE.UIManager.showRegPopout();

        return false;
    });

    //取消绑定
    $("#de_remove_bind").click(function(){
        DE.login.unBindHandler();
    });

    //邮箱已经被注册，直接登录
    $(document).on("click","#de_direct_login",function(){
        DE.login.initLoginForm();
        DE.UIManager.showLoginPopout();
        return false;
    });

    //忘记密码按钮点击事件
    $("#de_btn_forgot_pwd").on("click",function(){
        DE.UIManager.showRecoverPwdPopout();

        return false;
    });

    //刷新验证码
    $("#de_refresh_captcha").click(function(){
        $("#de_captcha_img").removeAttr("src").attr("src",DE.config.ajaxUrls.getValidCode);

        //$(this).attr('src')+'?'+Math.random()

        return false;
    });

    //enter提交表单
    $("#de_login_pwd").keydown(function(event){
        if(event.keyCode==13){
            $("#de_login_form").submit();
        }
    });

    //登陆
    DE.login.ajaxLogin();

    //注册
    DE.login.ajaxRegister();

    //QQ登陆
    DE.login.QQLoginHandler();


    //忘记密码
    DE.login.forgetPassword();
});
