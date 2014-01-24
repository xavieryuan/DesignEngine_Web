/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-31
 * Time: 下午1:54
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.entities=(function(){
    function createTable(){
        var ownTable=$("#de_entities_grid").dataTable({
            "bServerSide": true,
            "sAjaxSource": DE.config.ajaxUrls.getAllEntities,
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
                { "mDataProp": "postTitle","sClass":"title",
                    "fnRender":function(oObj) {
                        return "<img src='"+oObj.aData.postThumb+"'><a title='"+oObj.aData.postTitle+
                            "' class='de_entity_link' href='item/"+oObj.aData.postId+"'>"+oObj.aData.postTitle+"</a>";
                    }
                },
                { "mDataProp": "userName","sClass":"title",
                    "fnRender":function(oObj) {
                        return "<img src='"+oObj.aData.userProfileImg+"'><a title='"+oObj.aData.userName+
                            "' class='de_user_link' href='user/"+oObj.aData.userId+"'>"+oObj.aData.userName+"</a>";
                    }
                },
                { "mDataProp": "postDate"},
                { "mDataProp": "postCommentCount"},
                { "mDataProp": "postPraiseCount"},
                { "mDataProp": "postHonorCount"},
                { "mDataProp":"postVisible",
                    "fnRender":function(oObj) {
                        if(oObj.aData.postVisible===false){
                            return "<input type='radio' name='visible"+oObj.aData.postId+"' data-visible='false' class='showOrHideEntity' value='false' data-entity-id='"+oObj.aData.postId+"' checked><span>隐藏</span>"+
                                "<input type='radio' name='visible"+oObj.aData.postId+"' data-visible='false' class='showOrHideEntity' value='true' data-entity-id='"+oObj.aData.postId+"'><span>显示</span>";
                        }else{
                            return "<input type='radio' name='visible"+oObj.aData.postId+"' data-visible='true' class='showOrHideEntity' value='false' data-entity-id='"+oObj.aData.postId+"'><span>隐藏</span>"+
                                "<input type='radio' name='visible"+oObj.aData.postId+"' data-visible='true' class='showOrHideEntity' value='true' checked data-entity-id='"+oObj.aData.postId+"'><span>显示</span>";
                        }

                    }
                },
                { "mDataProp":"opt",
                    "fnRender":function(oObj) {
                        return "<a class='editEntity' href='edit/"+oObj.aData.postId+"'>修改</a>|"+
                            "<a class='deleteEntity' data-entity-id='"+oObj.aData.postId+"' href='javascript:void(0)'>删除</a>";
                    }
                }
            ] ,
            "fnServerData": function(sSource, aoData, fnCallback) {
                //回调函数
                DE.UIManager.showLoading();
                aoData.push({
                    "name":"searchValue",
                    "value":$("#de_entity_search_input").val()
                },{
                    "name":"searchType",
                    "value":$("#de_entity_search_type").val()
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
                DE.UIManager.showScreen("#de_screen_manager_panel",{type:DE.config.manageTypes.entity});
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
            this.ownTable=createTable();
        },
        destroyTable:function(){
            if(this.ownTable){
                this.ownTable.fnDestroy();
                this.ownTable.find("tbody").html("");
                this.ownTable=null;
            }
        }
    }
})();

$(document).ready(function(){

    //DE.entities.createTable();



    //搜索事件
    $("#de_entity_search_btn").click(function(){

        //重绘表格
        DE.entities.ownTable.fnSettings()._iDisplayStart=0;//从第一页开始
        DE.entities.ownTable.fnDraw();
    });

    //ajax删除
    $(document).on("click",".showOrHideEntity",function(){
        DE.UIManager.showLoading();
        DE.entity.showOrHideEntity($(this),true);
    });

    //ajax删除
    $(document).on("click","a.editEntity",function(){
        DE.entity.editEntity($(this).attr("href"));
        return false;
    });

    //ajax删除
    $(document).on("click","a.deleteEntity",function(){
        if(confirm("确定删除吗？")){
            var entityId=$(this).data("entity-id");
            DE.UIManager.showLoading();
            DE.entity.deleteEntity(entityId);
        }

    });

});