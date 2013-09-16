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

        /**
         * 操作中不需要特地为第一次加载清空容器，因为所有容器的数据在ui的showScreen函数中进行了清除
         * @param href
         */
        topMenuClickHandler:function(href){
            DE.history.push(href); //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var type=array[2];
            if(type==DE.config.linkTypes.project){
                //DE.UIManager.showScreen("#de_screen_project"); //放在此处会导致屏幕闪烁，放到ajax的回调中
                DE.entity.getAllEntity(type,true);
            }else if(type==DE.config.linkTypes.resource){
                DE.entity.getAllEntity(type,true);
            }else if(type==DE.config.linkTypes.user){
                DE.user.getHotUsers(true);
            }else if(type==DE.config.linkTypes.upload){
                DE.UIManager.showScreen("#de_screen_upload");
            }

        },
        getTags:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getTags,
                type:"get",
                dataType:"json",
                success:function(data){
                    me.showTags(data);
                },
                error:function(){

                }

            });
        },
        showTags:function(data){
            var html="";
            var projectTagTpl=$("#projectTagTpl").html();
            html=juicer(projectTagTpl,{root:DE.config.root,projecttags:data.worktags});
            $("#de_project_tags").html(html);

            var resourceTagTpl=$("#resourceTagTpl").html();
            html=juicer(resourceTagTpl,{root:DE.config.root,resourcetags:data.resourcetags});
            $("#de_resource_tags").html(html);
        },
        tagClickHandler:function(href,type){
            DE.history.push(href); //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var tag=array[3];

            DE.store.currentSearchValue=tag; //记录下当前搜索的内容
            DE.store.currentSearchType=type;
            DE.entity.getEntityByTag(tag,true);
        },
        searchTabClickHandler:function(type){

            //如果当前显示的类型和点击的按钮不一致，则要置换
            if(type!=DE.currentSearchType){
                DE.store.currentSearchType=type;
                DE.entity.getEntityByTag(DE.store.currentSearchValue,true);
            }

        },
        extMenuClickHandler:function(id){
            if(id=="de_btn_sign_out"){
                DE.login.logout();
            }else if(id=="de_btn_reset_pwd"){
                DE.UIManager.showRestPwdPopout();
            }else if(id=="de_btn_edit_profile"){
                DE.user.setProfile();
                DE.UIManager.showEditProfilePopout();
            }
        }
    }
})();

$(document).ready(function(){

    //获取顶部所有的标签
    DE.menu.getTags();

    $("#de_top_nav a").click(function(){
        DE.menu.topMenuClickHandler($(this).attr("href"));

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

    //首页进入时获取所有的作品
    DE.entity.getAllEntity(DE.config.entityTypes.project);


    //登录注册按钮点击事件
    $(document).on("click","#de_btn_login_reg",function(){
        DE.login.initLoginForm();
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


    $(document).on("click","#de_project_tags li>a",function(){
        DE.menu.tagClickHandler($(this).attr("href"),DE.config.entityTypes.project);


        return false;
    });

    $(document).on("click","#de_resource_tags li>a",function(){
        DE.menu.tagClickHandler($(this).attr("href"),DE.config.entityTypes.resource);

        return false;
    });

    //搜索
    $("#de_search_input").keydown(function(event){
        if(event.keyCode==13){
            var value=$(this).val();
            DE.menu.tagClickHandler(DE.config.root+"/search/"+value);
        }
    });

    //搜索结果tab点击事件
    $("#de_search_result_tab a").click(function(){
        var type=$(this).data("entity-type");

        DE.menu.searchTabClickHandler(type);

        return false;
    });


    //控制滚动分页
    $(window).scroll(function(){

    });


});