
if (!dojo._hasResource["steeeeps.config"]) {
    dojo._hasResource["steeeeps.config"] = true;
    dojo.provide("steeeeps.config");
    dojo.declare("steeeeps.Config", null, {
        constructor: function(){
        
        }
    });
    dojo.mixin(steeeeps.Config, {
        configPath: "assets/conf/config.txt",
        configObj: null,
        paneDefaultCoord: {
            x: dojo.body().scrollWidth / 2+"px",
            y: dojo.body().scrollHeight / 2+"px"
        },
        parseConfig: function(load, error){
            dojo.xhrGet({
                url: this.configPath,
                handleAs: "json",
                load: load,
                error: error
            });
        }
        
    });
}
