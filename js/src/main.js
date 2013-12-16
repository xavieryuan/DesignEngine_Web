/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-12-16
 * Time: 下午3:26
 * To change this template use File | Settings | File Templates.
 */
requirejs.config({
    paths:{
        jquery:"../lib/jquery-2.0.3.min",
        cookie:"../lib/jquery.cookie.js",
        form:"../lib/jquery.form",
        validate:"../lib/jquery.validate.min",
        juicer:"../lib/juicer.min",
        plupload:"../lib/plupload",
        pFlash:"plupload.flash"
    },
    shim:{
        cookie:["jquery"],
        form:["jquery"],
        validate:["jquery"],
        juicer:{
            exports:"juicer"
        },
        plupload:{
            exports:"plupload"
        },
        pFlash:["plupload"]
    }
});

require(["eventManager"],function(eventManager){
     eventManager.init();
});
