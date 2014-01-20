/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-31
 * Time: 下午1:54
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.entities=(function(){

    var ownTable=null;
    function createTable(){
        if(ownTable==null){
            ownTable=$("#grid").dataTable({
                "bServerSide": true,
                "sAjaxSource": DE.config.ajaxUrls.getAllProjects,
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
                    { "mDataProp": "projectTitle",/*"sClass":"title",*/
                        "fnRender":function(oObj) {
                            return "<img src='"+oObj.aData.projectThumb+"'><a title='"+oObj.aData.projectTitle+"' class='de_entity_link' href='item/"+oObj.aData.projectID+"'>"+oObj.aData.projectTitle+"</a>";
                        }
                    },
                    { "mDataProp": "user",
                        "fnRender":function(oObj) {
                            return "<img src='"+oObj.aData.userProfileImg+"'><a title='"+oObj.aData.username+"' class='de_user_link' href='user/+"+oObj.aData.userId+"'>"+oObj.aData.username+"</a>";
                        }
                    },
                    { "mDataProp": "uploadTime"},
                    { "mDataProp": "commentCount"},
                    { "mDataProp": "praiseCount"},
                    { "mDataProp": "honorCount"},
                    { "mDataProp":"visible",
                        "fnRender":function(oObj) {
                            if(oObj.aData.visible==false){
                                return "<input type='radio' class='showOrHideEntity' data-target-visible='false' data-entity-id='"+oObj.aData.projectId+"' checked><span>隐藏</span>"+
                                    "<input type='radio' class='showOrHideEntity' data-target-visible='true' data-entity-id='"+oObj.aData.projectId+"'><span>显示</span>";
                            }else{
                                return "<input type='radio' class='showOrHideEntity' data-target-visible='false' data-entity-id='"+oObj.aData.projectId+"'><span>隐藏</span>"+
                                    "<input type='radio' class='showOrHideEntity' data-target-visible='true' checked data-entity-id='"+oObj.aData.projectId+"'><span>显示</span>";
                            }

                        }
                    },
                    { "mDataProp":"opt",
                        "fnRender":function(oObj) {
                            return "<a class='editEntity' href='edit/"+oObj.aData.projectId+"'>修改</a>|"+
                                "<a class='deleteEntity' data-entity-id='"+oObj.aData.projectId+"' href='javascript:void(0)'>删除</a>";
                        }
                    }
                ] ,
                "fnServerData": function(sSource, aoData, fnCallback) {//回调函数
                    aoData.push({
                        "name":"searchValue",
                        "value":$("#de_entity_search_input").val()
                    },{
                        "name":"type",
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

    //DE.entities.createTable();



    //搜索事件
    $("#de_entity_search_btn").click(function(){

        //重绘表格
        DE.entities.ownTable.fnSettings()._iDisplayStart=0;//从第一页开始
        DE.entities.ownTable.fnDraw();
    });

    //ajax删除
    $(document).on("click","a.showOrHideEntity",function(){
        DE.entity.showOrHideEntity($(this));
    });

    //ajax删除
    $(document).on("click","a.editEntity",function(){
        DE.entity.editEntity($(this).attr("href"));
    });

    //ajax删除
    $(document).on("click","a.deleteEntity",function(){
        if(confirm("确定删除吗？")){
            var entityId=$(this).data("entity-id");
            DE.entity.deleteEntity(entityId);
        }

    });

});