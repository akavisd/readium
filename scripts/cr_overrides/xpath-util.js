"use strict";
var rdr = rdr || {};
rdr.util = rdr.util || {};
rdr.util.client = {
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



    getXPathByNode2: function(b, a, doc) {
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
    },
    
    
    getXPathByNode1: function(b, a, doc) {
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
        
        for (d = e.length - 1; 0 <= d; d--){
            c = e[d]; 
            g +="/" + c.name; 
            null != c.position && (g += "[" + c.position + "]");
        }
        return g.slice(1)
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
                    c.name = b.nodeName
            }
            d = 1;
            var h = void 0;
            if (2 === b.nodeType)
                d = null;
            else
                for (h = b.previousSibling; h; h = h.previousSibling)
                    h.nodeName === 
                    b.nodeName && ++d;
            c.position = d
        }
        for (d = e.length - 1; 0 <= d; d--)
            c = e[d], g += "/" + c.name, null != c.position && (g += "[" + c.position + "]");
        return g.slice(1)
    },isLoadedImagesIn: rdr.isIE8 ? function(b) {
        var b = b.getElementsByTagName("img"), a;
        for (a = 0; a < b.length; a += 1)
            if (!b[a].complete || !b[a].height)
                return !1;
        return !0
    } : function(b) {
        var b = b.getElementsByTagName("img"), a;
        for (a = 0; a < b.length; a += 1)
            if (!b[a].naturalHeight)
                return !1;
        return !0
    },setStyleSheetRule: function(b, a, c) {
        var b = b.sheet ? b.sheet : b.styleSheet, e = b.cssRules ? b.cssRules : b.rules, 
        d;
        for (d = 0; d < e.length; d += 1)
            e[d].selectorText === a && (b.cssRules ? b.deleteRule(d) : b.removeRule(d));
        b.insertRule ? b.insertRule(a + "{" + c + "}", e.length) : b.addRule && b.addRule(a, c, e.length)
    },getBoundingClientRectOn: function(b, a) {
        var c, e, d;
        "deviceXDPI" in screen && b.collapse && !rdr.sys.isIE9mobile && (e = screen.deviceXDPI / screen.logicalXDPI);
        d = _.isElement(a) ? a.getBoundingClientRect() : a;
        c = b.getBoundingClientRect();
        if (!c)
            return {left: 0,right: 0,top: 0,bottom: 0,width: 0,height: 0};
        e && 1 !== e ? (c = {left: c.left / e - d.left,right: c.right / 
            e - d.left,top: c.top / e - d.top,bottom: c.bottom / e - d.top}, c.width = c.right - c.left, c.height = c.bottom - c.top) : c = {left: c.left - d.left,right: c.right - d.left,top: c.top - d.top,bottom: c.bottom - d.top,width: void 0 === c.width ? c.right - c.left : c.width,height: void 0 === c.height ? c.bottom - c.top : c.height};
        return c
    },getClientRectsOn: function(b, a) {
        var c, e, d, g, h, i = [];
        "deviceXDPI" in screen && b.collapse && !rdr.sys.isIE9mobile && (e = screen.deviceXDPI / screen.logicalXDPI);
        g = _.isElement(a) ? a.getBoundingClientRect() : a;
        c = b.getClientRects();
        for (d = 0; d < c.length; d += 1) {
            if (navigator.userAgent && 0 < navigator.userAgent.indexOf("AppleWebKit")) {
                if (d < c.length - 1 && c[d].left <= c[d + 1].left && c[d].top <= c[d + 1].top && c[d].right >= c[d + 1].right && c[d].bottom >= c[d + 1].bottom)
                    continue;
                if (d === c.length - 1 && 0 < d && 0 === b.endOffset && c[d].height >= c[d - 1].height && c[d].width >= c[d - 1].width)
                    continue
            }
            e && 1 !== e ? (h = {left: c[d].left / e - g.left,right: c[d].right / e - g.left,top: c[d].top / e - g.top,bottom: c[d].bottom / e - g.top}, h.width = h.right - h.left, h.height = h.bottom - h.top, i.push(h)) : i.push({left: c[d].left - 
                g.left,right: c[d].right - g.left,top: c[d].top - g.top,bottom: c[d].bottom - g.top,width: c[d].width || c[d].right - c[d].left,height: c[d].height || c[d].bottom - c[d].top})
        }
        0 === c.length && (i[0] = {left: 0,right: 0,top: 0,bottom: 0,width: 0,height: 0});
        return i
    },wrapText: function(b) {
        var a = document.createElement("span");
        b.parentNode.insertBefore(a, b);
        a.appendChild(b);
        return a
    },unwrapText: function(b) {
        var a = b.parentNode, c = b.firstChild;
        a.insertBefore(c, b);
        a.removeChild(b);
        return c
    },rangeToString: function(b) {
        var b = b.cloneContents(), 
        a = "", a = document.createElement("div");
        a.appendChild(b);
        a = a.innerHTML;
        return a = a.replace(/<\/p>\s*<p/ig, "<p>\n<p").replace(/\s*<br[^>]*>\s*/ig, "\n").replace(/<[\s\S]+?>/g, "")
    },rangeToString8: function(b) {
        var a = "", a = b.htmlText;
        return a = a.replace(/<\/p>\s*<p/ig, "<p>\n<p").replace(/\s*<br[^>]*>\s*/ig, "\n").replace(/<[\s\S]+?>/g, "").replace(/\r\n/g, "")
    },createTextRange8: function(b, a, c, e) {
        var d = document.body.createTextRange(), g = document.body.createTextRange();
        if (3 === b.nodeType) {
            if (b.previousSibling ? (g.moveToElementText(b.previousSibling), 
            d.setEndPoint("StartToEnd", g)) : d.moveToElementText(b.parentNode), d.moveStart("character", 1), d.moveStart("character", -1), d.moveStart("character", a), d.collapse(!0), b === c)
                return d.moveEnd("character", e - a), d
        } else
            a ? (b = b.childNodes[a - 1], 3 === b.nodeType ? b.nextSibling ? (g.moveToElementText(b.nextSibling), d.setEndPoint("StartToStart", g)) : (g.moveToElementText(b.parentNode), d.setEndPoint("StartToEnd", g)) : (d.moveToElementText(b), d.setEndPoint("StartToEnd", g))) : d.moveToElementText(b);
        3 === c.nodeType ? (c.previousSibling ? 
        (g.moveToElementText(c.previousSibling), d.setEndPoint("EndToEnd", g)) : (g.moveToElementText(c.parentNode), d.setEndPoint("EndToStart", g)), d.moveEnd("character", e)) : (b = c.childNodes[e - 1], e ? 3 === b.nodeType ? b.nextSibling ? (g.moveToElementText(b.nextSibling), d.setEndPoint("EndToStart", g)) : (g.moveToElementText(b.parentNode), d.setEndPoint("EndToEnd", g)) : (g.moveToElementText(b), d.setEndPoint("EndToEnd", g)) : (g.moveToElementText(c), d.setEndPoint("EndToStart", g)));
        return d
    }};