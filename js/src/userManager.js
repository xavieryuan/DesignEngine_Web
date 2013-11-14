/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * 用户相关模块（热点用户，用户页面，修改资料，绑定账号)
 */
var DE=DE||{};
DE.user=(function(){

    return {

        /**
         * 用户头像上传句柄
         */
        createFigureUpload:function(){
            var uploaderFigure = new plupload.Uploader({
                runtimes:"flash",
                multi_selection:false,
                max_file_size:DE.config.uploadSize.maxImageSize,
                browse_button:"de_change_figure",
                container:"de_change_figure_container",
                url:DE.config.ajaxUrls.uploadFileUrl,
                unique_names:true,
                flash_swf_url : document.baseURI+'js/lib/plupload.flash.swf',
                multipart_params:{
                    isThumb:true,
                    userId:DE.store.currentUser.userId
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
         *获取热点用户
         * @param {Boolean} first 是否第一次获取，第一次获取需要显示screen
         */
        getHotUsers:function(first){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getHotUsers,
                type:"get",
                dataType:"json",
                data:{
                    baseUserId:DE.store.hotUserLoadedId
                },
                success:function(data){
                    if(data.success){
                        var length=data.users.length;
                        if(length==DE.config.perLoadCount){
                            DE.store.hotUserLoadedId=data.users[data.users.length-1]["userId"];
                        }else{
                            DE.store.hotUserLoadedId=DE.config.hasNoMoreFlag;
                        }

                        DE.store.currentScrollScreenType=DE.config.scrollScreenType.hotUser;
                        //不管是否有数据，都需要执行函数，因为函数里有显示界面screen的操作
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
                async:false, //使用同步，因为在showUserEntity中需要用到此步中涉及的信息
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
            var html=juicer(tpl,data.user);
            $("#de_user_info_card").html($(html));
        },

        /**
         * 显示用户作品（资源）
         * @param {Object} data 请求数据时后台返回的数组
         */
        showUserEntity:function(data){
            var tpl=$("#userEntitiesTpl").html();
            data.userId=DE.store.currentShowUser.userId;
            data.userName=DE.store.currentShowUser.name;
            data.userProfileImg=DE.store.currentShowUser.figure;
            data.role=DE.store.currentShowUser.role;
            data.showToolBar=this.canShowToolbar();
            var html=juicer(tpl,data);
            $("#de_user_uploads").html(html);

            if(data.userEntities.length==0){
                var index=Math.floor(Math.random()*jsondata.data.length);
                tpl=$("#noDataTpl").html();
                html=juicer(tpl,jsondata.data[index]);
                $("#de_user_uploads .de_project_grid").html(html);
            }


            DE.UIManager.showScreen("#de_screen_user_profile");
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
         */
        getUserEntities:function(id){
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
                        me.showUserEntity(data);
                        DE.store.userEntitiesCount=data.userEntities.length;
                        if(data.userEntities.length<=DE.config.perLoadCount){
                            DE.store.userEntitiesShow=data.userEntities.length;
                        }else{
                            DE.store.userEntitiesShow+=DE.config.perLoadCount;
                        }


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
         */
        userClickHandler:function(href){
            DE.UIManager.showLoading();
            DE.history.push(href);  //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var id=array[1];

            this.getUserById(id);
            this.getUserEntities(id);

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
                    de_reset_pwd:{
                        required:true,
                        rangelength:[6,20]
                    },
                    de_confirm_pwd: {
                        equalTo:"#de_reset_pwd"
                    }

                },
                messages: {
                    oldPassword:{
                        required:"请输入旧密码"
                    },
                    de_reset_pwd: {
                        required:"请输入新密码！",
                        rangelength:"请输入6-20位的密码！"
                    },
                    de_confirm_pwd: {
                        equalTo:"两次输入的密码不一致，请重新输入！"
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
                                    window.location.href=document.baseURI;
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
            $("#de_edit_description").text(DE.store.currentUser.description);
            $("#de_edit_login_email").val(DE.store.currentUser.email);
            $("#de_edit_figure").attr("src",DE.store.currentUser.figure);
        },

        /**
         * 修改个人信息
         */
        changeProfile:function(){
            $("#de_form_edit_profile").validate({
                rules: {
                    email:{
                        required:true,
                        email:true
                    }
                },
                messages: {
                    email: {
                        required:"请输入邮箱！",
                        email:"请输入正确的邮箱格式！"
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
                            profileImg:$("#de_edit_figure").attr("src")
                        },
                        success:function (data) {
                            if(data.success&&data.resultCode==DE.config.resultCode.account_update_succ){
                                DE.store.initCurrentUser({
                                    description:$("#de_edit_description").val(),
                                    figure:profileImg,
                                    email:$("#de_edit_login_email").val()
                                });
                                $(".de_user_link[href='user/"+DE.store.currentUser.userId+"'] img").attr("src",profileImg);

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
                            DE.login.QQBindHandler();
                            $("#de_has_bind").addClass("de_hidden");
                            $("#de_remove_bind").addClass("de_hidden");
                        }

                        DE.UIManager.showBindAccountPopout();
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
        DE.user.userClickHandler($(this).attr("href"));

        return false;
    });

    DE.user.createFigureUpload();

    DE.user.changeProfile();

    DE.user.changePassword();
});


