/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.login=(function(){
   return {
       ajaxLogin:function(){
           $("#form").ajaxSubmit({
               url:DE.config.uploadAction,
               type:"post",
               data:{

               },
               dataType:"json",
               success:function (data) {
                   if (data.info == 1) {

                   } else {

                   }
               },
               error:function (data) {

               }
           });
       },
       QQLogin:function(){
           QC.Login({
               btnId:"qq_link"    //插入按钮的节点id
           },function(reqData, oOpts){

               //登陆后获取openId发送到后台
               QC.Login.getMe(function(openId, accessToken){

                   $.ajax({
                       url:DE.config.ajaxUrls.login,
                       type:"post",
                       data:{

                       },
                       dataType:"json",
                       success:function(data){

                       },
                       error:function(){

                       }

                   });

               });
           });
       },
       checkLoginValid:function(){

       },
       checkRegisterValid:function(){

       },
       register:function(){
           $("#form").ajaxSubmit({
               url:DE.config.uploadAction,
               type:"post",
               data:{

               },
               dataType:"json",
               success:function (data) {
                   if (data.info == 1) {

                   } else {

                   }
               },
               error:function (data) {

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
               url:DE.config.urls.getHotUsers,
               type:"post",
               data:{

               },
               dataType:"json",
               success:function(data){

                   //清空显示的信息
               },
               error:function(){

               }

           });
       }
   }
})();

$(document).ready(function(){

});
