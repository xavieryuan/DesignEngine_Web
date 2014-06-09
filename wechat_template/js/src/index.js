/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-5-29
 * Time: 上午11:17
 * To change this template use File | Settings | File Templates.
 */

var config={
    ajaxUrls:{
        getEntityAttachments:"post/attachments", //获取作品（资源）附件（媒体文件)
        getEntityDetail:"post/info" //获取作品（资源）详情
    },
    imagesSize:{
        thumb:"-200x200",
        mediaThumb:"-400x300"
    },
    checkMobile:function(){
        var userAgentList = new Array("2.0 MMP", "240320", "AvantGo","BlackBerry", "Blazer",
            "Cellphone", "Danger", "DoCoMo", "Elaine/3.0", "EudoraWeb", "hiptop", "IEMobile", "KYOCERA/WX310K", "LG/U990",
            "MIDP-2.0", "MMEF20", "MOT-V", "NetFront", "Newt", "Nintendo Wii", "Nitro", "Nokia",
            "Opera Mini", "Opera Mobi",
            "Palm", "Playstation Portable", "portalmmm", "Proxinet", "ProxiNet",
            "SHARP-TQ-GX10", "Small", "SonyEricsson", "Symbian OS", "SymbianOS", "TS21i-10", "UP.Browser", "UP.Link",
            "Windows CE", "WinWAP", "Android", "iPhone", "iPod", "iPad", "Windows Phone", "HTC"/*, "GTB"*/);
        var appNameList = new Array("Microsoft Pocket Internet Explorer");

        var userAgent = navigator.userAgent.toString();
        var appName = navigator.appName.toString();
        var agentLength=userAgentList.length,appLength=appNameList.length;
        var i= 0,j=0;

        for (; i<agentLength; i++) {
            if (userAgent.indexOf(userAgentList[i]) >= 0) {
                return true;
            }
        }

        for (; j<appLength; j++) {
            if (appName.indexOf(appNameList[j]) >= 0) {
                return true;
            }
        }

        return false;
    }
};
var index=(function(config){
	function getImageBySize(path,size){
        var ext=path.substring(path.lastIndexOf("."),path.length);

        return path.substring(0,path.lastIndexOf("."))+size+ext;
    }
    return {
        /**
         * 查看作品（资源）详情页获取作品（资源）的相信信息
         * @param {Number} id
         * @param {Boolean} showHome 是否显示首页按钮，用户直接用详情地址进入的时候需要显示
         */
        getEntityDetail:function(id){
            var me=this;
            $.ajax({
                url:config.ajaxUrls.getEntityDetail,
                type:"get",
                async:false,  //用同步，需要显示元素，以便后面的请求的数据进行渲染
                dataType:"json",
                data:{
                    postId:id
                },
                success:function(data){
                    if(data.success){

                        //展示头部
                        me.showEntityDetailTop(data);

                    }else{
                        //config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    //config.ajaxErrorHandler();
                }

            });
        },
        /**
         *查看作品（资源）详情页获取附件（媒体文件）
         */
        getEntityAttachment:function(id){
            var me=this;

            $.ajax({
                url:config.ajaxUrls.getEntityAttachments,
                type:"get",
                dataType:"json",
                //async:false,
                data:{
                    postId:id
                },
                success:function(data){
                    if(data.success){
                        if(config.checkMobile()){
                            data.attachments=me.formatAttachment(data.attachments);
                        }
                        me.showAttachment(data);
                    }else{
                        //config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    //config.ajaxErrorHandler();
                }

            });
        },
        /**
         * 详情页显示作品（资源）详情
         * @param {Object} data 请求详情时返回的json对象
         */
        showEntityDetailTop:function(data){
            var tpl=$("#entityDetailTopTpl").html();
            var html=juicer(tpl,data.entity);
            $("body").append($(html));
        },
        /**
         * 显示附件（媒体文件）
         * @param {Object} data 请求附件时返回的json对象
         */
        showAttachment:function(data){
            var tpl=$("#entityMainContentTpl").html();
            var html=juicer(tpl,data);
            $("#main_content").html(html);
        },
        formatAttachment:function(data){
            var length=data.length,i=0;
            if(length==0){
                return [];
            }else{
                for(;i<length;i++){
                    data[i]["attachmentPreviewLocation"]=getImageBySize(data[i]["attachmentPreviewLocation"],config.imagesSize.mediaThumb);
                }

                return data;
            }
        }
    }
})(config);
$(document).ready(function(){
    var href=location.href;
    var pos=href.lastIndexOf("/");
    var id=href.substring(pos+1);

    //请求详细信息,同步的ajax,如果需要改用异步，需要修改html模板
    index.getEntityDetail(id);

    //请求附件
    index.getEntityAttachment(id);
    
    $(document).on("click","a[data-has-media='true']",function(){        
        return false;
    });
});
