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
                               figure:"/DesignEngine_Web/data/people1.jpg",
                               name:"dddddd",
                               userId:1,
                               description:"ddddddddd",
                               email:"csboy@163.com"
                           });
                           DE.UIManager.showLoginMenu({user:DE.store.currentUser,root:DE.config.root});
                           DE.UIManager.hideAllMenuAndPopouts();

                           $(form).clearForm();
                       },
                       error:function (data) {
                           DE.store.initCurrentUser({
                               role:"user",
                               figure:"/DesignEngine_Web/data/people1.jpg",
                               name:"dddddd",
                               userId:1,
                               description:"ddddddddd",
                               email:"csboy@163.com"
                           });

                           DE.UIManager.showLoginMenu({user:DE.store.currentUser,root:DE.config.root});
                           DE.UIManager.hideAllMenuAndPopouts();

                           $(form).clearForm();
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
                   console.log(openId+":"+accessToken);

               });
           });
       },
       ajaxRegister:function(){
           $("#de_register_form").validate({
               rules:{
                   de_reg_username:{
                       required:true,
                       remote :{
                           url : DE.config.ajaxUrls.usernameValidate, //后台处理程序
                           type : "get", //数据发送方式
                           data : {
                              username:function() {//要传递的数据
                                   return $("#de_reg_username").val();
                               }
                           }
                       }
                   },
                   de_reg_email:{
                       required:true,
                       email:true,
                       remote :{
                           url : DE.config.ajaxUrls.emailValidate, //后台处理程序
                           type : "get", //数据发送方式
                           data : {
                               email : function() {//要传递的数据
                                   return $("#de_reg_email").val();
                               }
                           }
                       }
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

                       },
                       dataType:"json",
                       success:function (data) {

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
       getValidCode:function(){
           $.ajax({
               url:DE.config.urls.getHotUsers,
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
               },
               error:function(){
                   DE.store.clearCurrentUser();
                   DE.UIManager.showLoginMenu({user:DE.store.currentUser,root:DE.config.root});
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
       }
   }
})();

$(document).ready(function(){
    $("#de_reg_btn").click(function(){
        DE.login.getValidCode();
        DE.UIManager.showRegPopout();

        return false;
    });

    //登陆
    DE.login.ajaxLogin();

    DE.login.ajaxRegister();


    //DE.login.QQLoginHandler();


});
