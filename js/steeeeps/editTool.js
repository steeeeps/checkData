
if (!dojo._hasResource["steeeeps.editTool"]) {
    dojo._hasResource["steeeeps.editTool"] = true;
    
    dojo.provide("steeeeps.editTool");
    dojo.require("dijit._Widget");
    dojo.require("dijit._Templated");
    dojo.require("dojo.cache");
    dojo.require("esri.toolbars.draw");
    dojo.require("esri.toolbars.edit");
    dojo.require("steeeeps.attributeInfo");
    dojo.declare("steeeeps.EditTool", [dijit._Widget, dijit._Templated], {
        map: null,
        drawbar: null,
        editbar: null,
        selectSet: null,
        templateString: dojo.cache("steeeeps", "template/editTool.html"),
        constructor: function(params, position){
            this.map = params.map;
        },
        postCreate: function(){
            this.inherited(arguments);
            this._initDrawbar();
            this._initEditbar();
            this.selectSet = [];
        },
        _initDrawbar: function(){
            this.drawbar = new esri.toolbars.Draw(this.map);
            dojo.connect(this.drawbar, "onDrawEnd", dojo.hitch(this, this._drawEndHandler));
           
        },
        _initEditbar: function(){
            this.editbar = new esri.toolbars.Edit(this.map);
        },
        _drawEndHandler: function(geometry){
            this.drawbar.deactivate();
            if (geometry.type == "point") {
                var graphic = new esri.Graphic(geometry, steeeeps.GraphicSymbols.getDefaultSymbol(), this._getGraphicAttribute());
                this._editLatlongAttribute(graphic);
                this.map.graphics.add(graphic);
                this._showAddAttributeWindow(this.map, graphic);
            }
            else 
                if (geometry.type == "extent") {
                    this._selectGraphics(this.selectSet, geometry);
                //怎样删除extent
                }
        },
        _showAddAttributeWindow: function(map, graphic){
            var addAttri = new steeeeps.AddAttribute(map, graphic);
            var pane = addAttri.getNode();
            this.map.infoWindow.setContent(pane);
            this.map.infoWindow.setTitle("添加属性");
            this.map.infoWindow.resize(350, 250);
            this.map.infoWindow.show(graphic.geometry);
        },
        _editLatlongAttribute: function(graphic){
            var latlong = esri.geometry.webMercatorToGeographic(graphic.geometry);
            graphic.attributes.latitude = latlong.x.toFixed(6);
            graphic.attributes.longitude = latlong.y.toFixed(6);
        },
        _selectGraphics: function(selectSet, geometry){
            if (!selectSet) 
                selectSet = [];
            var graphics = this.map.graphics.graphics;
            dojo.forEach(graphics, function(graphic){
                if (geometry.contains(graphic.geometry) && graphic.geometry != geometry) {
                    graphic.setSymbol(steeeeps.GraphicSymbols.getSelectedSymbol());
                    selectSet.push(graphic);
                }
            });
            //            if (!selectSet || selectSet.length == 0) 
            //                return;
            //            console.log(this);
            //            for (var i = 0; i < selectSet.length; i++) {
            //                console.log(i);
            //                this.editbar.activate(esri.toolbars.Edit.MOVE, selectSet[i]);
            //            }
            //            dojo.connect(this.editbar, "onGraphicMoveStop", this._graphicMoveStopHandler);
        },
        _graphicMoveStopHandler: function(graphic, transform){
            console.log("stop");
        },
        _deleteSelectSet: function(){
            if (!this.selectSet || this.selectSet.length == 0) {
                alert("当前没有选择的要素");
                return;
            }
            for (var i = 0; i < this.selectSet.length; i++) {
                this.map.graphics.remove(this.selectSet[i]);
            }
            this.selectSet = [];
        },
        _clearSelectSet: function(){
            if (!this.selectSet) 
                return;
            dojo.forEach(this.selectSet, function(graphic){
                graphic.setSymbol(steeeeps.GraphicSymbols.getDefaultSymbol());
            });
            this.selectSet = [];
        },
        _changeEditTool: function(event){
            event = event || window.event;
						var src=event.srcElement || event.target;
            var type = src.id.toLowerCase();
            switch (type) {
                case steeeeps.EditTool.TOOL_ADD:
                    this.drawbar.activate(esri.toolbars.Draw.POINT);
                    break;
                case steeeeps.EditTool.TOOL_SELECT:
                    this.drawbar.activate(esri.toolbars.Draw.EXTENT);
                    break;
                case steeeeps.EditTool.TOOL_DELETE:
                    this._deleteSelectSet();
                    break;
                case steeeeps.EditTool.TOOL_CLEAR:
                    this._clearSelectSet();
                    break;
            }
        },
        _createToolPane: function(){
            var pane = new dijit.layout.ContentPane({
                content: "<p>未加载工具...</p>",
                style: ""
            }, dojo.create("div"));
            return pane;
        },
        _getGraphicAttribute: function(){
            return this.map.graphics.graphics.length > 0 ? this._parseGraphicAttribute(this.map.graphics.graphics[0]) : this._parseDefaultAttribute();
        },
        _parseDefaultAttribute: function(){
            var fieldStr = steeeeps.Config.configObj.defaultFields;
            var arr = fieldStr.split(",");
            var fields = {};
            for (var i = 0; i < arr.length; i++) {
                fields[arr[i]] = null;
            }
            return fields;
        },
        _parseGraphicAttribute: function(graphic){
            var fields = {};
            for (key in graphic.attributes) {
                fields[key] = null;
            }
            return fields;
        },
        show: function(){
        
        },
        close: function(){
        
        }
    });
    
    dojo.mixin(steeeeps.EditTool, {
        TOOL_ADD: "add",
        TOOL_SELECT: "select",
        TOOL_DELETE: "delete",
        TOOL_CLEAR: "clear"
    });
}
