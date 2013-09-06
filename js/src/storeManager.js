/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-5
 * Time: 上午9:21
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.store={
    status:{
        loginPanel:0,
        registerPanel:0
    },
    currentUser:{
        userId:0,
        FullName:"",
        figureUrl:"",
        role:""
    },
    currentEntityId:0,
    userWorksCount:0,
    workLoadedDate:"",//分页加载，最后一个作品的时间
    resourceLoadedDate:"",
    currentShowEntity:"work",//当前显示的实体类型
    entityShowOrNot:false,
    userWorksShow:0, //查看用户那里的作品，已经显示的个数，本地分页
    currentUrl:"",//存储下已经加载的数据，点击的时候获取一部分资料
    clearStore:function(){
        this.userWorksCount=0;
        this.userWorksShow=0;
        this.lastLoadedDate="";
        this.currentShowEntity="work";
    }
};