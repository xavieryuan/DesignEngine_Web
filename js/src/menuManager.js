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
            DE.uiManager.showLoading();
            DE.history.push(href); //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var type=array[0];
            if(type==DE.config.topMenus.project){
                //DE.uiManager.showScreen("#de_screen_project"); //放在此处会导致屏幕闪烁，放到ajax的回调中
                DE.entity.getAllEntity(type,true);
            }else if(type==DE.config.topMenus.resource){
                DE.entity.getAllEntity(type,true);
            }else if(type==DE.config.topMenus.user){
                DE.user.getHotUsersOrder();
            }else if(type==DE.config.topMenus.upload){
                DE.uiManager.showScreen("#de_screen_upload");
            }

        },

        /**
         * 侧边栏菜单点击事件
         * @param {String} id 点击的菜单id
         */
        extMenuItemClickHandler:function(id){
            if(id=="de_btn_sign_out"){
                DE.login.logout();
            }else if(id=="de_btn_reset_pwd"){
                DE.uiManager.showRestPwdPopout();
            }else if(id=="de_btn_edit_profile"){
                DE.user.accountHasBind();
                DE.user.setProfile();
                DE.uiManager.showEditProfilePopout();

            }
        },

        /**
        *  logo点击事件处理
        * */
        logoClickHandler:function(){
            DE.history.push(document.baseURI||$("#de_base_url").attr("href"));
            DE.entity.getAllEntity(DE.config.entityTypes.project,true);
        },


        addMobileSources:function(){
            if(DE.config.checkMobile()){
                $("<link>").attr({ rel: "stylesheet",
                        type: "text/css",
                        href: "css/mobile.css"
                }).insertAfter($("link:eq(0)"));
            }
        },
        regBtnClickHandler:function(){
            DE.login.initLoginForm();
            DE.uiManager.showLoginPopout();
        },
        extMenuClickHandler:function(){
            DE.uiManager.showExtMenu();
        },
        documentClickHandler:function(target){
            if (target.parents("#de_popout").length == 0 && target.parents("#de_filter_menu").length == 0 &&
                target.parents("#de_ext_nav").length == 0 && target.parents("#de_pop_window").length == 0) {
                DE.uiManager.hideAllMenuAndPopouts();
            }
        },
        closePopWindowHandler:function(){
            DE.uiManager.closeWindow();
        },
        popCloseHandler:function(){
            DE.uiManager.hideAllMenuAndPopouts();
        }
    }
})();
