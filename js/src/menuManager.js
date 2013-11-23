/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-6
 * Time: 上午11:41
 * 顶部菜单、侧栏菜单，window滚动,搜索，搜索tab，弹层关闭等
 */
var DE=DE||{};
DE.menu=(function(){
    return {

        /**
         * window滚动处理事件
         */
        windowScrollHandler:function(){

            if(DE.store.scrollTimer){
                clearTimeout(DE.store.scrollTimer);
            }

            if(DE.store.currentScrollScreenType){
                DE.store.scrollTimer=setTimeout(function(){
                    if($(document).height()-$(window).height()<=$(window).scrollTop()){

                        //作品和资源要看是否是在搜索页面
                        if(DE.store.currentSearchValue){

                            //alert(DE.store.currentScrollScreenType+"search");
                            if(DE.store.searchLoadedCount!=DE.config.hasNoMoreFlag){
                                DE.entity.getEntityBySearch(DE.store.currentSearch.currentSearchValue,
                                    DE.store.currentSearch.currentSearchType,DE.store.currentSearch.isTag,false);
                            }

                        }else{
                            if(DE.store.currentScrollScreenType==DE.config.scrollScreenType.project){

                                //首页作品
                                if(DE.store.projectLoadedId!=DE.config.hasNoMoreFlag){
                                    DE.entity.getAllEntity(DE.config.entityTypes.project,false);
                                }

                            }else if(DE.store.currentScrollScreenType==DE.config.scrollScreenType.resource){

                                //首页资源
                                if(DE.store.resourceLoadedId!=DE.config.hasNoMoreFlag){
                                    DE.entity.getAllEntity(DE.config.entityTypes.resource,false);
                                }

                            }else if(DE.store.currentScrollScreenType==DE.config.scrollScreenType.hotUser){

                                //热点用户
                                if(DE.store.hotUserLoadedId!=DE.config.hasNoMoreFlag){
                                    DE.user.getHotUsers(false);
                                }

                            }else{

                                //用户页
                                if(DE.store.userEntitiesShow!=DE.config.hasNoMoreFlag){
                                    DE.user.showUserEntity(false);
                                }
                            }
                        }

                    }
                },200);
            }
        },

        /**
         * 操作中不需要特地为第一次加载清空容器，因为所有容器的数据在ui的showScreen函数中进行了清除
         * @param {String} href      需要设置的地址
         */
        topMenuClickHandler:function(href){
            DE.UIManager.showLoading();
            DE.history.push(href); //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var type=array[0];
            if(type==DE.config.topMenus.project){
                //DE.UIManager.showScreen("#de_screen_project"); //放在此处会导致屏幕闪烁，放到ajax的回调中
                DE.entity.getAllEntity(type,true);
            }else if(type==DE.config.topMenus.resource){
                DE.entity.getAllEntity(type,true);
            }else if(type==DE.config.topMenus.user){
                DE.user.getHotUsers(true);
            }else if(type==DE.config.topMenus.upload){
                DE.UIManager.showScreen("#de_screen_upload");
            }

        },

        /**
         * 获取系统标签设置在顶部搜索区域
         */
        getTags:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getTags,
                type:"get",
                dataType:"json",
                success:function(data){
                    if(data.success){
                        me.showTags(data);
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }

                    //进入页面，请求后台是否登录,先获取到tag然后再初始化数据，这样当时tag进入的时候就知道是作品还是资源
                    DE.login.checkLogin();

                },
                error:function(){
                    DE.config.ajaxErrorHandler();

                    //进入页面，请求后台是否登录
                    DE.login.checkLogin();
                }

            });
        },

        /**
         * 显示系统标签
         * @param {Object} data 请求系统标签时的json对象
         */
        showTags:function(data){
            var html="";
            var projectTagTpl=$("#projectTagTpl").html();
            html=juicer(projectTagTpl,{projecttags:data.work});
            $("#de_project_tags").html(html);

            var resourceTagTpl=$("#resourceTagTpl").html();
            html=juicer(resourceTagTpl,{resourcetags:data.resource});
            $("#de_resource_tags").html(html);
        },

        /**
         * 系统标签点击事件
         * @param {String} href 需要设置的地址
         * @param {String} searchType 搜索的类型
         * @param {Boolean} isTag 是否是标签
         */
        serachHandler:function(href,searchType,isTag){
            DE.history.push(href); //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var value=array[1];
            DE.UIManager.showLoading();
            DE.entity.getEntityBySearch(value,searchType,isTag,true);

            $("#de_search_input").val("");
        },

        /**
         * 搜索结果面板的tab切换事件
         * @param {String} type 需要显示的类型
         */
        searchTabClickHandler:function(type){

            //如果当前显示的类型和点击的按钮不一致，则要置换
            if(type!=DE.store.currentSearch.currentSearchType){
                DE.store.searchLoadedCount=0;
                DE.entity.getEntityBySearch(DE.store.currentSearch.currentSearchValue,type,DE.store.currentSearch.isTag,true);
            }

        },

        /**
         * 侧边栏菜单点击事件
         * @param {String} id 点击的菜单id
         */
        extMenuClickHandler:function(id){
            if(id=="de_btn_sign_out"){
                DE.login.logout();
            }else if(id=="de_btn_reset_pwd"){
                DE.UIManager.showRestPwdPopout();
            }else if(id=="de_btn_edit_profile"){
                DE.user.setProfile();
                DE.UIManager.showEditProfilePopout();
            }else if(id=="de_btn_bind_account"){
                DE.user.accountHasBind();
            }
        },

        /**
         * 搜素输入框事件
         */
        searchInputEventHandler:function(){
            var me=this;
            var searchInput= $("#de_search_input");
            searchInput.keydown(function(event){
                if(event.keyCode==13){
                    var value=$(this).val();
                    if(value.trim()){
                        me.serachHandler("search/"+value,DE.config.entityTypes.project,false);
                    }
                }
            });

            searchInput.marcoPolo({
                url: DE.config.ajaxUrls.searchSuggest,
                minChars:2,
                formatData : function (data) {
                    if(data.spellcheck.suggestions.length){
                        return data.spellcheck.suggestions[1]["suggestion"];
                    }else{
                        return [];
                    }

                },
                formatItem: function (data) {
                    return data;
                },
                onSelect: function (data) {
                    me.serachHandler("search/"+data,DE.config.entityTypes.project,false);
                },
                formatNoResults:function(q, $item){
                    return "";
                },
                formatMinChars :function(minChars, $item){
                    return "";
                },
                formatError :function($item, jqXHR, textStatus, errorThrown){
                    return "";
                }
            });
        }
    }
})();

$(document).ready(function(){

    //获取顶部所有的标签
    DE.menu.getTags();

    //顶部菜单点击事件（除上传按钮）
    $("#de_top_nav a").click(function(){
        DE.menu.topMenuClickHandler($(this).attr("href"));

        return false;
    });

    //上传菜单点击事件
    $(document).on("click","#de_btn_upload",function(){
        DE.menu.topMenuClickHandler($(this).attr("href"));

        return false;
    });

    //logo点击事件
    $("#de_logo").click(function(){
        DE.history.push(document.baseURI);
        DE.entity.getAllEntity(DE.config.entityTypes.project,true);

        return false;
    });

    //登录注册按钮点击事件
    $(document).on("click","#de_btn_login_reg",function(){
        DE.login.initLoginForm();
        DE.UIManager.showLoginPopout();

        return false;
    });

    //ext菜单按钮点击事件（显示隐藏）
    $(document).on("click","#de_btn_ext_nav",function(evt){
        DE.UIManager.showExtMenu();

        return false;
    });

    //用户菜单（ext菜单项按钮点击事件）
    $(document).on("click","#de_ext_nav a",function(){
        DE.menu.extMenuClickHandler($(this).attr("id"));

        return false;
    });

    //点击body隐藏所有弹窗和菜单
    $(document).click(function(event){
        var target=$(event.target);
        if(target.parents("#de_popout").length==0&&target.parents("#de_filter_menu").length==0&&
            target.parents("#de_ext_nav").length==0&&target.parents("#de_pop_window").length==0){
            DE.UIManager.hideAllMenuAndPopouts();
        }
    });

    //更多分类按钮点击事件
    $("#de_btn_filter>a").on("click",function(evt){
        DE.UIManager.showFilterMenu();

        return false;
    });

    //点击搜索里面的作品标签事件
    $(document).on("click","#de_project_tags li>a",function(){
        DE.menu.serachHandler($(this).attr("href"),DE.config.entityTypes.project,true);

        return false;
    });

    //点击搜索里面的资源标签事件
    $(document).on("click","#de_resource_tags li>a",function(){
        DE.menu.serachHandler($(this).attr("href"),DE.config.entityTypes.resource,true);

        return false;
    });

    //搜索
    DE.menu.searchInputEventHandler();

    //搜索结果tab点击事件
    $("#de_search_result_tab a").click(function(){
        var type=$(this).data("entity-type");

        DE.menu.searchTabClickHandler(type);

        return false;
    });

    //关闭弹出的window
    $("#de_close_pop_window").click(function(){
        $(this).parent().addClass("de_hidden");
        $("#de_pop_window_content").html("");
        $("#de_blackout").addClass("de_hidden");
    });

    //关闭pop
    $("#de_popout_close_btn").click(function(){
        DE.UIManager.hideAllMenuAndPopouts();
        return false;
    });

    //控制滚动分页
    $(window).scroll(function(){
        DE.menu.windowScrollHandler();
    });
});