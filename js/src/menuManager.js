/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-6
 * Time: 上午11:41
 * 菜单点击，window滚动
 */
var DE=DE||{};
DE.menu=(function(){
    return {
        windowScrollHandler:function(){

            //在详情页面,滚动请求评论和相似作品


            //在列表页面


            //用户页面
        },
        menuClickHandler:function(href){
            var array=href.split("/");
            var type=array[2];
            if(type=="project"){
                $("#de_project_list").html("");
                DE.entity.getAllEntity(type);
                DE.history.push(href);
                DE.UIManager.showScreen("#de_screen_project");
            }else if(type=="resource"){
                $("#de_resource_list").html("");
                DE.entity.getAllEntity(type);
                DE.history.push(href);
                DE.UIManager.showScreen("#de_screen_resource");
            }

        }
    }
})();

$(document).ready(function(){
    $("#de_top_nav a").click(function(){
        DE.menu.menuClickHandler($(this).attr("href"));
        $(this).addClass("active");

        return false;
    });
    $(window).scroll(function(){

    });
    $("#de_btn_login_reg").click(function(){

    });
    $("#de_logo").click(function(){

    });

    DE.entity.getAllEntity(DE.config.entityTypes.project);
});