// JavaScript Document

var DE=DE||{};

DE.DataManager=function(){
	//私有属性及方法	
	
	return{
		//公共属性及方法 开始
		doSignIn:function(){
			
			//如果登录为注册用户，则显示注册用户视图，此处为调试代码
			DE.UIManager.regView()

			},
		doSignOut:function(){
			
			//恢复访客视图
			DE.UIManager.guestView()
			
			//注销代码写在下面
			}
	
	
	
		//公共属性及方法 结束		
		}
	
	
	}()