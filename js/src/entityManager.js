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
        getEntityAttachment:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getEntityAttachments,
                type:"get",
                dataType:"json",
                success:function(data){
                    me.showAttachment(data);
                },
                error:function(){

                }

            });
        },
        getEntityDetail:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getEntityDetail,
                type:"get",
                async:false,
                dataType:"json",
                success:function(data){

                    //记录是否赞过
                    DE.store.initCurrentShowEntity(data.entity);

                    //展示工具栏
                    me.showEntityTool(data);

                    //展示头部
                    me.showEntityDetailTop(data);

                },
                error:function(){

                }

            });
        },
        getAllEntity:function(type,first){
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
                        DE.store.projectLoadedDate=data.projects[data.projects.length-1]["date"];
                        DE.store.currentScrollScreenType=DE.config.scrollScreenType.project;
                    }else{
                        DE.store.resourceLoadedDate=data.resource[data.resource.length-1]["date"];
                        DE.store.currentScrollScreenType=DE.config.scrollScreenType.resource;
                    }

                    me.showEntities(data,type,first);
                },
                error:function(){

                }

            });
        },

        /**
         *
         * @param tag
         * @param {Boolean} first       是否第一次加载，第一次需要设置显示的screen
         * @param {String} type   搜索的类型
         */
        getEntityByTag:function(tag,type,first){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getSimilarEntities,
                type:"get",
                dataType:"json",
                data:{
                    tag:tag
                },
                success:function(data){
                    DE.store.currentSearchValue=tag; //记录下当前搜索的内容
                    DE.store.currentSearchType=type;
                    DE.store.currentScrollScreenType=DE.config.scrollScreenType[type];
                    me.showSearchEntities(data,first);
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
        handlerPraiseOrHonor:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
                type:"post",
                data:{
                    id:DE.currentShowEntity.id
                },
                dataType:"json",
                success:function(data){

                },
                error:function(){

                }

            });
        },

        getSimilarEntities:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getSimilarEntities,
                type:"get",
                dataType:"json",
                success:function(data){
                     me.showSimilarEntity(data);
                },
                error:function(){

                }

            });
        },
        getComments:function(){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getComments,
                type:"get",
                data:{

                },
                dataType:"json",
                success:function(data){
                    me.showComment(data);
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
                 if(m.userId==DE.store.currentUser.userId||DE.config.roles.admin==DE.store.currentUser.role){
                     data.deleteAbel=true;
                 }
            });

            return data;
        },
        canShowToolbar:function(project){
            if(project.userId==DE.store.currentUser.userId||DE.config.roles.admin==DE.store.currentUser.role){
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
                    id:DE.store.currentShowEntity.id
                },
                dataType:"json",
                success:function(data){

                },
                error:function(){

                }

            });
        },
        editEntity:function(href){
            DE.history.push(href);

            DE.upload.editEntity(DE.store.currentShowEntity.id);
        },
        hideEntity:function(){
            $.ajax({
                url:DE.config.urls.getWorkById,
                type:"post",
                data:{
                    id:DE.store.currentShowEntity.id
                },
                dataType:"json",
                success:function(data){

                },
                error:function(){

                }

            });
        },

        entityClickHandler:function(href){
            var array=href.split("/");
            var id=array[3];


            //请求详细信息
            this.getEntityDetail();

            //请求附件
            this.getEntityAttachment();

            //请求评论
            this.getComments();

            //请求相似实体
            this.getSimilarEntities();

            //显示展现层
            DE.UIManager.showProjectDetail();

        },
        showEntityDetailTop:function(data){
            var tpl=$("#entityDetailTopTpl").html();
            data.entity.root=DE.config.root;
            var html=juicer(tpl,data.entity);
            $("#de_project_detail").html($(html));
        },
        showEntityTool:function(data){
            var tpl=$("#entityToolTpl").html();
            var showFlag=false;
            showFlag=this.canShowToolbar(data.entity);
            var html=juicer(tpl,{
                id:DE.store.currentShowEntity.id,
                hasPraised:data.entity.praised,
                canShowToolBar:showFlag,
                root:DE.config.root
            });
            $("#de_screen_project_detail").prepend($(html));

        },
        showSimilarEntity:function(data){
            var tpl=$("#similarEntityTpl").html();
            data.root=DE.config.root;
            var html=juicer(tpl,data);
            $("#de_screen_project_detail").append($(html));
        },
        showAttachment:function(data){
            var tpl=$("#entityMainContentTpl").html();
            var html=juicer(tpl,data);
            $("#de_project_detail").append($(html));
        },
        showComment:function(data){
            var tpl=$("#entityCommentsTpl").html();
            data.root=DE.config.root;
            var html=juicer(tpl,data);
            $("#de_screen_project_detail").append($(html));
        },
        /**
         * 这个函数
         * @param data
         * @param type
         * @param first
         */
        showEntities:function(data,type,first){
            var tpl="",html="";

            if(type==DE.config.entityTypes.project){
                tpl=$("#projectTpl").html();
                html=juicer(tpl,{projects:data.projects,root:DE.config.root});
                $("#de_project_list").append($(html));
                if(first){
                    DE.UIManager.showScreen("#de_screen_project");
                }

            }else{
                tpl=$("#resourceTpl").html();
                html=juicer(tpl,{resource:data.resource,root:DE.config.root});
                $("#de_resource_list").append($(html));
                if(first){
                    DE.UIManager.showScreen("#de_screen_resource");
                }
            }

        },
        showSearchEntities:function(data,first){
            var targetContain= $("#de_search_result");
            var tpl=$("#searchResultTpl").html();
            data.root=DE.config.root;
            var html=juicer(tpl,data);

            if(first){

                //清理工作在此处，tab公用了一个展示界面，点击tab的时候如果先清理那么数据突然消失，界面闪烁
                targetContain.html(html);
                DE.UIManager.showSearchScreen(DE.store.currentSearchValue,DE.store.currentSearchType);
                return false;
            }

            targetContain.append($(html));
        }
    }
})();

$(document).ready(function(){

    //显示当个实体详情
    $(document).on("click","a.de_entity_link",function(){
        DE.entity.entityClickHandler($(this).attr("href"));

        return false;
    });

    //关闭作品详情
    $(document).on("click","#de_btn_close_project_detail",function(){
        DE.UIManager.hideProjectDetail();

        return false;
    });

    $(document).on("click","#de_entity_praise",function(){
        DE.entity.handlerPraiseOrHonor();

        return false;
    });

    $(document).on("click","#de_entity_toolbar a",function(){
        var className=$(this).attr("class");
        if(className=="de_toolbar_edit"){
            DE.entity.editEntity($(this).attr("href"));
        }else if(className=="de_toolbar_delete"){
            DE.entity.deleteEntity();
        }else{
            DE.entity.hideEntity();
        }

        return false;
    });

});