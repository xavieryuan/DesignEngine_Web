// JavaScript Document
//全局方法整理

/*
DE.UIManager.showScreen(screenLink)		//显示特定的屏幕内容，screenLink是相应屏幕section标签的ID并带有#，例如#de_screen_project
DE.UIManager.showSearchScreen(keyword,type)
										//显示搜索结果屏幕，keyword是搜索关键词，type是优先显示的结果类型，type的值可以是resource或者project
DE.UIManager.showFilterMenu()			//显示筛选菜单
DE.UIManager.hideFilterMenu()			//隐藏筛选菜单
DE.UIManager.showExtMenu()				//显示扩展菜单
DE.UIManager.hideExtMenu()				//隐藏扩展菜单
DE.UIManager.showProjectDetail()		//显示作品详情
DE.UIManager.hideProjectDetail()		//隐藏作品详情
DE.UIManager.hideAllMenuAndPopouts()	//隐藏所有菜单及弹出面板的状态，
DE.UIManager.showLoginPopout()			//显示登录弹窗
DE.UIManager.showRegPopout()			//显示注册弹窗
DE.UIManager.showMsgPopout(title,msg)	//显示消息弹窗，title为消息框的标题，msg为消息正文
DE.UIManager.showRestPwdPopout()		//显示重置密码弹窗
DE.UIManager.gotoUploadStep(step)		//跳转到特定的上传步骤，stepID为对应上次步骤容器的ID，如"#de_upload_step1"，"#de_upload_step2"，"#de_upload_step3"
DE.UIManager.hidePopout()				//关闭弹窗
DE.UIManager.guestView()				//显示访客视图
DE.UIManager.regView()					//显示注册用户视图
DE.UIManager.vipView()					//显示VIP用户视图
DE.UIManager.adminView()				//显示管理员视图

*/

var DE=DE||{};

DE.UIManager=function(){
	//私有属性及方法	
	var showPopout=function(){
			$("#de_popout").removeClass("de_hidden")
			$("#de_blackout").removeClass("de_hidden")
		}
	var hidePopout=function(){
			$("#de_popout").addClass("de_hidden")
			$("#de_blackout").addClass("de_hidden")		
		}
	var gotoScreen=function(screenLink,paraObj){
			cleanAllScreens()
			$(screenLink).removeClass("de_hidden")			
			
			//加载某些特定屏幕时需要额外地处理视图
			if(screenLink=="#de_screen_project"){
				$(".de_top_nav .de_btn_project").addClass("active")
			}else if(screenLink=="#de_screen_resource"){
				$(".de_top_nav .de_btn_resource").addClass("active")
			}else if(screenLink=="#de_screen_designer"){
				$(".de_top_nav .de_btn_designer").addClass("active")
			}else if(screenLink=="#de_screen_search_result"){
				if(paraObj && paraObj.keyword){
					$("#de_btn_filter>a").html( "搜索："+paraObj.keyword ).addClass("active")
					}
				if(paraObj && paraObj.type=="resource"){
					$("#de_screen_search_result>.de_category_filter>.de_category_filter_option_resource").addClass("active")
					}else{
					$("#de_screen_search_result>.de_category_filter>.de_category_filter_option_project").addClass("active")	
					}
			}else if(screenLink=="#de_screen_project_detail"){
				
				}
		}
	var cleanAllScreens=function(){
		
			//隐藏各种组件
			DE.UIManager.hideAllMenuAndPopouts()
			DE.UIManager.hideProjectDetail()
		
			//恢复视图初始状态		
			$("#de_screen_container>section").addClass("de_hidden");
			$("#de_btn_filter .active").html("更多分类...").removeClass("active");			
			$("#de_top_nav .active").removeClass("active");
			$("#de_screen_search_result>.de_category_filter .active").removeClass("active");
			
			//如需释放内存可激活下列代码
			//$("#de_screen_container>section>ul").empty();
		}
	
	return{ 
		//公共属性及方法 开始
		showScreen:function(screenLink,paraObj){		
			gotoScreen(screenLink)
		},
		showSearchScreen:function(keyword,type){
			gotoScreen("#de_screen_search_result",{keyword:keyword,type:type})
		},	
		showFilterMenu:function(){
			DE.UIManager.hideAllMenuAndPopouts()
			$("#de_filter_menu").css("height",320)
			$("#de_btn_filter>a").addClass("focused")
		},
		hideFilterMenu:function(){
			$("#de_filter_menu").css("height",0);
			$("#de_btn_filter>a").removeClass("focused")		
		},
		showExtMenu:function(){
			DE.UIManager.hideAllMenuAndPopouts()
			$("#de_ext_nav").css("right",0)
		},
		hideExtMenu:function(){
			$("#de_ext_nav").css("right","-150px")
		},
		showProjectDetail:function(){
			$("#de_screen_project_detail").removeClass("de_hidden");
			$("#de_screen_project_detail").scrollTop(0)
			$("body").addClass("de_noscroll");
		},
		hideProjectDetail:function(){
			$("#de_screen_project_detail").addClass("de_hidden");
			$("body").removeClass("de_noscroll");
		},
		showLoginPopout:function(){
			showPopout()
			$("#de_popout>.de_inner_wrapper").css("left",0);
			$("#de_popout>.de_popout_title").html("登录");
			$("#de_login_email").focus();
		},
		showRegPopout:function(){
			showPopout()
			$("#de_popout>.de_inner_wrapper").css("left","-100%");
			$("#de_popout>.de_popout_title").html("注册");
			$("#de_reg_username").focus();
		},
		showRecoverPwdPopout:function(){
			showPopout()
			$("#de_popout>.de_inner_wrapper").css("left","-200%");
			$("#de_popout>.de_popout_title").html("找回密码");
			$("#de_recover_pwd_email").focus();		
		},
		showMsgPopout:function(title,msg){
			showPopout()
			$("#de_popout .de_popout_title").html(title)
			$("#de_popout .de_popout_msg").html(msg)
			$("#de_popout>.de_inner_wrapper").css("left","-300%")
		},
		showRestPwdPopout:function(){
			showPopout()
			$("#de_popout>.de_inner_wrapper").css("left","-400%");
			$("#de_popout>.de_popout_title").html("修改密码");
			$("#de_reset_pwd").focus();		
		},
		showEditProfilePopout:function(){
			showPopout();
			$("#de_popout>.de_inner_wrapper").css("left","-500%");
			$("#de_popout>.de_popout_title").html("编辑个人信息");
		},
		hidePopout:function(){
			hidePopout();
		},	
		hideAllMenuAndPopouts:function(){
			DE.UIManager.hideFilterMenu();
			DE.UIManager.hideExtMenu();
			hidePopout();
		},
		gotoUploadStep:function(stepID){
			$("#de_screen_upload .de_upload_step").addClass("de_hidden")
			$(stepID).removeClass("de_hidden")
			$("#de_screen_upload .current").removeClass("current")
			
			if(stepID=="#de_upload_step1"){
				$("#de_screen_upload .de_tab_step1").addClass("current")
			}else if(stepID=="#de_upload_step2"){
				$("#de_screen_upload .de_tab_step2").addClass("current")				
			}else if(stepID=="#de_upload_step3"){
				$("#de_screen_upload .de_tab_step3").addClass("current")			
			}
		},

		showLoginMenu:function(data){
            var tpl=$("#menuTpl").html();
            var html=juicer(tpl,data);
            $("#de_menu").html(html);
		}

	//公共属性及方法 结束
	}
}();