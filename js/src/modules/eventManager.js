/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-16
 * Time: 下午4:08
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.eventManager= (function (loginManager,mobileManager,menuManager,searchManager,entityManager,
                            userManager,popManager,storeManager,uploadManager,config,historyManager) {
    var init = function () {
        $(document).ready(function () {

            //获取顶部所有的标签
            //search.getTags();

            //检测是否登录
            loginManager.checkLogin();

            /*----------------------菜单事件--------------------------------*/
            //顶部菜单点击事件（除上传按钮）
            $("#de_top_nav a").click(function () {
                menuManager.topMenuClickHandler($(this).attr("href"));

                return false;
            });

            //上传菜单点击事件
            $(document).on("click", "#de_btn_upload", function () {
                menuManager.topMenuClickHandler($(this).attr("href"));

                return false;
            });

            //logo点击事件
            $("#de_logo").click(function () {
                menuManager.logoClickHandler();

                return false;
            });


            //ext菜单按钮点击事件（显示隐藏）
            $(document).on("click", "#de_btn_ext_nav", function (evt) {
                menuManager.extMenuBtnClickHandler();

                return false;
            });

            //用户菜单（ext菜单项按钮点击事件）
            $(document).on("click", "#de_ext_nav a:not('.de_user_link')", function () {
                menuManager.extMenuItemClickHandler($(this).attr("id"));

                return false;
            });

            //点击body隐藏所有弹窗和菜单
            $(document).click(function (event) {
                menuManager.documentClickHandler(event.target);
            });

            //控制滚动分页
            $(window).scroll(function () {
                menuManager.windowScrollHandler();
            });

            /*---------------------------------------搜索------------------------*/

            searchManager.searchInputEventHandler();


            //更多分类按钮点击事件
            $("#de_btn_filter>a").on("click", function (evt) {
                searchManager.filterClickHandler();

                return false;
            });

            //点击搜索里面的标签事件
            $(document).on("click", ".de_menu_list a", function () {
                searchManager.searchHandler($(this).attr("href"));

                return false;
            });



            /*------------------------------弹层控制-------------------*/

            //点击弹窗右上角x和消息提示的时候的“关闭”关闭弹窗
            $(document).on("click","#de_popout_x_btn,#de_popout_close_btn",function(){
                popManager.popCloseHandler();
                return false;
            });

            //关闭弹出的window
            $("#de_close_pop_window").click(function () {
                popManager.closePopWindowHandler();
            });


             /*----------------------------------作品详情-----------------------*/
            //显示单个实体详情
            $(document).on("click", "a.de_entity_link", function () {
                entityManager.entityClickHandler($(this).attr("href"),false,true);

                return false;
            });

            //关闭作品详情
            $(document).on("click", "#de_btn_close_project_detail", function () {
                entityManager.closeEntityDetailHandler($(this).data("behavior"));

                return false;
            });

            //点击赞图标的操作，增加或者删除
            $(document).on("click", "#de_entity_praise", function () {
                entityManager.praiseClickHandler();

                return false;
            });


            //评论登录
            $(document).on("click", "#de_btn_comment_login", function () {
                entityManager.commentLoginClickHandler();

                return false;
            });

            //添加评论
            $(document).on("click", "#de_btn_add_comment", function () {
                entityManager.addCommentHandler();
            });


            //删除评论
            $(document).on("click","a.de_delete_comment",function(){
               entityManager.commentDeleteHandler($(this));

                return false;
            });

            //评论加载更多
            $(document).on("click", "#de_comment_more_btn", function () {
                entityManager.getComments(DE.config.ajaxUrls.getComments,storeManager.currentShowEntity.id);
            });

            //工具栏点击事件
            $(document).on("click", ".de_project_toolbar a", function () {
                entityManager.entityToolbarHandler($(this));

                return false;
            });

            //点击附件播放对应媒体文件，上传预览那里也用到
            $(document).on("click","a[data-has-media='true']",function(){
                entityManager.showMedias($(this));

                return false;
            });

            /*--------------------------------登录注册绑定---------------------*/

            //登录按钮点击事件||邮箱已经注册，直接登录
            $(document).on("click", "#de_btn_login_reg，#de_direct_login", function () {
                loginManager.loginBtnClickHandler();

                return false;
            });

            //注册按钮点击
            $("#de_reg_btn").click(function () {
                loginManager.regBtnClickHandler();

                return false;
            });

            //取消绑定
            $("#de_remove_band").click(function () {
                loginManager.unBindHandler();
            });

            //忘记密码按钮点击事件
            $("#de_btn_forgot_pwd").on("click", function () {
                loginManager.forgetPasswordClickHandler();

                return false;
            });

            //刷新验证码
            $("#de_refresh_captcha").click(function () {
                loginManager.validCodeRefreshHandler();

                return false;
            });

            //enter提交表单
            $("#de_login_pwd").keydown(function (event) {
                loginManager.pwdInputKeyDownHandler(event.keyCode);
            });

            //登陆
            loginManager.ajaxLogin();

            //注册
            loginManager.ajaxRegister();

            //QQ登陆
            loginManager.QQLoginHandler();

            //忘记密码
            loginManager.forgetPassword();

            //popstate事件
            window.onpopstate = function (event) {

                //火狐第一次进入不响应此事件
                loginManager.stateChangeHandler();
            };


            /*--------------------------------用户相关-------------------------*/

            //点击用户头像
            $(document).on("click", "a.de_user_link", function () {
                userManager.userClickHandler($(this).attr("href"),null);

                return false;
            });

            //用户头像
            userManager.createFigureUpload();

            //修改资料提交
            userManager.changeProfile();

            //修改密码提交
            userManager.changePassword();

            //修改邮箱提交
            userManager.changeEmail();



            /*--------------------------------上传相关-------------------------*/

            //创建上传句柄
            //创建上传句柄
            uploadManager.createUpload({type:"thumb"});
            uploadManager.createUpload({type:config.uploadMediaTypes.localVideo,browseButton:"zy_add_location_video",
                filters:config.uploadFilters.videoFilter});
            uploadManager.createUpload({type:config.uploadMediaTypes._3d,browseButton:"zy_add_3d",
                filters:config.uploadFilters._3dFilter});
            uploadManager.createUpload({type:config.uploadMediaTypes.ppt,browseButton:"zy_add_ppt",
                filters:config.uploadFilters.pptFilter});
            uploadManager.createUpload({type:config.uploadMediaTypes.image,browseButton:"zy_add_image",
                filters:config.uploadFilters.imageFilter});
            uploadManager.createUpload({type:config.uploadMediaTypes.file,browseButton:"zy_add_file",
                filters:config.uploadFilters.fileFilter});
            uploadManager.createUpload({type:config.uploadMediaTypes.flash,browseButton:"zy_add_flash",
                filters:config.uploadFilters.flashFilter});

            //步骤控制
            $("#de_upload_step_nav a").click(function(){
                uploadManager.stepControl($(this).attr("href"));

                return false;
            });

            //标签删除事件
            $(document).on("click","#de_input_tag a",function(){
                uploadManager.deleteTag($(this));

                return false;
            });


            //标签输入事件
            uploadManager.tagInputEventHandler();

            //显示上传文件的菜单
            $("#zy_add_medias_button").hover(function(e){
                $("#zy_add_media_menu").css("height","280px");
            },function(e){
                $("#zy_add_media_menu").css("height",0);
            });
            $("#zy_add_media_menu").hover(function(e){
                $("#zy_add_media_menu").css("height","280px");
            },function(e){
                $("#zy_add_media_menu").css("height",0);
            });

            //控制网络视频,显示输入面板
            $("#zy_add_network_video").click(function () {
                uploadManager.showWebVideoPanel();

                return false;
            });

            //网络视频输入确定
            $(document).on("click", "#de_input_web_video_ok", function () {
                var value = $("#de_input_web_video").val();
                uploadManager.webVideoInput(value);
            });

            //删除未上传的文件
            $(document).on("click", "span.zy_uncomplete_delete", function () {
                if(confirm("确定删除吗？")){
                    $(this).parents("li").remove();
                }
            });

            //删除已经上传的文件
            $(document).on("click", "span.zy_media_delete", function (event) {
                uploadManager.deleteUploadedFile($(this));

                //阻止事件冒泡到a
                return false;
            });

            //列表中每一项的点击事件，如果选中的列表没有填写完整，则不能选择其他列表
            $(document).on("click", "a.zy_media_list", function () {
                uploadManager.uploadedLiClickHandler($(this));

                return false;
            });

            //表单提交
            $("#de_submit_upload").click(function () {

                uploadManager.uploadSubmit();

                return false;
            });
        });

        /*----------------------------------------手机兼容-------------------------------*/

        mobileManager.addMobileSources();

        document.addEventListener("touchend",function(event){
            var target=$(event.target);
            DE.menuManager.documentClickHandler(target);
        },false);

        //火狐里面阻止form提交
        $("input[type='text'],input[type='password']").keydown(function(e){
            if(e.keyCode==13){
                return false;
            }
        })
    };

    return {
        init: init
    }
})(DE.loginManager,DE.mobileManager,DE.menuManager,DE.searchManager,DE.entityManager,DE.userManager,
        DE.popManager,DE.storeManager,DE.uploadManager,DE.config,DE.historyManager);
