/*定义动效*/
var animations=angular.module("animations",["ngAnimate"]);
animations.animation(".de_ext_nav_active",function(){
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
		},
	}
})