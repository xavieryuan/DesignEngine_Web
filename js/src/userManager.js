/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.user=(function(){

    return {
        createFigureUpload:function(){
            var uploaderFigure = new plupload.Uploader({
                runtimes:"flash",
                multi_selection:false,
                max_file_size:DE.config.maxImageSize,
                browse_button:"de_change_figure",
                container:"de_change_figure_container",
                flash_swf_url:DE.config.root+'/js/lib/plupload.flash.swf',
                url:DE.config.ajaxUrls.uploadFigure,
                filters:[
                    {title:"Image files", extensions:"jpg,gif,png,jpeg"}
                ]
            });

            //初始化
            uploaderFigure.init();

            //文件添加事件
            uploaderFigure.bind("FilesAdded", function (up, files) {
                var filename = files[0].name;
                var lastIndex = filename.lastIndexOf(".");
                filename = filename.substring(0, lastIndex);

                //只含有汉字、数字、字母、下划线不能以下划线开头和结尾
                var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

                if (!reg.test(filename)) {
                    alert("文件名必须是数字下划线汉字字母,且不能以下划线开头。");

                    //删除文件
                    up.removeFile(files[0]);
                    return false;
                } else {
                    up.start();//开始上传
                }
            });

            //出错事件
            uploaderFigure.bind("Error", function (up, err) {
                if(err.message.match("Init")==null){
                    alert(err.message);
                }
                up.refresh();
            });

            //上传完毕事件
            uploaderFigure.bind("FileUploaded", function (up, file, res) {
                var response = JSON.parse(res.response);
                if (response.success) {

                    $("#de_edit_figure").attr("src",response.data.url);
                } else {
                    alert(response.data.message);
                }
            });
        },
        getHotUsers:function(first){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getHotUsers,
                type:"get",
                dataType:"json",
                success:function(data){
                    DE.store.hotUserLoadedId=data.users[data.users.length-1]["id"];
                    DE.store.currentScrollScreenType=DE.config.scrollScreenType.hotUser;
                    me.showHotUsers(data,first);
                },
                error:function(){

                }
            });
        },
        showHotUsers:function(data,first){
            var tpl=$("#hotUserTpl").html();
            var html=juicer(tpl,{hotUsers:data.users,root:DE.config.root});
            $("#de_hot_user_list").append($(html));

            if(first){
                DE.UIManager.showScreen("#de_screen_designer");
            }
        },
        getUserById:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getUserById,
                type:"get",
                async:false,  //启用同步，因为这里获取的数据要保存，在显示作品的时候要用
                dataType:"json",
                success:function(data){
                    DE.store.initCurrentShowUser(data.user);
                    DE.store.currentScrollScreenType=DE.config.scrollScreenType.userEntity;
                    me.showUserDetail(data);
                },
                error:function(){

                }

            });
        },
        showUserDetail:function(data){
            var tpl=$("#userDetailTpl").html();
            data.user.root=DE.config.root;
            var html=juicer(tpl,data.user);
            $("#de_user_info_card").html($(html));
        },
        showUserEntity:function(data){
            var tpl=$("#userEntitiesTpl").html();
            data.root=DE.config.root;
            data.userId=DE.store.currentShowUser.userId;
            data.userName=DE.store.currentShowUser.name;
            data.userProfile=DE.store.currentShowUser.figure;
            data.role=DE.store.currentShowUser.role;
            data.showToolBar=this.canShowToolbar();
            var html=juicer(tpl,data);
            $("#de_user_uploads").html(html);
        },
        showHonorEntity:function(data){
            var tpl=$("#userHonorProjectTpl").html();
            var html=juicer(tpl,data);
            $("#de_user_honor_projects").html(html);
        },
        canShowToolbar:function(){
            if(DE.store.currentShowUser.userId==DE.store.currentUser.userId||DE.store.currentUser.role==DE.config.roles.admin){
                return true;
            }

            return false;
        },
        toolbarHandler:function(target){
            var className=target.attr("class");
        },
        getUserEntities:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getUserEntities,
                type:"get",
                dataType:"json",
                success:function(data){
                    me.showUserEntity(data);

                    //如果是普通用户，会有优秀作品
                    if(DE.store.currentShowUser.role!="VIP"){
                        me.showHonorEntity(me.filterProjects(data));
                    }
                },
                error:function(){

                }

            });
        },
        userClickHandler:function(href){
            DE.history.push(href);  //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var id=array[3];

            this.getUserById();
            this.getUserEntities();

            DE.UIManager.showScreen("#de_screen_user_profile");

        },
        changePassword:function(){
            $("#de_reset_pwd_form").validate({
                rules: {
                    de_reset_pwd:{
                        required:true,
                        rangelength:[6,20]
                    },
                    de_confirm_pwd: {
                        equalTo:"#de_reset_pwd"
                    }

                },
                messages: {
                    de_reset_pwd: {
                        required:"请输入邮箱！",
                        rangelength:"请输入6-20位的密码！"
                    },
                    de_confirm_pwd: "两次输入的密码不一致，请重新输入！"

                },
                submitHandler:function(form) {
                    $(form).ajaxSubmit({
                        url:DE.config.ajaxUrls.changeProfile,
                        dataType:"json",
                        success:function (data) {

                        },
                        error:function (data) {

                        }
                    });
                }
            });
        },
        setProfile:function(){
            $("#de_user_name").text(DE.store.currentUser.name);
            $("#de_edit_description").text(DE.store.currentUser.description);
            $("#de_edit_login_email").val(DE.store.currentUser.email);
            $("#de_edit_figure").attr("src",DE.store.currentUser.figure);
        },
        changeProfile:function(){
            $("#de_form_edit_profile").validate({
                rules: {
                    de_edit_login_email:{
                        required:true,
                        email:true
                    },
                    de_edit_description: "required"

                },
                messages: {
                    de_edit_login_email: {
                        required:"请输入邮箱！",
                        email:"请输入正确的邮箱格式！"
                    },
                    de_edit_description: "请输入个人描述！"

                },
                submitHandler:function(form) {
                    $(form).ajaxSubmit({
                        url:DE.config.ajaxUrls.changeProfile,
                        dataType:"json",
                        success:function (data) {

                        },
                        error:function (data) {

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
            $.each(data.entities,function(index,d){
                if(d.hasHonor){
                    array.push(d);
                }
            });

            return {projects:array,root:DE.config.root};
        },
        /**
         *排序实体
         */
        sortEntities:function(){

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


