/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-20
 * Time: 下午2:38
 * To change this template use File | Settings | File Templates.
 */
function isTouchDevice(){
    if((navigator.userAgent.match(/android 3/i)) || (navigator.userAgent.match(/honeycomb/i))){
        return false;
    }
    try{
        document.createEvent("TouchEvent"); return true;
    }catch(e){
        return false;
    }
}
function touchScroll(id){
    if(isTouchDevice()){
        var el=document.getElementById(id); var scrollStartPosY=0; var scrollStartPosX=0;

        el.addEventListener("touchstart", function(event) {
            scrollStartPosY=this.scrollTop+event.touches[0].pageY; scrollStartPosX=this.scrollLeft+event.touches[0].pageX;
            //event.preventDefault();
        },false);

        el.addEventListener("touchmove", function(event) {
            if ((this.scrollTop < this.scrollHeight-this.offsetHeight && this.scrollTop+event.touches[0].pageY < scrollStartPosY-5) ||
                             (this.scrollTop != 0 && this.scrollTop+event.touches[0].pageY > scrollStartPosY+5)){
                event.preventDefault();
            }
            if ((this.scrollLeft < this.scrollWidth-this.offsetWidth && this.scrollLeft+event.touches[0].pageX < scrollStartPosX-5) ||
                    (this.scrollLeft != 0 && this.scrollLeft+event.touches[0].pageX > scrollStartPosX+5)) {
                event.preventDefault();
            }
            this.scrollTop=scrollStartPosY-event.touches[0].pageY;
            this.scrollLeft=scrollStartPosX-event.touches[0].pageX;
        },false);
    }

}
touchScroll('de_screen_project_detail');
