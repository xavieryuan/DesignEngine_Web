/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-1-10
 * Time: 下午3:00
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.popManager=(function(uiManager){
    return {
        popCloseHandler:function(){
            uiManager.hideAllMenuAndPopouts();
        },
        closePopWindowHandler:function(){
            $(this).parent().addClass("de_hidden");
            $("#de_pop_window_content").html("");
            $("#de_blackout").addClass("de_hidden");
        }

    }
})(DE.uiManager);
