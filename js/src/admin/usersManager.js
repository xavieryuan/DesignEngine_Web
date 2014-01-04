/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-31
 * Time: 下午1:54
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.users=(function(){

    var ownTable=null;
    function createTable(){
        if(ownTable==null){
            ownTable=$("#grid").dataTable({
                "bServerSide": true,
                "sAjaxSource": DE.config.ajaxUrls.getAllUsers,
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
                    {"mDataProp": "check",
                        "fnRender":function(oObj){
                            return "<input type='checkbox' class='checkChild'> ";
                        }
                    },
                    { "mDataProp": "title","sClass":"title",
                        "fnRender":function(oObj) {
                            return "<span><img src='"+oObj.aData.masterThumb+"'></span><span title='"+oObj.aData.title+"' class='titleSpan'>"+oObj.aData.title+"</span>";
                        }
                    },
                    { "mDataProp": "worksId"},
                    { "mDataProp": "participantEmail",
                        "fnRender":function(oObj){
                            return "<span title='"+oObj.aData.participantEmail+"' class='emailSpan'>"+oObj.aData.participantEmail+"</span>";
                        }
                    },
                    { "mDataProp": "totalScore",
                        "fnRender":function(oObj){
                            //这里scorebox的top值从290开始往上加90,要加载好后设置，在table的回调函数里面设置
                            return '<div ><a class="score">'+oObj.aData.totalScore+'</a><div class="scorebox"><div class="scoreclose"><a></a></div>'+
                                '<div class="scoretitle"><span>当前评阅总分</span><b>'+oObj.aData.totalScore+'</b></div>'+
                                '<div class="scroll"><table cellpadding="0" cellspacing="0" class="smalltable"><tbody><tr class="title"><th>评阅人</th><th>评阅时间</th><th>评分</th></tr></tbody></table></div></div></div>';
                        }
                    },
                    { "mDataProp": "status",
                        "fnRender":function(oObj){
                            return '<select class="changeStatus"><option value="PENDING">待审查</option><option value="UNQUALIFIED">资格审查未通过</option><option value="QUALIFIED">资格审查通过</option><option value="PRELIMINARY_QUALIFIED">初选入围</option><option value="PRELIMINARY_UNQUALIFIED">初选未入围</option><option value="QUARTER_QUALIFIED">复选入围</option><option value="QUARTER_UNQUALIFIED">复选未入围</option></select>';
                        }
                    },
                    { "mDataProp":"opt",
                        "fnRender":function(oObj) {
                            return "<a target='_blank' href='"+header+"/web/admin/"+adminId+"/works/"+lotusPrizeId+"/participant/"+oObj.aData.participantId+"/"+oObj.aData.worksId+"?_worksId="+oObj.aData.worksId+"'>预览</a>"+
                                "<a target='_blank' href='"+header+"/web/admin/"+adminId+"/works/"+lotusPrizeId+"/edit?participantId="+oObj.aData.participantId+"&_worksId="+oObj.aData.worksId+"&categoryId="+oObj.aData.categoryId+"'>编辑</a>"+
                                "<a href='"+header+"/web/admin/"+adminId+"/works/"+lotusPrizeId+"/participant/"+oObj.aData.participantId+"/"+oObj.aData.worksId+"/download?_worksId="+oObj.aData.worksId+"'>导出PDF</a><a class='delete' href='javascript:void(0)'>删除</a>";
                        }
                    }
                ] ,
                "fnServerData": function(sSource, aoData, fnCallback) {//回调函数
                    aoData.push({
                        "name":"title",
                        "value":$("#search").val()=="搜索作品（作品名称）"?"":$("#search").val()
                    },{
                        "name":"categoryId",
                        "value":categoryId
                    },{
                        "name":"workStatus",
                        "value":$("#state").val()
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
                            statusList=[];
                            for (var i = 0, iLen = response.aaData.length; i < iLen; i++) {
                                response.aaData[i].check="check";
                                response.aaData[i].opt="opt";
                                //记录下所有的状态信息，表格画完后再显示
                                statusList.push(response.aaData[i].status);
                            }

                            json.aaData=response.aaData;
                            json.iTotalRecords = response.iTotalRecords;
                            json.iTotalDisplayRecords = response.iTotalDisplayedRecords;
                            fnCallback(json);
                            $("#checkAll").removeAttr("checked");//去掉全选按钮的选中状态
                        }
                    });
                },
                "fnDrawCallback": function(oSettings, json) {
                    //在这里设置scorebox的top值
                    $(".scorebox").each(function(index){
                        $(this).css("top",50+index*120);
                    });
                    //显示目前状态
                    $("table select").each(function(index){
                        $(this).val(statusList[index]);
                    });
                },
                "fnFormatNumber":function(iIn){
                    return iIn;
                }
            });
        }
    }
    return {
        getTable:function(){
            return ownTable;
        },
        initTable:function(){
            createTable();
        }
    }
})();

$(document).ready(function(){

    //DE.users.createTable();

    //更改状态
    $(".changeStatus").live("change",function(){
        var id=$(this).parents("tr").find("td:eq(2)").text();
        var selectValue=$(this).val();
        $.ajax({
            url:DE.config.ajaxUrls.changeUserStatus,
            dataType:"json",
            type:"post",
            data:{
                worksIdString:id,
                status:selectValue
            },
            success:function(data){
                if(data.success){
                    //$().toastmessage("showSuccessToast","标记成功");
                    DE.users.getTable().fnDraw();
                }else{
                    //$().toastmessage("showErrorToast","标记失败");
                }

            }
        })
    });

    //搜索事件
    $("#search").click(function(){
        $(this).val("");
    }).keydown(function(e){
        if(e.keyCode=="13"){
            //重绘表格
            DE.users.getTable().fnSettings()._iDisplayStart=0;//从第一页开始
            DE.users.getTable().fnDraw();
        }
    });

    //ajax删除
    $("a.delete").live("click",function(){
        if(confirm("确定删除吗？")){
            var id=$(this).parents("tr").find("td:eq(2)").text();
            $.ajax({
                url:header+"/web/admin/"+adminId+"/works/"+lotusPrizeId+"/remove",
                dataType:"json",
                type:"post",
                data:{
                    _worksId:id
                },
                success:function(data){
                    if(data.success){
                        //重绘表格
                        DE.users.getTable().fnDraw();
                        //$().toastmessage("showSuccessToast","删除成功");
                    }else{
                        //$().toastmessage("showErrorToast","删除失败");
                    }
                }
            })
        }

    });

});