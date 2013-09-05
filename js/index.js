// JavaScript Document

$(document).ready(function(evt) {
//初始化
	
//数据无关的初始化工作
	//登录注册按钮点击事件
	$(".de_btn_login_reg").on("click",function(evt){
		DE.UIManager.showLoginPopout();
		evt.stopPropagation();
		})
	//更多分类按钮点击事件	
	$("#de_btn_filter>a").on("click",function(evt){
		DE.UIManager.showFilterMenu()
		evt.stopPropagation();		 
		})
	//ext菜单按钮点击事件
	$("#de_btn_ext_nav").on("click",function(evt){
		DE.UIManager.showExtMenu();	
		evt.stopPropagation();	
		})
	//上传按钮点击事件
	$("#de_btn_upload").on("click",function(evt){
		DE.UIManager.showScreen($(this).attr("href"));		
		evt.stopPropagation();	
		})	
	//注册按钮点击事件
	$("#de_reg_btn").on("click",function(){
		DE.UIManager.showRegPopout();
		})
	//忘记密码按钮点击事件	
	$("#de_btn_forgot_pwd").on("click",function(){
		DE.UIManager.showRecoverPwdPopout();
		
		})
	//重置密码按钮点击事件
	$("#de_btn_reset_pwd").on("click",function(){
		DE.UIManager.showRestPwdPopout();
		})
	//修改个人信息按钮
	$("#de_btn_edit_profile").on("click",function(){
		DE.UIManager.showEditProfilePopout();
		})
	
	
	//关闭弹窗按钮点击事件
	$("#de_popout .de_popout_close_btn").on("click",function(){
		DE.UIManager.hidePopout();
		})
		
	//点击body隐藏所有弹窗和菜单
	$(document).on("click",function(){		
		DE.UIManager.hideAllMenuAndPopouts()
		})	
	
	//点击各类弹窗和菜单时，阻止点击事件冒泡到document
	$("#de_filter_menu").on("click",function(evt){
		evt.stopPropagation();
		})
	$("#de_ext_nav").on("click",function(evt){
		evt.stopPropagation();
		})
	$("#de_popout").on("click",function(evt){		
		evt.stopPropagation();
		}) 		

//数据相关的初始化，需修改
	
	//Filter Menu 按钮点击事件	
	$("#de_filter_menu li>a").on("click",function(evt){
		
		//DE.UIManager.showSearchResultScreen($(this).text())
		console.log($(this).attr("href"))
		DE.UIManager.showSearchScreen($(this).text(),"project")		
		
		//开始查询代码		
		})
	
	//top nav tab标签点击事件
	$("#de_top_nav>ul>li>a").on("click",function(evt){				
		DE.UIManager.showScreen($(this).attr("href"));
		//开始查询代码
		})
	
	

	//临时登录
	$("#de_btn_sign_in").on("click",function(evt){
		DE.DataManager.doSignIn()
		DE.UIManager.hideAllMenuAndPopouts()
		
		})
	//临时注销
	$("#de_btn_sign_out").on("click",function(evt){
		DE.UIManager.guestView()
		DE.UIManager.hideAllMenuAndPopouts()
		
		})
	
	//访问个人主页面
	$("#de_btn_user_profile").on("click",function(evt){
		DE.UIManager.showScreen($(this).attr("href"));		
		})
		
	$(".user_info a").on("click",function(evt){
		DE.UIManager.showScreen("#de_screen_user_profile");		
		})
	
	//显示作品详情
	$(".project_info a").on("click",function(evt){
		DE.UIManager.showProjectDetail()
		})

	//关闭作品详情
	$("#de_btn_close_project_detail").on("click",function(evt){
		DE.UIManager.hideProjectDetail()
		})		 
});




				
						
			