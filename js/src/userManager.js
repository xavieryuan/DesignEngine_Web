/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * 用户相关模块（热点用户，用户页面，修改资料，绑定账号)
 */
var DE=DE||{};
DE.user=(function(){
    var userEntities=null;//存储到本地的用户作品资源数据
    var hotUsersOrder=null;
    return {

        /**
         * 用户头像上传句柄
         */
        createFigureUpload:function(){
            var uploaderFigure = new plupload.Uploader({
                runtimes:"html5",
                multi_selection:false,
                max_file_size:DE.config.uploadSize.maxImageSize,
                browse_button:"de_change_figure",
                container:"de_change_figure_container",
                url:DE.config.ajaxUrls.uploadFileUrl,
                unique_names:true,
                //urlstream_upload:true,
                //flash_swf_url : (document.baseURI||$("#de_base_url").attr("href"))+'js/lib/plupload.flash.swf',
                multipart_params:{
                    isThumb:true
                    //userId:DE.store.currentUser.userId
                },
                filters:[
                    {title:"Image files", extensions:DE.config.uploadFilters.imageFilter}
                ]
            });

            //初始化
            uploaderFigure.init();

            //文件添加事件
            uploaderFigure.bind("FilesAdded", function (up, files) {
                up.start();
            });

            //出错事件
            uploaderFigure.bind("Error", function (up, err) {
                if(err.message.match("Init")==null){
                    if(err.message.match("size")){
                        DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadSizeError+DE.config.uploadSize.maxMediaSize);
                    }else if(err.message.match("extension")){
                        DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadExtensionError+DE.config.uploadFilters.imageFilter);
                    }else{
                        DE.UIManager.showMsgPopout(DE.config.messageCode.errorTitle,DE.config.messageCode.uploadIOErrror);
                    }
                }
                up.refresh();
            });

            //上传完毕事件
            uploaderFigure.bind("FileUploaded", function (up, file, res) {
                var response = JSON.parse(res.response);
                if (response.success) {

                    $("#de_edit_figure").attr("src",response.url);
                } else {
                    DE.config.ajaxReturnErrorHandler(response);
                }
            });
        },

        /**
         * 获取热点用户的排序列表
         */
        getHotUsersOrder:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getHotUsersOrder,
                type:"get",
                dataType:"json",
                success:function(data){
                    if(data.success){

                        //判断是否有数据,避免getHotUsers中每次都判断
                        if(data.rank.length){
                            hotUsersOrder=data.rank;
                            me.getHotUsers(true);
                        }else{
                            me.showHotUsers({users:[]},true);
                            DE.store.hotUserLoadedCount=DE.config.hasNoMoreFlag;
                        }

                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }

                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }
            });
        },

        /**
         * 获取热点用户,只处理存在的情况
         * @param {Boolean} first 是否第一次获取，第一次获取需要显示screen
         */
        getHotUsers:function(first){
            var me=this;
            var userId="";
            if(DE.store.hotUserLoadedCount+DE.config.perLoadCount<hotUsersOrder.length){
                userId=hotUsersOrder.slice(DE.store.hotUserLoadedCount,DE.store.hotUserLoadedCount+DE.config.perLoadCount).join(",")
            }else{
                userId=hotUsersOrder.slice(DE.store.hotUserLoadedCount).join(",");
            }
            $.ajax({
                url:DE.config.ajaxUrls.getHotUsers,
                type:"get",
                dataType:"json",
                data:{
                    userId:userId
                },
                success:function(data){
                    if(data.success){
                        var length=data.users.length,i=0;
                        if(length==DE.config.perLoadCount){
                            DE.store.hotUserLoadedCount+=DE.config.perLoadCount;
                        }else{
                            DE.store.hotUserLoadedCount=DE.config.hasNoMoreFlag;
                        }

                        DE.store.currentScrollScreenType=DE.config.scrollScreenType.hotUser;

                        if(DE.config.checkMobile()){
                            for(;i<length;i++){
                                data.users[i]["projects"]=DE.entity.formatThumb(data.users[i]["projects"]);
                            }
                        }
                        me.showHotUsers(data,first);
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }

                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }
            });

        },

        /**
         *　显示热点用户
         * @param {Object} data 请求的时候后台返回的json数据
         * @param {Boolean} first 是否第一次请求
         */
        showHotUsers:function(data,first){
            var tpl=$("#hotUserTpl").html();
            var html=juicer(tpl,{hotUsers:data.users});

            if(first){
                if(!html.trim()){
                    var index=Math.floor(Math.random()*jsondata.data.length);
                    tpl=$("#noDataTpl").html();
                    html=juicer(tpl,jsondata.data[index]);
                }
                $("#de_hot_user_list").html(html);
                DE.UIManager.showScreen("#de_screen_designer");
            }else{
                $("#de_hot_user_list").append($(html));
            }
        },

        /**
         * 获取用户信息
         * @param {Number} id 需要获取的用户的id
         */
        getUserById:function(id){
            var me=this;

            $.ajax({
                url:DE.config.ajaxUrls.getUserById,
                type:"get",
                async:false, //使用同步，因为在showUserEntity中需要用到此步中涉及的信息(优秀作品处)
                dataType:"json",
                data:{
                   userId:id
                },
                success:function(data){
                    if(data.success){
                        DE.store.initCurrentShowUser(data.user);
                        DE.store.currentScrollScreenType=DE.config.scrollScreenType.userEntity;
                        me.showUserDetail(data);
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 显示用户信息
         * @param {Object} data 请求时后台返回的json数据
         */
        showUserDetail:function(data){
            var tpl=$("#userDetailTpl").html();
            data.user.role=data.user.userRoles[0];
            var html=juicer(tpl,data.user);
            $("#de_screen_user_profile").html($(html));
        },

        /**
         * 显示用户作品（资源）
         * @param {Boolean} isFirst 是否第一次请求，如果是要显示界面
         * @param {Function} callback 用户也显示完，需要执行的操作,主要是显示作品详情
         */
        showUserEntity:function(isFirst,callback){
            var tpl=$("#userEntitiesTpl").html();
            var dataObj={};
            dataObj.userId=DE.store.currentShowUser.userId;
            dataObj.userName=DE.store.currentShowUser.name;
            dataObj.userProfileImg=DE.store.currentShowUser.figure;
            dataObj.role=DE.store.currentShowUser.role;
            dataObj.showToolBar=this.canShowToolbar();

            if(DE.store.userEntitiesShowCount+DE.config.perLoadCount<userEntities.length){
                dataObj.userEntities=userEntities.slice(DE.store.userEntitiesShowCount,DE.store.userEntitiesShowCount+DE.config.perLoadCount);
                DE.store.userEntitiesShowCount+=DE.config.perLoadCount;
            }else{
                dataObj.userEntities=userEntities.slice(DE.store.userEntitiesShowCount);
                DE.store.userEntitiesShowCount=DE.config.hasNoMoreFlag;
            }

            var html=juicer(tpl,dataObj);
            $("#de_user_uploads").append(html);

            if(userEntities.length==0){
                var index=Math.floor(Math.random()*jsondata.data.length);
                tpl=$("#noDataTpl").html();
                html=juicer(tpl,jsondata.data[index]);
                $("#de_user_uploads .de_project_grid").html(html);
            }

            if(isFirst){
                DE.UIManager.showScreen("#de_screen_user_profile");
                if(callback){
                    callback();
                }
            }
        },

        /**
         * 显示优秀作品
         * @param {Object} data 包含一个作品对象数组的对象
         */
        showHonorEntity:function(data){
            var tpl=$("#userHonorProjectTpl").html();
            var html=juicer(tpl,data);
            $("#de_user_honor_projects").html(html);
        },

        /**
         * 用户页判断是否显示工具栏
         * @returns {boolean} true|false
         */
        canShowToolbar:function(){
            if(DE.store.currentShowUser.userId==DE.store.currentUser.userId||DE.store.currentUser.role==DE.config.roles.admin){
                return true;
            }

            return false;
        },

        /**
         * 获取用户的作品（资源)
         * @param {Number} id 用户id
         * @param {Function} callback 用户也显示完，需要执行的操作,主要是显示作品详情
         */
        getUserEntities:function(id,callback){
            var me=this;

            $.ajax({
                url:DE.config.ajaxUrls.getUserEntities,
                type:"get",
                dataType:"json",
                data:{
                    userId:id
                },
                success:function(data){
                    if(data.success){
                        userEntities=data.userEntities;

                        if(DE.config.checkMobile()){
                            userEntities=DE.entity.formatThumb(userEntities);
                        }
                        me.showUserEntity(true,callback);

                        //如果是普通用户，会有优秀作品
                        if(DE.store.currentShowUser.role==DE.config.roles.user){
                            me.showHonorEntity(me.filterProjects(data));
                        }
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }

                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 用户头像点击事件
         * @param {String} href 用户页地址
         * @param {Function} callback 用户也显示完，需要执行的操作,主要是显示作品详情
         */
        userClickHandler:function(href,callback){
            DE.UIManager.showLoading();
            DE.history.push(href);  //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var id=array[1];

            this.getUserById(id);
            this.getUserEntities(id,callback);

            //DE.UIManager.showScreen("#de_screen_user_profile");

        },

        /**
         *修改密码
         */
        changePassword:function(){
            $("#de_reset_pwd_form").validate({
                rules: {
                    oldPassword:{
                        required:true
                    },
                    newPassword:{
                        required:true,
                        rangelength:[6,20]
                    },
                    de_confirm_pwd: {
                        equalTo:"#de_reset_pwd"
                    }

                },
                messages: {
                    oldPassword:{
                        required:DE.config.validError.oldPwdRequired
                    },
                    newPassword: {
                        required:DE.config.validError.newPwdRequired,
                        rangelength:DE.config.validError.pwdLengthError
                    },
                    de_confirm_pwd: {
                        equalTo:DE.config.validError.pwdEqualError
                    }

                },
                submitHandler:function(form) {

                    DE.UIManager.showLoading();

                    $(form).ajaxSubmit({
                        url:DE.config.ajaxUrls.changePassword,
                        dataType:"json",
                        type:"post",
                        success:function (data) {
                            if(data.success&&data.resultCode==DE.config.resultCode.password_change_succ){
                                DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.changePwdSuccess);
                                setTimeout(function(){
                                    window.location.href=document.baseURI||$("#de_base_url").attr("href");
                                },2000);
                            }else{
                                DE.config.ajaxReturnErrorHandler(data);
                            }
                        },
                        error:function (data) {
                            DE.config.ajaxErrorHandler();
                        }
                    });
                }
            });
        },

        /**
         * 进入修改时设置信息
         */
        setProfile:function(){
            $("#de_user_name").text(DE.store.currentUser.name);
            $("#de_edit_description").val(DE.store.currentUser.description);
            $("#de_edit_login_email").val(DE.store.currentUser.email);
            $("#de_edit_figure").attr("src",DE.store.currentUser.figure);

            if(!DE.store.currentUser.regLocked){
                $.ajax({
                    url:DE.config.ajaxUrls.getNewEmail,
                    type:"get",
                    dataType:"json",
                    success:function (data) {
                        if(data.success){
                            if(data.status==DE.config.emailStatus.pending){
                                $("#de_email_error").text(DE.config.messageCode.emailPending.replace("${email}",data.email));
                            }else if(data.status==DE.config.emailStatus.invalid){
                                $("#de_email_error").text(DE.config.messageCode.emailInvalid.replace("${email}",data.email));
                            }else{
                                DE.store.initCurrentUser({
                                    email:data.email,
                                    regLocked:true
                                });
                                $("#de_edit_login_email").val(data.email);
                            }
                        }else{
                            DE.config.ajaxReturnErrorHandler(data);
                        }
                    },
                    error:function (data) {
                        DE.config.ajaxErrorHandler();
                    }
                })
            }
        },

        /**
         * 修改邮箱
         */
        changeEmail:function(){
            $("#de_form_edit_email").validate({
                rules: {
                    email:{
                        required:true,
                        email:true,
                        remote:{
                            url:DE.config.ajaxUrls.emailValidate,
                            data:{
                                de_reg_email:function() {
                                    return $("#de_edit_login_email").val();
                                }
                            }
                        }
                    }
                },
                messages: {
                    email: {
                        required:DE.config.validError.emailRequired,
                        email:DE.config.validError.emailFormatError,
                        remote:DE.config.validError.emailExist
                    }

                },
                submitHandler:function(form) {

                    DE.UIManager.showLoading();
                    $(form).ajaxSubmit({
                        url:DE.config.ajaxUrls.changeEmail,
                        dataType:"json",
                        type:"post",
                        success:function (data) {
                            if(data.success&&data.resultCode==DE.config.resultCode.account_update_succ){
                                DE.store.initCurrentUser({
                                    regLocked:false
                                });

                                DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.emailChangeSuccess);
                                DE.UIManager.hideLoading();
                            }else{
                                DE.config.ajaxReturnErrorHandler(data);
                            }
                        },
                        error:function (data) {
                            DE.config.ajaxErrorHandler();
                        }
                    });
                }
            });
        },

        /**
         * 修改个人信息
         */
        changeProfile:function(){
            $("#de_form_edit_profile").validate({
                rules: {
                    description:{
                        maxlength:140
                    }
                },
                messages: {
                    description:{
                        maxlength:DE.config.validError.descriptionLengthError
                    }
                },
                submitHandler:function(form) {

                    DE.UIManager.showLoading();
                    var profileImg= $("#de_edit_figure").attr("src");
                    $(form).ajaxSubmit({
                        url:DE.config.ajaxUrls.changeProfile,
                        dataType:"json",
                        type:"post",
                        data:{
                            profileImg:profileImg
                        },
                        success:function (data) {
                            if(data.success&&data.resultCode==DE.config.resultCode.account_update_succ){
                                var description=$("#de_edit_description").val();
                                DE.store.initCurrentUser({
                                    description:description,
                                    figure:profileImg
                                });
                                $(".de_user_link[href='user/"+DE.store.currentUser.userId+"'] img").attr("src",profileImg);

                                $(".user_about").text(description);

                                DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.operationSuccess);
                                DE.UIManager.hideLoading();
                            }else{
                                 DE.config.ajaxReturnErrorHandler(data);
                            }
                        },
                        error:function (data) {
                            DE.config.ajaxErrorHandler();
                        }
                    });
                }
            });
        },

        /**
         * 获取荣誉作品,只有作品能被贴荣誉标签
         */
        filterProjects:function(data){
            var array=[];
            $.each(data.userEntities,function(index,d){
                if(d.postHonorCount!=0){
                    array.push(d);
                }
            });

            return {projects:array};
        },

        /**
         *查看账户是否绑定了QQ等
         */
        accountHasBind:function(){
            $.ajax({
                url:DE.config.ajaxUrls.checkHasBind,
                dataType:"json",
                type:"get",
                success:function(data){
                    if(data.success){
                        if(!data.bind){

                            //QQ绑定
                            //DE.login.QQBindHandler();
                            $("#de_has_bind").addClass("de_hidden");
                            $("#de_remove_bind").addClass("de_hidden");
                        }else{
                            $("#de_bind_account_btn").addClass("de_hidden");
                        }
                        DE.login.QQBindHandler();
                        //DE.UIManager.showBindAccountPopout();
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }
            })
        }
    };
})();

$(document).ready(function(){
    $(document).on("click","a.de_user_link",function(){
        DE.user.userClickHandler($(this).attr("href"),null);

        return false;
    });

    DE.user.createFigureUpload();

    DE.user.changeProfile();

    DE.user.changeEmail();

    DE.user.changePassword();
});


