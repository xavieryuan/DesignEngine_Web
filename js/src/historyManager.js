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

    function handler(type,value,clearFirstLoadFlag){

        DE.store.clearStore(clearFirstLoadFlag);
        DE.store.clearEditData();
        //DE.store.clearCurrentUser();

        switch (type){
            case "tag":

                //请求对应数据
                DE.entity.getEntityByTag(value,type,true);

                break;
            case "project":

                //请求对应数据
                DE.entity.getAllEntity(DE.config.entityTypes.project,true);

                break;
            case "user":

                //请求对应数据
                if(value=="hot"){
                    DE.user.getHotUsers(true);
                }else{
                    DE.user.getUserById();
                    DE.user.getUserEntities();
                    DE.UIManager.showScreen("#de_screen_user_profile");
                }

                break;
            case "search":

                //请求对应数据
                DE.entity.getEntityByTag(value,type,true);

                break;
            case "upload":

                //请求对应数据
                DE.UIManager.showScreen("#de_screen_upload");

                break;
            case "edit":

                //请求对应数据
                DE.upload.editEntity(value);

                break;
            case "resource":

                //请求对应数据
                DE.entity.getAllEntity(DE.config.entityTypes.resource,true);

                break;
            default :
                DE.entity.getAllEntity(DE.config.entityTypes.project,true);

            }
    }

    function handlerHref(href){
        var type="";
        var value="";
        var array=href.split("/");

        //如果是history函数push的是/root/tag/tagName这种形式如果是hash则是/tag/tagName
        if(array.length==4){
            type=array[2];
            value=array[3];
        }else{
            type=array[1];
            value=array[2];
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

            //第一次进入网站，触发该函数obj是没有值的
            if(obj!=null){
                handler(obj.type,obj.value);
            }
        },
        push:function(href){

            //首页传的href可能只有一个"/"或者"/engine"这种形式

            //当url变化的时候，清空存储器
            DE.store.clearStore(true);

            if(supports_history_api()){
                history.pushState({href:href},"",href);
            }else{
                location.hash="#!"+href;
            }
        },
        initDatas:function(){

            //设置为第一次进入页面，在store的clear中进行清除
            DE.store.isFirstLoad=true;

            var href=window.location.href;
            href=href.substring(href.indexOf(DE.config.root));
            var hrefArray=href.split("/");
            var lenght=hrefArray.length;

            if(lenght==3){

                //如果路径只有两个元素，那进入的是首页
                handler(null,null,false);
            }else if(lenght==4){

                //从其他地址进入，需要获取数据
                handler(hrefArray[2],hrefArray[3],false)
            }
        }
    }
})();

$(document).ready(function(){


    //每次进入页面都需要根据地址取数据
    DE.history.initDatas();

    //popstate事件
    window.onpopstate=function(event){
        if(event){

             //火狐第一次进入不响应此事件，event为空会报错，需要判断一下
             DE.history.stateChange(event);
        }
    }



});
