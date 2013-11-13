/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:00
 * 管理url地址历史，针对不同的url地址做不同的处理
 */
var DE=DE||{};
DE.history=(function(){

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
     */
    function handler(type,value){

        DE.store.clearStore();
        DE.upload.clearEditData();
        //DE.store.clearCurrentUser();

        switch (type){
            case "tag":

                //请求点击标签的数据
                DE.entity.getEntityBySearch(decodeURI(value),type,true,true);

                break;
            case "project":

                //请求首页作品聚合
                DE.entity.getAllEntity(DE.config.entityTypes.project,true);

                break;
            case "user":

                //请求用户数据
                if(value=="hot"){
                    DE.user.getHotUsers(true);
                }else{
                    DE.user.getUserById(value);
                    DE.user.getUserEntities(value);
                    DE.UIManager.showScreen("#de_screen_user_profile");
                }

                break;
            case "search":

                //请求搜索数据
                DE.entity.getEntityBySearch(decodeURI(value),type,false,true);

                break;
            case "upload":

                //请求上传数据
                DE.UIManager.showScreen("#de_screen_upload");

                break;
            case "edit":

                //请求修改数据
                DE.upload.editEntity(value);

                break;
            case "resource":

                //请求首页资源数据
                DE.entity.getAllEntity(DE.config.entityTypes.resource,true);

                break;
            default :

                //默认请求首页作品数据
                DE.entity.getAllEntity(DE.config.entityTypes.project,true);

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
        stateChange:function(event){

            var obj=null;
            if(supports_history_api()){
                if(event.state){
                    var href=event.state.href;
                    obj=handlerHref(href);
                }else{

                    /*如果不是第一次进入页面，而且地址又到了首页，需要进行处理
                      此处进行判断是因为谷歌第一次进入也会相应事件，而此时不应该让此事件操作，因为默认会加载数据，不需要通过此事件
                      来进行数据的加载，所以要通过标志来处理第一次不进行事件操作的行为
                    * */
                    if(!DE.store.isFirstLoad){
                        handler(null,null);
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
                handler(obj.type,obj.value);
            }
        },

        /**
         * 无刷新改变地址栏
         * @param {String} href 需要设置的地址
         */
        push:function(href){

            //首页传的href可能只有一个"/"或者"/engine"这种形式

            //当url变化的时候，清空存储器
            DE.store.clearStore();

            if(supports_history_api()){
                history.pushState({href:href},"",href);
            }else{
                location.hash="#!"+href;
            }
        },

        /*
        * 如果是edit或者是upload，在没有登录的情况下需要直接跳到首页，所以这里的前提条件是是否登录
        * */
        initDatas:function(){

            var href=window.location.href;
            href=href.substring(href.indexOf(DE.config.root));
            var hrefArray=href.split("/");
            var lenght=hrefArray.length;

            if(!DE.store.currentUser.userId){
                if(hrefArray[2]=="edit"||hrefArray[2]=="upload"){
                    window.location.href=DE.config.root;
                    return ;
                }
            }

            if(lenght==3){

                //如果路径只有两个元素(其中一个为空:/design)，那进入的是首页
                handler(null,null);
            }else if(lenght==4){

                //从其他地址进入/design/tag/tagName，需要获取数据
                handler(hrefArray[2],hrefArray[3])
            }
        }
    }
})();

$(document).ready(function(){

    //popstate事件
    window.onpopstate=function(event){
        if(event){

            //火狐第一次进入不响应此事件，event为空会报错，需要判断一下
            DE.history.stateChange(event);

            //这个函数最后响应，需要响应完后在将标志设置为false
            DE.store.isFirstLoad=false;
        }
    }

});