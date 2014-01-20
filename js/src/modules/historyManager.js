/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:00
 * 管理url地址历史，针对不同的url地址做不同的处理
 */
var DE=DE||{};
DE.historyManager=(function(){

    /**
     * 是否支持history的api
     * @returns {History|*}
     */
    function supports_history_api(){
        return window.history && history.pushState;
    }

    /**
     * 针对不同的url的数据处理,对应config中的urls
     * @param {String} type 要请求数据的类型
     * @param {String} value 要请求的数据的参数值
     * @param {*} oldHref 旧的url，主要是详情页使用
     * @param {Function} callback 回调函数,主要是显示作品详情
     */
    function handler(type,value,oldHref,callback){

        DE.storeManager.clearStore();
        DE.uploadManager.clearEditData();
        //DE.storeManager.clearCurrentUser();
        DE.uiManager.showLoading();

        switch (type){
            case "resource-tag":

                //请求点击标签的数据
                value=decodeURI(value);

                DE.entityManager.getEntityBySearch({
                    content:value,
                    type:DE.config.entityTypes.resource,
                    isTag:true,
                    isFirst:true,
                    callback:callback
                });

                break;
            case "project-tag":

                //请求点击标签的数据
                value=decodeURI(value);

                DE.entityManager.getEntityBySearch({
                    content:value,
                    type:DE.config.entityTypes.project,
                    isTag:true,
                    isFirst:true,
                    callback:callback
                });

                break;
            case "project":

                //请求首页作品聚合
                DE.entityManager.getAllEntity(DE.config.entityTypes.project,true,callback);

                break;
            case "user":

                //请求用户数据
                if(value=="hot"){
                    DE.userManager.getHotUsersOrder();
                }else{
                    DE.userManager.getUserById(value);
                    DE.userManager.getUserEntities(value,callback);
                    //DE.uiManager.showScreen("#de_screen_user_profile");
                }

                break;
            case "search":

                //请求搜索数据
                DE.entityManager.getEntityBySearch({
                    content:decodeURI(value),
                    type:"",
                    isTag:false,
                    isFirst:true,
                    callback:callback
                });

                break;
            case "upload":

                //请求上传数据
                DE.uiManager.showScreen("#de_screen_upload");

                break;
            case "edit":

                //请求修改数据
                DE.uploadManager.editEntity(value);

                break;
            case "resource":

                //请求首页资源数据
                DE.entityManager.getAllEntity(DE.config.entityTypes.resource,true,callback);

                break;
            case "item":

                if(oldHref!==undefined&&oldHref!==""){
                    var obj=handlerHref(oldHref);
                    handler(obj.type,obj.value,undefined,function(){
                        DE.entityManager.entityClickHandler(type+"/"+value,false,false);
                    });

                }else{
                    var showHome=oldHref===""?false:true;

                    handler(null,null,undefined,function(){
                        DE.entityManager.entityClickHandler(type+"/"+value,showHome,false);
                    });
                }

                break;
            default :

                //默认请求首页作品数据
                DE.entityManager.getAllEntity(DE.config.entityTypes.project,true,callback);

            }
    }


    /**
     * 处理href(url)函数
     * @param {String} href 传入的地址
     * @returns {{type: string, value: string}}
     */
    function handlerHref(href){
        var array=href.split("/");

        //history函数push的hash都是tag/tagName

        var type=array[0];
        var value=array[1];

        return {
            type:type,
            value:value
        }
    }

    return {

        /**
         * stateChange处理函数
         * @param {Object} event sate变化时的事件对象
         */
        stateChange:function(state){

            var obj=null;
            if(supports_history_api()){
                var baseURI=document.baseURI||$("#de_base_url").attr("href");

                //回退到首页的时候是null,第一次进入非首页回退的时候浏览器默认会根据代码生成state
                if(state){

                    var href=state.href;
                    if(typeof state.oldHref!=="undefined"){

                        //前进或者后退到详情页,不管如何都需要重新处理数据
                        obj=handlerHref(href);
                    }else{

                        //由于存在详情页回退是不需要刷新数据的，这里应该要判断是否加载了数据
                        if(DE.storeManager.userEntitiesShowCount===0&&DE.storeManager.projectLoadedId===0&&
                            DE.storeManager.resourceLoadedId===0&&DE.storeManager.hotUserLoadedCount===0&&DE.storeManager.searchLoadedCount===0){

                            if(href==baseURI){
                                obj={type:null,value:null};
                            }else{
                                obj=handlerHref(href);
                            }
                        }
                    }

                    /*
                    * 这里调用和下面调用都是为了防止在详情页面，用户直接前进后退，
                    * 此时页面详情没有事件关闭，应该调用一次关闭
                    * */
                    DE.uiManager.hideProjectDetail();
                }else{

                    //退回到第一次进入时的首页state为{}或者为null,还有chrome的第一次响应(判断作品是否加载过)
                    if(DE.storeManager.projectLoadedId===0&&location.href==baseURI){
                        handler(null,null);
                        DE.uiManager.hideProjectDetail();
                    }

                }
            }else{
                if(location.hash){
                    var hash=location.hash;
                    var hashValue=hash.substring(2);

                    obj=handlerHref(hashValue);
                }
            }

            /*有两种情况会使event.state为空，从而使obj为null
            *一种是第一次进入网站，这个时候不需要响应数据，由initData响应
            *一种是退回到首页或者点击logo到首页，这个时候是需要处理的，在上面处理了
            */


            if(obj!=null){

                handler(obj.type,obj.value,state.oldHref);
            }

        },

        /**
         * 无刷新改变地址栏
         * @param {String} href 需要设置的地址
         * @param {Boolean} isEntityDetail 是否是详情页，如果是则不需要clearStore,可选
         */
        push:function(href,isEntityDetail){

            //首页传的href可能只有一个"/"或者"/engine"这种形式

            //当url变化的时候，清空存储器
            if(!isEntityDetail){
                DE.storeManager.clearStore();
            }


            if(supports_history_api()){
                if(isEntityDetail){
                    var baseURI=document.baseURI||$("#de_base_url").attr("href");
                    var oldHref=location.href.substring(baseURI.length);
                    history.pushState({href:href,oldHref:oldHref},"",href);
                }else{
                    history.pushState({href:href},"",href);
                }
            }else{
                location.hash="#!"+href;
            }
        },

        /*
        * 如果是edit或者是upload，在没有登录的情况下需要直接跳到首页，所以这里的前提条件是是否登录
        * */
        initDatas:function(){

            var href=window.location.href;
            var baseURI=document.baseURI||$("#de_base_url").attr("href");
            href=href.substring(baseURI.length);
            if(!href){
                handler(null,null);
            }else{
                var hrefArray=href.split("/");

                handler(hrefArray[0],hrefArray[1]);
            }
        }
    }
})();
