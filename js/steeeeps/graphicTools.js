
if (!dojo._hasResource["steeeeps.graphicTools"]) {
    dojo._hasResource["steeeeps.graphicTools"] = true;
    
    dojo.provide("steeeeps.graphicTools")
    dojo.require("dijit._Widget");
    dojo.require("dijit._Templated");
    dojo.require("dojo.cache");
    dojo.require("esri.toolbars.draw");
    dojo.require("esri.toolbars.edit");
    dojo.require("esri.toolbars.navigation");
    dojo.require("dijit.form.Button");
    dojo.require("dijit.Menu");
    dojo.require("steeeeps.attributeInfo");
    dojo.require("steeeeps.dragTitlePane");
    
    
    dojo.declare("steeeeps.GraphicTools", [dijit._Widget, dijit._Templated], {
        map: null,
        navigationbar: null,
        selectSet: [],
        baseClass: "toolbar",
        templateString: dojo.cache("steeeeps", "template/graphicTools.html"),
        constructor: function(params, position){
            this.map = params.map;
        },
        postCreate: function(){
            var domNode = this.domNode;
            this.inherited(arguments);
            this._initNavigationbar();
            this._initGraphicsLayer();
            //do something about domNode;
        },
        startup: function(){
            //dojo.connect(this.zoomIn,"onclick",changeNavigationTool);
        },
        destroy: function(){
            if (this.navigationbar) 
                this.navigationbar.destroy();
            dojo.disconnect(this.map.graphics, "onClick", dojo.hitch(this, this._graphicsLayerClickHandler));
            dojo.disconnect(this.map.graphics, "onDblClick", dojo.hitch(this, this._graphicsLayerDblClickHandler));
        },
        _initNavigationbar: function(){
            this.navigationbar = new esri.toolbars.Navigation(this.map);
        },
        _initGraphicsLayer: function(){
            dojo.connect(this.map.graphics, "onClick", dojo.hitch(this, this._graphicsLayerClickHandler));
            dojo.connect(this.map.graphics, "onDblClick", dojo.hitch(this, this._graphicsLayerDblClickHandler));
        },
        _graphicsLayerClickHandler: function(event){
            graphic = event.graphic;
            var attriInfo = new steeeeps.AttributeWindow({
                map: this.map,
                graphic: graphic
            });
            var grid = attriInfo.getNode();
            
            this.map.infoWindow.setContent(grid);
            this.map.infoWindow.setTitle("属性");
            this.map.infoWindow.resize(370, 450);
            this.map.infoWindow.show(event.mapPoint);
        },
        _graphicsLayerDblClickHandler: function(event){
        
        },
        _changeNavigationTool: function(event){
            event = event || window.event;
            var src = event.srcElement || event.target;
            var type = src.id.toLowerCase();
            switch (type) {
                case "zoomin":
                    this.navigationbar.activate(esri.toolbars.Navigation.ZOOM_IN);
                    break;
                case "zoomout":
                    this.navigationbar.activate(esri.toolbars.Navigation.ZOOM_OUT);
                    break;
                case "pan":
                    this.navigationbar.deactivate();
                    break;
                case "fullextent":
                    this.navigationbar.zoomToFullExtent();
                    break;
                case "edit":
                    this._showEditPane(event);
                    break;
                case "save":
                    break;
            }
        },
        _showEditPane: function(event){
            var tools = new steeeeps.EditTool({
                "map": this.map
            }, dojo.create("div"));
            var drag = new steeeeps.DragTitlePane({
                title: "编辑工具"
            }, dojo.create("div"));
            drag.setContent(tools.domNode);
            drag.setStyle({
                "width": "450px",
                "z-index": "3",
                "opacity": "0.8"
            });
            drag.startup();
            dojo.body().appendChild(drag.domNode);
        }
    });
}
