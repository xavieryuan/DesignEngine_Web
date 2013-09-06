/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-9-4
 * Time: 下午6:01
 * To change this template use File | Settings | File Templates.
 */
var DE=DE||{};
DE.upload=(function(){
    function createThumbUpload(){
        var uploaderThumb = new plupload.Uploader({
            runtimes:"flash",
            multi_selection:false,
            max_file_size:DE.config.maxImageSize,
            browse_button:"zy_upload_thumb_button",
            container:"zy_thumb_container",
            flash_swf_url:'../wp-includes/js/plupload/plupload.flash.swf',
            url:DE.config.uploadUrl,
            filters:[
                {title:"Image files", extensions:"jpg,gif,png,jpeg"}
            ]
        });

        //初始化
        uploaderThumb.init();

        //文件添加事件
        uploaderThumb.bind("FilesAdded", function (up, files) {
            var filename = files[0].name;
            var lastIndex = filename.lastIndexOf(".");
            filename = filename.substring(0, lastIndex);

            //只含有汉字、数字、字母、下划线不能以下划线开头和结尾
            var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

            if (!reg.test(filename)) {
                alert("文件名必须是数字下划线汉字字母,且不能以下划线开头。");

                //删除文件
                up.removeFile(files[0]);
                return false;
            } else {
                up.start();//开始上传
            }
        });

        //文件上传进度条事件
        uploaderThumb.bind("UploadProgress", function (up, file) {

        });

        //出错事件
        uploaderThumb.bind("Error", function (up, err) {
            alert(err.message);
            up.refresh();
        });

        //上传完毕事件
        uploaderThumb.bind("FileUploaded", function (up, file, res) {
            //console.log(response.success+"路径："+response.url);
            var response = JSON.parse(res.response);
            //console.log(response);
            if (response.success) {

                //显示压缩后的图片
                var img_src = response.data.url;
                var img_ext = img_src.substring(img_src.lastIndexOf("."), img_src.length);
                var img_src_compress = img_src.substring(0, img_src.lastIndexOf(".")) + zy_config.zy_compress_suffix + img_ext;
                jQuery("#zy_uploaded_thumb").attr("src", img_src_compress);
                jQuery("#zy_thumb").val(response.data.filename);
            } else {
                alert(response.data.message);
            }
        });
    }

    function createMediaUpload(browseButton,container,fileters){
        var uploaderMedia=new plupload.Uploader({
            runtimes:"flash",
            multi_selection:false,
            max_file_size:DE.config.maxMediaSize,
            browse_button:browseButton,
            container:container,
            flash_swf_url: '../js/lib/plupload.flash.swf',
            url:DE.config.uploadUrl,
            chunk_size:"2m",
            filters : [
                {title : "Media files", extensions : filters}
            ],
            multipart_params: {
                path:"#"
            }
        });

        //初始化
        uploaderMedia.init();

        //文件添加事件
        uploaderMedia.bind("FilesAdded",function(up,files){
            var filename=files[0].name;
            var lastIndex=filename.lastIndexOf(".");
            filename=filename.substring(0,lastIndex);

            //只含有汉字、数字、字母、下划线不能以下划线开头和结尾
            var reg=/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            if(!reg.test(filename)){
                alert("文件名必须是数字下划线汉字字母,且不能以下划线开头。");

                //删除文件
                up.removeFile(files[0]);
                return false;
            }else{
                up.start(); //开始上传

                //显示按钮
                $("#zy_upload_media_button").addClass("zy_hidden");
            }
        });

        //文件上传进度条事件
        uploaderMedia.bind("UploadProgress",function(up,file){
            $("#zy_file_info").html(file.percent + '%'+file.name);
        });

        //出错事件
        uploaderMedia.bind("Error",function(up,err){
            up.refresh();

            //设置页面展示
            $("#zy_file_info").html("上传出错");
            $("#zy_upload_media_button").removeClass("zy_hidden");
        });

        //上传完毕事件
        uploaderMedia.bind("FileUploaded",function(up,file,res){
            var response=JSON.parse(res.response);
            if(response.success){
                //设置uploaded_medias的值
                uploaded_medias[zy_media_id]["zy_media_filename"]=response.data.filename;
                uploaded_medias[zy_media_id]["zy_media_filepath"]=response.data.url;

                //设置列表中的值
                $("#zy_uploaded_medias_ol a[data-zy-media-id='"+zy_media_id+"']",parent.document).find(".zy_media_filename").text(file.name);

                //$(".zy_file_info").html(file.name).attr("data-zy-media-url",response.data.url);
                $("#zy_file_info").html(file.name);
                $("#zy_upload_media_button").removeClass("zy_hidden");
            }else{
                alert(response.data.message);
            }

        });
    }

    return {
        getWorkDetail:function(){
            $.ajax({
                url:DE.config.urls.getWorkDetail,
                type:"post",
                data:{

                },
                dataType:"json",
                success:function(data){

                },
                error:function(){

                }

            });
        },
        createUpload:function(obj){
            if(obj.type=="thumb"){
                createThumbUpload();
            }else{
                createMediaUpload(obj.browseButton,obj.container,obj.filters)
            }
        },
        drag:function(){
            var targetOl = jQuery("#zy_uploaded_medias_ol")[0];//容器元素
            var eleDrag = null;//被拖动的元素

            jQuery("#ol a").each(function (index, l) {

                var target = jQuery(this)[0];

                //开始选择
                target.onselectstart = function () {

                    //阻止默认的事件
                    return false;
                };

                //拖拽开始
                target.ondragstart = function (ev) {
                    //拖拽效果
                    ev.dataTransfer.effectAllowed = "move";
                    eleDrag = ev.target;
                    return true;
                };

                //拖拽结束
                target.ondragend = function (ev) {
                    eleDrag = null;
                    return false;
                };
            });

            //在元素中滑过
            //ol作为最大的容器也要处理拖拽事件，当其中有li的时候放到li的前面，但没有的时候放到ol的最后面
            targetOl.ondragover = function (ev) {
                ev.preventDefault();//阻止浏览器的默认事件
                return false;
            };

            //进入元素
            targetOl.ondragenter = function (ev) {

                if (ev.toElement == targetOl) {
                    targetOl.appendChild(jQuery(eleDrag).parents("li")[0]);
                } else {
                    targetOl.insertBefore(jQuery(eleDrag).parents("li")[0], jQuery(ev.toElement).parents("li")[0]);
                }
                return false;
            };
        },
        uploadBtnHandler:function(){

        },
        deleteUploadFile:function(){

        },
        setFirstActive:function(){

        },
        ajaxForm:function(){
            $("#form").ajaxSubmit({
                url:DE.config.uploadAction,
                type:"post",
                data:{

                },
                dataType:"json",
                success:function (data) {
                    if (data.info == 1) {

                    } else {

                    }
                },
                error:function (data) {

                }
            });
        }
    }
})();

$(document).ready(function(){
    DE.upload.createUpload({type:"thumb"});
    DE.upload.createUpload({type:"media",browseButton:"",container:"",filters:""});
    DE.upload.createUpload({type:"media",browseButton:"",container:"",filters:""});
    DE.upload.createUpload({type:"media",browseButton:"",container:"",filters:""});
    DE.upload.createUpload({type:"media",browseButton:"",container:"",filters:""});
});