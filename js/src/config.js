/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-5
 * Time: 上午9:22
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.config={
    root:"/DesignEngine_Web",
    maxMediaSize:"200m",
    maxImageSize:"2m",
    ajaxUrls:{
        uploadFileUrl:"#",
        uploadAction:"#",
        getProjectDetail:"#",
        getProjectsByTag:"#",
        getAllProjects:"/DesignEngine_Web/data/projects.json",
        getAllResource:"/DesignEngine_Web/data/resource.json",
        deleteEntity:"#",
        hideEntity:"#",
        getProjectsBySearch:"#",
        getTags:"#",
        addPraise:"#",
        deletePraise:"#",
        addHonor:"#",
        deleteHonor:"#",
        getSimilarEntities:"#",
        getComments:"#",
        postComment:"#",
        deleteComment:"#",
        getHotUsers:"#",
        getUserById:"#",
        getUserEntities:"#",
        login:"#",
        sendOpenId:"#",
        register:"#",
        changeEmail:"#",
        forgetPassword:"#"
    },
    entityTypes:{
        project:"project",
        resource:"resource"
    },
    urls:{
        indexWork:"/project/all",
        indexResource:"/resource/all",
        entityDetail:"/entity/entityId",
        tagWorks:"/tag/tagName",
        hotUsers:"/user/hot",
        userDetail:"/user/userId",
        search:"/search/searchContent",
        uploadWork:"/upload/entity",
        editWork:"/edit/entityId"
    },
    roles:{
        admin:"admin",
        user:"user",
        vip:"VIP"
    }

};
Object.freeze(DE.config);