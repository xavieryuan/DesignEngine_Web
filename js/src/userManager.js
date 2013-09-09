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
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getHotUsers,
                type:"get",
                dataType:"json",
                success:function(data){
                    DE.store.hotUserLoadedId=data.users[data.users.length-1]["id"];
                    me.showHotUser(data);
                },
                error:function(){

                }

            });
        },
        showHotUser:function(data){
            var tpl=$("#hotUserTpl").html();
            var html=juicer(tpl,{hotUsers:data.users,root:DE.config.root});
            $("#de_hot_user_list").append($(html));
        },
        getUserById:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getUserById,
                type:"get",
                async:false,  //启用同步，因为这里获取的数据要保存，在显示作品的时候要用
                dataType:"json",
                success:function(data){
                    DE.store.currentShowUser.userId=data.user.id;
                    DE.store.currentShowUser.figureUrl=data.user.profile;
                    DE.store.currentShowUser.name=data.user.name;
                    DE.store.currentShowUser.role=data.user.role;
                    me.showUserDetail(data);
                },
                error:function(){

                }

            });
        },
        showUserDetail:function(data){
            var tpl=$("#userDetailTpl").html();
            data.user.root=DE.config.root;
            var html=juicer(tpl,data.user);
            $("#de_user_info_card").html($(html));
        },
        showUserEntity:function(data){
            var tpl=$("#userEntitiesTpl").html();
            data.root=DE.config.root;
            data.userId=DE.store.currentShowUser.userId;
            data.userName=DE.store.currentShowUser.name;
            data.userProfile=DE.store.currentShowUser.figureUrl;
            data.role=DE.store.currentShowUser.role;
            data.showToolBar=this.canShowToolbar();
            var html=juicer(tpl,data);
            $("#de_user_uploads").append($(html));
        },
        showHonorProject:function(data){
            var tpl=$("#userHonorProjectTpl").html();
            var html=juicer(tpl,data);
            $("#de_user_honor_projects").html(html);
        },
        canShowToolbar:function(){
            if(DE.store.currentShowUser.userId==DE.store.currentUser.userId||DE.store.currentUser.role==DE.config.roles.admin){
                return true;
            }

            return false;
        },
        toolbarHandler:function(target){
            var className=target.attr("class");
        },
        getUserEntities:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getUserEntities,
                type:"get",
                dataType:"json",
                success:function(data){
                    me.showUserEntity(data);

                    //如果是普通用户，会有优秀作品
                    if(DE.store.currentShowUser.role!="VIP"){
                        me.showHonorProject(me.filterProjects(data));
                    }
                },
                error:function(){

                }

            });
        },
        userClickHandler:function(href){
            DE.history.push(href);  //由于有清空store的操作，需要最先执行
            var array=href.split("/");
            var id=array[3];

            this.getUserById();
            this.getUserEntities();

            DE.UIManager.showScreen("#de_screen_user_profile");

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

        /**
         * 获取荣誉作品,只有作品能被贴荣誉标签
         */
        filterProjects:function(data){
            var array=[];
            $.each(data.entities,function(index,d){
                if(d.hasHonor){
                    array.push(d);
                }
            });

            return {projects:array,root:DE.config.root};
        },
        /**
         *排序实体
         */
        sortEntities:function(){

        }

    };
})();

$(document).ready(function(){
    $(document).on("click","a.de_user_link",function(){
        DE.user.userClickHandler($(this).attr("href"));

        return false;
    });
});


