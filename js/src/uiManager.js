// JavaScript Document
//全局方法整理

/*
DE.uiManager.showScreen(screenLink)		//显示特定的屏幕内容，screenLink是相应屏幕section标签的ID并带有#，例如#de_screen_project
DE.uiManager.showSearchScreen(keyword,type)
										//显示搜索结果屏幕，keyword是搜索关键词，type是优先显示的结果类型，type的值可以是resource或者project
DE.uiManager.showFilterMenu()			//显示筛选菜单
DE.uiManager.hideFilterMenu()			//隐藏筛选菜单
DE.uiManager.showExtMenu()				//显示扩展菜单
DE.uiManager.hideExtMenu()				//隐藏扩展菜单
DE.uiManager.showProjectDetail()		//显示作品详情
DE.uiManager.hideProjectDetail()		//隐藏作品详情
DE.uiManager.hideAllMenuAndPopouts()	//隐藏所有菜单及弹出面板的状态，
DE.uiManager.showLoginPopout()			//显示登录弹窗
DE.uiManager.showRegPopout()			//显示注册弹窗
DE.uiManager.showMsgPopout(title,msg)	//显示消息弹窗，title为消息框的标题，msg为消息正文
DE.uiManager.showRestPwdPopout()		//显示重置密码弹窗
DE.uiManager.gotoUploadStep(step)		//跳转到特定的上传步骤，stepID为对应上次步骤容器的ID，如"#de_upload_step1"，"#de_upload_step2"，"#de_upload_step3"
DE.uiManager.hidePopout()				//关闭弹窗
DE.uiManager.guestView()				//显示访客视图
DE.uiManager.regView()					//显示注册用户视图
DE.uiManager.vipView()					//显示VIP用户视图
DE.uiManager.adminView()				//显示管理员视图

*/

var DE=DE||{};

DE.uiManager=function(){
	//私有属性及方法	
	var showPopout=function(){
        $("#de_popout").removeClass("de_hidden");
        $("#de_blackout").removeClass("de_hidden");
    };
	var hidePopout=function(){
        $("#de_popout").addClass("de_hidden");
        $("#de_blackout").addClass("de_hidden");

        //清空错误提示
        $("#de_reg_error").text("");
        $("#de_login_error").text("");
        $("#de_email_error").text("");
    };
	var gotoScreen=function(screenLink,paraObj){
        cleanAllScreens();
        $(screenLink).removeClass("de_hidden");

        //加载某些特定屏幕时需要额外地处理视图
        if(screenLink=="#de_screen_project"){
            $(".de_top_nav .de_btn_project").addClass("active");

            //清理已经加载的数据
            DE.store.clearScreenData("project");
        }else if(screenLink=="#de_screen_resource"){
            $(".de_top_nav .de_btn_resource").addClass("active");

            DE.store.clearScreenData("resource");
        }else if(screenLink=="#de_screen_designer"){
            $(".de_top_nav .de_btn_designer").addClass("active");

            DE.store.clearScreenData("hotUser");
        }else if(screenLink=="#de_screen_search_result"){
            if(paraObj && paraObj.keyword){
                $("#de_btn_filter>a").html( "搜索："+paraObj.keyword ).addClass("active");
            }
            if(paraObj && paraObj.type==DE.config.entityTypes.resource){
                $("#de_screen_search_result>.de_category_filter>.de_category_filter_option_resource").addClass("active");
            }else{
                $("#de_screen_search_result>.de_category_filter>.de_category_filter_option_project").addClass("active");
            }

            DE.store.clearScreenData("search");
        }else if(screenLink=="#de_screen_user_profile"){
            DE.store.clearScreenData("user");
        }else if(screenLink=="#de_screen_upload"){
            DE.store.clearScreenData("upload");
        }
        $(window).scrollTop(0);


        DE.uiManager.hideLoading();

    };
	var cleanAllScreens=function(){
		
			//隐藏各种组件
			DE.uiManager.hideAllMenuAndPopouts();
			DE.uiManager.hideProjectDetail();
		
			//恢复视图初始状态		
			$("#de_screen_container>section").addClass("de_hidden");
			$("#de_btn_filter>a").html("更多分类...").removeClass("active");
			$("#de_top_nav .active").removeClass("active");
			$("#de_screen_search_result>.de_category_filter .active").removeClass("active");
			
			//如需释放内存可激活下列代码
			//$("#de_screen_container>section>ul").empty();
    };
	
	return{ 
		//公共属性及方法 开始
		showScreen:function(screenLink,paraObj){		
			gotoScreen(screenLink)
		},
        closeWindow:function(){
            $(this).parent().addClass("de_hidden");
            $("#de_blackout").addClass("de_hidden");
        },
		showSearchScreen:function(keyword,type){
			gotoScreen("#de_screen_search_result",{keyword:keyword,type:type})
		},	
		showFilterMenu:function(){
			DE.uiManager.hideAllMenuAndPopouts();
			$("#de_filter_menu").animate({"height":300},200);
			$("#de_btn_filter>a").addClass("focused");
		},
		hideFilterMenu:function(){
			$("#de_filter_menu").animate({"height":0},200,function(){
                $("#de_filter_menu").css("overflow","hidden");
            });
			$("#de_btn_filter>a").removeClass("focused")		
		},
		showExtMenu:function(){
			DE.uiManager.hideAllMenuAndPopouts();
			$("#de_ext_nav").css("right",0)
		},
		hideExtMenu:function(){
			$("#de_ext_nav").css("right","-150px")
		},
        showLoading:function(){
            $("#de_loading").removeClass("de_hidden");
            $("#de_loading_spinner ").removeClass("de_animation_stop");
        },
        hideLoading:function(){
            $("#de_loading").addClass("de_hidden");
            $("#de_loading_spinner ").addClass("de_animation_stop");
        },
		showProjectDetail:function(){
            var detailEle=$("#de_screen_project_detail");
            detailEle.removeClass("de_hidden");
            detailEle.scrollTop(0);
			$("body").addClass("de_noscroll");
            this.hideLoading();
		},
		hideProjectDetail:function(){

            //隐藏的同时，重新设置de_screen_project_detail的html
			$("#de_screen_project_detail").scrollTop(0).addClass("de_hidden").
                html('');
			$("body").removeClass("de_noscroll");
            DE.store.clearCurrentShowEntity();

		},
		showLoginPopout:function(){
			showPopout();
			$("#de_popout>.de_inner_wrapper").css("left",0);
			$("#de_popout>.de_popout_title").html("登录");
			$("#de_login_email").focus();
		},
		showRegPopout:function(){
			showPopout();
			$("#de_popout>.de_inner_wrapper").css("left","-100%");
			$("#de_popout>.de_popout_title").html("即将完成注册，请填写下列信息");
			$("#de_reg_username").focus();
            $("#de_captcha_img").removeAttr("src").attr("src",DE.config.ajaxUrls.getValidCode);
		},
		showRecoverPwdPopout:function(){
			showPopout();
			$("#de_popout>.de_inner_wrapper").css("left","-200%");
			$("#de_popout>.de_popout_title").html("找回密码");
			$("#de_recover_pwd_email").focus();		
		},
		showMsgPopout:function(title,msg){
			showPopout();
			$("#de_popout .de_popout_title").html(title);
			$("#de_popout_msg p").html(msg);
			$("#de_popout>.de_inner_wrapper").css("left","-300%")
		},
		showRestPwdPopout:function(){
			showPopout();
			$("#de_popout>.de_inner_wrapper").css("left","-400%");
			$("#de_popout>.de_popout_title").html("修改密码");
			$("#de_reset_pwd").focus();		
		},
		showEditProfilePopout:function(){
			showPopout();
			$("#de_popout>.de_inner_wrapper").css("left","-500%");
			$("#de_popout>.de_popout_title").html("编辑个人信息");
		},
        showBindAccountPopout:function(){
            showPopout();
            $("#de_popout>.de_inner_wrapper").css("left","-600%");
            $("#de_popout>.de_popout_title").html("绑定账户");
        },
		hidePopout:function(){
			hidePopout();
		},	
		hideAllMenuAndPopouts:function(){
			DE.uiManager.hideFilterMenu();
			DE.uiManager.hideExtMenu();
			hidePopout();
		},
		gotoUploadStep:function(stepID){
			$("#de_screen_upload .de_upload_step").addClass("de_hidden");
			$(stepID).removeClass("de_hidden");
			$("#de_screen_upload .current").removeClass("current");
			
			if(stepID=="#de_upload_step1"){
				$("#de_screen_upload .de_tab_step1").addClass("current");
			}else if(stepID=="#de_upload_step2"){
				$("#de_screen_upload .de_tab_step2").addClass("current");
			}else if(stepID=="#de_upload_step3"){
				$("#de_screen_upload .de_tab_step3").addClass("current");
			}
		},

		showLoginMenu:function(data){
            var tpl=$("#userMenuTpl").html();
            var html=juicer(tpl,data);
            $("#de_menu").html(html);
		}

	//公共属性及方法 结束
	}
}();