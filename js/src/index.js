

DE.eventManager.init();

//移动平台进入全屏，原理是手动滚动一下
window.onload=function(){
    if(DE.config.checkMobile()){
        setTimeout(function(){
            window.scrollTo(0,1);
        },500);
    }
};