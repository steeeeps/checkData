
if (!dojo._hasResource["steeeeps.attributeInfo"]) {
    dojo._hasResource["steeeeps.attributeInfo"] = true;
    
    dojo.provide("steeeeps.attributeInfo");
    dojo.require("dijit.layout.ContentPane");
    dojo.require("dojox.grid.EnhancedGrid");
    dojo.require("dojox.grid.DataGrid");
    dojo.require("dojo.data.ItemFileWriteStore");
    dojo.require("dijit.form.ComboBox");
    
    dojo.declare("steeeeps.AttributeWindow", null, {
        graphic: null,
        map: null,
        node: null,
        grid: null,
        constructor: function(params){
            this.map = params.map;
            this.graphic = params.graphic;
        },
        _createAttriDatagrid: function(graphic){
            var data = {
                items: this._createItemStore(),
                identifier: "field",
                label: "value"
            };
            var store = new dojo.data.ItemFileWriteStore({
                data: data
            });
            var attriGrid = new dojox.grid.DataGrid({
                store: store,
                structure: this._createLayout(),
                autoRender: true,
                selectionMode: "single",
                style: "height:370px;width:360px;color:#11537a;font-size:12;"
            }, dojo.create("div"));
            
            dojo.connect(attriGrid, "onRowClick", this._gridRowClickHandler);
            return attriGrid;
        },
        //设置longitude,latitude时不能编辑
        _gridRowClickHandler: function(event){
            event.cell.editable = true;
            var grid = event.cell.grid;
            var field = grid.store.getValue(grid.getItem(event.rowIndex), "field");
            if ("longitude,latitude".indexOf(field) != -1) {
                event.cell.editable = false;
            }
        },
        _createItemStore: function(){
            var arr = [];
            var obj;
            for (field in this.graphic.attributes) {
                obj = {};
                obj.field = field;
                obj.value = this.graphic.attributes[field];
                arr.push(obj);
            }
            return arr;
        },
        _createLayout: function(){
            var layout = [{
                field: "field",
                name: "字段",
                styles: "text-align:center;",
                width: "115px"
            }, {
                field: "value",
                name: "属性",
                editable: true,
                styles: "text-align:center;",
                width: "225px"
            }];
            return layout;
        },
        _saveAttribute: function(){
            for (var i = 0; i < grid.rowCount; i++) {
                var item = grid.getItem(i);
                var field = grid.store.getValue(item, "field");
                var value = grid.store.getValue(item, "value");
                this.graphic.attributes[field] = value;
            }
        },
        _deleteGraphic: function(){
            var result = window.confirm("是否删除改点？");
            if (!result) 
                return;
            this.map.graphics.remove(this.graphic);
            this.map.infoWindow.hide();
        },
        _createButton: function(label, func){
            var button = dojo.create("input", {
                type: "button",
                value: label,
                onclick: dojo.hitch(this, func)
            });
            return button;
        },
        getNode: function(){
            if (!this.node) 
                this.node = dojo.create("div");
            grid = this._createAttriDatagrid(this.graphic);
            this.node.appendChild(grid.domNode);
            this.node.appendChild(this._createButton("保存属性", this._saveAttribute));
            this.node.appendChild(this._createButton("删除该点", this._deleteGraphic));
            return this.node;
        }
    });
    
    dojo.declare("steeeeps.AddAttribute", null, {
        graphic: null,
        textInput: null,
        cbo: null,
        map: null,
        constructor: function(map, graphic){
            this.graphic = graphic;
            this.map = map;
        },
        _createComboBox: function(store, show){
            this.cbo = new dijit.form.ComboBox({
                store: store,
                //value: "name",
                searchAttr: show,
                style:{
                    float:"left"
                }
            }, dojo.create("input"));
            dojo.connect(this.cbo, "onChange", dojo.hitch(this, this._comboBoxChangeHandler));
            return this.cbo.domNode;
        },
        _comboBoxChangeHandler: function(newValue){
            //            if ("longitude,latitude".indexOf(newValue) != -1) {
            //                this.textInput.readonly = "readonly";
            //            }
            //            else 
            //                this.textInput.readonly = " ";
            this.textInput.value = this.graphic.attributes[newValue];
        },
        _createContentPane: function(){
            var pane = new dijit.layout.ContentPane({
                content: "<p>没有任何控件...</p>",
                style: "width:300px;height:180px;"
            }, dojo.create("div"));
            return pane;
        },
        _createTextInput: function(){
            this.textInput = dojo.create("input", {
                type: "text",
               
                style:{
                    float:"left"
                }
            });
            return this.textInput;
        },
        _createButton: function(label, func){
            var button = dojo.create("input", {
                type: "button",
                value: label,
                onclick: dojo.hitch(this, func)
            });
            return button;
        },
        _saveAttribute: function(){
            this.graphic.attributes[this.cbo.attr("value")] = this.textInput.value;
        },
        _deleteGraphic: function(){
            var result = window.confirm("是否删除该点？");
            if (!result) 
                return;
            this.map.graphics.remove(this.graphic);
            this.map.infoWindow.hide();
        },
        _getFieldStore: function(){
            var store;
            var items = [];
            for (field in this.graphic.attributes) {
                store = {};
                store["field"] = field;
                items.push(store);
            }
            return new dojo.data.ItemFileWriteStore({
                data: {
                    items: items,
                    identifier: "field",
                    label: "field"
                }
            });
        },
        getNode: function(){
            var div = dojo.create("div");
            var p1=dojo.create('p',{
                'class':"info_p"
            });
            dojo.create("span", {
                innerHTML: "属性字段:",
                style:{
                   float:"left"
                }
            },p1);
            p1.appendChild(this._createComboBox(this._getFieldStore(), "field"));
            div.appendChild(p1);
           // div.appendChild(this._createComboBox(this._getFieldStore(), "field"));
           var p2= div.appendChild(dojo.create("p",{
                'class':"info_p"
            }));
           dojo.create("span", {
                innerHTML: "属性值:",
                style:{
                   float:"left"
                }
            },p2);

            p2.appendChild(this._createTextInput());
            div.appendChild(p2);
           
           var p3=dojo.create("p",{
                'class':"info_p"
            });

            
            p3.appendChild(this._createButton("保存属性", this._saveAttribute));
            p3.appendChild(this._createButton("删除该点", this._deleteGraphic));
            div.appendChild(p3);
            var pane = this._createContentPane();
            pane.setContent(div);
            return pane.domNode;
        }
    });
}
