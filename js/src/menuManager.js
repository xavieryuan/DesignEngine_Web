/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-6
 * Time: 上午11:41
 * 顶部菜单、侧栏菜单，window滚动
 */
var DE=DE||{};
DE.menu=(function(){
    return {
        windowScrollHandler:function(){

            //在详情页面,滚动请求评论和相似作品


            //在列表页面


            //用户页面
        },
        topMenuClickHandler:function(href){
            DE.history.push(href); //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var type=array[2];
            if(type=="project"){
                $("#de_project_list").html("");
                DE.entity.getAllEntity(type);
                DE.UIManager.showScreen("#de_screen_project");
            }else if(type=="resource"){
                $("#de_resource_list").html("");
                DE.entity.getAllEntity(type);
                DE.UIManager.showScreen("#de_screen_resource");
            }else if(type=="user"){
                $("#de_hot_user_list").html("");
                DE.user.getHotUsers();
                DE.UIManager.showScreen("#de_screen_designer");
            }else if(type=="upload"){
                DE.UIManager.showScreen("#de_screen_upload");
            }

        },
        searchTagHandler:function(href){

        },
        extMenuClickHandler:function(id){
            if(id=="de_btn_sign_out"){
                DE.login.logout();
            }else if(id=="de_btn_reset_pwd"){
                DE.UIManager.showRestPwdPopout();
            }else if(id=="de_btn_edit_profile"){
                DE.UIManager.showEditProfilePopout();
            }
        }
    }
})();

$(document).ready(function(){
    $("#de_top_nav a").click(function(){
        DE.menu.topMenuClickHandler($(this).attr("href"));
        //$(this).addClass("active");

        return false;
    });
    $(document).on("click","#de_btn_upload",function(){
        DE.menu.topMenuClickHandler($(this).attr("href"));

        return false;
    });
    $("#de_logo").click(function(){

    });

    //初始化登陆菜单
    DE.UIManager.showLoginMenu({user:DE.store.currentUser,root:DE.config.root});

    //登录注册按钮点击事件
    $(document).on("click","#de_btn_login_reg",function(){
        DE.UIManager.showLoginPopout();

        return false;
    });

    //ext菜单按钮点击事件
    $(document).on("click","#de_btn_ext_nav",function(evt){
        DE.UIManager.showExtMenu();

        return false;
    });

    //用户菜单
    $(document).on("click","#de_ext_nav a",function(){
        DE.menu.extMenuClickHandler($(this).attr("id"));

        return false;
    });

    //点击body隐藏所有弹窗和菜单
    $(document).click(function(event){
        var target=$(event.target);
        if(target.parents("#de_popout").length==0&&target.parents("#de_filter_menu").length==0&&
            target.parents("#de_ext_nav").length==0){
            DE.UIManager.hideAllMenuAndPopouts();
        }
    });

    //更多分类按钮点击事件
    $("#de_btn_filter>a").on("click",function(evt){
        DE.UIManager.showFilterMenu();

        return false;
    });



    $("#de_filter_menu li>a").on("click",function(evt){

        DE.UIManager.showSearchScreen($(this).text(),"project");

        //开始查询代码
    });


    DE.entity.getAllEntity(DE.config.entityTypes.project);

    $(window).scroll(function(){

    });


});