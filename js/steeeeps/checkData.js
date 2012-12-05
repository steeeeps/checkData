
if (!dojo._hasResource["steeeeps.checkData"]) {
    dojo._hasResource["steeeeps.checkData"] = true;
    
    dojo.provide("steeeeps.checkData");
    
    dojo.require("esri.map");
    dojo.require("steeeeps.config");
    dojo.require("steeeeps.graphicSymbols");
    dojo.require("steeeeps.graphicTools");
    dojo.require("steeeeps.editTool");
    dojo.require("dijit.layout.BorderContainer");
    dojo.require("dijit.layout.ContentPane");
    
    dojo.declare("steeeeps.CheckData", null, {
    
        map: null,
        resizeTimer: 0,
        constructor: function(){
            this._start();
        },
        _start: function(){
            steeeeps.Config.parseConfig(dojo.hitch(this, this._configLoadHandler), dojo.hitch(this, this._configErrorHandler));
        },
        _configLoadHandler: function(response, ioArgs){
            if (!response) {
                console.log("配置信息为空...");
                return;
            }
            steeeeps.Config.configObj = response;
            var initExtent = new esri.geometry.Extent({
                    xmax: 13003849.437012147,
                    xmin: 12906010.040807255,
                    ymax: 4880944.608272873,
                    ymin: 4853885.900259957,
                    "spatialReference": {
                        "wkid": 102100 
                    }
                });
            this.map = new esri.Map("map",{
                extent:initExtent
            });
            dojo.connect(this.map, "onLoad", dojo.hitch(this, this._mapLoadHandler));
            this.map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer(steeeeps.Config.configObj.ArcGISTiledMapServiceLayerUrl));
        },
        _configErrorHandler: function(error){
            console.log(error);
        },
        _mapLoadHandler: function(){
            dojo.connect(dijit.byId("map"), "resize", dojo.hitch(this, this._resizeHandler));
            this._getJsonData();
            this._createNavigationTools();
        },
        _resizeHandler: function(){
            if (this.resizeTimer) 
                clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(dojo.hitch(this, function(){
                this.map.resize();
                this.map.reposition();
            }, 500));
        },
        _createNavigationTools: function(){
            var tools = new steeeeps.GraphicTools({
                "map": this.map
            }, dojo.create("toolbar", {
                "class": "toolbar"
            }, dojo.body()));
        },
        _getJsonData: function(){
            var mp = this.map;
            dojo.xhrGet({
                url: "assets/conf/json.txt",
                handleAs: "json",
                load: function(response, args){
                    var data = response.data;
                    var type = data.type;
                    dojo.forEach(data.results, function(da){
                        da.type = type;
                        var mappoint = esri.geometry.geographicToWebMercator(new esri.geometry.Point(da.longitude, da.latitude, mp.spatialReference));
                        var graphic = new esri.Graphic(mappoint, steeeeps.GraphicSymbols.getDefaultSymbol(), da);
                        mp.graphics.add(graphic);
                    });
                }
            });
        }
        
    });
    
}
