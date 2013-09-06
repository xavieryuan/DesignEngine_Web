/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.user=(function(){
    return {
        getHotUsers:function(){
            $.ajax({
                url:DE.config.urls.getHotUsers,
                type:"post",
                data:{

                },
                dataType:"json",
                success:function(data){

                },
                error:function(){

                }

            });
        },
        getUserById:function(){
            $.ajax({
                url:DE.config.urls.getHotUsers,
                type:"post",
                data:{

                },
                dataType:"json",
                success:function(data){

                },
                error:function(){

                }

            });
        },
        canShowToolbar:function(project){
            if(project.userId==currentUserId||currentUserRole==roleAdmin){
                return true;
            }

            return false;
        },
        toolbarHandler:function(target){
            var className=target.attr("class");
        },
        getUserWorks:function(){
            $.ajax({
                url:DE.config.urls.getHotUsers,
                type:"post",
                data:{

                },
                dataType:"json",
                success:function(data){

                },
                error:function(){

                }

            });
        },
        editPassword:function(){

        },
        editDetail:function(){
            $.ajax({
                url:DE.config.urls.getHotUsers,
                type:"post",
                data:{

                },
                dataType:"json",
                success:function(data){

                },
                error:function(){

                }

            });
        },
        filterEnties:function(){

        },
        sortEntities:function(){

        }

    };
})();

$(document).ready(function(){

});


