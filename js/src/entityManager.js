/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * 首页获取文章，搜索文章，更具标签获取文章，查看文章详情都作为这个模块
 */
var DE=DE||{};
DE.entity=(function(){
    var url="";
    var data=null;

    return {
        getEntityAttachment:function(type){
            if(type==DE.config.entityTypes.project){

            }
            $.ajax({
                url:DE.config.urls.getWorkDetail,
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
        getAllEntity:function(type){
            var me=this;
            if(type==DE.config.entityTypes.project){
                url=DE.config.ajaxUrls.getAllProjects;
            }else{
                url=DE.config.ajaxUrls.getAllResource;
            }


            $.ajax({
                url:url,
                type:"get",
                dataType:"json",
                success:function(data){
                    if(type==DE.config.entityTypes.project){
                        DE.store.workLoadedDate=data.projects[data.projects.length-1]["date"];
                    }else{
                        DE.store.resourceLoadedDate=data.resource[data.resource.length-1]["date"];
                    }

                    me.showEntity(data,type);
                },
                error:function(){

                }

            });
        },
        getEntityByTag:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        getEntityBySearch:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        searchHandler:function(target){
            var val="";
            if(target.is("input")){
                val=target.val();
            }else{
                val=target.text();
            }

            if(val!=""){
                $("#searchTitle").val("搜索:"+val);
            }

        },
        getTags:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        addPraise:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        changeTab:function(){

        },
        deletePraise:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        addHonor:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        deleteHonor:function(){
            $.ajax({
                url:DE.config.ajaxUrls.deleteHonor,
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
        getSimilarWorks:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        getComments:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        postComment:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        deleteComment:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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
        canCommentsDelete:function(data){

            $.each(data,function(index,m){
                 if(m.userId==DE.data.currentUser.userId||DE.config.roles.admin==DE.data.currentUser.role){
                     data.deleteAbel=true;
                 }
            });

            return data;
        },
        canShowToolbar:function(project){
            if(project.userId==DE.data.currentUser.userId||DE.config.roles.admin==DE.data.currentUser.role){
                return true;
            }

            return false;
        },
        toolbarHandler:function(target){
             var className=target.attr("class");
        },
        deleteEntity:function(){
            $.ajax({
                url:DE.config.ajaxUrls.deleteWork,
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
        editEntity:function(){
            //更改url，并且设置数据
        },
        hideEntity:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
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

        entityClickHandler:function(target){

            //请求附件

            //展示附件,juicer

            //显示展现层
        },
        showAttachment:function(){

        },
        showComments:function(){

        },
        showEntity:function(data,type){
            var tpl="",html="";

            if(type==DE.config.entityTypes.project){
                tpl=$("#projectTpl").html();
                html=juicer(tpl,{projects:data.projects,root:DE.config.root});
                $("#de_project_list").append($(html));
            }else{
                tpl=$("#resourceTpl").html();
                html=juicer(tpl,{resource:data.resource,root:DE.config.root});
                $("#de_resource_list").append($(html));
            }

        }

    }
})();

$(document).ready(function(){

    //显示当个实体详情
    $(document).on("click","a.entityLink",function(){
        DE.entity.entityClickHandler($(this).attr("target"));
    });

});