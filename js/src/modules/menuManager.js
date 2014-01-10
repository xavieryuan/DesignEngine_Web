/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-6
 * Time: 上午11:41
 * 顶部菜单、侧栏菜单，window滚动,搜索，搜索tab，弹层关闭等
 */
var DE=DE||{};
DE.menuManager=(function(){
    return {

        /**
         * window滚动处理事件
         */
        windowScrollHandler:function(){

            if(DE.storeManager.scrollTimer){
                clearTimeout(DE.storeManager.scrollTimer);
            }

            if(DE.storeManager.currentScrollScreenType){
                DE.storeManager.scrollTimer=setTimeout(function(){
                    if($(document).height()-$(window).height()<=$(window).scrollTop()){

                        //作品和资源要看是否是在搜索页面
                        if(DE.storeManager.currentSearch.currentSearchValue){

                            //alert(DE.storeManager.currentScrollScreenType+"search");
                            if(DE.storeManager.searchLoadedCount!=DE.config.hasNoMoreFlag){
                                DE.entityManager.getEntityBySearch(DE.storeManager.currentSearch.currentSearchValue,
                                    DE.storeManager.currentSearch.currentSearchType,DE.storeManager.currentSearch.isTag,false);
                            }

                        }else{
                            if(DE.storeManager.currentScrollScreenType==DE.config.scrollScreenType.project){

                                //首页作品
                                if(DE.storeManager.projectLoadedId!=DE.config.hasNoMoreFlag){
                                    DE.entityManager.getAllEntity(DE.config.entityTypes.project,false);
                                }

                            }else if(DE.storeManager.currentScrollScreenType==DE.config.scrollScreenType.resource){

                                //首页资源
                                if(DE.storeManager.resourceLoadedId!=DE.config.hasNoMoreFlag){
                                    DE.entityManager.getAllEntity(DE.config.entityTypes.resource,false);
                                }

                            }else if(DE.storeManager.currentScrollScreenType==DE.config.scrollScreenType.hotUser){

                                //热点用户
                                if(DE.storeManager.hotUserLoadedCount!=DE.config.hasNoMoreFlag){
                                    DE.userManager.getHotUsers(false);
                                }

                            }else{

                                //用户页
                                if(DE.storeManager.userEntitiesShowCount!=DE.config.hasNoMoreFlag){
                                    DE.userManager.showUserEntity(false);
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
            DE.uiManager.showLoading();
            DE.historyManager.push(href); //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var type=array[0];
            if(type==DE.config.topMenus.project){
                //DE.uiManager.showScreen("#de_screen_project"); //放在此处会导致屏幕闪烁，放到ajax的回调中
                DE.entityManager.getAllEntity(type,true);
            }else if(type==DE.config.topMenus.resource){
                DE.entityManager.getAllEntity(type,true);
            }else if(type==DE.config.topMenus.user){
                DE.userManager.getHotUsersOrder();
            }else if(type==DE.config.topMenus.upload){
                DE.uiManager.showScreen("#de_screen_upload");
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
                    DE.loginManager.checkLogin();

                },
                error:function(){
                    DE.config.ajaxErrorHandler();

                    //进入页面，请求后台是否登录
                    DE.loginManager.checkLogin();
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
         * 搜索结果面板的tab切换事件
         * @param {String} type 需要显示的类型
         */
        searchTabClickHandler:function(type){

            //如果当前显示的类型和点击的按钮不一致，则要置换
            if(type!=DE.storeManager.currentSearch.currentSearchType){
                DE.storeManager.searchLoadedCount=0;
                DE.entityManager.getEntityBySearch(DE.storeManager.currentSearch.currentSearchValue,type,DE.storeManager.currentSearch.isTag,true);
            }

        },

        /**
         * 侧边栏菜单点击事件
         * @param {String} id 点击的菜单id
         */
        extMenuItemClickHandler:function(id){
            if(id=="de_btn_sign_out"){
                DE.loginManager.logout();
            }else if(id=="de_btn_reset_pwd"){
                DE.uiManager.showRestPwdPopout();
            }else if(id=="de_btn_edit_profile"){
                DE.userManager.accountHasBind();
                DE.userManager.setProfile();
                DE.uiManager.showEditProfilePopout();

            }
        },

        /**
        *  logo点击事件处理
        * */
        logoClickHandler:function(){
            DE.historyManager.push(document.baseURI||$("#de_base_url").attr("href"));
            DE.entityManager.getAllEntity(DE.config.entityTypes.project,true);
        },

        /**
         * 搜素输入框事件
         */
        documentClickHandler:function(target){
            if(target.parents("#de_popout").length==0&&target.parents("#de_filter_menu").length==0&&
                target.parents("#de_ext_nav").length==0&&target.parents("#de_pop_window").length==0){
                DE.uiManager.hideAllMenuAndPopouts();
            }
        },
        extMenuBtnClickHandler:function(){
            DE.uiManager.showExtMenu();
        }
    }
})();


