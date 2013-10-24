/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 *和作品资源相关的处理：首页获取，搜索文章，根据标签获取文章，查看文章详情,用户页面显示的作品或者资源都作为这个模块
 */
var DE=DE||{};
DE.entity=(function(){

    /**
     * 获取日期时间,用户评论
     * @returns {string} 返回格式好的日期时间2012-09-09 12:03:34
     */
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }

    return {

        /**
         *查看作品（资源）详情页获取附件（媒体文件）
         */
        getEntityAttachment:function(id){
            var me=this;

            $.ajax({
                url:DE.config.ajaxUrls.getEntityAttachments,
                type:"get",
                dataType:"json",
                //async:false,
                data:{
                    postId:id
                },
                success:function(data){
                    if(data.success){
                        me.showAttachment(data);
                    }else{
                       DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 查看作品（资源）详情页获取作品（资源）的相信信息
         */
        getEntityDetail:function(id){
            var me=this;

            $.ajax({
                url:DE.config.ajaxUrls.getEntityDetail,
                type:"get",
                async:false,  //用同步，后面的请求需要用到返回的结果值
                dataType:"json",
                data:{
                    postId:id
                },
                success:function(data){
                    if(data.success){
                        //记录是否赞过
                        DE.store.initCurrentShowEntity({
                            id:data.entity.postId,
                            hasPraised:data.entity.userPraised,
                            type:data.entity.postType=="work"?DE.config.entityTypes.project:DE.config.entityTypes.resource
                        });

                        //展示工具栏
                        me.showEntityTool(data);

                        //展示头部
                        me.showEntityDetailTop(data);

                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 获取首页的作品或者资源
         * @param {String} type 要获取的类型
         * @param {Boolean} first 是否第一次获取
         */
        getAllEntity:function(type,first){
            var me=this;
            var url="";
            var postId=0;
            if(type==DE.config.entityTypes.project){
                url=DE.config.ajaxUrls.getAllProjects;
                postId=DE.store.projectLoadedId;
            }else{
                url=DE.config.ajaxUrls.getAllResource;
                postId=DE.store.resourceLoadedId;
            }


            $.ajax({
                url:url,
                type:"get",
                dataType:"json",
                data:{
                    postId:postId
                },
                success:function(data){
                    if(data.success){
                        var length=0;
                        if(type==DE.config.entityTypes.project){
                            length=data.projects.length;
                            if(length==DE.config.perLoadCount){
                                DE.store.projectLoadedId=data.projects[length-1]["postId"];
                            }else{
                                DE.store.projectLoadedId=DE.config.hasNoMoreFlag;
                            }
                            DE.store.currentScrollScreenType=DE.config.scrollScreenType.project;
                        }else{
                            length=data.resources.length;
                            if(length==DE.config.perLoadCount){
                                DE.store.resourceLoadedId=data.resources[length-1]["postId"];
                            }else{
                                DE.store.resourceLoadedId=DE.config.hasNoMoreFlag;
                            }
                            DE.store.currentScrollScreenType=DE.config.scrollScreenType.resource;
                        }

                        //不管是否有数据，都需要执行函数，因为函数里有显示界面screen的操作
                        me.showEntities(data,type,first);
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }

                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 根据搜索内容获取作品（资源）
         * @param {String} content 搜索的内容
         * @param {Boolean} first 是否第一次加载，第一次需要设置显示的screen
         * @param {Boolean} isTag 是否是标签
         * @param {String} type 搜索的类型
         */
        getEntityBySearch:function(content,type,isTag,first){
            var me=this;

            $.ajax({
                url:DE.config.ajaxUrls.getEntitiesBySearch,
                type:"get",
                dataType:"json",
                data:{
                    keyword:content,
                    field:isTag?"term":"info",
                    entityId:type==DE.config.entityTypes.project?DE.store.projectLoadedId:DE.store.resourceLoadedId
                },
                success:function(data){
                    if(data.success){
                        DE.store.currentSearch.currentSearchValue=content; //记录下当前搜索的内容

                        DE.store.currentSearch.currentSearchType=type;
                        DE.store.currentSearch.isTag=isTag;
                        DE.store.currentScrollScreenType=DE.config.scrollScreenType[type];
                        if(type==DE.config.entityTypes.resource){
                            DE.store.resourceLoadedId=0;
                        }else{
                            DE.store.projectLoadedId=0;
                        }

                        me.showSearchEntities(data,first);
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 查看作品（资源）详情页点击赞图标的操作（增加、删除)
         */
        handlerPraiseOrHonor:function(){
            var url="";
            if(DE.store.currentShowEntity.hasPraised){
                url=DE.config.ajaxUrls.deletePraise;
            }else{
                url=DE.config.ajaxUrls.addPraise;
            }
            $.ajax({
                url:url,
                type:"post",
                data:{
                    postId:DE.store.currentShowEntity.id
                },
                dataType:"json",
                success:function(data){

                    //更新赞的数量
                    if(data.success){
                        var praiseCountEl=$("#praiseCount");
                        var honorCountEl=$("#honorCount");
                        if(DE.store.currentShowEntity.hasPraised){
                            DE.store.currentShowEntity.hasPraised=false;
                            $("#de_entity_praise").addClass("de_flag_reg_zan").removeClass("de_flag_reg_zanned");
                            if(DE.store.currentUser.role==DE.config.roles.user){
                                 praiseCountEl.text(parseInt(praiseCountEl.text())-1);
                            }else{

                                honorCountEl.text(parseInt(honorCountEl.text())-1);
                            }
                        }else{
                            DE.store.currentShowEntity.hasPraised=true;
                            $("#de_entity_praise").removeClass("de_flag_reg_zan").addClass("de_flag_reg_zanned");
                            if(DE.store.currentUser.role==DE.config.roles.user){
                                praiseCountEl.text(parseInt(praiseCountEl.text())+1);
                            }else{
                                honorCountEl.text(parseInt(honorCountEl.text())+1);
                            }
                        }

                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 查看作品（资源）详情页获取相似作品（资源）
         */
        getSimilarEntities:function(id){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getSimilarEntities,
                type:"get",
                dataType:"json",
                success:function(data){
                     me.showSimilarEntity(data);
                },
                error:function(){
                     DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 查看作品（资源）详情页获取评论
         */
        getComments:function(id){
            var me=this;

            $.ajax({
                url:DE.config.ajaxUrls.getComments,
                type:"get",
                //async:false,
                data:{
                    postId:id,
                    commentId:DE.store.commentLoadedId
                },
                dataType:"json",
                success:function(data){
                    if(data.success){
                        var length=data.comments.length;
                        if(length>0){
                            if(length<DE.config.perLoadCount){

                                //不足每次加载的数据，没有更多
                                DE.store.commentLoadedId=DE.config.hasNoMoreFlag;
                                //$("#de_comment_more_btn").remove();
                            }else{
                                DE.store.commentLoadedId=data.comments[length-1]["commentId"];
                            }

                            //不管是否有数据，都需要执行函数，因为函数里有显示界面screen的操作
                            me.showComment(data);
                        }else{

                            //返回为0，没有更多
                            DE.store.commentLoadedId=DE.config.hasNoMoreFlag;
                            $("#de_comment_more_btn").remove();
                        }
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }

                },
                error:function(){
                     DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 查看作品（资源）详情页删除评论
         */
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

        /**
         * 查看作品（资源）详情页判断评论是否显示评论删除的按钮
         * @param {Array} data 评论对象数组
         * @returns {*} 返回做过处理的对象数组
         */
        canCommentsDelete:function(data){

            $.each(data,function(index,m){
                 if(m.userId==DE.store.currentUser.userId||DE.config.roles.admin==DE.store.currentUser.role){
                     data.deleteAbel=true;
                 }
            });

            return data;
        },

        /**
         * 查看作品（资源）详情页判断是否显示工具栏
         * @param {Object} entity 作品（资源）对象
         * @returns {boolean} true|false
         */
        canShowToolbar:function(entity){
            if(entity.userId==DE.store.currentUser.userId||DE.config.roles.admin==DE.store.currentUser.role){
                return true;
            }

            return false;
        },

        /**
         * 详情页和用户页工具栏删除作品（资源)
         * @param {Number} id 作品资源id
         */
        deleteEntity:function(id){
            $.ajax({
                url:DE.config.ajaxUrls.deleteEntity,
                type:"post",
                data:{
                    postId:id
                },
                dataType:"json",
                success:function(data){
                    if(data.success&&data.resultCode==DE.config.resultCode.post_remove_succ){

                        //界面更新,有可能在详情页，也有可能在用户页
                        DE.UIManager.hideProjectDetail();
                        DE.store.commentLoadedId=0;
                        $(".de_entity_link[href='entity/"+id+"']").parents("li").remove();
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 详情页和用户页工具栏点击编辑按钮的处理函数
         * @param {String} href 按钮a的href,设置成url地址
         */
        editEntity:function(href){
            DE.history.push(href);

            //需要获取id不能使用DE.store.currentShowEntity.id，因为在用户页面也有此工具栏
            var id=href.split("/")[1];

            DE.upload.editEntity(id);
        },

        /**
         * 详情页和用户页工具栏隐藏作品（资源）
         * @param {Object} el 点击的a标签
         */
        showOrHideEntity:function(el){
            var id=el.attr("href");
            var visible=true;
            if(el.data("target-visible")==true){
                visible=false;
            }
            $.ajax({
                url:DE.config.ajaxUrls.showOrHideEntity,
                type:"post",
                data:{
                    postId:id,
                    status:visible
                },
                dataType:"json",
                success:function(data){
                     if(data.success&&data.resultCode==DE.config.resultCode.visible_set_succ){
                         if(visible){
                             el.removeClass("de_toolbar_visible").addClass("de_toolbar_invisible");
                             el.data("target-visible",true);
                         }else{
                             el.removeClass("de_toolbar_invisible").addClass("de_toolbar_visible");
                             el.data("target-visible",false);
                         }
                     }else{
                         DE.config.ajaxReturnErrorHandler(data);
                     }
                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 作品（资源）聚合点击事件，显示详情
         * @param {String} href 聚合中a的href（entity/id形式）
         */
        entityClickHandler:function(href){
            var array=href.split("/");
            var id=array[1];



            //请求详细信息
            this.getEntityDetail(id);

            //请求附件
            this.getEntityAttachment(id);

            //请求评论
            if(DE.store.currentShowEntity.type==DE.config.entityTypes.project){
                this.getComments(id);
            }

            //请求相似实体
            this.getSimilarEntities(id);

            //显示展现层
            DE.UIManager.showProjectDetail();

        },

        /**
         * 详情页显示作品（资源）详情
         * @param {Object} data 请求详情时返回的json对象
         */
        showEntityDetailTop:function(data){
            var tpl=$("#entityDetailTopTpl").html();
            data.entity.user=DE.store.currentUser;
            var html=juicer(tpl,data.entity);
            $("#de_screen_project_detail").append($(html));
        },

        /**
         * 详情页显示赞和工具栏
         * @param {Object} data 请求详情时返回的json对象
         */
        showEntityTool:function(data){
            var tpl=$("#entityToolTpl").html();
            var showFlag=this.canShowToolbar(data.entity);
            var html=juicer(tpl,{
                id:DE.store.currentShowEntity.id,
                hasPraised:data.entity.userPraised,
                canShowToolBar:showFlag,
                postType:data.entity.postType,
                postVisible:data.entity.postVisible
            });
            $("#de_screen_project_detail").prepend($(html));

        },

        /**
         * 显示相似作品
         * @param {Object} data 请求相似作品时返回的json对象
         */
        showSimilarEntity:function(data){
            var tpl=$("#similarEntityTpl").html();
            var html=juicer(tpl,data);
            $("#de_similar_entities").append($(html));
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

        /**
         * 显示所有评论
         * @param {Object} data 请求评论时返回的json对象
         */
        showComment:function(data){
            var tpl=$("#entityCommentsTpl").html();
            var html=juicer(tpl,{comments:data.comments});
            $("#de_comment_list").append($(html));
        },

        /**
         * 显示作品（资源）聚合
         * @param {Object} data 请求作品（资源）时返回的json对象
         * @param {String} type 请求的类型
         * @param {Boolean} first 是否第一次请求,第一次需要设置screen
         */
        showEntities:function(data,type,first){
            var tpl="",html="";

            if(type==DE.config.entityTypes.project){
                tpl=$("#projectTpl").html();
                html=juicer(tpl,{projects:data.projects});

                if(first){
                    $("#de_project_list").html(html);
                    DE.UIManager.showScreen("#de_screen_project");
                }else{
                    $("#de_project_list").append($(html));
                }

            }else{
                tpl=$("#resourceTpl").html();
                html=juicer(tpl,{resource:data.resources});

                if(first){
                    $("#de_resource_list").html(html);
                    DE.UIManager.showScreen("#de_screen_resource");
                }else{
                    $("#de_resource_list").append($(html));
                }
            }

        },

        /**
         * 显示搜索出来的作品（资源）聚合
         * @param data
         * @param {Boolean} first 是否第一次请求,第一次需要设置screen
         */
        showSearchEntities:function(data,first){
            var targetContain= $("#de_search_result");
            var tpl=$("#searchResultTpl").html();
            var html=juicer(tpl,data);

            if(first){

                //清理工作在此处，tab公用了一个展示界面，点击tab的时候如果先清理那么数据突然消失，界面闪烁
                targetContain.html(html);
                DE.UIManager.showSearchScreen(DE.store.currentSearch.currentSearchValue,DE.store.currentSearch.currentSearchType);

            }else{
                targetContain.append($(html));
            }


        },

        /**
         * 详情页点击添加评论按钮处理事件
         */
        addCommentHandler:function(){
            var contentEle=$("#de_comment_content");
            var content=contentEle.val();
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.postComment,
                type:"post",
                data:{
                    postId:DE.store.currentShowEntity.id,
                    content:content
                },
                dataType:"json",
                success:function(data){
                    if(data.success&&data.resultCode==DE.config.resultCode.comment_add_succ){
                        contentEle.val("");
                        me.showSingleComment(content,data.createTime);
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });

        },

        /**
         * 详情页显示单条评论，用于添加时
         * @param {String} content 评论内容
         * @param {String} time 评论时间
         */
        showSingleComment:function(content,time){
            var tpl=$("#singleComment").html();
            var html=juicer(tpl,{
                user:DE.store.currentUser,
                content:content,
                time:time
            });
            $("#de_comment_list").append($(html));
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
        DE.store.commentLoadedId=0;

        return false;
    });

    //点击赞图标的操作，增加或者删除
    $(document).on("click","#de_entity_praise",function(){
        if(!DE.store.currentUser.userId){
            DE.login.initLoginForm();
            DE.UIManager.showLoginPopout();
            DE.UIManager.hideProjectDetail();
        }else{
            DE.entity.handlerPraiseOrHonor();
        }


        return false;
    });


    //评论登录
    $(document).on("click","#de_btn_comment_login",function(){
        DE.login.initLoginForm();
        DE.UIManager.showLoginPopout();
        DE.UIManager.hideProjectDetail();

        return false;
    });

    //添加评论
    $(document).on("click","#de_btn_add_comment",function(){
        DE.entity.addCommentHandler();
    });

    //评论加载更多
    $(document).on("click","#de_comment_more_btn",function(){
        DE.entity.getComments(DE.store.currentShowEntity.id);
    });

    //工具栏点击事件
    $(document).on("click",".de_project_toolbar a",function(){
        var className=$(this).attr("class");
        if(className=="de_toolbar_edit"){
            DE.entity.editEntity($(this).attr("href"));
        }else if(className=="de_toolbar_delete"){
            DE.entity.deleteEntity($(this).attr("href"));
        }else{
            DE.entity.showOrHideEntity($(this));
        }

        return false;
    });

});