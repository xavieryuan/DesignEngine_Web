/*greensock 配置*/
CSSPlugin.defaultTransformPerspective=1200;

/*定义动效*/
var animations=angular.module("animations",["ngAnimate"]);

animations.animation(".de_ext_nav",function(){
	return{
		beforeAddClass: function(element, className, done) {
			if(className=="de_ext_nav_active"){
				TweenMax.to(element,0.3,{x:-220,ease:Circ.easeOut,onComplete:done})
			}
		},
		beforeRemoveClass: function(element, className, done) {
			if(className=="de_ext_nav_active"){
				TweenMax.to(element,0.3,{x:0,ease:Circ.easeOut,onComplete:done})
			}
		}
	}
});
animations.animation(".de_popout",function(){
	return{
		enter:function(element,done){
			TweenMax.set(element,{z:90,opacity:0});
			TweenMax.to(element,0.5,{z:0,opacity:1, ease:Circ.easeOut, onComplete:done})
		},
		leave:function(element,done){
			TweenMax.to(element,0.5,{z:90,opacity:0, ease:Circ.easeOut, onComplete:done})
		}
	}
});
animations.animation(".de_blackout",function(){
	return{
		beforeAddClass: function(element, className, done) {
			if(className=="ng-hide"){
				TweenMax.set(element,{opacity:0.7});
				TweenMax.to(element,0.5,{opacity:0, ease:Circ.easeOut, onComplete:done})
			}
		},
		beforeRemoveClass: function(element, className, done) {
			if(className=="ng-hide"){				
				TweenMax.to(element,0.5,{opacity:0.7, ease:Circ.easeOut, onComplete:done})
			}
		}
	}
});
animations.animation(".de_screen_project_detail",function(){
	return{
		enter:function(element,done){
            //console.log(element.scope());
			//重置de_project_detail位置到页面顶端
			window.scrollTo(0,0);
			var header=$(element).find(".de_project_header");
			var detail=$(element).find(".de_project_detail");
			TweenMax.set(element,{opacity:0});
			TweenMax.set(header,{y:-100});
			TweenMax.set(detail,{y:100});
			TweenMax.to([header,detail],0.3,{y:0});
			TweenMax.to(element,0.4,{opacity:1,onComplete:done});
		}/*,
		leave:function(element,done){
			var header=$(element).find(".de_project_header");
			var detail=$(element).find(".de_project_detail");
			TweenMax.to(header,0.3,{y:-100});
			TweenMax.to(detail,0.3,{y:100});
			TweenMax.to(element,0.4,{opacity:0,onComplete:function(){

                done();
			});

		}*/
	}
});


