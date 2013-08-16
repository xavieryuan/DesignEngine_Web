// JavaScript Document

function hideAllMenu(){
	$("#de_filter_menu").css("height",0)
	}

$(document).ready(function(e) {
	//初始化
	//绑定菜单事件
	 $("#de_btn_project_filter").on("click",function(evt){
		 if($("#de_filter_menu").height()<459){
			 $("#de_filter_menu").css("height",459)
			 }else{
			 $("#de_filter_menu").css("height",0)	 
			}
			evt.stopPropagation();		 
		 })
	
	$("#de_filter_menu li>a").on("click",function(evt){
		
		$(this).addClass("selected")
		$("#de_filter_menu li>a").not(this).removeClass("selected");
		
		$("#de_btn_project_filter").html( $(this).text() )
		
		})
		 				 
	$(document).on("click",function(){
		hideAllMenu()
		})
	
	//section tab标签
	$("#de_section_tab>ul>li>a").on("click",function(evt){
		
		$("#de_section_tab>ul>li>a").each(function(index, ele) {
            $(ele).removeClass("de_tab_active");
			$($(ele).attr("href")).addClass("de_hidden")
        });
		
		var target=$(this).attr("href");
		$(this).addClass("de_tab_active")
		$(target).removeClass("de_hidden")
		
		evt.preventDefault();
		})	 
			 
});




				
						
			