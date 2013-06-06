"use strict";
var xPathUtil = {
	getNodeByXPath: function(doc) {
        return doc.evaluate ? function(b, a) {
            var c, a = a || doc;
            if (!b || "." === b)
                return a;
            try {
                c = doc.evaluate(b, a, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
            } catch (e) {
                c = null, console.error("getNodeByXPath document.evaluate error")
            }
            return c
        } : function(b, a) {
            var c, e, d, g, h, i, l, a = a || doc;
            if (!b || "." === b)
                return a;
            c = b.split("/");
            for (i = 0; i < c.length; i += 1)
                if (e = c[i].split("["), d = e[0], e = parseInt(e[1], 10) || 1, g = 0, "text()" === d) {
                    h = a.childNodes;
                    for (l = 0; l < 
                    h.length; l += 1)
                        if (3 === h[l].nodeType && (g += 1, g === e))
                            return h[l]
                } else {
                    h = a.children;
                    for (l = 0; l < h.length; l += 1)
                        if (h[l].nodeName === d.toUpperCase() && (g += 1, g === e)) {
                            a = h[l];
                            break
                        }
                }
            return a
        }
    },


    getXPathByNode: function(b, a, doc) {
        var c, e = [], d, g = "", a = a || doc;
        if (!b.parentNode)
            return "/";
        if (b === a)
            return ".";
        for (; b && b !== a && b.parentNode; b = b.parentNode) {
            c = e[e.length] = {};

            switch (b.nodeType) {
                case 3:
                    c.name = "text()";
                    break;
                case 1:
                    //c.name = b.nodeName
                    c.name = "*";//b.nodeName
            }
  
            d = 1;
            var h = void 0;
            if (2 === b.nodeType){
                d = null;
            }else{
                for (h = b.previousSibling; h; h = h.previousSibling){
                	if (b.parentElement){
                		if ((b.nodeType === 3) == (h.nodeType === 3)){
                			 ++d;
                		}
                	}
                
                    /*h.nodeName === b.nodeName && ++d;*/
                 }
            }        
            c.position = d;// (b.nodeType !== 3)? d :0 
        }
        var arrPath = [];
        
        for (d = e.length - 1; 0 <= d; d--){
            c = e[d]; 
            g +="/" + c.name; 
            null != c.position && (g += "[" + c.position + "]");
            
            arrPath.push(c.position);
        }
        return {xPath:g.slice(1), arrPath:arrPath};
    }
    
};