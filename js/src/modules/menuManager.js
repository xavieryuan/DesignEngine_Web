/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-6
 * Time: 上午11:41
 * 顶部菜单、侧栏菜单，window滚动,搜索，搜索tab，弹层关闭等
 */
var DE=DE||{};
DE.menuManager=(function(config,uiManager,storeManager,entityManager,
    historyManager,userManager,loginManager){
    return {

        /**
         * window滚动处理事件
         */
        windowScrollHandler:function(){

            if(storeManager.scrollTimer){
                clearTimeout(storeManager.scrollTimer);
            }

            if(storeManager.currentScrollScreenType){
                storeManager.scrollTimer=setTimeout(function(){
                    if($(document).height()-$(window).height()<=$(window).scrollTop()){

                        switch(storeManager.currentScrollScreenType){
                            case config.scrollScreenType.search:

                                //搜索页
                                if(storeManager.searchLoadedCount!==config.hasNoMoreFlag){
                                    entityManager.getEntityBySearch({
                                        content:storeManager.currentSearch.currentSearchValue,
                                        type:storeManager.currentSearch.currentSearchType,
                                        isTag:storeManager.currentSearch.isTag,
                                        isFirst:false,
                                        callback:null
                                    });
                                }

                                break;
                            case config.scrollScreenType.project:

                                //首页作品
                                if(storeManager.projectLoadedId!=config.hasNoMoreFlag){
                                    entityManager.getAllEntity(config.entityTypes.project,false,null);
                                }

                                break;
                            case config.scrollScreenType.resource:

                                //首页资源
                                if(storeManager.resourceLoadedId!=config.hasNoMoreFlag){
                                    entityManager.getAllEntity(config.entityTypes.resource,false,null);
                                }

                                break;
                            case config.scrollScreenType.hotUser:

                                //热点用户
                                if(storeManager.hotUserLoadedCount!=config.hasNoMoreFlag){
                                    userManager.getHotUsers(false);
                                }

                                break;
                            case config.scrollScreenType.userEntity:

                                //用户页
                                if(storeManager.userEntitiesShowCount!=config.hasNoMoreFlag){
                                    userManager.showUserEntity(false,null);
                                }

                                break;
                        }
                    }
                },100);
            }
        },

        /**
         * 操作中不需要特地为第一次加载清空容器，因为所有容器的数据在ui的showScreen函数中进行了清除
         * @param {String} href      需要设置的地址
         */
        topMenuClickHandler:function(href){
            uiManager.showLoading();
            historyManager.push(href,false); //push历史记录并且清空store
            var array=href.split("/");
            var type=array[0];
            if(type==config.topMenus.project){
                //uiManager.showScreen("#de_screen_project"); //放在此处会导致屏幕闪烁，放到ajax的回调中
                entityManager.getAllEntity(type,true,null);
            }else if(type==config.topMenus.resource){
                entityManager.getAllEntity(type,true,null);
            }else if(type==config.topMenus.user){
                userManager.getHotUsersOrder();
            }else if(type==config.topMenus.upload){
                uiManager.showScreen("#de_screen_upload");
            }

        },

        /**
         * 侧边栏菜单点击事件
         * @param {String} id 点击的菜单id
         */
        extMenuItemClickHandler:function(id){
            if(id=="de_btn_sign_out"){
                loginManager.logoutHandler();
            }else if(id=="de_btn_reset_pwd"){
                uiManager.showRestPwdPopout();
            }else if(id=="de_btn_edit_profile"){
                userManager.accountHasBind();
                userManager.setProfile();
                uiManager.showEditProfilePopout();

            }
        },

        /**
        *  logo点击事件处理
        * */
        logoClickHandler:function(){
            historyManager.push(document.baseURI||$("#de_base_url").attr("href"),false);
            entityManager.getAllEntity(config.entityTypes.project,true,null);
        },

        /**
         * 搜素输入框事件
         */
        documentClickHandler:function(target){
            if(target.parents("#de_popout").length==0&&target.parents("#de_filter_menu").length==0&&
                target.parents("#de_ext_nav").length==0&&target.parents("#de_pop_window").length==0){
                uiManager.hideAllMenuAndPopouts();
            }
        },
        extMenuBtnClickHandler:function(){
            uiManager.showExtMenu();
        }
    }
})(DE.config,DE.uiManager,DE.storeManager,DE.entityManager,DE.historyManager,DE.userManager,DE.loginManager);


