/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:00
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.history=(function(){
    function supports_history_api(){
        return window.history && history.pushState;
    }

    function handler(type,value){

        switch (type){
            case "tag":
                //请求对应数据
                break;
            case "project":
                //请求对应数据
                break;
            case "user":
                break;
            case "search":
                break;
            case "upload":
                break;
            case "edit":
                break;
            case "resource":
                break;
            case "entity":
                //默认请求首页数据
                break;
            default :
            //同tag/all，请求首页的设计作品数据

            }
    }

    function handlerHref(href){
        var type="";
        var value="";
        var array=href.split("/");

        //给首页做hack
        if(array[2]==""){
            type="work";
            value="all";
        }else{
            type=array[2];
            value=array[3];
        }

        return {
            type:type,
            value:value
        }
    }
    return {
        stateChange:function(event){
            var obj=null;
            if(supports_history_api()){
                if(event.state){
                    var href=event.state.href;
                    obj=handlerHref(href);
                }
            }else{
                if(location.hash){
                    var hash=location.hash;
                    var hashValue=hash.substring(2);

                    obj=handlerHref(hashValue);
                }
            }

            //第一次进入网站，触发该函数obj是没有值的
            if(obj!=null){
                handler(obj.type,obj.value);
            }

        },
        push:function(href){

            //首页传的href可能只有一个"/"或者"/engine"这种形式

            if(supports_history_api()){
                history.pushState({href:href},"",href);
            }else{
                location.hash="#!"+href;
            }

            //当url变化的时候，清空存储器
            DE.store.clearStore();
        }
    }
})();

$(document).ready(function(){
     window.onpopstate=DE.history.stateChange(event);
});
