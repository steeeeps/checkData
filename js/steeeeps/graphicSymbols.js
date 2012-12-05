
if (!dojo._hasResource["steeeeps.graphicSymbols"]) {
    dojo._hasResource["steeeeps.graphicSymbols"] = true;
    
    dojo.provide("steeeeps.graphicSymbols");
    dojo.declare("steeeeps.GraphicSymbols", null, {
        constructor: function(){
        }
    });
    dojo.mixin(steeeeps.GraphicSymbols, {
        getDefaultSymbol: function(){
            return new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 0, 0, 1]));
        },
        getSelectedSymbol: function(){
            return new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 15, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([75, 231, 123, 1]));
        }
    });
}

