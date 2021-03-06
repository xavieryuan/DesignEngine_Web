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
                        if(DE.store.currentSearch.currentSearchValue){

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
                                if(DE.store.hotUserLoadedCount!=DE.config.hasNoMoreFlag){
                                    DE.user.getHotUsers(false);
                                }

                            }else{

                                //用户页
                                if(DE.store.userEntitiesShowCount!=DE.config.hasNoMoreFlag){
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
                DE.user.getHotUsersOrder();
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
         */
        serachHandler:function(href){
            DE.history.push(href); //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var value=array[1];
            var searchUrlType=array[0];
            var searchType="";
            var isTag=false;

            //设置searchType和isTag的值，如果是search直接使用默认值
            if(searchUrlType===DE.config.searchUrlType.projectTag){
                searchType=DE.config.entityTypes.project;
                isTag=true;
            }else if(searchUrlType===DE.config.searchUrlType.resourceTag){
                searchType=DE.config.entityTypes.resource;
                isTag=true;
            }

            DE.UIManager.showLoading();
            DE.entity.getEntityBySearch(value,searchType,isTag,true,null);


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
         * @param {String} type 点击的菜单类型
         * @param {String} href 需要push的路劲
         */
        extMenuClickHandler:function(type,href){
            switch (type){
                case "changePwd":
                    DE.UIManager.showRestPwdPopout();

                    break;
                case "exit":
                    DE.login.logout();

                    break;
                case "changeProfile":
                    DE.user.accountHasBind();
                    DE.user.setProfile();
                    DE.UIManager.showEditProfilePopout();

                    break;
                case "userHome":
                    DE.user.userClickHandler(href,null);

                    break;
                case "userManage":
                    DE.UIManager.showLoading();
                    DE.history.push(href);
                    DE.users.createTable();

                    break;
                case "entityManage":
                    DE.UIManager.showLoading();
                    DE.history.push(href);
                    DE.entities.createTable();

                    break;
                case "commentManage":
                    DE.UIManager.showLoading();
                    DE.history.push(href);
                    DE.comments.createTable();

                    break;
            }
        },

        /**
        *  logo点击事件处理
        * */
        logoClickHandler:function(){
            DE.history.push(document.baseURI||$("#de_base_url").attr("href"));
            DE.entity.getAllEntity(DE.config.entityTypes.project,true);
        },

        /**
         * 搜素输入框事件
         */
        searchInputEventHandler:function(){
            var me=this;
            var searchInput= $("#de_search_input");
            var filterMenu=$("#de_filter_menu");
            searchInput.keydown(function(event){
                if(event.keyCode==13){
                    var value=$(this).val();
                    if(value.trim()){
                        me.serachHandler("search/"+value);
                        searchInput.blur();
                    }
                }
            });

            searchInput.marcoPolo({
                url: DE.config.ajaxUrls.searchSuggest,
                minChars:2,
                /*formatData : function (data) {
                    return data;
                },*/
                onBlur:function(){
                    filterMenu.removeClass("de_overflow_visible");
                },
                onFocus:function(){
                    filterMenu.addClass("de_overflow_visible");
                },
                formatItem: function (data) {
                    return data;
                },
                onSelect: function (data) {
                    me.serachHandler("search/"+data);

                    //select后会失去焦点，但是源代码中有一个1s的timeout，重新让输入框获取到焦点，彻底失去焦点用下面方法
                    //此解决方法不优雅
                    setTimeout(function(){
                        searchInput.blur();
                    },1.5);

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
        },
        addMobileSources:function(){
            var head=$("head");
            var userAgent=navigator.userAgent;
            if((userAgent.match("Android")!==null||userAgent.match("iPhone")!==null)&&userAgent.match("UCBrowser")===null){
                if(userAgent.match("iPhone")===null){

                    //只有原生android浏览器需要加这个
                    $("<script src='js/lib/touchScroll.js'></script>").appendTo(head);

                    //登录、评论输入框
                    $("input,textarea").focus(function(){
                        $("#de_popout").css("top","250px");
                        $("body").addClass("de_noscroll");
                    });
                    $("input,textarea").blur(function(){
                        $("body").removeClass("de_noscroll");
                    });
                }else{
                    $("#de_popout input,#de_popout textarea").focus(function(){
                        $("#de_popout").css("top","250px");
                    });
                }
            }
        },
        documentClickHandler:function(target){
            if(target.parents("#de_popout").length==0&&target.parents("#de_filter_menu").length==0&&
                target.parents("#de_ext_nav").length==0&&target.parents("#de_pop_show_media").length==0&&
                $("#de_web_video_panel").hasClass("de_hidden")){
                DE.UIManager.hideAllMenuAndPopouts();
            }
        }
    }
})();

//移动平台进入全屏，原理是手动滚动一下
window.onload=function(){
    if(DE.config.checkMobile()){
        setTimeout(function(){
            window.scrollTo(0,1);
        },500);
    }
};
$(document).ready(function(){

     DE.menu.addMobileSources();

    //获取顶部所有的标签
    //DE.menu.getTags();

    //顶部菜单点击事件（除刷选按钮）
    $("#de_top_nav li").not("#de_btn_filter").find("a").click(function(){
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
        DE.menu.logoClickHandler();

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
    $(document).on("click","#de_ext_nav a:not('.de_user_link')",function(){
        DE.menu.extMenuClickHandler($(this).data("type"),$(this).attr("href"));

        return false;
    });
	
	//点击弹窗右上角x关闭弹窗
	$(document).on("click","#de_popout_x_btn",function(){
		DE.UIManager.hidePopout();
		return false;	
	});
	
    //点击body隐藏所有弹窗和菜单
    $(document).click(function(event){
        var target=$(event.target);
        DE.menu.documentClickHandler(target);
    });
    document.addEventListener("touchend",function(event){
        var target=$(event.target);
        DE.menu.documentClickHandler(target);
    },false);

    //更多分类按钮点击事件
    $("#de_btn_filter>a").on("click",function(evt){
        DE.UIManager.showFilterMenu();

        return false;
    });

    //点击搜索里面的标签事件
    $(".de_menu_list a").click(function(){
        DE.menu.serachHandler($(this).attr("href"));

        return false;
    });


    //搜索
    DE.menu.searchInputEventHandler();

    //搜索结果tab点击事件
    /*$("#de_search_result_tab a").click(function(){
        var type=$(this).data("entity-type");

        DE.menu.searchTabClickHandler(type);

        return false;
    });*/

    //关闭弹出的window
    $("#de_pop_show_media_close").click(function(){
        $("#de_pop_show_media").addClass("de_hidden");
		$("#de_screen_project_detail").removeClass("de_hidden");
        $("#de_pop_show_media_content").html("");
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