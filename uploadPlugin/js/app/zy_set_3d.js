/**
 * Created by JetBrains PhpStorm.
 * User: ty
 * Date: 13-6-13
 * Time: 上午8:58
 * 幻灯片设置3d文件属性页面js
 */
$(document).ready(function(){

    var zy_media_id=zy_set_common.zy_get_media_id();


    //设置原来的内容
    zy_set_common.zy_set_old_content(zy_media_id,config.uploadMediaTypes._3d);

    //上传罗略图部分代码
    zy_set_common.zy_create_thumb_uploader(zy_media_id);

    //上传视频文件部分代码
    zy_set_common.zy_create_media_uploader(config.uploadFilters._3dFilter,zy_media_id);

    //控制标题和描述的输入
    $("#zy_media_title").blur(function(){
        //防止后台json_decode出错，将双引号改成单引号
        zy_set_common.zy_get_private_uploaded()[zy_media_id][config.mediaObj.mediaTitle]=$(this).val().replace(/["]/g,"'");
    });
    $("#zy_media_memo").blur(function(){
        //防止后台json_decode出错，将双引号改成单引号
        zy_set_common.zy_get_private_uploaded()[zy_media_id][config.mediaObj.mediaMemo]=$(this).val().replace(/["]/g,"'");
    });
});
