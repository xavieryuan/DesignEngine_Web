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

                   $(form).ajaxSubmit({
                       url:DE.config.ajaxUrls.login,
                       dataType:"json",
                       success:function (data) {


                           DE.store.initCurrentUser({
                               role:"user",
                               figure:"data/people1.jpg",
                               name:"dddddd",
                               userId:1,
                               description:"ddddddddd",
                               email:"csboy@163.com"
                           });
                           DE.UIManager.showLoginMenu({user:DE.store.currentUser});
                           DE.UIManager.hideAllMenuAndPopouts();

                           $(form).clearForm();

                           //成功后如果在用户页面需要重新加载数据
                           if(window.location.href.indexOf("user")!=-1&&window.location.href.indexOf("hot")==-1){
                               DE.history.initDatas();
                           }
                       },
                       error:function (data) {
                           DE.store.initCurrentUser({
                               role:"user",
                               figure:"data/people1.jpg",
                               name:"dddddd",
                               userId:1,
                               description:"ddddddddd",
                               email:"csboy@163.com"
                           });

                           DE.UIManager.showLoginMenu({user:DE.store.currentUser});
                           DE.UIManager.hideAllMenuAndPopouts();

                           $(form).clearForm();

                           //成功后如果在用户页面需要重新加载数据
                           if(window.location.href.indexOf("user")!=-1&&window.location.href.indexOf("hot")==-1){
                               DE.history.initDatas();
                           }

                       }
                   });
               }
           });

       },
       QQLoginHandler:function(){
           QC.Login({
               btnId:"de_qq_login"    //插入按钮的节点id
           },function(reqData, oOpts){
               QC.Login.getMe(function(openId, accessToken){
                   //console.log("openId:"+openId+":"+accessToken);

                   $.ajax({
                       url:DE.config.ajaxUrls.sendOpenId,
                       data:{
                           openId:openId,
                           openIdSource:"qq"
                       },
                       type:"post",
                       dataType:"json",
                       success:function(data){
                           if(data.success){

                               DE.store.initCurrentUser({
                                   role:data.role,
                                   figure:data.profileImg,
                                   name:data.accountFullname,
                                   userId:data.accountId,
                                   description:data.profileDescription,
                                   email:data.accountEmail,
                                   status:data.accountStatus
                               });

                               DE.UIManager.showLoginMenu({user:DE.store.currentUser});
                               DE.UIManager.hideAllMenuAndPopouts();

                               //成功后如果在用户页面需要重新加载数据
                               if(window.location.href.indexOf("user")!=-1&&window.location.href.indexOf("hot")==-1){
                                   DE.history.initDatas();
                               }

                           }else{
                               if(data.errorCode){

                                   //记录下openId，然后再注册的时候带回给后台
                                   DE.store.currentUser.openId=openId;
                                   DE.store.currentUser.accessToken=accessToken;
                                   DE.UIManager.showRegPopout();
                               }
                           }
                       },
                       error:function(){

                       }
                   })

               });
           });
       },
       ajaxBand:function(){
           $("#de_band_form").validate({
               rules:{
                   de_band_email:{
                       required:true,
                       email:true
                   }
               },
               messages:{
                   de_band_email:{
                       required:"请输入邮箱！",
                       email:"请输入正确的邮箱格式！"
                   }
               },
               submitHandler:function(form) {
                   $(form).ajaxSubmit({
                       url:DE.config.ajaxUrls.bandOldCount,
                       type:"post",
                       data:{

                       },
                       dataType:"json",
                       success:function (data) {
                            console.log(data);
                       },
                       error:function (data) {

                       }
                   });
               }
           });
       },
       ajaxRegister:function(){
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
                       remote:"邮箱已经被注册，请填写其他邮箱！"
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
                           console.log(data);
                           if(data.success){

                               //设置store的currentUser，显示用户菜单，关闭弹出层，清空form

                               DE.store.initCurrentUser({
                                   role:data.role,
                                   figure:data.profileImg,
                                   name:data.accountFullname,
                                   userId:data.accountId,
                                   description:data.profileDescription,
                                   email:data.accountEmail,
                                   status:data.accountStatus
                               });

                               DE.UIManager.showLoginMenu({user:DE.store.currentUser});
                               DE.UIManager.hideAllMenuAndPopouts();
                               $(form).clearForm();

                               //不管注册成功或者失败，都需要重新刷一次验证码
                               $("#de_captcha_img").removeAttr("src").attr("src",DE.config.ajaxUrls.getValidCode);
                           }else{
                              $("#de_reg_error").text("验证码错误！");
                               $("#de_captcha_img").removeAttr("src").attr("src",DE.config.ajaxUrls.getValidCode);
                           }
                       },
                       error:function (data) {

                       }
                   });
               }
           });
       },
       forgetPassword:function(){
           $.ajax({
               url:DE.config.ajaxUrls.forgetPassword,
               type:"post",
               data:{

               },
               dataType:"json",
               success:function(data){

               },
               error:function(){

               }

           });
       },
       logout:function(){
           $.ajax({
               url:DE.config.root,
               type:"post",
               dataType:"json",
               success:function(data){

                   //清空显示的信息
                   DE.store.clearCurrentUser();
                   DE.UIManager.showLoginMenu({user:DE.store.currentUser});
                   window.location.href=DE.config.root;
               },
               error:function(){
                   DE.store.clearCurrentUser();
                   DE.UIManager.showLoginMenu({user:DE.store.currentUser});
                   window.location.href=DE.config.root;
               }

           });
       },
       rememberMeHandler:function(){
           var emailValue=$("#de_login_email").val();
           if(!$.cookie("email")||$.cookie("email")!=emailValue){
               var expiration = new Date((new Date()).getTime() + 7*24*60* 60000);//设置时间
               $.cookie("email", emailValue, { expires: expiration }); // 存储一个带15分钟期限的 cookie
           }
           if ($("#de_remember_me").is(":checked")) {
               var password = $("#de_login_pwd").val();
               var expiration = new Date((new Date()).getTime() + 7*24*60* 60000);//设置时间
               $.cookie("rememberMe", "true", { expires: expiration }); // 存储一个带15分钟期限的 cookie
               $.cookie("password", password, { expires: expiration }); // 存储一个带15分钟期限的 cookie
           }else {
               $.cookie("rememberMe", "false", { expires: -1 });
               //$.cookie("username", '', { expires: -1 });
               $.cookie("password", '', { expires: -1 });
           }
       },
       initLoginForm:function(){
           $("#de_login_email").val($.cookie("email"));
           if ($.cookie("rememberMe") == "true") {
               $("#de_remember_me").prop("checked","checked");
               $("#de_login_pwd").val($.cookie("password"));
           }
       },

       /**
        * 登陆超时，重新登陆操作
        */
       timeoutLogin:function(){

       },

       /*
       * 每次进入页面都需要向后台请求是否登录,后台根据session判断是否登录
       * */
       checkLogin:function(){

           //设置为第一次进入页面，在store的clear中进行清除
           DE.store.isFirstLoad=true;

           $.ajax({
               url:DE.config.ajaxUrls.checkLogin,
               type:"post",
               dataType:"json",
               success:function(data){

                   //每次进入页面都需要根据地址取数据,需要在login那里的checkLogin里面调用
                   DE.history.initDatas();

                   //初始化登陆菜单
                   DE.UIManager.showLoginMenu({user:DE.store.currentUser});
               },
               error:function(){

                   //每次进入页面都需要根据地址取数据,需要在login那里的checkLogin里面调用
                   DE.history.initDatas();

                   //初始化登陆菜单
                   DE.UIManager.showLoginMenu({user:DE.store.currentUser});
               }
           });
       }
   }
})();

$(document).ready(function(){

    //进入页面，请求后台是否登录
    DE.login.checkLogin();

    $("#de_reg_btn").click(function(){
        DE.UIManager.showRegPopout();

        return false;
    });

    $("#de_refresh_captcha").click(function(){
        $("#de_captcha_img").removeAttr("src").attr("src",DE.config.ajaxUrls.getValidCode);

        //$(this).attr('src')+'?'+Math.random()

        return false;
    });

    //登陆
    DE.login.ajaxLogin();

    //注册
    DE.login.ajaxRegister();

    //QQ登陆
    DE.login.QQLoginHandler();


});
