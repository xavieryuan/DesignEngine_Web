/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-1-10
 * Time: 下午2:44
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.mobileManager=(function(){
    return {
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
    }
})();
