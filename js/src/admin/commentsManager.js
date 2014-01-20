/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-31
 * Time: 下午1:54
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.comments=(function(){

    var ownTable=null;
    function createTable(){
        if(ownTable==null){
            ownTable=$("#grid").dataTable({
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
                    "sUrl":"../../de_DE.txt"
                },
                "aoColumns": [
                    { "mDataProp": "commentContent"},
                    { "mDataProp": "useInfo",
                        "fnRender":function(oObj) {
                            return "<img src='"+oObj.aData.userProfileImg+"'><a title='"+oObj.aData.username+"' class='de_user_link' href='user/+"+oObj.aData.userId+"'>"+oObj.aData.username+"</a>";
                        }
                    },
                    { "mDataProp": "projectInfo",
                        "fnRender":function(oObj) {
                            return "<img src='"+oObj.aData.projectThumb+"'><a title='"+oObj.aData.projectTitle+"' class='de_entity_link' href='item/"+oObj.aData.projectID+"'>"+oObj.aData.projectTitle+"</a>";
                        }
                    },
                    { "mDataProp": "commentTime"},
                    { "mDataProp":"status",
                        "fnRender":function(oObj) {
                            if(oObj.aData.visible==false){
                                return "<input type='radio' class='showOrHideComment' data-target-visible='false' data-comment-id='"+oObj.aData.commentId+"' checked><span>隐藏</span>"+
                                    "<input type='radio' class='showOrHideComment' data-target-visible='true' data-comment-id='"+oObj.aData.commentId+"'><span>显示</span>";
                            }else{
                                return "<input type='radio' class='showOrHideComment' data-target-visible='false' data-comment-id='"+oObj.aData.commentId+"'><span>隐藏</span>"+
                                    "<input type='radio' class='showOrHideComment' data-target-visible='true' checked data-comment-id='"+oObj.aData.commentId+"'><span>显示</span>";
                            }

                        }
                    },
                    { "mDataProp":"opt",
                        "fnRender":function(oObj) {
                            return "<a class='deleteComment' data-entity-id='"+oObj.aData.postId+"' data-comment-id='"+oObj.aData.commentId+"' href='javascript:void(0)'>删除</a>";
                        }
                    }
                ] ,
                "fnServerData": function(sSource, aoData, fnCallback) {//回调函数
                    aoData.push({
                        "name":"searchValue",
                        "value":$("#de_comment_search_input").val()
                    },{
                        "name":"type",
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
        }
    }
    return {
        ownTable:ownTable,
        createTable:createTable,
        destroyTable:function(){
            ownTable.fnDestroy();
            ownTable=null;
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
    $(document).on("click","a.showOrHideComment",function(){

        var commentId=$(this).data("comment-id");
        $.ajax({
            url:DE.config.ajaxUrls.showOrHideComment,
            dataType:"json",
            type:"post",
            data:{
                commentId:commentId
            },
            success:function(data){
                if(data.success){

                    //重绘表格
                    DE.comments.ownTable.fnDraw();

                }else{

                }
            },
            error:function(){
                DE.config.ajaxErrorHandler();
            }
        })
    });


    //ajax删除
    $(document).on("click","a.deleteComment",function(){
        if(confirm("确定删除吗？")){
            var commentId=$(this).data("comment-id"),
                postId=$(this).data("entity-id");
            DE.entity.deleteComment(commentId,postId,null);
        }

    });

});