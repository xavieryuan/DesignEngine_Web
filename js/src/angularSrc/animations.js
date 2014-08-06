/*greensock 配置*/
CSSPlugin.defaultTransformPerspective=1200;

/*定义动效*/
var animations=angular.module("animations",["ngAnimate"]);

animations.animation(".de_animation_ext_nav",function(){
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

animations.animation(".de_animation_popout",function(){
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
animations.animation(".de_animation_blackout",function(){
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
animations.animation(".de_animation_project_detail",function(){
	return{
		enter:function(element,done){			
			var target=$;
			console.log(target);
			done();
			//TweenMax.set(target,{opacity:0});
			//TweenMax.to(target,0.5,{opacity:1,onComplete:done})
			//TweenMax.set(element,{opacity:0});
			//TweenMax.to(element,0.5,{opacity:1, ease:Circ.easeOut, onComplete:done})
			
		},
		leave:function(element,done){
			done()
		}
	}
});

