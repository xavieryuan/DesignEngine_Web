/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-16
 * Time: 下午4:08
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.event= (function () {
    var init = function () {
        $(document).ready(function () {

            //获取顶部所有的标签
            DE.menu.getTags();

            //顶部菜单点击事件（除上传按钮）
            $("#de_top_nav a").click(function () {
                DE.menu.topMenuClickHandler($(this).attr("href"));

                return false;
            });

            //上传菜单点击事件
            $(document).on("click", "#de_btn_upload", function () {
                DE.menu.topMenuClickHandler($(this).attr("href"));

                return false;
            });

            //logo点击事件
            $("#de_logo").click(function () {
                DE.history.push("");
                DE.entity.getAllEntity(DE.config.entityTypes.project, true);

                return false;
            });

            //登录注册按钮点击事件
            $(document).on("click", "#de_btn_login_reg", function () {
                DE.login.initLoginForm();
                DE.uiManager.showLoginPopout();

                return false;
            });

            //ext菜单按钮点击事件（显示隐藏）
            $(document).on("click", "#de_btn_ext_nav", function (evt) {
                DE.uiManager.showExtMenu();

                return false;
            });

            //用户菜单（ext菜单项按钮点击事件）
            $(document).on("click", "#de_ext_nav a", function () {
                DE.menu.extMenuClickHandler($(this).attr("id"));

                return false;
            });

            //点击body隐藏所有弹窗和菜单
            $(document).click(function (event) {
                var target = $(event.target);
                if (target.parents("#de_popout").length == 0 && target.parents("#de_filter_menu").length == 0 &&
                    target.parents("#de_ext_nav").length == 0 && target.parents("#de_pop_window").length == 0) {
                    DE.uiManager.hideAllMenuAndPopouts();
                }
            });

            //更多分类按钮点击事件
            $("#de_btn_filter>a").on("click", function (evt) {
                DE.uiManager.showFilterMenu();

                return false;
            });

            //点击搜索里面的作品标签事件
            $(document).on("click", "#de_project_tags li>a", function () {
                DE.menu.serachHandler($(this).attr("href"), DE.config.entityTypes.project, true);

                return false;
            });

            //点击搜索里面的资源标签事件
            $(document).on("click", "#de_resource_tags li>a", function () {
                DE.menu.serachHandler($(this).attr("href"), DE.config.entityTypes.resource, true);

                return false;
            });

            //搜索
            $("#de_search_input").keydown(function (event) {
                if (event.keyCode == 13) {
                    var value = $(this).val();
                    DE.menu.serachHandler("search/" + value, DE.config.entityTypes.project, false);
                }
            });

            //搜索结果tab点击事件
            $("#de_search_result_tab a").click(function () {
                var type = $(this).data("entity-type");

                DE.menu.searchTabClickHandler(type);

                return false;
            });

            //关闭弹出的window
            $("#de_close_pop_window").click(function () {
                $(this).parent().addClass("de_hidden");
                $("#de_blackout").addClass("de_hidden");
            });

            //关闭pop
            $("#de_popout_close_btn").click(function () {
                DE.uiManager.hideAllMenuAndPopouts();
                return false;
            });

            //控制滚动分页
            $(window).scroll(function () {
                DE.menu.windowScrollHandler();
            });

            //显示当个实体详情
            $(document).on("click", "a.de_entity_link", function () {

                DE.entity.entityClickHandler($(this).attr("href"));

                return false;
            });

            //关闭作品详情
            $(document).on("click", "#de_btn_close_project_detail", function () {
                DE.uiManager.hideProjectDetail();
                DE.store.commentLoadedId = 0;

                return false;
            });

            //点击赞图标的操作，增加或者删除
            $(document).on("click", "#de_entity_praise", function () {
                if (!DE.store.currentUser.userId) {
                    DE.login.initLoginForm();
                    DE.uiManager.showLoginPopout();
                    DE.uiManager.hideProjectDetail();
                } else {
                    DE.entity.handlerPraiseOrHonor();
                }


                return false;
            });


            //评论登录
            $(document).on("click", "#de_btn_comment_login", function () {
                DE.login.initLoginForm();
                DE.uiManager.showLoginPopout();
                DE.uiManager.hideProjectDetail();

                return false;
            });

            //添加评论
            $(document).on("click", "#de_btn_add_comment", function () {
                DE.entity.addCommentHandler();
            });

            //评论加载更多
            $(document).on("click", "#de_comment_more_btn", function () {
                DE.entity.getComments(DE.store.currentShowEntity.id);
            });

            //工具栏点击事件
            $(document).on("click", ".de_project_toolbar a", function () {
                var className = $(this).attr("class");
                if (className == "de_toolbar_edit") {
                    DE.entity.editEntity($(this).attr("href"));
                } else if (className == "de_toolbar_delete") {
                    DE.entity.deleteEntity($(this).attr("href"));
                } else {
                    DE.entity.showOrHideEntity($(this));
                }

                return false;
            });

            //进入页面，请求后台是否登录
            DE.login.checkLogin();

            //注册按钮点击
            $("#de_reg_btn").click(function () {
                DE.uiManager.showRegPopout();

                return false;
            });

            //取消绑定
            $("#de_remove_band").click(function () {
                DE.login.unBindHandler();
            });

            //忘记密码按钮点击事件
            $("#de_btn_forgot_pwd").on("click", function () {
                DE.uiManager.showRecoverPwdPopout();

                return false;
            });

            //刷新验证码
            $("#de_refresh_captcha").click(function () {
                $("#de_captcha_img").removeAttr("src").attr("src", DE.config.ajaxUrls.getValidCode);

                //$(this).attr('src')+'?'+Math.random()

                return false;
            });

            //enter提交表单
            $("#de_login_pwd").keydown(function (event) {
                if (event.keyCode == 13) {
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

            //点击用户头像
            $(document).on("click", "a.de_user_link", function () {
                DE.user.userClickHandler($(this).attr("href"));

                return false;
            });

            //用户头像
            DE.user.createFigureUpload();

            //修改资料提交
            DE.user.changeProfile();

            //修改密码提交
            DE.user.changePassword();

            //创建上传句柄
            DE.upload.createUpload({type: "thumb"});
            DE.upload.createUpload({type: "zy_location_video", browseButton: "zy_add_location_video", filters: "mp4"});
            DE.upload.createUpload({type: "zy_3d", browseButton: "zy_add_3d", filters: "zip"});
            DE.upload.createUpload({type: "zy_ppt", browseButton: "zy_add_ppt", filters: "pptx"});
            DE.upload.createUpload({type: "zy_image", browseButton: "zy_add_image", filters: "jpg,gif,png,jpeg"});
            DE.upload.createUpload({type: "zy_file", browseButton: "zy_add_file", filters: "zip"});

            //步骤控制
            $("#de_upload_step_nav a").click(function () {
                DE.upload.stepControl($(this).attr("href"));

                return false;
            });

            //标签删除事件
            $(document).on("click", "#de_input_tag a", function () {
                $(this).parent().remove();

                return false;
            });

            //标签输入事件
            $("#de_input_project_tag").keydown(function (event) {
                if (event.keyCode == 13) {
                    DE.upload.showInputTag($(this).val());
                    $(this).val("");
                }
            });

            //显示上传文件的菜单
            $("#zy_add_medias_button").hover(function (e) {
                $("#zy_add_media_menu").css("height", "360px");
            }, function (e) {
                $("#zy_add_media_menu").css("height", 0);
            });
            $("#zy_add_media_menu").hover(function (e) {
                $("#zy_add_media_menu").css("height", "360px");
            }, function (e) {
                $("#zy_add_media_menu").css("height", 0);
            });

            //控制网络视频,显示输入面板
            $("#zy_add_network_video").click(function () {
                var tpl = $("#webVideoInput").html();
                $("#de_pop_window").removeClass("de_hidden de_pop_show_media").addClass("de_pop_web_video");
                $("#de_pop_window_content").html(tpl);
                $("#de_blackout").removeClass("de_hidden");

                return false;
            });

            //网络视频输入确定
            $(document).on("click", "#de_input_web_video_ok", function () {
                var value = $("#de_input_web_video").val();
                DE.upload.webVideoInput(value);
            });

            //删除未上传的文件
            $(document).on("click", "span.zy_uncomplete_delete", function () {
                if (confirm("如果文件在上传过程中或者在等待上传，则无法删除！尝试删除吗？")) {
                    $(this).parents("li").remove();
                }
            });

            //删除已经上传的文件
            $(document).on("click", "span.zy_media_delete", function (event) {
                DE.upload.deleteUploadedFile($(this));

                //阻止事件冒泡到a
                return false;
            });

            //列表中每一项的点击事件，如果选中的列表没有填写完整，则不能选择其他列表
            $(document).on("click", "a.zy_media_list", function () {
                DE.upload.uploadedLiClickHandler($(this));
            });

            //表单提交
            $("#de_submit_upload").click(function () {
                DE.upload.ajaxUploadForm();
                return false;
            });

            //popstate事件
            window.onpopstate = function (event) {
                if (event) {

                    //火狐第一次进入不响应此事件，event为空会报错，需要判断一下
                    DE.history.stateChange(event);
                }
            }

        });

    };

    return {
        init: init
    }
})();
