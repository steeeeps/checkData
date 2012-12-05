
if (!dojo._hasResource["steeeeps.dragTitlePane"]) {
    dojo._hasResource["steeeeps.dragTitlePane"] = true;
    dojo.provide("steeeeps.dragTitlePane");
    dojo.require("dijit._Widget");
    dojo.require("dijit._Templated");
    dojo.require("dijit.TitlePane");
    dojo.require("dojo.dnd.Moveable");
    
    dojo.declare("steeeeps.DragTitlePane", [dijit._Widget, dijit._Templated], {
        title: "",
        params: null,
        wipeIn: null,
        wipeOut: null,
        open: true,
        duration: dijit.defaultDuration,
        templateString: dojo.cache("steeeeps", "template/dragTitlePane.html"),
        constructor: function(params, srcNode){
            this.params = params;
        },
        postCreate: function(){
            this.inherited(arguments);
            var hideNode = this.hideNode;
            var wipeNode = this.wipeNode;
            this.wipeIn = dojo.fx.wipeIn({
                node: this.wipeNode,
                duration: this.duration,
                beforeBegin: function(){
                    hideNode.style.display = "";
                }
            });
            this.wipeOut = dojo.fx.wipeOut({
                node: this.wipeNode,
                duration: this.duration,
                onEnd: function(){
                    hideNode.style.display = "none";
                }
            });
            this.setTitle(this.params.title);
            this._setMoveable();
            this._setDefaultPosi();
        },
        _setDefaultPosi: function(){
            this.setAttr("style", "position:absolute;left:" + steeeeps.Config.paneDefaultCoord.x + ";top:" + steeeeps.Config.paneDefaultCoord.y + ";");
        },
        _arrowNodeClickHandler: function(){
            this.open = !this.open;
            this._changeOpenAttr();
        },
        _closeNodeClickHandler: function(){
            this.destroy();
        },
        _changeOpenAttr: function(){
            dojo.forEach([this.wipeIn, this.wipeOut], function(op){
                if (op && op.status() == "playing") {
                    op.stop();
                }
            });
            var play = this[this.open ? "wipeIn" : "wipeOut"];
            play.play();
        },
        _setMoveable: function(){
            var dnd = new dojo.dnd.Moveable(this.domNode);
        },
        setTitle: function(title){
            this.title = title;
            this.titleNode.innerHTML = title;
        },
        setContent: function(content){
            this.containerNode.appendChild(content);
        },
        setAttr: function(attr, value){
            dojo.attr(this.domNode, attr, value);
        },
        setStyle: function(style, value){
            if (arguments.length == 1 && typeof(arguments[0] == "object")) {
                dojo.style(this.domNode, arguments[0])
            }
            else 
                if (arguments.length == 2) {
                    dojo.style(this.domNode, arguments[0], arguments[1]);
                }
        }
    });
}
