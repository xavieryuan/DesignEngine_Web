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
        uploadFileUrl:"http://192.168.2.148:8089/upload?test=1",
        uploadAction:"#",
        getProjectDetail:"#",
        getProjectsByTag:"#",
        getAllProjects:"/DesignEngine_Web/data/projects.json",
        getAllResource:"/DesignEngine_Web/data/resource.json",
        getEntityMedias:"/DesignEngine_Web/data/medias.json",
        deleteEntity:"#",
        hideEntity:"#",
        getEntityAttachments:"/DesignEngine_Web/data/attachments.json",
        getEntityDetail:"/DesignEngine_Web/data/entityDetail.json",
        getProjectsBySearch:"#",
        getTags:"/DesignEngine_Web/data/tags.json",
        addPraise:"#",
        deletePraise:"#",
        addHonor:"#",
        deleteHonor:"#",
        getSimilarEntities:"/DesignEngine_Web/data/similarEntities.json",
        getComments:"/DesignEngine_Web/data/comments.json",
        postComment:"#",
        deleteComment:"#",
        getHotUsers:"/DesignEngine_Web/data/hotUsers.json",
        getUserById:"/DesignEngine_Web/data/user.json",
        getUserEntities:"/DesignEngine_Web/data/userEntities.json",
        login:"/DesignEngine_Web",
        sendOpenId:"#",
        register:"/DesignEngine_Web",
        changeProfile:"/DesignEngine_Web",
        changePassword:"/DesignEngine_Web",
        forgetPassword:"#",
        uploadFigure:"/DesignEngine_Web",
        emailValidate:"",
        usernameValidate:""
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
    linkTypes:{
        user:"user",
        project:"project",
        resource:"resource",
        upload:"upload"
    },
    roles:{
        admin:"admin",
        user:"user",
        vip:"VIP"
    }

};
Object.freeze(DE.config);