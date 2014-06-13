/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 *和作品资源相关的处理：首页获取，搜索文章，根据标签获取文章，查看文章详情
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

    /**
     *
     * @param {String} date 需要格式化的时间字符串
     * @returns {string}
     */
    function formatDate(date){

        var date=new Date(date);

        var year=date.getFullYear();

        var month=date.getMonth()+1;
        if(month<10){
            month="0"+month;
        }

        var day=date.getDate();
        if(day<10){
            day="0"+day;
        }

        return year+"-"+month+"-"+day;

    }

    /**
     * 格式化搜索的数据
     * @param {Object} data 后台返回的json数据
     * @returns {*}
     */
    function formatSearchData(data){

        var length=data.docs.length;
        var i=0;
        for(;i<length;i++){
            data.docs[i]["postDate"]=formatDate(data.docs[i]["postDate"]);
        }

        return data;
    }

    function getImageBySize(path,size){
        var ext=path.substring(path.lastIndexOf("."),path.length);

        return path.substring(0,path.lastIndexOf("."))+size+ext;
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
                        if(DE.config.checkMobile()){
                           data.attachments=me.formatAttachment(data.attachments);
                        }
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

        formatAttachment:function(data){
            var length=data.length,i=0;
            var location="",ext="",pos= 0;
            if(length==0){
                return [];
            }else{
                for(;i<length;i++){
                    location=data[i]["attachmentPreviewLocation"];
                    pos=location.lastIndexOf(".");
                    ext=location.substring(pos+1);
                    if(ext!=="gif"||ext!=="GIF"){
                        data[i]["attachmentPreviewLocation"]=getImageBySize(data[i]["attachmentPreviewLocation"],DE.config.imagesSize.mediaThumb);
                    }
                }

                return data;
            }
        },

        /**
         * 查看作品（资源）详情页获取作品（资源）的相信信息
         * @param {Number} id
         * @param {Boolean} showHome 是否显示首页按钮，用户直接用详情地址进入的时候需要显示
         */
        getEntityDetail:function(id,showHome){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getEntityDetail,
                type:"get",
                async:false,  //用同步，需要显示元素，以便后面的请求的数据进行渲染
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

                        data.showHome=!!showHome?true:false;
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
         * @param {Function} callback 显示完，需要执行的操作,主要是显示作品详情
         */
        getAllEntity:function(type,first,callback){
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
                        if(DE.config.checkMobile()){
                            if(data.projects){
                                data.projects=me.formatThumb(data.projects);
                            }else{
                                data.resources=me.formatThumb(data.resources);
                            }
                        }
                        me.showEntities(data,type,first,callback);
                    }else{
                        DE.config.ajaxReturnErrorHandler(data);
                    }

                },
                error:function(){
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        formatThumb:function(data){
            var length=data.length,i=0;
            if(length==0){
                return [];
            }else{
                for(;i<length;i++){
                    data[i]["postThumb"]=getImageBySize(data[i]["postThumb"],DE.config.imagesSize.thumb);
                }

                return data;
            }
        },

        /**
         * 根据搜索内容获取作品（资源）
         * @param {String} content 搜索的内容
         * @param {Boolean} first 是否第一次加载，第一次需要设置显示的screen
         * @param {Boolean} isTag 是否是标签
         * @param {String} type 搜索的类型
         * @param {Function} callback 显示完，需要执行的操作,主要是显示作品详情
         */
        getEntityBySearch:function(content,type,isTag,first,callback){
            var me=this;
            $.ajax({
                url:DE.config.ajaxUrls.getEntitiesBySearch,
                type:"get",
                dataType:"json",
                data:{
                    keyword:content,
                    field:isTag?"term":"info",
                    type:type===DE.config.entityTypes.project?"work":type,
                    start:DE.store.searchLoadedCount
                },
                success:function(data){

                    if(first){

                        DE.store.currentSearch.currentSearchValue=content; //记录下当前搜索的内容

                        DE.store.currentSearch.currentSearchType=type;
                        DE.store.currentSearch.isTag=isTag;
                        DE.store.currentScrollScreenType=type?DE.config.scrollScreenType[type]:"searchAll";
                    }


                    //后台有可能返回response为null
                    if(data.docs.length<DE.config.perLoadCount){
                        DE.store.searchLoadedCount=DE.config.hasNoMoreFlag;
                    }else{
                        DE.store.searchLoadedCount+=data.docs.length;
                    }

                    if(DE.config.checkMobile()){
                        data.docs=me.formatThumb(data.docs);
                    }
                    me.showSearchEntities(data,first,callback);

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
            DE.UIManager.showLoading();
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
                    if(data.success&&(data.resultCode==DE.config.resultCode.praise_add_succ||data.resultCode==DE.config.resultCode.praise_remove_succ)){
                        var praiseCountEl=$("#praiseCount");
                        var honorCountEl=$("#honorCount");
                        var countEl=$(".de_entity_link[href='item/"+DE.store.currentShowEntity.id+"']").parents("li").find(".likes");
                        var oldCount=parseInt(countEl.text());
                        if(DE.store.currentShowEntity.hasPraised){
                            DE.store.currentShowEntity.hasPraised=false;
                            DE.UIManager.hideLoading();
                            $("#de_entity_praise").addClass("de_flag_reg_zan").removeClass("de_flag_reg_zanned");
                            if(DE.store.currentUser.role==DE.config.roles.user){
                                praiseCountEl.text(parseInt(praiseCountEl.text())-1);
                            }else{
                                honorCountEl.text(parseInt(honorCountEl.text())-1);
                            }

                            //更新聚合li中赞的显示数量
                            countEl.text(oldCount-1);
                        }else{
                            DE.store.currentShowEntity.hasPraised=true;
                            $("#de_entity_praise").removeClass("de_flag_reg_zan").addClass("de_flag_reg_zanned");
                            if(DE.store.currentUser.role==DE.config.roles.user){
                                praiseCountEl.text(parseInt(praiseCountEl.text())+1);
                            }else{
                                honorCountEl.text(parseInt(honorCountEl.text())+1);
                            }

                            countEl.text(oldCount+1);
                        }

                        DE.UIManager.hideLoading();
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
                data:{
                    postId:id
                },
                success:function(data){

                    if(DE.config.checkMobile()){
                        data.docs=me.formatThumb(data.docs);
                    }
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
                    commentId:DE.store.currentShowEntity.commentLoadedId
                },
                dataType:"json",
                success:function(data){
                    if(data.success){
                        var length=data.comments.length;
                        var moreBtn=$("#de_comment_more_btn");
                        if(length>0){
                            if(length<DE.config.perLoadCount){

                                //不足每次加载的数据，没有更多
                                DE.store.currentShowEntity.commentLoadedId=DE.config.hasNoMoreFlag;
                                moreBtn.remove();
                            }else{
                                DE.store.currentShowEntity.commentLoadedId=data.comments[length-1]["commentId"];
                                moreBtn.removeClass("de_hidden");
                            }

                            //不管是否有数据，都需要执行函数，因为函数里有显示界面screen的操作
                            me.showComment(me.canCommentDelete(data));
                        }else{

                            //返回为0，没有更多
                            DE.store.currentShowEntity.commentLoadedId=DE.config.hasNoMoreFlag;
                            moreBtn.remove();
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
         * 查看作品（资源）详情页删除评论,分两种情况，一种是在详情页，一种是在管理页
         */
        deleteComment:function(commentId,postId,target){
            $.ajax({
                url:DE.config.ajaxUrls.deleteComment,
                type:"post",
                data:{
                    commentId:commentId,
                    postId:postId
                },
                dataType:"json",
                success:function(data){
                    if(data.success&&data.resultCode==DE.config.resultCode.comment_remove_succ){
                        DE.UIManager.hideLoading();
                        DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.operationSuccess);

                        if(target){
                            target.parents("li").remove();

                            //更新显示的数据
                            var commentCountEl=$("#commentsCount");
                            var count=parseInt(commentCountEl.text())-1;
                            commentCountEl.text(count);
                            $(".de_entity_link[href='item/"+DE.store.currentShowEntity.id+"']").parents("li").find(".comments").text(count);

                        }

                        //更新管理界面
                        if(DE.comments.ownTable){
                            DE.comments.ownTable.fnDraw();
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
         * 查看作品（资源）详情页判断评论是否显示评论删除的按钮
         * @param {Array} data 评论对象数组
         * @returns {*} 返回做过处理的对象数组
         */
        canCommentDelete:function(data){

            $.each(data.comments,function(index,m){
                 if(m.userId==DE.store.currentUser.userId||DE.config.roles.admin==DE.store.currentUser.role){
                     m.deleteAble=true;
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

                        DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.operationSuccess);
                        DE.UIManager.hideLoading();

                        //界面更新,有可能在详情页，也有可能在用户页
                        DE.UIManager.hideProjectDetail();
                        $(".de_entity_link[href='item/"+id+"']").parents("li").remove();
                        var uploadCountEl=$(".uploads");
                        uploadCountEl.text(parseInt(uploadCountEl.text())-1);

                        //更新管理界面
                        if(DE.entities.ownTable){
                            DE.entities.ownTable.fnDraw();
                        }
                        if(DE.comments.ownTable){
                            DE.comments.ownTable.fnDraw();
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
         * @param {Boolean} isAdmin 是否是后台的事件
         */
        showOrHideEntity:function(el,isAdmin){
            var id=el.data("entity-id");
            var visible=el.data("target-visible")||el.val();

            //val返回的是字符型，转成统一的boolean型
            if(typeof visible ==="string"){
                visible=visible==="true"?true:false;
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
                         DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.operationSuccess);
                         var li=$(".de_entity_link[href='item/"+id+"']").parents("li");

                         //需要判断是否存在这个toolbar（li），有可能是从管理页进入的，此时没有
                         if(li.length!==0){

                             var toolbarA=li.find(".de_project_toolbar li:eq(2) a");

                             if(el[0]!=toolbarA[0]){
                                 $.merge(el,toolbarA);
                             }
                         }

                         if(!isAdmin){
                             if(visible){
                                 el.removeClass("de_toolbar_visible").addClass("de_toolbar_invisible");
                                 el.data("target-visible",false);

                             }else{
                                 el.removeClass("de_toolbar_invisible").addClass("de_toolbar_visible");
                                 el.data("target-visible",true);

                             }
                         }


                         //更新管理界面
                         if(DE.entities.ownTable){

                             //DE.entities.ownTable.fnDraw();
                             //记录下目前的visible值
                             var inputRadio=$("input[data-entity-id='"+id+"']");
                             inputRadio.data("visible",visible);

                             //如果是在管理页点开详情，还需要设置表格中的数据
                             inputRadio.parent("td").find("input[value='"+visible+"']").prop("checked",true);
                         }

                         DE.UIManager.hideLoading();
                     }else{

                         if(DE.entities.ownTable){

                             //设置失败后，需要重新设置选中状态
                             el.parent("td").find("input[value='"+el.data("visible")+"']").prop("checked",true);
                         }
                         DE.config.ajaxReturnErrorHandler(data);
                     }
                },
                error:function(){

                    if(DE.entities.ownTable){

                        //设置失败后，需要重新设置选中状态
                        el.parent("td").find("input[value='"+el.data("visible")+"']").prop("checked",true);
                    }
                    DE.config.ajaxErrorHandler();
                }

            });
        },

        /**
         * 作品（资源）聚合点击事件，显示详情
         * @param {String} href 聚合中a的href（entity/id形式）
         * @param {Boolean} showHome 是否显示首页按钮，用户直接用详情地址进入的时候需要显示
         */
        entityClickHandler:function(href,showHome){
            var array=href.split("/");
            var id=array[1];

            //先隐藏清空数据，然后再显示，因为点击相似作品在同一个页面，如果不清空数据会导致数据重复
            DE.UIManager.hideProjectDetail();

            //请求详细信息,同步的ajax,如果需要改用异步，需要修改html模板
            this.getEntityDetail(id,showHome);


            //请求附件
            this.getEntityAttachment(id);

            //请求评论
            this.getComments(id);

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
                postVisible:data.entity.postVisible,
                showHome:data.showHome
            });
            $("#de_screen_project_detail").prepend($(html));
        },

        /**
         * 显示相似作品
         * @param {Object} data 请求相似作品时返回的json对象
         */
        showSimilarEntity:function(data){
            var tpl=$("#similarEntityTpl").html();
            var html=juicer(tpl,formatSearchData(data));
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
         * @param {Function} callback 显示完，需要执行的操作,主要是显示作品详情
         */
        showEntities:function(data,type,first,callback){
            var tpl="",html="",index=0;

            if(type==DE.config.entityTypes.project){
                tpl=$("#projectTpl").html();
                html=juicer(tpl,{projects:data.projects});

                if(first){
                    if(!html.trim()){
                        index=Math.floor(Math.random()*jsondata.data.length);
                        tpl=$("#noDataTpl").html();
                        html=juicer(tpl,jsondata.data[index]);

                    }
                    $("#de_project_list").html(html);
                    DE.UIManager.showScreen("#de_screen_project");
                }else{
                    $("#de_project_list").append($(html));
                }

            }else{
                tpl=$("#resourceTpl").html();
                html=juicer(tpl,{resource:data.resources});

                if(first){
                    if(!html.trim()){
                        index=Math.floor(Math.random()*jsondata.data.length);
                        tpl=$("#noDataTpl").html();
                        html=juicer(tpl,jsondata.data[index]);

                    }
                    $("#de_resource_list").html(html);
                    DE.UIManager.showScreen("#de_screen_resource");
                }else{
                    $("#de_resource_list").append($(html));
                }
            }

            if(callback){
                callback();
            }

        },


        /**
         * 显示搜索出来的作品（资源）聚合
         * @param data
         * @param {Boolean} first 是否第一次请求,第一次需要设置screen
         * @param {Function} callback 显示完，需要执行的操作,主要是显示作品详情
         */
        showSearchEntities:function(data,first,callback){
            var targetContain= $("#de_search_result");
            var tpl=$("#searchResultTpl").html();
            var html=juicer(tpl,formatSearchData(data));

            if(first){

                //清理工作在此处，tab公用了一个展示界面，点击tab的时候如果先清理那么数据突然消失，界面闪烁
                if(!html.trim()){
                    var index=Math.floor(Math.random()*jsondata.data.length);
                    tpl=$("#noDataTpl").html();
                    html=juicer(tpl,jsondata.data[index]);

                }
                targetContain.html(html);
                DE.UIManager.showSearchScreen(DE.store.currentSearch.currentSearchValue,DE.store.currentSearch.currentSearchType);
                if(callback){
                    callback();
                }
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

            if(content.trim()){
                DE.UIManager.showLoading();
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
                            me.showSingleComment(content,data);

                            DE.UIManager.hideLoading();
                            var commentCountEl=$("#commentsCount");
                            var count=parseInt(commentCountEl.text())+1;

                            commentCountEl.text(count);
                            $(".de_entity_link[href='item/"+DE.store.currentShowEntity.id+"']").parents("li").find(".comments").text(count);
                        }else{
                            DE.config.ajaxReturnErrorHandler(data);
                        }
                    },
                    error:function(){
                        DE.config.ajaxErrorHandler();
                    }

                });
            }
        },

        /**
         * 详情页显示单条评论，用于添加时
         * @param {String} content 评论内容
         * @param {Object} data 创建的时候返回的json数据
         */
        showSingleComment:function(content,data){
            var tpl=$("#singleComment").html();
            var html=juicer(tpl,{
                user:DE.store.currentUser,
                content:content,
                time:data.createTime,
                commentId:data.commentId
            });
            $("#de_comment_list").append($(html));
        },


        /**
         * 播放媒体文件
         * @param {Object} target 点击的元素,a
         */
        showMedias:function(target){

            var content="";
            var img=target.find("img");
            var mediaId=img.data("media-id");
            var mediaType=img.data("media-type");
            var ext="";//文件的后缀,视频文件有mp4和swf

            //如果上传uploadedMedias中有，那是在预览，用uploadedMedias中的
            if(!$.isEmptyObject(DE.store.uploadedMedias)){
                if(mediaType===DE.config.uploadMediaTypes.ppt&&
                    DE.store.uploadedMedias[mediaId][DE.config.mediaObj.mediaFilepath].match("<iframe")===null){

                    content=DE.config.messageCode.pptHasNotUploaded;
                }else{
                    content=DE.store.uploadedMedias[mediaId][DE.config.mediaObj.mediaFilepath];
                }

            }else{
                content=target.attr("href");
                if(content==DE.config.resultCode.pptx_upload_error){
                    content=DE.config.messageCode.pptUploadError;
                }else if(content==DE.config.resultCode.pptx_upload_wait){
                    content=DE.config.messageCode.pptHasNotUploaded;
                }

                if(mediaType==DE.config.uploadMediaTypes.localVideo){
                    ext=content.substr(content.lastIndexOf(".")+1);
                }
            }

            //ios移动设备上视频(mp4)使用新窗口播放
            if(ext==="mp4"&&mediaType===DE.config.uploadMediaTypes.localVideo&&navigator.userAgent.match(/(iPad|iPhone|iPod)/g)!==null){
                 window.open(content);
            }else{
                //显示元素界面
                var tpl=$("#showMediaContent").html();
                var html=juicer(tpl,{type:mediaType,content:content,ext:ext});
                $("#de_screen_project_detail").addClass("de_hidden");
				$("#de_pop_show_media").removeClass("de_hidden");
                $("#de_pop_show_media_content").html(html);
                $("#de_blackout").removeClass("de_hidden");
            }

        },

        /**
         * 作品（资源）工具栏点击处理事件
         * @param {Object} target 点击的工具栏的a
         */
        entityToolbarHandler:function(target){
            DE.UIManager.showLoading();
            var handler=target.data("handler");
            if(handler=="edit"){
                this.editEntity(target.attr("href"));
            }else if(handler=="delete"){
                if(confirm("确定删除吗？")){
                    this.deleteEntity(target.attr("href"));
                }else{
                    DE.UIManager.hideLoading();
                }
            }else{
                this.showOrHideEntity(target,false);
            }
        }
    }
})();

$(document).ready(function(){

    //显示当个实体详情
    $(document).on("click","a.de_entity_link",function(){
        var href=$(this).attr("href");
        DE.entity.entityClickHandler(href,false);

        //不能放到 entityClickHandler函数中，从浏览器向前进入详情页取数据也调用此函数，此时是不需要push的
        DE.history.push(href,true);

        return false;
    });


    //关闭作品详情
    $(document).on("click","#de_btn_close_project_detail",function(){
        if($(this).data("behaiver")=="close"){

            history.go(-1);

            DE.UIManager.hideProjectDetail();
        }else{

            DE.menu.logoClickHandler();
        }


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

    //删除评论
    $(document).on("click","a.de_delete_comment",function(){
        DE.UIManager.showLoading();
        DE.entity.deleteComment($(this).attr("href"),DE.store.currentShowEntity.id,$(this));

        return false;
    });

    //工具栏点击事件
    $(document).on("click",".de_project_toolbar a",function(){
        DE.entity.entityToolbarHandler($(this));

        return false;
    });

    //点击附件播放对应媒体文件，上传预览那里也用到
    $(document).on("click","a[data-has-media='true']",function(){
        DE.entity.showMedias($(this));

        return false;
    });

});