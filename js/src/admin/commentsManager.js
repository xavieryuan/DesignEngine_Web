/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-31
 * Time: 下午1:54
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.comments=(function(){
    function createTable(){
        var ownTable=$("#de_comments_grid").dataTable({
            "bServerSide": true,
            "sAjaxSource": DE.config.ajaxUrls.getAllComments,
            "bInfo":false,
            "bLengthChange": false,
            "bFilter": false,
            "bSort":false,
            "bAutoWidth": false,
            "iDisplayLength":DE.config.perLoadCount,
            "sPaginationType":"full_numbers",
            "oLanguage": {
                "sUrl":"js/de_DE.txt"
            },
            "aoColumns": [
                { "mDataProp": "commentContent","sClass":"content"},
                { "mDataProp": "userName","sClass":"title",
                    "fnRender":function(oObj) {
                        return "<img src='"+oObj.aData.userProfileImg+"'><a title='"+oObj.aData.userName+
                            "' class='de_user_link' href='user/"+oObj.aData.userId+"'>"+oObj.aData.userName+"</a>";
                    }
                },
                { "mDataProp": "postTitle","sClass":"title",
                    "fnRender":function(oObj) {
                        return "<img src='"+oObj.aData.postThumb+"'><a title='"+oObj.aData.postTitle+
                            "' class='de_entity_link' href='item/"+oObj.aData.postId+"'>"+oObj.aData.postTitle+"</a>";
                    }
                },
                { "mDataProp": "commentTime"},
                { "mDataProp":"commentVisible",
                    "fnRender":function(oObj) {
                        if(oObj.aData.commentVisible==false){
                            return "<input type='radio' name='visible"+oObj.aData.commentId+"' data-visible='false' class='showOrHideComment' data-entity-id='"+oObj.aData.postId+"' value='false' data-comment-id='"+oObj.aData.commentId+"' checked><span>隐藏</span>"+
                                "<input type='radio' name='visible"+oObj.aData.commentId+"' data-visible='false' class='showOrHideComment' data-entity-id='"+oObj.aData.postId+"' value='true' data-comment-id='"+oObj.aData.commentId+"'><span>显示</span>";
                        }else{
                            return "<input type='radio' name='visible"+oObj.aData.commentId+"' data-visible='true' class='showOrHideComment' data-entity-id='"+oObj.aData.postId+"' value='false' data-comment-id='"+oObj.aData.commentId+"'><span>隐藏</span>"+
                                "<input type='radio' name='visible"+oObj.aData.commentId+"' data-visible='true' class='showOrHideComment' data-entity-id='"+oObj.aData.postId+"' value='true' checked data-comment-id='"+oObj.aData.commentId+"'><span>显示</span>";
                        }

                    }
                },
                { "mDataProp":"opt",
                    "fnRender":function(oObj) {
                        return "<a class='deleteComment' data-entity-id='"+oObj.aData.postId+"' data-comment-id='"+oObj.aData.commentId+"' href='javascript:void(0)'>删除</a>";
                    }
                }
            ] ,
            "fnServerData": function(sSource, aoData, fnCallback) {
                //回调函数
                DE.UIManager.showLoading();
                aoData.push({
                    "name":"searchValue",
                    "value":$("#de_comment_search_input").val()
                },{
                    "name":"searchType",
                    "value":$("#de_comment_search_type").val()
                });
                $.ajax({
                    "dataType":'json',
                    "type":"POST",
                    "url":sSource,
                    "data":aoData,
                    "success": function (response) {
                        var json = {
                            "sEcho" : response.sEcho
                        };
                        for (var i = 0, iLen = response.aaData.length; i < iLen; i++) {
                            response.aaData[i].opt="opt";
                        }

                        json.aaData=response.aaData;
                        json.iTotalRecords = response.iTotalRecords;
                        json.iTotalDisplayRecords = response.iTotalDisplayedRecords;
                        fnCallback(json);

                    }
                });
            },
            "fnDrawCallback":function(oSettings ){
                DE.UIManager.showScreen("#de_screen_manager_panel",{type:DE.config.manageTypes.comment});
            },
            "fnFormatNumber":function(iIn){
                return iIn;
            }
        });

        return ownTable;
    }
    return {
        ownTable:null,
        createTable:function(){
            this.destroyTable();
            this.ownTable=createTable();
        },
        destroyTable:function(){
            if(this.ownTable){
                this.ownTable.fnDestroy();
                this.ownTable.find("tbody").html("");
                this.ownTable=null;
            }
        },
        showOrHideCommentHandler:function(el){
            DE.UIManager.showLoading();
            $.ajax({
                url:DE.config.ajaxUrls.showOrHideComment,
                dataType:"json",
                type:"post",
                data:{
                    commentId:el.data("comment-id"),
                    postId:el.data("entity-id")
                },
                success:function(data){
                    if(data.success&&data.resultCode===DE.config.resultCode.comment_visible_succ){

                        //重绘表格
                        //DE.comments.ownTable.fnDraw();
                        DE.UIManager.hideLoading();
                        DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.operationSuccess);

                        //记录下目前的visible值
                        el.parent("td").find("input").data("visible",el.val()==="true"?true:false);

                    }else{

                        //设置失败后，需要重新设置选中状态
                        el.parent("td").find("input[value='"+el.data("visible")+"']").prop("checked",true);
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){

                    //设置失败后，需要重新设置选中状态
                    el.parent("td").find("input[value='"+el.data("visible")+"']").prop("checked",true);
                    DE.config.ajaxErrorHandler();
                }
            })
        }
    }
})();

$(document).ready(function(){

    //DE.comments.createTable();



    //搜索事件
    $("#de_comment_search_btn").click(function(){

        //重绘表格
        DE.comments.ownTable.fnSettings()._iDisplayStart=0;//从第一页开始
        DE.comments.ownTable.fnDraw();
    });

    //ajax删除
    $(document).on("click",".showOrHideComment",function(){
        DE.comments.showOrHideCommentHandler($(this));
    });


    //ajax删除
    $(document).on("click","a.deleteComment",function(){
        if(confirm("确定删除吗？")){
            var commentId=$(this).data("comment-id"),
                postId=$(this).data("entity-id");
            DE.UIManager.showLoading();
            DE.entity.deleteComment(commentId,postId,null);
        }

    });

});