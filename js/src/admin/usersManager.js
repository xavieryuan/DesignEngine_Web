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
                    { "mDataProp": "username",/*"sClass":"title",*/
                        "fnRender":function(oObj) {
                            return "<img src='"+oObj.aData.userProfileImg+"'><a title='"+oObj.aData.username+"' class='de_user_link' href='user/+"+oObj.aData.userId+"'>"+oObj.aData.username+"</a>";
                        }
                    },
                    { "mDataProp": "projectCount"},
                    { "mDataProp": "commentCount"},
                    { "mDataProp": "honorCount"},
                    { "mDataProp":"status",
                        "fnRender":function(oObj) {
                            if(oObj.aData.status===DE.config.userStatus.disabled){
                                return "<input type='radio' class='setUserStatus' data-user-id='"+oObj.aData.userId+"' checked><span>禁言</span>"+
                                    "<input type='radio' class='setUserStatus' data-user-id='"+oObj.aData.userId+"'><span>激活</span>";
                            }else{
                                return "<input type='radio' class='setUserStatus' data-user-id='"+oObj.aData.userId+"'><span>禁言</span>"+
                                    "<input type='radio' class='setUserStatus' data-user-id='"+oObj.aData.userId+"' checked><span>激活</span>";
                            }

                        }
                    },
                    { "mDataProp":"roles",
                        "fnRender":function(oObj) {
                            if(oObj.aData.roles[0]===DE.config.roles.vip){
                                return "<input type='radio' data-user-id='"+oObj.aData.userId+"' class='setUserRole'><span>标准</span>"+
                                    "<input type='radio' data-user-id='"+oObj.aData.userId+"' class='setUserRole' checked><span>VIP</span>";
                            }else{
                                return "<input type='radio' data-user-id='"+oObj.aData.userId+"' class='setUserRole' checked><span>标准</span>"+
                                    "<input type='radio' data-user-id='"+oObj.aData.userId+"' class='setUserRole'><span>VIP</span>";
                            }

                        }
                    }
                ] ,
                "fnServerData": function(sSource, aoData, fnCallback) {//回调函数
                    aoData.push({
                        "name":"searchValue",
                        "value":$("#de_user_search_input").val()
                    },{
                        "name":"type",
                        "value":$("#de_user_search_type").val()
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
                            /*for (var i = 0, iLen = response.aaData.length; i < iLen; i++) {
                                response.aaData[i].opt="opt";
                            }*/

                            json.aaData=response.aaData;
                            json.iTotalRecords = response.iTotalRecords;
                            json.iTotalDisplayRecords = response.iTotalDisplayedRecords;
                            fnCallback(json);

                        }
                    });
                },
                "fnDrawCallback":function(oSettings ){
                    DE.UIManager.showScreen("#de_screen_manager_panel",{type:DE.config.manageTypes.user});
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

    //DE.users.createTable();

    //搜索事件
    $("#de_user_search_btn").click(function(){

        //重绘表格
        DE.users.ownTable.fnSettings()._iDisplayStart=0;//从第一页开始
        DE.users.ownTable.fnDraw();
    });

    //ajax删除
    $(document).on("click","a.setUserStatus",function(){

        var userId=$(this).data("user-id");
        $.ajax({
            url:DE.config.ajaxUrls.changeUserStatus,
            dataType:"json",
            type:"post",
            data:{
                userId:userId
            },
            success:function(data){
                if(data.success){

                    //重绘表格
                    DE.users.ownTable.fnDraw();

                }else{

                }
            },
            error:function(){
                DE.config.ajaxErrorHandler();
            }
        })
    });

    //ajax删除
    $(document).on("click","a.setUserRole",function(){

        var userId=$(this).data("user-id");
        $.ajax({
            url:DE.config.ajaxUrls.setUserRole,
            dataType:"json",
            type:"post",
            data:{
                userId:userId
            },
            success:function(data){
                if(data.success){

                    //重绘表格
                    DE.users.ownTable.fnDraw();

                }else{

                }
            },
            error:function(){
                DE.config.ajaxErrorHandler();
            }
        })

    });

});