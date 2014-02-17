/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-31
 * Time: 下午1:54
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.users=(function(){
    function createTable(){
        var ownTable=$("#de_users_grid").dataTable({
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
                "sUrl":"js/de_DE.txt"
            },
            "aoColumns": [
                { "mDataProp": "userName","sClass":"title",
                    "fnRender":function(oObj) {
                        return "<img src='"+oObj.aData.userProfileImg+"'><a title='"+oObj.aData.userName+
                            "' class='de_user_link' href='user/"+oObj.aData.userId+"'>"+oObj.aData.userName+"</a>";
                    }
                },
                { "mDataProp": "userEmail"},
                { "mDataProp": "userUploadCount"},
                { "mDataProp": "userCommentCount"},
                { "mDataProp": "userPraiseCount"},
                { "mDataProp":"userCommentEnable",
                    "fnRender":function(oObj) {
                        if(oObj.aData.userCommentEnable===false){
                            return "<input type='radio' name='status"+oObj.aData.userId+"' data-status='false' value='false' class='setUserStatus' data-user-id='"+oObj.aData.userId+"' checked><span>禁言</span>"+
                                "<input type='radio' name='status"+oObj.aData.userId+"' data-status='false' value='true' class='setUserStatus' data-user-id='"+oObj.aData.userId+"'><span>激活</span>";
                        }else{
                            return "<input type='radio' name='status"+oObj.aData.userId+"' data-status='true' value='false' class='setUserStatus' data-user-id='"+oObj.aData.userId+"'><span>禁言</span>"+
                                "<input type='radio' name='status"+oObj.aData.userId+"' data-status='true' value='true' class='setUserStatus' data-user-id='"+oObj.aData.userId+"' checked><span>激活</span>";
                        }

                    }
                },
                { "mDataProp":"userRoles",
                    "fnRender":function(oObj) {
                        if(oObj.aData.userRoles[0]===DE.config.roles.vip){
                            return "<input type='radio' name='role"+oObj.aData.userId+"' data-role='"+DE.config.roles.vip+"' data-user-id='"+oObj.aData.userId+
                                "' value='"+DE.config.roles.user+"' class='setUserRole'><span>标准</span>"+
                                "<input type='radio' name='role"+oObj.aData.userId+"' data-role='"+DE.config.roles.vip+"' data-user-id='"+oObj.aData.userId+
                                "' value='"+DE.config.roles.vip+"' class='setUserRole' checked><span>VIP</span>"+
                                "<input type='radio' name='role"+oObj.aData.userId+"' data-role='"+DE.config.roles.vip+"' data-user-id='"+oObj.aData.userId+
                                "' value='"+DE.config.roles.admin+"' class='setUserRole'><span>admin</span>";
                        }else if(oObj.aData.userRoles[0]===DE.config.roles.user){
                            return "<input type='radio' name='role"+oObj.aData.userId+"' data-role='"+DE.config.roles.user+"' data-user-id='"+oObj.aData.userId+
                                "' value='"+DE.config.roles.user+"' class='setUserRole' checked><span>标准</span>"+
                                "<input type='radio' name='role"+oObj.aData.userId+"' data-role='"+DE.config.roles.user+"' data-user-id='"+oObj.aData.userId+
                                "' value='"+DE.config.roles.vip+"' class='setUserRole'><span>VIP</span>"+
                                "<input type='radio' name='role"+oObj.aData.userId+"' data-role='"+DE.config.roles.user+"' data-user-id='"+oObj.aData.userId+
                                "' value='"+DE.config.roles.admin+"' class='setUserRole'><span>admin</span>";
                        }else if(oObj.aData.userRoles[0]===DE.config.roles.admin){
                            return "<input type='radio' name='role"+oObj.aData.userId+"' data-role='"+DE.config.roles.admin+"' data-user-id='"+oObj.aData.userId+
                                "' value='"+DE.config.roles.user+"' class='setUserRole'><span>标准</span>"+
                                "<input type='radio' name='role"+oObj.aData.userId+"' data-role='"+DE.config.roles.admin+"' data-user-id='"+oObj.aData.userId+
                                "' value='"+DE.config.roles.vip+"' class='setUserRole' checked><span>VIP</span>"+
                                "<input type='radio' name='role"+oObj.aData.userId+"' data-role='"+DE.config.roles.admin+"' data-user-id='"+oObj.aData.userId+
                                "' value='"+DE.config.roles.admin+"' class='setUserRole' checked><span>admin</span>";
                        }

                    }
                }
            ] ,
            "fnServerData": function(sSource, aoData, fnCallback) {
                //回调函数
                DE.UIManager.showLoading();
                aoData.push({
                    "name":"searchValue",
                    "value":$("#de_user_search_input").val()
                },{
                    "name":"searchType",
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
        setUserStatusHandler:function(el){
            DE.UIManager.showLoading();
            $.ajax({
                url:DE.config.ajaxUrls.setUserStatus,
                dataType:"json",
                type:"post",
                data:{
                    accountId:el.data("user-id")
                },
                success:function(data){

                    if(data.success&&data.resultCode===DE.config.resultCode.account_update_succ){

                        //重绘表格
                        //DE.users.ownTable.fnDraw();
                        DE.UIManager.hideLoading();
                        DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.operationSuccess);

                        el.parent("td").find("input").data("status",el.value);

                    }else{

                        //设置失败后，需要重新设置选中状态
                        el.parent("td").find("input[value='"+el.data("status")+"']").prop("checked",true);
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){

                    //设置失败后，需要重新设置选中状态
                    el.parent("td").find("input[value='"+el.data("status")+"']").prop("checked",true);
                    DE.config.ajaxErrorHandler();
                }
            })
        },
        setUserRoleHandler:function(el){
            DE.UIManager.showLoading();
            $.ajax({
                url:DE.config.ajaxUrls.setUserRole,
                dataType:"json",
                type:"post",
                data:{
                    userId:el.data("user-id"),
                    role:el.val()
                },
                success:function(data){
                    if(data.success&&data.resultCode===DE.config.resultCode.account_update_succ){

                        //重绘表格
                        //DE.users.ownTable.fnDraw();
                        DE.UIManager.hideLoading();
                        DE.UIManager.showMsgPopout(DE.config.messageCode.successTitle,DE.config.messageCode.operationSuccess);

                        //记录下目前的role值
                        el.parent("td").find("input").data("role",el.value);

                    }else{

                        //设置失败后，需要重新设置选中状态
                        el.parent("td").find("input[value='"+el.data("role")+"']").prop("checked",true);
                        DE.config.ajaxReturnErrorHandler(data);
                    }
                },
                error:function(){

                    //设置失败后，需要重新设置选中状态
                    el.parent("td").find("input[value='"+el.data("role")+"']").prop("checked",true);
                    DE.config.ajaxErrorHandler();
                }
            })
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
    $(document).on("click",".setUserStatus",function(){
        DE.users.setUserStatusHandler($(this));

    });

    //ajax删除
    $(document).on("click",".setUserRole",function(){
        DE.users.setUserRoleHandler($(this));

    });
});