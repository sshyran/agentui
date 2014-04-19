(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { }
$hxClasses["DateTools"] = DateTools;
DateTools.__name__ = ["DateTools"];
DateTools.__format_get = function(d,e) {
	return (function($this) {
		var $r;
		switch(e) {
		case "%":
			$r = "%";
			break;
		case "C":
			$r = StringTools.lpad(Std.string(d.getFullYear() / 100 | 0),"0",2);
			break;
		case "d":
			$r = StringTools.lpad(Std.string(d.getDate()),"0",2);
			break;
		case "D":
			$r = DateTools.__format(d,"%m/%d/%y");
			break;
		case "e":
			$r = Std.string(d.getDate());
			break;
		case "H":case "k":
			$r = StringTools.lpad(Std.string(d.getHours()),e == "H"?"0":" ",2);
			break;
		case "I":case "l":
			$r = (function($this) {
				var $r;
				var hour = d.getHours() % 12;
				$r = StringTools.lpad(Std.string(hour == 0?12:hour),e == "I"?"0":" ",2);
				return $r;
			}($this));
			break;
		case "m":
			$r = StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
			break;
		case "M":
			$r = StringTools.lpad(Std.string(d.getMinutes()),"0",2);
			break;
		case "n":
			$r = "\n";
			break;
		case "p":
			$r = d.getHours() > 11?"PM":"AM";
			break;
		case "r":
			$r = DateTools.__format(d,"%I:%M:%S %p");
			break;
		case "R":
			$r = DateTools.__format(d,"%H:%M");
			break;
		case "s":
			$r = Std.string(d.getTime() / 1000 | 0);
			break;
		case "S":
			$r = StringTools.lpad(Std.string(d.getSeconds()),"0",2);
			break;
		case "t":
			$r = "\t";
			break;
		case "T":
			$r = DateTools.__format(d,"%H:%M:%S");
			break;
		case "u":
			$r = (function($this) {
				var $r;
				var t = d.getDay();
				$r = t == 0?"7":Std.string(t);
				return $r;
			}($this));
			break;
		case "w":
			$r = Std.string(d.getDay());
			break;
		case "y":
			$r = StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
			break;
		case "Y":
			$r = Std.string(d.getFullYear());
			break;
		default:
			$r = (function($this) {
				var $r;
				throw "Date.format %" + e + "- not implemented yet.";
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
DateTools.__format = function(d,f) {
	var r = new StringBuf();
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) break;
		r.addSub(f,p,np - p);
		r.b += Std.string(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	r.addSub(f,p,f.length - p);
	return r.b;
}
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += "{";
		while(l != null) {
			if(first) first = false; else s.b += ", ";
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += "}";
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.random = function(x) {
	return x <= 0?0:Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	return quotes?s.split("\"").join("&quot;").split("'").join("&#039;"):s;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var XmlType = $hxClasses["XmlType"] = { __ename__ : ["XmlType"], __constructs__ : [] }
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
}
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	toString: function() {
		if(this.nodeType == Xml.PCData) return StringTools.htmlEscape(this._nodeValue);
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.ProcessingInstruction) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += "<";
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += " ";
				s.b += Std.string(k);
				s.b += "=\"";
				s.b += Std.string(this._attributes.get(k));
				s.b += "\"";
			}
			if(this._children.length == 0) {
				s.b += "/>";
				return s.b;
			}
			s.b += ">";
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += "</";
			s.b += Std.string(this._nodeName);
			s.b += ">";
		}
		return s.b;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get_nodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,__class__: Xml
}
var haxe = {}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.CallStack = function() { }
$hxClasses["haxe.CallStack"] = haxe.CallStack;
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.CallStack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
haxe.Json = function() {
};
$hxClasses["haxe.Json"] = haxe.Json;
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.stringify = function(value,replacer) {
	return new haxe.Json().toString(value,replacer);
}
haxe.Json.prototype = {
	quote: function(s) {
		this.buf.b += "\"";
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += "\\\"";
				break;
			case 92:
				this.buf.b += "\\\\";
				break;
			case 10:
				this.buf.b += "\\n";
				break;
			case 13:
				this.buf.b += "\\r";
				break;
			case 9:
				this.buf.b += "\\t";
				break;
			case 8:
				this.buf.b += "\\b";
				break;
			case 12:
				this.buf.b += "\\f";
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += "\"";
	}
	,toStringRec: function(k,v) {
		if(this.replacer != null) v = this.replacer(k,v);
		var _g = Type["typeof"](v);
		var $e = (_g);
		switch( $e[1] ) {
		case 8:
			this.buf.b += "\"???\"";
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
			var v1 = v;
			this.buf.b += Std.string(v1);
			break;
		case 2:
			this.buf.b += Std.string(Math.isFinite(v)?v:"null");
			break;
		case 5:
			this.buf.b += "\"<fun>\"";
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.b += "[";
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(0,v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.b += ",";
						this.toStringRec(i,v1[i++]);
					}
				}
				this.buf.b += "]";
			} else if(c == haxe.ds.StringMap) {
				var v1 = v;
				var o = { };
				var $it0 = v1.keys();
				while( $it0.hasNext() ) {
					var k1 = $it0.next();
					o[k1] = v1.get(k1);
				}
				this.objString(o);
			} else this.objString(v);
			break;
		case 7:
			var i = Type.enumIndex(v);
			var v1 = i;
			this.buf.b += Std.string(v1);
			break;
		case 3:
			var v1 = v;
			this.buf.b += Std.string(v1);
			break;
		case 0:
			this.buf.b += "null";
			break;
		}
	}
	,objString: function(v) {
		this.fieldsString(v,Reflect.fields(v));
	}
	,fieldsString: function(v,fields) {
		var first = true;
		this.buf.b += "{";
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.b += ",";
			this.quote(f);
			this.buf.b += ":";
			this.toStringRec(f,value);
		}
		this.buf.b += "}";
	}
	,toString: function(v,replacer) {
		this.buf = new StringBuf();
		this.replacer = replacer;
		this.toStringRec("",v);
		return this.buf.b;
	}
	,__class__: haxe.Json
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.prototype = {
	run: function() {
		console.log("run");
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,__class__: haxe.Timer
}
haxe.ds = {}
haxe.ds.BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe.ds.BalancedTree;
haxe.ds.BalancedTree.__name__ = ["haxe","ds","BalancedTree"];
haxe.ds.BalancedTree.prototype = {
	compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,balance: function(l,k,v,r) {
		var hl = l == null?0:l._height;
		var hr = r == null?0:r._height;
		return hl > hr + 2?(function($this) {
			var $r;
			var _this = l.left;
			$r = _this == null?0:_this._height;
			return $r;
		}(this)) >= (function($this) {
			var $r;
			var _this = l.right;
			$r = _this == null?0:_this._height;
			return $r;
		}(this))?new haxe.ds.TreeNode(l.left,l.key,l.value,new haxe.ds.TreeNode(l.right,k,v,r)):new haxe.ds.TreeNode(new haxe.ds.TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe.ds.TreeNode(l.right.right,k,v,r)):hr > hl + 2?(function($this) {
			var $r;
			var _this = r.right;
			$r = _this == null?0:_this._height;
			return $r;
		}(this)) > (function($this) {
			var $r;
			var _this = r.left;
			$r = _this == null?0:_this._height;
			return $r;
		}(this))?new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left),r.key,r.value,r.right):new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe.ds.TreeNode(r.left.right,r.key,r.value,r.right)):new haxe.ds.TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe.ds.TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		return c == 0?new haxe.ds.TreeNode(node.left,k,v,node.right,node == null?0:node._height):c < 0?(function($this) {
			var $r;
			var nl = $this.setLoop(k,v,node.left);
			$r = $this.balance(nl,node.key,node.value,node.right);
			return $r;
		}(this)):(function($this) {
			var $r;
			var nr = $this.setLoop(k,v,node.right);
			$r = $this.balance(node.left,node.key,node.value,nr);
			return $r;
		}(this));
	}
	,get: function(k) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(k,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,set: function(k,v) {
		this.root = this.setLoop(k,v,this.root);
	}
	,__class__: haxe.ds.BalancedTree
}
haxe.ds.TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this = $this.right;
		$r = _this == null?0:_this._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this = $this.right;
		$r = _this == null?0:_this._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
$hxClasses["haxe.ds.TreeNode"] = haxe.ds.TreeNode;
haxe.ds.TreeNode.__name__ = ["haxe","ds","TreeNode"];
haxe.ds.TreeNode.prototype = {
	__class__: haxe.ds.TreeNode
}
haxe.ds.EnumValueMap = function() {
	haxe.ds.BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe.ds.EnumValueMap;
haxe.ds.EnumValueMap.__name__ = ["haxe","ds","EnumValueMap"];
haxe.ds.EnumValueMap.__interfaces__ = [IMap];
haxe.ds.EnumValueMap.__super__ = haxe.ds.BalancedTree;
haxe.ds.EnumValueMap.prototype = $extend(haxe.ds.BalancedTree.prototype,{
	compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0, _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var v1 = a1[i], v2 = a2[i];
			var d = Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)?this.compare(v1,v2):Reflect.compare(v1,v2);
			if(d != 0) return d;
		}
		return 0;
	}
	,compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,__class__: haxe.ds.EnumValueMap
});
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += " => ";
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
haxe.macro = {}
haxe.macro.Constant = $hxClasses["haxe.macro.Constant"] = { __ename__ : ["haxe","macro","Constant"], __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] }
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : ["haxe","macro","Binop"], __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] }
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; }
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.toString = $estr;
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
haxe.macro.Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : ["haxe","macro","Unop"], __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] }
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.ExprDef = $hxClasses["haxe.macro.ExprDef"] = { __ename__ : ["haxe","macro","ExprDef"], __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EMeta"] }
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.toString = $estr;
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.toString = $estr;
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EMeta = function(s,e) { var $x = ["EMeta",29,s,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ComplexType = $hxClasses["haxe.macro.ComplexType"] = { __ename__ : ["haxe","macro","ComplexType"], __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] }
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.TypeParam = $hxClasses["haxe.macro.TypeParam"] = { __ename__ : ["haxe","macro","TypeParam"], __constructs__ : ["TPType","TPExpr"] }
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.rtti = {}
haxe.rtti.CType = $hxClasses["haxe.rtti.CType"] = { __ename__ : ["haxe","rtti","CType"], __constructs__ : ["CUnknown","CEnum","CClass","CTypedef","CFunction","CAnonymous","CDynamic","CAbstract"] }
haxe.rtti.CType.CUnknown = ["CUnknown",0];
haxe.rtti.CType.CUnknown.toString = $estr;
haxe.rtti.CType.CUnknown.__enum__ = haxe.rtti.CType;
haxe.rtti.CType.CEnum = function(name,params) { var $x = ["CEnum",1,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CClass = function(name,params) { var $x = ["CClass",2,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CTypedef = function(name,params) { var $x = ["CTypedef",3,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CFunction = function(args,ret) { var $x = ["CFunction",4,args,ret]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CAnonymous = function(fields) { var $x = ["CAnonymous",5,fields]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CDynamic = function(t) { var $x = ["CDynamic",6,t]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CAbstract = function(name,params) { var $x = ["CAbstract",7,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.Rights = $hxClasses["haxe.rtti.Rights"] = { __ename__ : ["haxe","rtti","Rights"], __constructs__ : ["RNormal","RNo","RCall","RMethod","RDynamic","RInline"] }
haxe.rtti.Rights.RNormal = ["RNormal",0];
haxe.rtti.Rights.RNormal.toString = $estr;
haxe.rtti.Rights.RNormal.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RNo = ["RNo",1];
haxe.rtti.Rights.RNo.toString = $estr;
haxe.rtti.Rights.RNo.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RCall = function(m) { var $x = ["RCall",2,m]; $x.__enum__ = haxe.rtti.Rights; $x.toString = $estr; return $x; }
haxe.rtti.Rights.RMethod = ["RMethod",3];
haxe.rtti.Rights.RMethod.toString = $estr;
haxe.rtti.Rights.RMethod.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RDynamic = ["RDynamic",4];
haxe.rtti.Rights.RDynamic.toString = $estr;
haxe.rtti.Rights.RDynamic.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RInline = ["RInline",5];
haxe.rtti.Rights.RInline.toString = $estr;
haxe.rtti.Rights.RInline.__enum__ = haxe.rtti.Rights;
haxe.rtti.TypeTree = $hxClasses["haxe.rtti.TypeTree"] = { __ename__ : ["haxe","rtti","TypeTree"], __constructs__ : ["TPackage","TClassdecl","TEnumdecl","TTypedecl","TAbstractdecl"] }
haxe.rtti.TypeTree.TPackage = function(name,full,subs) { var $x = ["TPackage",0,name,full,subs]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TClassdecl = function(c) { var $x = ["TClassdecl",1,c]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TEnumdecl = function(e) { var $x = ["TEnumdecl",2,e]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TTypedecl = function(t) { var $x = ["TTypedecl",3,t]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TAbstractdecl = function(a) { var $x = ["TAbstractdecl",4,a]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.XmlParser = function() {
	this.root = new Array();
};
$hxClasses["haxe.rtti.XmlParser"] = haxe.rtti.XmlParser;
haxe.rtti.XmlParser.__name__ = ["haxe","rtti","XmlParser"];
haxe.rtti.XmlParser.prototype = {
	defplat: function() {
		var l = new List();
		if(this.curplatform != null) l.add(this.curplatform);
		return l;
	}
	,xtypeparams: function(x) {
		var p = new List();
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			p.add(this.xtype(c));
		}
		return p;
	}
	,xtype: function(x) {
		return (function($this) {
			var $r;
			var _g = x.get_name();
			$r = (function($this) {
				var $r;
				switch(_g) {
				case "unknown":
					$r = haxe.rtti.CType.CUnknown;
					break;
				case "e":
					$r = haxe.rtti.CType.CEnum($this.mkPath(x.att.resolve("path")),$this.xtypeparams(x));
					break;
				case "c":
					$r = haxe.rtti.CType.CClass($this.mkPath(x.att.resolve("path")),$this.xtypeparams(x));
					break;
				case "t":
					$r = haxe.rtti.CType.CTypedef($this.mkPath(x.att.resolve("path")),$this.xtypeparams(x));
					break;
				case "x":
					$r = haxe.rtti.CType.CAbstract($this.mkPath(x.att.resolve("path")),$this.xtypeparams(x));
					break;
				case "f":
					$r = (function($this) {
						var $r;
						var args = new List();
						var aname = x.att.resolve("a").split(":");
						var eargs = HxOverrides.iter(aname);
						var $it0 = x.get_elements();
						while( $it0.hasNext() ) {
							var e = $it0.next();
							var opt = false;
							var a = eargs.next();
							if(a == null) a = "";
							if(a.charAt(0) == "?") {
								opt = true;
								a = HxOverrides.substr(a,1,null);
							}
							args.add({ name : a, opt : opt, t : $this.xtype(e)});
						}
						var ret = args.last();
						args.remove(ret);
						$r = haxe.rtti.CType.CFunction(args,ret.t);
						return $r;
					}($this));
					break;
				case "a":
					$r = (function($this) {
						var $r;
						var fields = new List();
						var $it1 = x.get_elements();
						while( $it1.hasNext() ) {
							var f = $it1.next();
							var f1 = $this.xclassfield(f,true);
							f1.platforms = new List();
							fields.add(f1);
						}
						$r = haxe.rtti.CType.CAnonymous(fields);
						return $r;
					}($this));
					break;
				case "d":
					$r = (function($this) {
						var $r;
						var t = null;
						var tx = x.x.firstElement();
						if(tx != null) t = $this.xtype(new haxe.xml.Fast(tx));
						$r = haxe.rtti.CType.CDynamic(t);
						return $r;
					}($this));
					break;
				default:
					$r = $this.xerror(x);
				}
				return $r;
			}($this));
			return $r;
		}(this));
	}
	,xtypedef: function(x) {
		var doc = null;
		var t = null;
		var meta = [];
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			if(c.get_name() == "haxe_doc") doc = c.get_innerData(); else if(c.get_name() == "meta") meta = this.xmeta(c); else t = this.xtype(c);
		}
		var types = new haxe.ds.StringMap();
		if(this.curplatform != null) types.set(this.curplatform,t);
		return { file : x.has.resolve("file")?x.att.resolve("file"):null, path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), params : this.mkTypeParams(x.att.resolve("params")), type : t, types : types, platforms : this.defplat(), meta : meta};
	}
	,xabstract: function(x) {
		var doc = null;
		var meta = [], subs = [], supers = [];
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			var _g = c.get_name();
			switch(_g) {
			case "haxe_doc":
				doc = c.get_innerData();
				break;
			case "meta":
				meta = this.xmeta(c);
				break;
			case "to":
				var $it1 = c.get_elements();
				while( $it1.hasNext() ) {
					var t = $it1.next();
					subs.push(this.xtype(t));
				}
				break;
			case "from":
				var $it2 = c.get_elements();
				while( $it2.hasNext() ) {
					var t = $it2.next();
					supers.push(this.xtype(t));
				}
				break;
			default:
				this.xerror(c);
			}
		}
		return { file : x.has.resolve("file")?x.att.resolve("file"):null, path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), params : this.mkTypeParams(x.att.resolve("params")), platforms : this.defplat(), meta : meta, subs : subs, supers : supers};
	}
	,xenumfield: function(x) {
		var args = null;
		var xdoc = x.x.elementsNamed("haxe_doc").next();
		var meta = x.hasNode.resolve("meta")?this.xmeta(x.node.resolve("meta")):[];
		if(x.has.resolve("a")) {
			var names = x.att.resolve("a").split(":");
			var elts = x.get_elements();
			args = new List();
			var _g = 0;
			while(_g < names.length) {
				var c = names[_g];
				++_g;
				var opt = false;
				if(c.charAt(0) == "?") {
					opt = true;
					c = HxOverrides.substr(c,1,null);
				}
				args.add({ name : c, opt : opt, t : this.xtype(elts.next())});
			}
		}
		return { name : x.get_name(), args : args, doc : xdoc == null?null:new haxe.xml.Fast(xdoc).get_innerData(), meta : meta, platforms : this.defplat()};
	}
	,xenum: function(x) {
		var cl = new List();
		var doc = null;
		var meta = [];
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			if(c.get_name() == "haxe_doc") doc = c.get_innerData(); else if(c.get_name() == "meta") meta = this.xmeta(c); else cl.add(this.xenumfield(c));
		}
		return { file : x.has.resolve("file")?x.att.resolve("file"):null, path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), isExtern : x.x.exists("extern"), params : this.mkTypeParams(x.att.resolve("params")), constructors : cl, platforms : this.defplat(), meta : meta};
	}
	,xclassfield: function(x,defPublic) {
		var e = x.get_elements();
		var t = this.xtype(e.next());
		var doc = null;
		var meta = [];
		while( e.hasNext() ) {
			var c = e.next();
			var _g = c.get_name();
			switch(_g) {
			case "haxe_doc":
				doc = c.get_innerData();
				break;
			case "meta":
				meta = this.xmeta(c);
				break;
			default:
				this.xerror(c);
			}
		}
		return { name : x.get_name(), type : t, isPublic : x.x.exists("public") || defPublic, isOverride : x.x.exists("override"), line : x.has.resolve("line")?Std.parseInt(x.att.resolve("line")):null, doc : doc, get : x.has.resolve("get")?this.mkRights(x.att.resolve("get")):haxe.rtti.Rights.RNormal, set : x.has.resolve("set")?this.mkRights(x.att.resolve("set")):haxe.rtti.Rights.RNormal, params : x.has.resolve("params")?this.mkTypeParams(x.att.resolve("params")):null, platforms : this.defplat(), meta : meta};
	}
	,xclass: function(x) {
		var csuper = null;
		var doc = null;
		var tdynamic = null;
		var interfaces = new List();
		var fields = new List();
		var statics = new List();
		var meta = [];
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			var _g = c.get_name();
			switch(_g) {
			case "haxe_doc":
				doc = c.get_innerData();
				break;
			case "extends":
				csuper = this.xpath(c);
				break;
			case "implements":
				interfaces.add(this.xpath(c));
				break;
			case "haxe_dynamic":
				tdynamic = this.xtype(new haxe.xml.Fast(c.x.firstElement()));
				break;
			case "meta":
				meta = this.xmeta(c);
				break;
			default:
				if(c.x.exists("static")) statics.add(this.xclassfield(c)); else fields.add(this.xclassfield(c));
			}
		}
		return { file : x.has.resolve("file")?x.att.resolve("file"):null, path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), isExtern : x.x.exists("extern"), isInterface : x.x.exists("interface"), params : this.mkTypeParams(x.att.resolve("params")), superClass : csuper, interfaces : interfaces, fields : fields, statics : statics, tdynamic : tdynamic, platforms : this.defplat(), meta : meta};
	}
	,xpath: function(x) {
		var path = this.mkPath(x.att.resolve("path"));
		var params = new List();
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			params.add(this.xtype(c));
		}
		return { path : path, params : params};
	}
	,xmeta: function(x) {
		var ml = [];
		var $it0 = x.nodes.resolve("m").iterator();
		while( $it0.hasNext() ) {
			var m = $it0.next();
			var pl = [];
			var $it1 = m.nodes.resolve("e").iterator();
			while( $it1.hasNext() ) {
				var p = $it1.next();
				pl.push(p.get_innerHTML());
			}
			ml.push({ name : m.att.resolve("n"), params : pl});
		}
		return ml;
	}
	,processElement: function(x) {
		var c = new haxe.xml.Fast(x);
		return (function($this) {
			var $r;
			var _g = c.get_name();
			$r = (function($this) {
				var $r;
				switch(_g) {
				case "class":
					$r = haxe.rtti.TypeTree.TClassdecl($this.xclass(c));
					break;
				case "enum":
					$r = haxe.rtti.TypeTree.TEnumdecl($this.xenum(c));
					break;
				case "typedef":
					$r = haxe.rtti.TypeTree.TTypedecl($this.xtypedef(c));
					break;
				case "abstract":
					$r = haxe.rtti.TypeTree.TAbstractdecl($this.xabstract(c));
					break;
				default:
					$r = $this.xerror(c);
				}
				return $r;
			}($this));
			return $r;
		}(this));
	}
	,xerror: function(c) {
		return (function($this) {
			var $r;
			throw "Invalid " + c.get_name();
			return $r;
		}(this));
	}
	,mkRights: function(r) {
		return (function($this) {
			var $r;
			switch(r) {
			case "null":
				$r = haxe.rtti.Rights.RNo;
				break;
			case "method":
				$r = haxe.rtti.Rights.RMethod;
				break;
			case "dynamic":
				$r = haxe.rtti.Rights.RDynamic;
				break;
			case "inline":
				$r = haxe.rtti.Rights.RInline;
				break;
			default:
				$r = haxe.rtti.Rights.RCall(r);
			}
			return $r;
		}(this));
	}
	,mkTypeParams: function(p) {
		var pl = p.split(":");
		if(pl[0] == "") return new Array();
		return pl;
	}
	,mkPath: function(p) {
		return p;
	}
	,__class__: haxe.rtti.XmlParser
}
haxe.xml = {}
haxe.xml._Fast = {}
haxe.xml._Fast.NodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeAccess"] = haxe.xml._Fast.NodeAccess;
haxe.xml._Fast.NodeAccess.__name__ = ["haxe","xml","_Fast","NodeAccess"];
haxe.xml._Fast.NodeAccess.prototype = {
	resolve: function(name) {
		var x = this.__x.elementsNamed(name).next();
		if(x == null) {
			var xname = this.__x.nodeType == Xml.Document?"Document":this.__x.get_nodeName();
			throw xname + " is missing element " + name;
		}
		return new haxe.xml.Fast(x);
	}
	,__class__: haxe.xml._Fast.NodeAccess
}
haxe.xml._Fast.AttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.AttribAccess"] = haxe.xml._Fast.AttribAccess;
haxe.xml._Fast.AttribAccess.__name__ = ["haxe","xml","_Fast","AttribAccess"];
haxe.xml._Fast.AttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		var v = this.__x.get(name);
		if(v == null) throw this.__x.get_nodeName() + " is missing attribute " + name;
		return v;
	}
	,__class__: haxe.xml._Fast.AttribAccess
}
haxe.xml._Fast.HasAttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasAttribAccess"] = haxe.xml._Fast.HasAttribAccess;
haxe.xml._Fast.HasAttribAccess.__name__ = ["haxe","xml","_Fast","HasAttribAccess"];
haxe.xml._Fast.HasAttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		return this.__x.exists(name);
	}
	,__class__: haxe.xml._Fast.HasAttribAccess
}
haxe.xml._Fast.HasNodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasNodeAccess"] = haxe.xml._Fast.HasNodeAccess;
haxe.xml._Fast.HasNodeAccess.__name__ = ["haxe","xml","_Fast","HasNodeAccess"];
haxe.xml._Fast.HasNodeAccess.prototype = {
	resolve: function(name) {
		return this.__x.elementsNamed(name).hasNext();
	}
	,__class__: haxe.xml._Fast.HasNodeAccess
}
haxe.xml._Fast.NodeListAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeListAccess"] = haxe.xml._Fast.NodeListAccess;
haxe.xml._Fast.NodeListAccess.__name__ = ["haxe","xml","_Fast","NodeListAccess"];
haxe.xml._Fast.NodeListAccess.prototype = {
	resolve: function(name) {
		var l = new List();
		var $it0 = this.__x.elementsNamed(name);
		while( $it0.hasNext() ) {
			var x = $it0.next();
			l.add(new haxe.xml.Fast(x));
		}
		return l;
	}
	,__class__: haxe.xml._Fast.NodeListAccess
}
haxe.xml.Fast = function(x) {
	if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) throw "Invalid nodeType " + Std.string(x.nodeType);
	this.x = x;
	this.node = new haxe.xml._Fast.NodeAccess(x);
	this.nodes = new haxe.xml._Fast.NodeListAccess(x);
	this.att = new haxe.xml._Fast.AttribAccess(x);
	this.has = new haxe.xml._Fast.HasAttribAccess(x);
	this.hasNode = new haxe.xml._Fast.HasNodeAccess(x);
};
$hxClasses["haxe.xml.Fast"] = haxe.xml.Fast;
haxe.xml.Fast.__name__ = ["haxe","xml","Fast"];
haxe.xml.Fast.prototype = {
	get_elements: function() {
		var it = this.x.elements();
		return { hasNext : $bind(it,it.hasNext), next : function() {
			var x = it.next();
			if(x == null) return null;
			return new haxe.xml.Fast(x);
		}};
	}
	,get_innerHTML: function() {
		var s = new StringBuf();
		var $it0 = this.x.iterator();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			s.b += Std.string(x.toString());
		}
		return s.b;
	}
	,get_innerData: function() {
		var it = this.x.iterator();
		if(!it.hasNext()) throw this.get_name() + " does not have data";
		var v = it.next();
		var n = it.next();
		if(n != null) {
			if(v.nodeType == Xml.PCData && n.nodeType == Xml.CData && StringTools.trim(v.get_nodeValue()) == "") {
				var n2 = it.next();
				if(n2 == null || n2.nodeType == Xml.PCData && StringTools.trim(n2.get_nodeValue()) == "" && it.next() == null) return n.get_nodeValue();
			}
			throw this.get_name() + " does not only have data";
		}
		if(v.nodeType != Xml.PCData && v.nodeType != Xml.CData) throw this.get_name() + " does not have data";
		return v.get_nodeValue();
	}
	,get_name: function() {
		return this.x.nodeType == Xml.Document?"Document":this.x.get_nodeName();
	}
	,__class__: haxe.xml.Fast
}
haxe.xml.Parser = function() { }
$hxClasses["haxe.xml.Parser"] = haxe.xml.Parser;
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i = s.charCodeAt(1) == 120?Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)):Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.b += Std.string(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.b += Std.string(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
js.d3 = {}
js.d3._D3 = {}
js.d3._D3.InitPriority = function() { }
$hxClasses["js.d3._D3.InitPriority"] = js.d3._D3.InitPriority;
js.d3._D3.InitPriority.__name__ = ["js","d3","_D3","InitPriority"];
var m3 = {}
m3.CrossMojo = function() { }
$hxClasses["m3.CrossMojo"] = m3.CrossMojo;
m3.CrossMojo.__name__ = ["m3","CrossMojo"];
m3.CrossMojo.jq = function(selector,arg2) {
	var v;
	if(arg2 == null) v = $(selector); else v = $(selector, arg2);
	return v;
}
m3.CrossMojo.windowConsole = function() {
	return window.console;
}
m3.CrossMojo.confirm = function() {
	return confirm;
}
m3.CrossMojo.pushState = function(data,title,url) {
	History.pushState(data, title, url);
}
m3.CrossMojo.prettyPrintString = function(json) {
	return JSON.stringify(JSON.parse(json), undefined, 2);
}
m3.CrossMojo.prettyPrint = function(json) {
	return JSON.stringify(json, undefined, 2);
}
m3.comm = {}
m3.comm.BaseRequest = function(requestData,successFcn,errorFcn) {
	this.requestData = requestData;
	this.onSuccess = successFcn;
	this.onError = errorFcn;
};
$hxClasses["m3.comm.BaseRequest"] = m3.comm.BaseRequest;
m3.comm.BaseRequest.__name__ = ["m3","comm","BaseRequest"];
m3.comm.BaseRequest.prototype = {
	abort: function() {
	}
	,start: function(opts) {
		var _g = this;
		var ajaxOpts = { dataType : "json", contentType : "application/json", data : this.requestData, type : "POST", success : function(data,textStatus,jqXHR) {
			if(jqXHR.getResponseHeader("Content-Length") == "0") return;
			_g.onSuccess(data,textStatus,jqXHR);
		}, error : function(jqXHR,textStatus,errorThrown) {
			if(jqXHR.getResponseHeader("Content-Length") == "0") return;
			var error_message = "";
			if(errorThrown == null || js.Boot.__instanceof(errorThrown,String)) {
				error_message = errorThrown;
				if(jqXHR.message != null) error_message = jqXHR.message; else if(jqXHR.responseText != null && jqXHR.responseText.charAt(0) != "<") error_message = jqXHR.responseText;
			} else error_message = textStatus + ":  " + Std.string(errorThrown.message);
			if(_g.onError != null) _g.onError(jqXHR,textStatus,errorThrown); else {
				m3.util.JqueryUtil.alert("There was an error making your request:  " + error_message);
				throw new m3.exception.Exception("Error executing ajax call | Response Code: " + jqXHR.status + " | " + error_message);
			}
		}};
		$.extend(ajaxOpts,this.baseOpts);
		if(opts != null) $.extend(ajaxOpts,opts);
		return $.ajax(ajaxOpts);
	}
	,__class__: m3.comm.BaseRequest
}
m3.comm.LongPollingRequest = function(channel,requestToRepeat,logga,successFcn,ajaxOpts) {
	this.timeout = 30000;
	this.delayNextPoll = false;
	this.running = true;
	var _g = this;
	this.channel = channel;
	this.logger = logga;
	this.baseOpts = { complete : function(jqXHR,textStatus) {
		_g.poll();
	}};
	if(ajaxOpts != null) $.extend(this.baseOpts,ajaxOpts);
	var wrappedSuccessFcn = function(data,textStatus,jqXHR) {
		if(_g.running) try {
			successFcn(data,textStatus,jqXHR);
		} catch( e ) {
			if( js.Boot.__instanceof(e,m3.exception.Exception) ) {
				_g.logger.error("Error while polling",e);
			} else throw(e);
		}
	};
	var errorFcn = function(jqXHR,textStatus,errorThrown) {
		_g.delayNextPoll = true;
		_g.logger.error("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
	};
	m3.comm.BaseRequest.call(this,requestToRepeat,wrappedSuccessFcn,errorFcn);
};
$hxClasses["m3.comm.LongPollingRequest"] = m3.comm.LongPollingRequest;
m3.comm.LongPollingRequest.__name__ = ["m3","comm","LongPollingRequest"];
m3.comm.LongPollingRequest.__super__ = m3.comm.BaseRequest;
m3.comm.LongPollingRequest.prototype = $extend(m3.comm.BaseRequest.prototype,{
	poll: function() {
		if(this.running) {
			if(this.delayNextPoll == true) {
				this.delayNextPoll = false;
				haxe.Timer.delay($bind(this,this.poll),this.timeout / 2 | 0);
			} else {
				this.baseOpts.url = "/api/channel/poll?channel=" + this.channel + "&timeoutMillis=" + Std.string(this.timeout);
				this.baseOpts.timeout = this.timeout + 1000;
				this.jqXHR = m3.comm.BaseRequest.prototype.start.call(this);
			}
		}
	}
	,abort: function() {
		this.running = false;
		if(this.jqXHR != null) try {
			this.jqXHR.abort();
			this.jqXHR = null;
		} catch( err ) {
			this.logger.error("error on poll abort | " + Std.string(err));
		}
	}
	,start: function(opts) {
		this.poll();
		return this.jqXHR;
	}
	,toggle: function() {
		this.running = !this.running;
		this.logger.debug("Long Polling is running? " + Std.string(this.running));
		this.poll();
	}
	,resume: function() {
		this.running = false;
		this.poll();
	}
	,pause: function() {
		this.running = false;
		this.poll();
	}
	,__class__: m3.comm.LongPollingRequest
});
m3.event = {}
m3.event.EventManager = function() {
	this.hash = new haxe.ds.EnumValueMap();
	this.oneTimers = new Array();
};
$hxClasses["m3.event.EventManager"] = m3.event.EventManager;
m3.event.EventManager.__name__ = ["m3","event","EventManager"];
m3.event.EventManager.prototype = {
	change: function(id,t) {
		this.get_logger().debug("EVENTMODEL: Change to " + Std.string(id));
		var map = this.hash.get(id);
		if(map == null) {
			this.get_logger().warn("No listeners for event " + Std.string(id));
			return;
		}
		var iter = map.iterator();
		while(iter.hasNext()) {
			var listener = iter.next();
			this.get_logger().debug("Notifying " + listener.get_name() + " of " + Std.string(id) + " event");
			try {
				listener.change(t);
				if(HxOverrides.remove(this.oneTimers,listener.get_uid())) map.remove(listener.get_uid());
			} catch( err ) {
				this.get_logger().error("Error executing " + listener.get_name() + " of " + Std.string(id) + " event",m3.log.Logga.getExceptionInst(err));
			}
		}
	}
	,removeListener: function(id,listenerUid) {
		var map = this.hash.get(id);
		if(map != null) map.remove(listenerUid);
	}
	,listenOnceInternal: function(id,listener) {
		var map = this.hash.get(id);
		this.oneTimers.push(listener.get_uid());
		return this.addListenerInternal(id,listener);
	}
	,listenOnce: function(id,func,listenerName) {
		var listener = new m3.event.EMListener(func,listenerName);
		return this.listenOnceInternal(id,listener);
	}
	,addListenerInternal: function(id,listener) {
		var map = this.hash.get(id);
		if(map == null) {
			map = new haxe.ds.StringMap();
			this.hash.set(id,map);
		}
		map.set(listener.get_uid(),listener);
		return listener.get_uid();
	}
	,addListener: function(id,func,listenerName) {
		var listener = new m3.event.EMListener(func,listenerName);
		return this.addListenerInternal(id,listener);
	}
	,get_logger: function() {
		if(this._logger == null) this._logger = m3.log.Logga.get_DEFAULT();
		return this._logger;
	}
	,__class__: m3.event.EventManager
}
m3.event.EMListener = function(fcn,name) {
	this.fcn = fcn;
	this.uid = m3.util.UidGenerator.create(20);
	this.name = name == null?this.get_uid():name;
};
$hxClasses["m3.event.EMListener"] = m3.event.EMListener;
m3.event.EMListener.__name__ = ["m3","event","EMListener"];
m3.event.EMListener.prototype = {
	get_name: function() {
		return this.name;
	}
	,get_uid: function() {
		return this.uid;
	}
	,change: function(t) {
		this.fcn(t);
	}
	,__class__: m3.event.EMListener
}
m3.exception = {}
m3.exception.Exception = function(message,cause) {
	this.message = message;
	this.cause = cause;
	try {
		this.callStack = haxe.CallStack.callStack();
	} catch( err ) {
	}
};
$hxClasses["m3.exception.Exception"] = m3.exception.Exception;
m3.exception.Exception.__name__ = ["m3","exception","Exception"];
m3.exception.Exception.prototype = {
	messageList: function() {
		return this.chain().map(function(e) {
			return e.message;
		});
	}
	,stackTrace: function() {
		var l = new Array();
		var index = 0;
		var _g = 0, _g1 = this.chain();
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			if(index++ > 0) l.push("CAUSED BY: " + e.message); else l.push("ERROR: " + e.message);
			var _g2 = 0, _g3 = e.callStack;
			while(_g2 < _g3.length) {
				var s = _g3[_g2];
				++_g2;
				l.push("  " + Std.string(s));
			}
		}
		return l.join("\n");
	}
	,chain: function() {
		var chain = [];
		var gather = (function($this) {
			var $r;
			var gather1 = null;
			gather1 = function(e) {
				if(e != null) {
					chain.push(e);
					gather1(e.cause);
				}
			};
			$r = gather1;
			return $r;
		}(this));
		gather(this);
		return chain;
	}
	,rootCause: function() {
		var ch = this.chain();
		return ch[ch.length - 1];
	}
	,__class__: m3.exception.Exception
}
m3.exception.AjaxException = function(message,cause) {
	m3.exception.Exception.call(this,message,cause);
};
$hxClasses["m3.exception.AjaxException"] = m3.exception.AjaxException;
m3.exception.AjaxException.__name__ = ["m3","exception","AjaxException"];
m3.exception.AjaxException.__super__ = m3.exception.Exception;
m3.exception.AjaxException.prototype = $extend(m3.exception.Exception.prototype,{
	__class__: m3.exception.AjaxException
});
m3.helper = {}
m3.helper.ArrayHelper = function() { }
$hxClasses["m3.helper.ArrayHelper"] = m3.helper.ArrayHelper;
$hxExpose(m3.helper.ArrayHelper, "m3.helper.ArrayHelper");
m3.helper.ArrayHelper.__name__ = ["m3","helper","ArrayHelper"];
m3.helper.ArrayHelper.indexOf = function(array,t) {
	if(array == null) return -1;
	var index = -1;
	var _g1 = 0, _g = array.length;
	while(_g1 < _g) {
		var i_ = _g1++;
		if(array[i_] == t) {
			index = i_;
			break;
		}
	}
	return index;
}
m3.helper.ArrayHelper.indexOfComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return -1;
	var result = -1;
	if(array != null && array.length > 0) {
		var _g1 = startingIndex, _g = array.length;
		while(_g1 < _g) {
			var idx_ = _g1++;
			var comparisonValue;
			if(js.Boot.__instanceof(propOrFcn,String)) comparisonValue = Reflect.field(array[idx_],propOrFcn); else comparisonValue = propOrFcn(array[idx_]);
			if(value == comparisonValue) {
				result = idx_;
				break;
			}
		}
	}
	return result;
}
m3.helper.ArrayHelper.indexOfComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return -1;
	var result = -1;
	var _g1 = startingIndex, _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var subArray = Reflect.field(array[idx_],subArrayProp);
		if(m3.helper.ArrayHelper.contains(subArray,value)) {
			result = idx_;
			break;
		}
	}
	return result;
}
m3.helper.ArrayHelper.indexOfArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	var result = -1;
	if(array != null) {
		if(m3.helper.ArrayHelper.hasValues(comparison)) {
			var base = comparison[0];
			var baseIndex = m3.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,startingIndex);
			while(baseIndex > -1 && result < 0) {
				var candidate = array[baseIndex];
				var breakOut = false;
				var _g1 = 1, _g = comparison.length;
				while(_g1 < _g) {
					var c_ = _g1++;
					var comparisonValue;
					if(js.Boot.__instanceof(comparison[c_].propOrFcn,String)) comparisonValue = Reflect.field(candidate,comparison[c_].propOrFcn); else comparisonValue = comparison[c_].propOrFcn(candidate);
					if(comparison[c_].value == comparisonValue) continue; else {
						baseIndex = m3.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,baseIndex + 1);
						breakOut = true;
						break;
					}
				}
				if(breakOut) continue;
				result = baseIndex;
			}
		}
	}
	return result;
}
m3.helper.ArrayHelper.getElementComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return null;
	var result = null;
	var _g1 = startingIndex, _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var comparisonValue;
		if(js.Boot.__instanceof(propOrFcn,String)) comparisonValue = Reflect.field(array[idx_],propOrFcn); else comparisonValue = propOrFcn(array[idx_]);
		if(value == comparisonValue) {
			result = array[idx_];
			break;
		}
	}
	return result;
}
m3.helper.ArrayHelper.getElementComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return null;
	var result = null;
	var _g1 = startingIndex, _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var subArray = Reflect.field(array[idx_],subArrayProp);
		if(m3.helper.ArrayHelper.contains(subArray,value)) {
			result = array[idx_];
			break;
		}
	}
	return result;
}
m3.helper.ArrayHelper.getElementArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	var result = null;
	if(array != null) {
		if(m3.helper.ArrayHelper.hasValues(comparison)) {
			var base = comparison[0];
			var baseIndex = m3.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,startingIndex);
			while(baseIndex > -1 && result == null) {
				var candidate = array[baseIndex];
				var breakOut = false;
				var _g1 = 1, _g = comparison.length;
				while(_g1 < _g) {
					var c_ = _g1++;
					var comparisonValue;
					if(js.Boot.__instanceof(comparison[c_].propOrFcn,String)) comparisonValue = Reflect.field(candidate,comparison[c_].propOrFcn); else comparisonValue = comparison[c_].propOrFcn(candidate);
					if(comparison[c_].value == comparisonValue) continue; else {
						baseIndex = m3.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,baseIndex + 1);
						breakOut = true;
						break;
					}
				}
				if(breakOut) continue;
				result = candidate;
			}
		}
	}
	return result;
}
m3.helper.ArrayHelper.contains = function(array,value) {
	if(array == null) return false;
	var contains = Lambda.indexOf(array,value);
	return contains > -1;
}
m3.helper.ArrayHelper.containsAny = function(array,valueArray) {
	if(array == null || valueArray == null) return false;
	var contains = -1;
	var _g1 = 0, _g = valueArray.length;
	while(_g1 < _g) {
		var v_ = _g1++;
		contains = Lambda.indexOf(array,valueArray[v_]);
		if(contains > -1) break;
	}
	return contains > -1;
}
m3.helper.ArrayHelper.containsAll = function(array,valueArray) {
	if(array == null || valueArray == null) return false;
	var anyFailures = false;
	var _g1 = 0, _g = valueArray.length;
	while(_g1 < _g) {
		var v_ = _g1++;
		var index = Lambda.indexOf(array,valueArray[v_]);
		if(index < 0) {
			anyFailures = true;
			break;
		}
	}
	return !anyFailures;
}
m3.helper.ArrayHelper.containsComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = m3.helper.ArrayHelper.indexOfComplex(array,value,propOrFcn,startingIndex);
	return contains > -1;
}
m3.helper.ArrayHelper.containsComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = m3.helper.ArrayHelper.indexOfComplexInSubArray(array,value,subArrayProp,startingIndex);
	return contains > -1;
}
m3.helper.ArrayHelper.containsArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = m3.helper.ArrayHelper.indexOfArrayComparison(array,comparison,startingIndex);
	return contains > -1;
}
m3.helper.ArrayHelper.hasValues = function(array) {
	return array != null && array.length > 0;
}
m3.helper.ArrayHelper.joinX = function(array,sep) {
	if(array == null) return null;
	var s = "";
	var _g1 = 0, _g = array.length;
	while(_g1 < _g) {
		var str_ = _g1++;
		var tmp = array[str_];
		if(m3.helper.StringHelper.isNotBlank(tmp)) tmp = StringTools.trim(tmp);
		if(m3.helper.StringHelper.isNotBlank(tmp) && str_ > 0 && s.length > 0) s += sep;
		s += array[str_];
	}
	return s;
}
m3.helper.DateHelper = function() { }
$hxClasses["m3.helper.DateHelper"] = m3.helper.DateHelper;
m3.helper.DateHelper.__name__ = ["m3","helper","DateHelper"];
m3.helper.DateHelper.inThePast = function(d) {
	return d.getTime() < new Date().getTime();
}
m3.helper.DateHelper.inTheFuture = function(d) {
	return d.getTime() > new Date().getTime();
}
m3.helper.DateHelper.isValid = function(d) {
	return d != null && !Math.isNaN(d.getTime());
}
m3.helper.DateHelper.isBefore = function(d1,d2) {
	return d1.getTime() < d2.getTime();
}
m3.helper.DateHelper.isAfter = function(d1,d2) {
	return !m3.helper.DateHelper.isBefore(d1,d2);
}
m3.helper.DateHelper.isBeforeToday = function(d) {
	return d.getTime() < m3.helper.DateHelper.startOfToday().getTime();
}
m3.helper.DateHelper.startOfToday = function() {
	var now = new Date();
	return HxOverrides.strDate(now.getFullYear() + "-" + m3.helper.StringHelper.padLeft("" + (now.getMonth() + 1),2,"0") + "-" + m3.helper.StringHelper.padLeft("" + now.getDate(),2,"0"));
}
m3.helper.OSetHelper = function() { }
$hxClasses["m3.helper.OSetHelper"] = m3.helper.OSetHelper;
m3.helper.OSetHelper.__name__ = ["m3","helper","OSetHelper"];
m3.helper.OSetHelper.getElement = function(oset,value,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	return m3.helper.OSetHelper.getElementComplex(oset,value,null,startingIndex);
}
m3.helper.OSetHelper.getElementComplex = function(oset,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(oset == null) return null;
	if(propOrFcn == null) propOrFcn = oset.identifier();
	var result = null;
	var index_ = -1;
	var iter = oset.iterator();
	while(iter.hasNext()) if(startingIndex > ++index_) continue; else {
		var comparisonT = iter.next();
		var comparisonValue;
		if(js.Boot.__instanceof(propOrFcn,String)) comparisonValue = Reflect.field(comparisonT,propOrFcn); else comparisonValue = propOrFcn(comparisonT);
		if(value == comparisonValue) {
			result = comparisonT;
			break;
		}
	}
	return result;
}
m3.helper.OSetHelper.hasValues = function(oset) {
	return oset != null && oset.iterator().hasNext();
}
m3.helper.OSetHelper.joinX = function(oset,sep,getString) {
	if(getString == null) getString = oset.identifier();
	var s = "";
	var iter = oset.iterator();
	var index = 0;
	while(iter.hasNext()) {
		var t = iter.next();
		var tmp = getString(t);
		if(m3.helper.StringHelper.isNotBlank(tmp)) tmp = StringTools.trim(tmp);
		if(m3.helper.StringHelper.isNotBlank(tmp) && index > 0 && s.length > 0) s += sep;
		s += getString(t);
		index++;
	}
	return s;
}
m3.helper.OSetHelper.strIdentifier = function(str) {
	return str;
}
m3.helper.StringHelper = function() { }
$hxClasses["m3.helper.StringHelper"] = m3.helper.StringHelper;
m3.helper.StringHelper.__name__ = ["m3","helper","StringHelper"];
m3.helper.StringHelper.compare = function(left,right) {
	if(left < right) return -1; else if(left > right) return 1; else return 0;
}
m3.helper.StringHelper.extractLast = function(term,splitValue) {
	if(splitValue == null) splitValue = ",";
	if(term == null) return term;
	var lastTerm = null;
	if(js.Boot.__instanceof(splitValue,EReg)) lastTerm = (js.Boot.__cast(splitValue , EReg)).split(term).pop(); else lastTerm = term.split(splitValue).pop();
	return lastTerm;
}
m3.helper.StringHelper.replaceAll = function(original,sub,by) {
	if(original == null) return original;
	if(!js.Boot.__instanceof(original,String)) original = Std.string(original);
	while(original.indexOf(sub) >= 0) if(js.Boot.__instanceof(sub,EReg)) original = (js.Boot.__cast(sub , EReg)).replace(original,by); else original = StringTools.replace(original,sub,by);
	return original;
}
m3.helper.StringHelper.replaceLast = function(original,newLastTerm,splitValue) {
	if(splitValue == null) splitValue = ".";
	if(m3.helper.StringHelper.isBlank(original)) return original;
	var pathSplit = original.split(splitValue);
	pathSplit.pop();
	pathSplit.push(newLastTerm);
	return pathSplit.join(".");
}
m3.helper.StringHelper.capitalizeFirstLetter = function(str) {
	if(m3.helper.StringHelper.isBlank(str)) return str;
	return HxOverrides.substr(str,0,1).toUpperCase() + HxOverrides.substr(str,1,str.length);
}
m3.helper.StringHelper.camelCase = function(str) {
	if(m3.helper.StringHelper.isBlank(str)) return str;
	return HxOverrides.substr(str,0,1).toLowerCase() + HxOverrides.substr(str,1,str.length);
}
m3.helper.StringHelper.isBlank = function(str) {
	return str == null || $.trim(str) == "";
}
m3.helper.StringHelper.isNotBlank = function(str) {
	return !m3.helper.StringHelper.isBlank(str);
}
m3.helper.StringHelper.indentLeft = function(baseString,chars,padChar) {
	if(baseString == null) baseString = "";
	var padding = "";
	var _g = 0;
	while(_g < chars) {
		var i_ = _g++;
		padding += padChar;
	}
	return padding + baseString;
}
m3.helper.StringHelper.padLeft = function(baseString,minChars,padChar) {
	if(baseString == null) baseString = "";
	var padding = "";
	if(baseString.length < minChars) {
		var _g = baseString.length;
		while(_g < minChars) {
			var i_ = _g++;
			padding += padChar;
		}
	}
	return padding + baseString;
}
m3.helper.StringHelper.padRight = function(baseString,minChars,padChar) {
	if(baseString == null) baseString = "";
	var padding = "";
	if(baseString.length < minChars) {
		var _g = baseString.length;
		while(_g < minChars) {
			var i_ = _g++;
			padding += padChar;
		}
	}
	return baseString + padding;
}
m3.helper.StringHelper.trimLeft = function(s,minChars,trimChars) {
	if(trimChars == null) trimChars = " \n\t";
	if(minChars == null) minChars = 0;
	if(s == null) s = "";
	if(s.length < minChars) return s;
	var i = 0;
	while(i <= s.length && trimChars.indexOf(HxOverrides.substr(s,i,1)) >= 0) i += 1;
	if(s.length - i < minChars) i = s.length - minChars;
	return HxOverrides.substr(s,i,null);
}
m3.helper.StringHelper.trimRight = function(s,minChars,trimChars) {
	if(trimChars == null) trimChars = " \n\t";
	if(minChars == null) minChars = 0;
	if(s == null) s = "";
	if(s.length < minChars) return s;
	var i = s.length;
	while(i > 0 && trimChars.indexOf(HxOverrides.substr(s,i - 1,1)) >= 0) i -= 1;
	if(s.length - i < minChars) i = minChars;
	return HxOverrides.substr(s,0,i);
}
m3.helper.StringHelper.contains = function(baseString,str) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false;
	return baseString.indexOf(str) > -1;
}
m3.helper.StringHelper.containsAny = function(baseString,sarray) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false; else {
		var _g1 = 0, _g = sarray.length;
		while(_g1 < _g) {
			var s_ = _g1++;
			if(m3.helper.StringHelper.contains(baseString,sarray[s_])) return true;
		}
	}
	return false;
}
m3.helper.StringHelper.startsWithAny = function(baseString,sarray) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false; else {
		var _g1 = 0, _g = sarray.length;
		while(_g1 < _g) {
			var s_ = _g1++;
			if(HxOverrides.substr(baseString,0,sarray[s_].length) == sarray[s_]) return true;
		}
	}
	return false;
}
m3.helper.StringHelper.endsWithAny = function(baseString,sarray) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false; else {
		var _g1 = 0, _g = sarray.length;
		while(_g1 < _g) {
			var s_ = _g1++;
			if(StringTools.endsWith(baseString,sarray[s_])) return true;
		}
	}
	return false;
}
m3.helper.StringHelper.splitByReg = function(baseString,reg) {
	var result = null;
	if(baseString != null && reg != null) result = reg.split(baseString);
	return result;
}
m3.helper.StringHelper.toDate = function(baseString) {
	var date = null;
	if(m3.helper.StringHelper.isNotBlank(baseString)) {
		try {
			date = HxOverrides.strDate(baseString);
		} catch( err ) {
		}
		if(!m3.helper.DateHelper.isValid(date) && baseString.indexOf("/") > -1) try {
			var split = baseString.split("/");
			var temp = split[2] + "-" + split[0] + "-" + split[1];
			date = HxOverrides.strDate(temp);
		} catch( err ) {
		}
	}
	if(!m3.helper.DateHelper.isValid(date)) date == null;
	return date;
}
m3.helper.StringHelper.boolAsYesNo = function(bool) {
	if(bool) return "Yes"; else return "No";
}
m3.helper.StringHelper.toBool = function(str) {
	if(str == null) return false;
	return str.toLowerCase() == "true";
}
m3.jq = {}
m3.jq.JQDialogHelper = function() { }
$hxClasses["m3.jq.JQDialogHelper"] = m3.jq.JQDialogHelper;
m3.jq.JQDialogHelper.__name__ = ["m3","jq","JQDialogHelper"];
m3.jq.JQDialogHelper.close = function(d) {
	d.dialog("close");
}
m3.jq.JQDialogHelper.open = function(d) {
	d.dialog("open");
}
m3.jq.JQMenuHelper = function() { }
$hxClasses["m3.jq.JQMenuHelper"] = m3.jq.JQMenuHelper;
m3.jq.JQMenuHelper.__name__ = ["m3","jq","JQMenuHelper"];
m3.jq.JQMenuHelper.blur = function(m) {
	m.menu("blur");
}
m3.jq.JQMenuHelper.collapseAll = function(m) {
	m.menu("collapseAll");
}
m3.jq.JQMenuHelper.refresh = function(m) {
	m.menu("refresh");
}
m3.jq.M3DialogHelper = function() { }
$hxClasses["m3.jq.M3DialogHelper"] = m3.jq.M3DialogHelper;
m3.jq.M3DialogHelper.__name__ = ["m3","jq","M3DialogHelper"];
m3.jq.M3DialogHelper.close = function(dlg) {
	dlg.m3dialog("close");
}
m3.jq.M3DialogHelper.open = function(dlg) {
	dlg.m3dialog("open");
}
m3.log = {}
m3.log.Logga = function(logLevel) {
	this.initialized = false;
	this.loggerLevel = logLevel;
};
$hxClasses["m3.log.Logga"] = m3.log.Logga;
m3.log.Logga.__name__ = ["m3","log","Logga"];
m3.log.Logga.get_DEFAULT = function() {
	if(m3.log.Logga.DEFAULT == null) m3.log.Logga.DEFAULT = new m3.log.RemoteLogga(m3.log.LogLevel.DEBUG,m3.log.LogLevel.DEBUG);
	return m3.log.Logga.DEFAULT;
}
m3.log.Logga.getExceptionInst = function(err) {
	if(js.Boot.__instanceof(err,m3.exception.Exception)) return err; else return new m3.exception.Exception(err);
}
m3.log.Logga.prototype = {
	error: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.ERROR,exception);
	}
	,warn: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.WARN,exception);
	}
	,info: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.INFO,exception);
	}
	,debug: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.DEBUG,exception);
	}
	,trace: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.TRACE,exception);
	}
	,setLogLevel: function(logLevel) {
		this.loggerLevel = logLevel;
	}
	,logsAtLevel: function(level) {
		return this.loggerLevel[1] <= level[1];
	}
	,log: function(statement,level,exception) {
		if(!this.initialized) this._getLogger();
		if(level == null) level = m3.log.LogLevel.INFO;
		try {
			if(exception != null && $bind(exception,exception.stackTrace) != null && Reflect.isFunction($bind(exception,exception.stackTrace))) statement += "\n" + exception.stackTrace();
		} catch( err ) {
			this.log("Could not get stackTrace",m3.log.LogLevel.ERROR);
		}
		if(m3.helper.StringHelper.isBlank(statement)) {
			this.console.error("empty log statement");
			this.console.trace();
		}
		if(m3.helper.StringHelper.isNotBlank(this.statementPrefix)) statement = this.statementPrefix + " || " + statement;
		if(this.logsAtLevel(level) && this.console != null) try {
			if((Type.enumEq(level,m3.log.LogLevel.TRACE) || Type.enumEq(level,m3.log.LogLevel.DEBUG)) && ($_=this.console,$bind($_,$_.debug)) != null) this.console.debug(statement); else if(Type.enumEq(level,m3.log.LogLevel.INFO) && ($_=this.console,$bind($_,$_.info)) != null) this.console.info(statement); else if(Type.enumEq(level,m3.log.LogLevel.WARN) && ($_=this.console,$bind($_,$_.warn)) != null) this.console.warn(statement); else if(Type.enumEq(level,m3.log.LogLevel.ERROR) && this.preservedConsoleError != null) {
				this.preservedConsoleError.apply(this.console,[statement]);
				this.console.trace();
			} else if(Type.enumEq(level,m3.log.LogLevel.ERROR) && ($_=this.console,$bind($_,$_.error)) != null) {
				this.console.error(statement);
				this.console.trace();
			} else if(this.preservedConsoleLog != null) this.preservedConsoleLog.apply(this.console,[statement]); else this.console.log(statement);
		} catch( err ) {
			if(this.console != null && Reflect.hasField(this.console,"error")) this.console.error(err);
		}
	}
	,setStatementPrefix: function(prefix) {
		this.statementPrefix = prefix;
	}
	,overrideConsoleLog: function() {
		var _g = this;
		if(!this.initialized) this._getLogger();
		if(this.console != null) try {
			this.console.log("prime console.log");
			this.preservedConsoleLog = ($_=this.console,$bind($_,$_.log));
			this.console.log = function() {
				_g.warn(arguments[0]);
			};
		} catch( err ) {
			this.warn("Could not override console.log");
		}
	}
	,overrideConsoleTrace: function() {
		var _g = this;
		if(!this.initialized) this._getLogger();
		if(this.console != null) try {
			this.preservedConsoleTrace = ($_=this.console,$bind($_,$_.trace));
			this.console.trace = function() {
				_g.preservedConsoleTrace.apply(_g.console);
			};
		} catch( err ) {
			this.warn("Could not override console.trace");
		}
	}
	,overrideConsoleError: function() {
		var _g = this;
		if(!this.initialized) this._getLogger();
		if(this.console != null) try {
			this.preservedConsoleError = ($_=this.console,$bind($_,$_.error));
			this.console.error = function() {
				_g.error(arguments[0]);
			};
		} catch( err ) {
			this.warn("Could not override console.error");
		}
	}
	,_getLogger: function() {
		this.console = js.Browser.window.console;
		this.initialized = true;
	}
	,__class__: m3.log.Logga
}
m3.log.LogLevel = $hxClasses["m3.log.LogLevel"] = { __ename__ : ["m3","log","LogLevel"], __constructs__ : ["TRACE","DEBUG","INFO","WARN","ERROR"] }
m3.log.LogLevel.TRACE = ["TRACE",0];
m3.log.LogLevel.TRACE.toString = $estr;
m3.log.LogLevel.TRACE.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.DEBUG = ["DEBUG",1];
m3.log.LogLevel.DEBUG.toString = $estr;
m3.log.LogLevel.DEBUG.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.INFO = ["INFO",2];
m3.log.LogLevel.INFO.toString = $estr;
m3.log.LogLevel.INFO.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.WARN = ["WARN",3];
m3.log.LogLevel.WARN.toString = $estr;
m3.log.LogLevel.WARN.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.ERROR = ["ERROR",4];
m3.log.LogLevel.ERROR.toString = $estr;
m3.log.LogLevel.ERROR.__enum__ = m3.log.LogLevel;
m3.log.RemoteLogga = function(consoleLevel,remoteLevel) {
	m3.log.Logga.call(this,consoleLevel);
	this.remoteLogLevel = remoteLevel;
	this.logs = [];
	this.sessionUid = m3.util.UidGenerator.create(32);
	this.log("SessionUid: " + this.sessionUid);
};
$hxClasses["m3.log.RemoteLogga"] = m3.log.RemoteLogga;
m3.log.RemoteLogga.__name__ = ["m3","log","RemoteLogga"];
m3.log.RemoteLogga.__super__ = m3.log.Logga;
m3.log.RemoteLogga.prototype = $extend(m3.log.Logga.prototype,{
	unpause: function() {
		if(this.timer != null) this.timer.unpause();
	}
	,pause: function() {
		if(this.timer != null) this.timer.pause();
	}
	,setRemoteLoggingFcn: function(remoteLogFcn) {
		var _g = this;
		if(this.timer != null) this.timer.stop();
		if(remoteLogFcn != null) this.timer = new m3.log._RemoteLogga.RemoteLoggingTimer(remoteLogFcn,function() {
			var saved = _g.logs;
			_g.logs = [];
			return saved;
		});
	}
	,remoteLogsAtLevel: function(level) {
		return this.remoteLogLevel[1] <= level[1];
	}
	,log: function(statement,level,exception) {
		if(level == null) level = m3.log.LogLevel.INFO;
		m3.log.Logga.prototype.log.call(this,statement,level,exception);
		if(this.timer != null && this.remoteLogsAtLevel(level)) {
			try {
				if(exception != null && $bind(exception,exception.stackTrace) != null && Reflect.isFunction($bind(exception,exception.stackTrace))) statement += "\n" + exception.stackTrace();
			} catch( err ) {
			}
			this.logs.push({ sessionUid : this.sessionUid, at : DateTools.format(new Date(),"%Y-%m-%d %T"), message : statement, severity : level[0], category : "ui"});
		}
	}
	,__class__: m3.log.RemoteLogga
});
m3.util = {}
m3.util.UidGenerator = function() { }
$hxClasses["m3.util.UidGenerator"] = m3.util.UidGenerator;
m3.util.UidGenerator.__name__ = ["m3","util","UidGenerator"];
m3.util.UidGenerator.get_chars = function() {
	return "ABCDEFGHIJKLMNOPQRSTUVWXYZabsdefghijklmnopqrstuvwxyz0123456789";
}
m3.util.UidGenerator.get_nums = function() {
	return "0123456789";
}
m3.util.UidGenerator.create = function(length) {
	if(length == null) length = 20;
	var str = new Array();
	var charsLength = m3.util.UidGenerator.get_chars().length;
	while(str.length == 0) {
		var ch = m3.util.UidGenerator.randomChar();
		if(m3.util.UidGenerator.isLetter(ch)) str.push(ch);
	}
	while(str.length < length) {
		var ch = m3.util.UidGenerator.randomChar();
		str.push(ch);
	}
	return str.join("");
}
m3.util.UidGenerator.isLetter = function($char) {
	var _g1 = 0, _g = m3.util.UidGenerator.get_chars().length;
	while(_g1 < _g) {
		var i = _g1++;
		if(m3.util.UidGenerator.get_chars().charAt(i) == $char) return true;
	}
	return false;
}
m3.util.UidGenerator.randomNum = function() {
	var max = m3.util.UidGenerator.get_chars().length - 1;
	var min = 0;
	return min + Math.round(Math.random() * (max - min) + 1);
}
m3.util.UidGenerator.randomIndex = function(str) {
	var max = str.length - 1;
	var min = 0;
	return min + Math.round(Math.random() * (max - min) + 1);
}
m3.util.UidGenerator.randomChar = function() {
	var i = 0;
	while((i = m3.util.UidGenerator.randomIndex(m3.util.UidGenerator.get_chars())) >= m3.util.UidGenerator.get_chars().length) continue;
	return m3.util.UidGenerator.get_chars().charAt(i);
}
m3.util.UidGenerator.randomNumChar = function() {
	var i = 0;
	while((i = m3.util.UidGenerator.randomIndex(m3.util.UidGenerator.get_nums())) >= m3.util.UidGenerator.get_nums().length) continue;
	return Std.parseInt(m3.util.UidGenerator.get_nums().charAt(i));
}
m3.jq.PlaceHolderUtil = function() { }
$hxClasses["m3.jq.PlaceHolderUtil"] = m3.jq.PlaceHolderUtil;
m3.jq.PlaceHolderUtil.__name__ = ["m3","jq","PlaceHolderUtil"];
m3.jq.PlaceHolderUtil.setFocusBehavior = function(input,placeholder) {
	placeholder.focus(function(evt) {
		placeholder.hide();
		input.show().focus();
	});
	input.blur(function(evt) {
		if(m3.helper.StringHelper.isBlank(input.val())) {
			placeholder.show();
			input.hide();
		}
	});
}
m3.log._RemoteLogga = {}
m3.log._RemoteLogga.RemoteLoggingTimer = function(remoteLogFcn,getMsgs) {
	this.paused = false;
	haxe.Timer.call(this,30000);
	this.remoteLogFcn = remoteLogFcn;
	this.getLogs = getMsgs;
};
$hxClasses["m3.log._RemoteLogga.RemoteLoggingTimer"] = m3.log._RemoteLogga.RemoteLoggingTimer;
m3.log._RemoteLogga.RemoteLoggingTimer.__name__ = ["m3","log","_RemoteLogga","RemoteLoggingTimer"];
m3.log._RemoteLogga.RemoteLoggingTimer.__super__ = haxe.Timer;
m3.log._RemoteLogga.RemoteLoggingTimer.prototype = $extend(haxe.Timer.prototype,{
	unpause: function() {
		m3.log.Logga.get_DEFAULT().debug("unpausing remote logga");
		this.paused = false;
	}
	,pause: function() {
		m3.log.Logga.get_DEFAULT().debug("pausing remote logga");
		this.paused = true;
	}
	,run: function() {
		if(this.paused) return;
		var logs = this.getLogs();
		if(m3.helper.ArrayHelper.hasValues(logs)) this.remoteLogFcn(logs); else m3.log.Logga.get_DEFAULT().debug("no remote logs to send");
	}
	,__class__: m3.log._RemoteLogga.RemoteLoggingTimer
});
m3.observable = {}
m3.observable.OSet = function() { }
$hxClasses["m3.observable.OSet"] = m3.observable.OSet;
m3.observable.OSet.__name__ = ["m3","observable","OSet"];
m3.observable.OSet.prototype = {
	__class__: m3.observable.OSet
}
m3.observable.EventManager = function(set) {
	this._set = set;
	this._listeners = [];
};
$hxClasses["m3.observable.EventManager"] = m3.observable.EventManager;
m3.observable.EventManager.__name__ = ["m3","observable","EventManager"];
m3.observable.EventManager.prototype = {
	listenerCount: function() {
		return this._listeners.length;
	}
	,fire: function(t,type) {
		var _g = this;
		Lambda.iter(this._listeners,function(l) {
			try {
				l(t,type);
			} catch( err ) {
				m3.log.Logga.get_DEFAULT().error("Error processing listener on " + _g._set.getVisualId(),m3.log.Logga.getExceptionInst(err));
			}
		});
	}
	,remove: function(l) {
		HxOverrides.remove(this._listeners,l);
	}
	,add: function(l) {
		Lambda.iter(this._set,function(it) {
			return l(it,m3.observable.EventType.Add);
		});
		this._listeners.push(l);
	}
	,__class__: m3.observable.EventManager
}
m3.observable.EventType = function(name,add,update) {
	this._name = name;
	this._add = add;
	this._update = update;
};
$hxClasses["m3.observable.EventType"] = m3.observable.EventType;
m3.observable.EventType.__name__ = ["m3","observable","EventType"];
m3.observable.EventType.prototype = {
	isDelete: function() {
		return !(this._add || this._update);
	}
	,isAddOrUpdate: function() {
		return this._add || this._update;
	}
	,isUpdate: function() {
		return this._update;
	}
	,isAdd: function() {
		return this._add;
	}
	,name: function() {
		return this._name;
	}
	,__class__: m3.observable.EventType
}
m3.observable.AbstractSet = function() {
	this._eventManager = new m3.observable.EventManager(this);
};
$hxClasses["m3.observable.AbstractSet"] = m3.observable.AbstractSet;
m3.observable.AbstractSet.__name__ = ["m3","observable","AbstractSet"];
m3.observable.AbstractSet.__interfaces__ = [m3.observable.OSet];
m3.observable.AbstractSet.prototype = {
	delegate: function() {
		return (function($this) {
			var $r;
			throw new m3.exception.Exception("implement me");
			return $r;
		}(this));
	}
	,iterator: function() {
		return (function($this) {
			var $r;
			throw new m3.exception.Exception("implement me");
			return $r;
		}(this));
	}
	,identifier: function() {
		return (function($this) {
			var $r;
			throw new m3.exception.Exception("implement me");
			return $r;
		}(this));
	}
	,getVisualId: function() {
		return this.visualId;
	}
	,fire: function(t,type) {
		this._eventManager.fire(t,type);
	}
	,map: function(f) {
		return new m3.observable.MappedSet(this,f);
	}
	,filter: function(f) {
		return new m3.observable.FilteredSet(this,f);
	}
	,removeListener: function(l) {
		this._eventManager.remove(l);
	}
	,listen: function(l) {
		this._eventManager.add(l);
	}
	,__class__: m3.observable.AbstractSet
}
m3.observable.ObservableSet = function(identifier,tArr) {
	m3.observable.AbstractSet.call(this);
	this._identifier = identifier;
	this._delegate = new m3.util.SizedMap();
	if(tArr != null) this.addAll(tArr);
};
$hxClasses["m3.observable.ObservableSet"] = m3.observable.ObservableSet;
m3.observable.ObservableSet.__name__ = ["m3","observable","ObservableSet"];
m3.observable.ObservableSet.__super__ = m3.observable.AbstractSet;
m3.observable.ObservableSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	asArray: function() {
		var a = new Array();
		var iter = this.iterator();
		while(iter.hasNext()) a.push(iter.next());
		return a;
	}
	,size: function() {
		return this._delegate.size;
	}
	,clear: function() {
		var iter = this.iterator();
		while(iter.hasNext()) this["delete"](iter.next());
	}
	,identifier: function() {
		return this._identifier;
	}
	,'delete': function(t) {
		var key = (this.identifier())(t);
		if(this._delegate.exists(key)) {
			this._delegate.remove(key);
			this.fire(t,m3.observable.EventType.Delete);
		}
	}
	,update: function(t) {
		this.addOrUpdate(t);
	}
	,delegate: function() {
		return this._delegate;
	}
	,addOrUpdate: function(t) {
		var key = (this.identifier())(t);
		var type;
		if(this._delegate.exists(key)) type = m3.observable.EventType.Update; else type = m3.observable.EventType.Add;
		this._delegate.set(key,t);
		this.fire(t,type);
	}
	,isEmpty: function() {
		return Lambda.empty(this._delegate);
	}
	,iterator: function() {
		return this._delegate.iterator();
	}
	,addAll: function(tArr) {
		if(tArr != null && tArr.length > 0) {
			var _g1 = 0, _g = tArr.length;
			while(_g1 < _g) {
				var t_ = _g1++;
				this.addOrUpdate(tArr[t_]);
			}
		}
	}
	,add: function(t) {
		this.addOrUpdate(t);
	}
	,__class__: m3.observable.ObservableSet
});
m3.observable.MappedSet = function(source,mapper,remapOnUpdate) {
	if(remapOnUpdate == null) remapOnUpdate = false;
	m3.observable.AbstractSet.call(this);
	this._mappedSet = new haxe.ds.StringMap();
	this._mapListeners = new Array();
	this._source = source;
	this._remapOnUpdate = remapOnUpdate;
	this._mapper = mapper;
	this._source.listen($bind(this,this._sourceListener));
};
$hxClasses["m3.observable.MappedSet"] = m3.observable.MappedSet;
m3.observable.MappedSet.__name__ = ["m3","observable","MappedSet"];
m3.observable.MappedSet.__super__ = m3.observable.AbstractSet;
m3.observable.MappedSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	removeListeners: function(mapListener) {
		HxOverrides.remove(this._mapListeners,mapListener);
		this._source.removeListener($bind(this,this._sourceListener));
	}
	,mapListen: function(f) {
		var iter = this._mappedSet.keys();
		while(iter.hasNext()) {
			var key = iter.next();
			var t = m3.helper.OSetHelper.getElement(this._source,key);
			var u = this._mappedSet.get(key);
			f(t,u,m3.observable.EventType.Add);
		}
		this._mapListeners.push(f);
	}
	,iterator: function() {
		return this._mappedSet.iterator();
	}
	,identify: function(u) {
		var keys = this._mappedSet.keys();
		while(keys.hasNext()) {
			var key = keys.next();
			if(this._mappedSet.get(key) == u) return key;
		}
		throw new m3.exception.Exception("unable to find identity for " + Std.string(u));
	}
	,delegate: function() {
		return this._mappedSet;
	}
	,identifier: function() {
		return $bind(this,this.identify);
	}
	,_sourceListener: function(t,type) {
		var key = (this._source.identifier())(t);
		var mappedValue;
		if(type.isAdd() || this._remapOnUpdate && type.isUpdate()) {
			mappedValue = this._mapper(t);
			this._mappedSet.set(key,mappedValue);
		} else if(type.isUpdate()) mappedValue = this._mappedSet.get(key); else {
			mappedValue = this._mappedSet.get(key);
			this._mappedSet.remove(key);
		}
		this.fire(mappedValue,type);
		Lambda.iter(this._mapListeners,function(it) {
			return it(t,mappedValue,type);
		});
	}
	,__class__: m3.observable.MappedSet
});
m3.observable.FilteredSet = function(source,filter) {
	var _g = this;
	m3.observable.AbstractSet.call(this);
	this._filteredSet = new haxe.ds.StringMap();
	this._source = source;
	this._filter = filter;
	this._source.listen(function(t,type) {
		if(type.isAddOrUpdate()) _g.apply(t); else if(type.isDelete()) {
			var key = (_g.identifier())(t);
			if(_g._filteredSet.exists(key)) {
				_g._filteredSet.remove(key);
				_g.fire(t,type);
			}
		}
	});
};
$hxClasses["m3.observable.FilteredSet"] = m3.observable.FilteredSet;
m3.observable.FilteredSet.__name__ = ["m3","observable","FilteredSet"];
m3.observable.FilteredSet.__super__ = m3.observable.AbstractSet;
m3.observable.FilteredSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	asArray: function() {
		var a = new Array();
		var iter = this.iterator();
		while(iter.hasNext()) a.push(iter.next());
		return a;
	}
	,iterator: function() {
		return this._filteredSet.iterator();
	}
	,identifier: function() {
		return this._source.identifier();
	}
	,refilter: function() {
		var _g = this;
		Lambda.iter(this._source,function(it) {
			return _g.apply(it);
		});
	}
	,apply: function(t) {
		var key = (this._source.identifier())(t);
		var f = this._filter(t);
		var exists = this._filteredSet.exists(key);
		if(f != exists) {
			if(f) {
				this._filteredSet.set(key,t);
				this.fire(t,m3.observable.EventType.Add);
			} else {
				this._filteredSet.remove(key);
				this.fire(t,m3.observable.EventType.Delete);
			}
		} else if(exists) this.fire(t,m3.observable.EventType.Update);
	}
	,delegate: function() {
		return this._filteredSet;
	}
	,__class__: m3.observable.FilteredSet
});
m3.observable.GroupedSet = function(source,groupingFn) {
	var _g = this;
	m3.observable.AbstractSet.call(this);
	this._source = source;
	this._groupingFn = groupingFn;
	this._groupedSets = new haxe.ds.StringMap();
	this._identityToGrouping = new haxe.ds.StringMap();
	source.listen(function(t,type) {
		var groupingKey = groupingFn(t);
		var previousGroupingKey = _g._identityToGrouping.get(groupingKey);
		if(type.isAddOrUpdate()) {
			if(previousGroupingKey != groupingKey) {
				_g["delete"](t,false);
				_g.add(t);
			}
		} else _g["delete"](t);
	});
};
$hxClasses["m3.observable.GroupedSet"] = m3.observable.GroupedSet;
m3.observable.GroupedSet.__name__ = ["m3","observable","GroupedSet"];
m3.observable.GroupedSet.__super__ = m3.observable.AbstractSet;
m3.observable.GroupedSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	delegate: function() {
		return this._groupedSets;
	}
	,iterator: function() {
		return this._groupedSets.iterator();
	}
	,identify: function(set) {
		var keys = this._groupedSets.keys();
		while(keys.hasNext()) {
			var key = keys.next();
			if(this._groupedSets.get(key) == set) return key;
		}
		throw new m3.exception.Exception("unable to find identity for " + Std.string(set));
	}
	,identifier: function() {
		return $bind(this,this.identify);
	}
	,addEmptyGroup: function(key) {
		if(this._groupedSets.get(key) == null) {
			var groupedSet = new m3.observable.ObservableSet(this._source.identifier());
			groupedSet.visualId = key;
			this._groupedSets.set(key,groupedSet);
		}
		return this._groupedSets.get(key);
	}
	,add: function(t) {
		var id = (this._source.identifier())(t);
		var key = this._identityToGrouping.get(id);
		if(key != null) throw new m3.exception.Exception("cannot add it is already in the list" + id + " -- " + key);
		key = this._groupingFn(t);
		this._identityToGrouping.set(id,key);
		var groupedSet = this._groupedSets.get(key);
		if(groupedSet == null) {
			groupedSet = this.addEmptyGroup(key);
			groupedSet.addOrUpdate(t);
			this.fire(groupedSet,m3.observable.EventType.Add);
		} else {
			groupedSet.addOrUpdate(t);
			this.fire(groupedSet,m3.observable.EventType.Update);
		}
	}
	,'delete': function(t,deleteEmptySet) {
		if(deleteEmptySet == null) deleteEmptySet = true;
		var id = (this._source.identifier())(t);
		var key = this._identityToGrouping.get(id);
		if(key != null) {
			this._identityToGrouping.remove(id);
			var groupedSet = this._groupedSets.get(key);
			if(groupedSet != null) {
				groupedSet["delete"](t);
				if(groupedSet.isEmpty() && deleteEmptySet) {
					this._groupedSets.remove(key);
					this.fire(groupedSet,m3.observable.EventType.Delete);
				} else this.fire(groupedSet,m3.observable.EventType.Update);
			} else {
			}
		} else {
		}
	}
	,__class__: m3.observable.GroupedSet
});
m3.observable.SortedSet = function(source,sortByFn) {
	var _g = this;
	m3.observable.AbstractSet.call(this);
	this._source = source;
	if(sortByFn == null) this._sortByFn = source.identifier(); else this._sortByFn = sortByFn;
	this._sorted = new Array();
	this._dirty = true;
	this._comparisonFn = function(l,r) {
		var l0 = _g._sortByFn(l);
		var r0 = _g._sortByFn(r);
		var cmp = m3.helper.StringHelper.compare(l0,r0);
		if(cmp != 0) return cmp;
		var li = (_g.identifier())(l);
		var ri = (_g.identifier())(r);
		return m3.helper.StringHelper.compare(li,ri);
	};
	source.listen(function(t,type) {
		if(type.isDelete()) _g["delete"](t); else if(type.isUpdate()) {
			_g["delete"](t);
			_g.add(t);
		} else _g.add(t);
	});
};
$hxClasses["m3.observable.SortedSet"] = m3.observable.SortedSet;
m3.observable.SortedSet.__name__ = ["m3","observable","SortedSet"];
m3.observable.SortedSet.__super__ = m3.observable.AbstractSet;
m3.observable.SortedSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	delegate: function() {
		throw new m3.exception.Exception("not implemented");
		return null;
	}
	,iterator: function() {
		return HxOverrides.iter(this.sorted());
	}
	,identifier: function() {
		return this._source.identifier();
	}
	,add: function(t) {
		this._sorted.push(t);
		this._dirty = true;
		this.fire(t,m3.observable.EventType.Add);
	}
	,'delete': function(t) {
		HxOverrides.remove(this._sorted,t);
		this.fire(t,m3.observable.EventType.Delete);
	}
	,binarySearch: function(value,sortBy,startIndex,endIndex) {
		var middleIndex = startIndex + endIndex >> 1;
		if(startIndex < endIndex) {
			var middleValue = this._sorted[middleIndex];
			var middleSortBy = this._sortByFn(middleValue);
			if(middleSortBy == sortBy) return middleIndex; else if(middleSortBy > sortBy) return this.binarySearch(value,sortBy,startIndex,middleIndex); else return this.binarySearch(value,sortBy,middleIndex + 1,endIndex);
		}
		return -1;
	}
	,indexOf: function(t) {
		this.sorted();
		return this.binarySearch(t,this._sortByFn(t),0,this._sorted.length - 1);
	}
	,sorted: function() {
		if(this._dirty) {
			this._sorted.sort(this._comparisonFn);
			this._dirty = false;
		}
		return this._sorted;
	}
	,__class__: m3.observable.SortedSet
});
m3.serialization = {}
m3.serialization.Serializer = function() {
	this._handlersMap = new haxe.ds.StringMap();
	this.addHandlerViaName("Array<Dynamic>",new m3.serialization.DynamicArrayHandler());
};
$hxClasses["m3.serialization.Serializer"] = m3.serialization.Serializer;
m3.serialization.Serializer.__name__ = ["m3","serialization","Serializer"];
m3.serialization.Serializer.prototype = {
	createHandler: function(type) {
		return (function($this) {
			var $r;
			var $e = (type);
			switch( $e[1] ) {
			case 1:
				var parms = $e[3], path = $e[2];
				$r = path == "Bool"?new m3.serialization.BoolHandler():new m3.serialization.EnumHandler(path,parms);
				break;
			case 2:
				var parms = $e[3], path = $e[2];
				$r = (function($this) {
					var $r;
					switch(path) {
					case "Bool":
						$r = new m3.serialization.BoolHandler();
						break;
					case "Float":
						$r = new m3.serialization.FloatHandler();
						break;
					case "String":
						$r = new m3.serialization.StringHandler();
						break;
					case "Int":
						$r = new m3.serialization.IntHandler();
						break;
					case "Array":
						$r = new m3.serialization.ArrayHandler(parms,$this);
						break;
					case "Date":
						$r = new m3.serialization.DateHandler();
						break;
					default:
						$r = new m3.serialization.ClassHandler(Type.resolveClass(m3.serialization.CTypeTools.classname(type)),m3.serialization.CTypeTools.typename(type),$this);
					}
					return $r;
				}($this));
				break;
			case 7:
				var parms = $e[3], path = $e[2];
				$r = (function($this) {
					var $r;
					switch(path) {
					case "Bool":
						$r = new m3.serialization.BoolHandler();
						break;
					case "Float":
						$r = new m3.serialization.FloatHandler();
						break;
					case "String":
						$r = new m3.serialization.StringHandler();
						break;
					case "Int":
						$r = new m3.serialization.IntHandler();
						break;
					case "Array":
						$r = new m3.serialization.ArrayHandler(parms,$this);
						break;
					case "Date":
						$r = new m3.serialization.DateHandler();
						break;
					default:
						$r = new m3.serialization.ClassHandler(Type.resolveClass(m3.serialization.CTypeTools.classname(type)),m3.serialization.CTypeTools.typename(type),$this);
					}
					return $r;
				}($this));
				break;
			case 6:
				$r = new m3.serialization.DynamicHandler();
				break;
			case 4:
				var ret = $e[3], args = $e[2];
				$r = new m3.serialization.FunctionHandler();
				break;
			default:
				$r = (function($this) {
					var $r;
					throw new m3.serialization.JsonException("don't know how to handle " + Std.string(type));
					return $r;
				}($this));
			}
			return $r;
		}(this));
	}
	,getHandler: function(type) {
		var typename = m3.serialization.CTypeTools.typename(type);
		var handler = this._handlersMap.get(typename);
		if(handler == null) {
			handler = this.createHandler(type);
			this._handlersMap.set(typename,handler);
		}
		return handler;
	}
	,getHandlerViaClass: function(clazz) {
		var typename = m3.serialization.TypeTools.classname(clazz);
		return this.getHandler(haxe.rtti.CType.CClass(typename,new List()));
	}
	,createWriter: function() {
		return new m3.serialization.JsonWriter(this);
	}
	,createReader: function(strict) {
		if(strict == null) strict = true;
		return new m3.serialization.JsonReader(this,strict);
	}
	,toJsonString: function(value) {
		return haxe.Json.stringify(this.toJson(value));
	}
	,toJson: function(value) {
		return this.createWriter().write(value);
	}
	,fromJson: function(fromJson,clazz,strict) {
		if(strict == null) strict = true;
		var reader = this.createReader(strict);
		reader.read(fromJson,clazz);
		return reader;
	}
	,fromJsonX: function(fromJson,clazz,strict) {
		if(strict == null) strict = true;
		var reader = this.createReader(strict);
		reader.read(fromJson,clazz);
		return reader.instance;
	}
	,load: function(fromJson,instance,strict) {
		if(strict == null) strict = true;
		var reader = this.createReader(strict);
		reader.read(fromJson,Type.getClass(instance),instance);
		return reader;
	}
	,addHandlerViaName: function(typename,handler) {
		this._handlersMap.set(typename,handler);
	}
	,addHandler: function(clazz,handler) {
		var typename = Type.getClassName(clazz);
		this._handlersMap.set(typename,handler);
	}
	,__class__: m3.serialization.Serializer
}
m3.serialization.TypeHandler = function() { }
$hxClasses["m3.serialization.TypeHandler"] = m3.serialization.TypeHandler;
m3.serialization.TypeHandler.__name__ = ["m3","serialization","TypeHandler"];
m3.serialization.TypeHandler.prototype = {
	__class__: m3.serialization.TypeHandler
}
m3.serialization.ArrayHandler = function(parms,serializer) {
	this._parms = parms;
	this._serializer = serializer;
	this._elementHandler = this._serializer.getHandler(this._parms.first());
};
$hxClasses["m3.serialization.ArrayHandler"] = m3.serialization.ArrayHandler;
m3.serialization.ArrayHandler.__name__ = ["m3","serialization","ArrayHandler"];
m3.serialization.ArrayHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.ArrayHandler.prototype = {
	write: function(value,writer) {
		var arr = value;
		var result = [];
		var _g = 0;
		while(_g < arr.length) {
			var e = arr[_g];
			++_g;
			result.push(this._elementHandler.write(e,writer));
		}
		return result;
	}
	,read: function(fromJson,reader,instance) {
		if(instance == null) instance = [];
		if(fromJson != null) {
			var arr;
			if(js.Boot.__instanceof(fromJson,Array)) arr = fromJson; else arr = [fromJson];
			var i = 0;
			var _g = 0;
			while(_g < arr.length) {
				var e = arr[_g];
				++_g;
				var context = "[" + i + "]";
				reader.stack.push(context);
				try {
					instance.push(this._elementHandler.read(e,reader));
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,String) ) {
						var msg = $e0;
						reader.error("error reading " + context + "\n" + msg);
					} else if( js.Boot.__instanceof($e0,m3.serialization.JsonException) ) {
						var e1 = $e0;
						reader.error("error reading " + context,e1);
					} else throw($e0);
				}
				reader.stack.pop();
				i += 1;
			}
		}
		return instance;
	}
	,__class__: m3.serialization.ArrayHandler
}
m3.serialization.EnumHandler = function(enumName,parms) {
	this._enumName = enumName;
	this._parms = parms;
	this._enum = Type.resolveEnum(this._enumName);
	if(this._enum == null) throw new m3.serialization.JsonException("no enum named " + this._enumName + " found");
	this._enumValues = Type.allEnums(this._enum);
};
$hxClasses["m3.serialization.EnumHandler"] = m3.serialization.EnumHandler;
m3.serialization.EnumHandler.__name__ = ["m3","serialization","EnumHandler"];
m3.serialization.EnumHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.EnumHandler.prototype = {
	write: function(value,writer) {
		return Std.string(value);
	}
	,read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("enum type can not populate a passed in instance");
		var type = Type.getClass(fromJson);
		var result = (function($this) {
			var $r;
			switch(type) {
			case String:
				$r = Type.createEnum($this._enum,fromJson);
				break;
			case Int:
				$r = Type.createEnumIndex($this._enum,fromJson);
				break;
			default:
				$r = (function($this) {
					var $r;
					reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not a String");
					$r = null;
					return $r;
				}($this));
			}
			return $r;
		}(this));
		return result;
	}
	,__class__: m3.serialization.EnumHandler
}
m3.serialization.ValueTypeHandler = function(valueType) {
	this._valueType = valueType;
};
$hxClasses["m3.serialization.ValueTypeHandler"] = m3.serialization.ValueTypeHandler;
m3.serialization.ValueTypeHandler.__name__ = ["m3","serialization","ValueTypeHandler"];
m3.serialization.ValueTypeHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.ValueTypeHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("value type can not populate a passed in instance");
		var type = Type["typeof"](fromJson);
		if(type == this._valueType) return fromJson; else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not an " + Std.string(this._valueType));
			return null;
		}
	}
	,__class__: m3.serialization.ValueTypeHandler
}
m3.serialization.DynamicArrayHandler = function() {
};
$hxClasses["m3.serialization.DynamicArrayHandler"] = m3.serialization.DynamicArrayHandler;
m3.serialization.DynamicArrayHandler.__name__ = ["m3","serialization","DynamicArrayHandler"];
m3.serialization.DynamicArrayHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.DynamicArrayHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		var classname = m3.serialization.ValueTypeTools.getClassname(Type["typeof"](fromJson));
		if(classname == "Array") return fromJson; else return reader.error("expected an array got a " + classname);
	}
	,__class__: m3.serialization.DynamicArrayHandler
}
m3.serialization.DynamicHandler = function() {
};
$hxClasses["m3.serialization.DynamicHandler"] = m3.serialization.DynamicHandler;
m3.serialization.DynamicHandler.__name__ = ["m3","serialization","DynamicHandler"];
m3.serialization.DynamicHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.DynamicHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		return fromJson;
	}
	,__class__: m3.serialization.DynamicHandler
}
m3.serialization.IntHandler = function() {
	m3.serialization.ValueTypeHandler.call(this,ValueType.TInt);
};
$hxClasses["m3.serialization.IntHandler"] = m3.serialization.IntHandler;
m3.serialization.IntHandler.__name__ = ["m3","serialization","IntHandler"];
m3.serialization.IntHandler.__super__ = m3.serialization.ValueTypeHandler;
m3.serialization.IntHandler.prototype = $extend(m3.serialization.ValueTypeHandler.prototype,{
	__class__: m3.serialization.IntHandler
});
m3.serialization.FloatHandler = function() {
	m3.serialization.ValueTypeHandler.call(this,ValueType.TFloat);
};
$hxClasses["m3.serialization.FloatHandler"] = m3.serialization.FloatHandler;
m3.serialization.FloatHandler.__name__ = ["m3","serialization","FloatHandler"];
m3.serialization.FloatHandler.__super__ = m3.serialization.ValueTypeHandler;
m3.serialization.FloatHandler.prototype = $extend(m3.serialization.ValueTypeHandler.prototype,{
	read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("value type can not populate a passed in instance");
		var type = Type["typeof"](fromJson);
		if(type == ValueType.TFloat || type == ValueType.TInt) return fromJson; else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not an " + Std.string(this._valueType));
			return null;
		}
	}
	,__class__: m3.serialization.FloatHandler
});
m3.serialization.BoolHandler = function() {
	m3.serialization.ValueTypeHandler.call(this,ValueType.TBool);
};
$hxClasses["m3.serialization.BoolHandler"] = m3.serialization.BoolHandler;
m3.serialization.BoolHandler.__name__ = ["m3","serialization","BoolHandler"];
m3.serialization.BoolHandler.__super__ = m3.serialization.ValueTypeHandler;
m3.serialization.BoolHandler.prototype = $extend(m3.serialization.ValueTypeHandler.prototype,{
	__class__: m3.serialization.BoolHandler
});
m3.serialization.StringHandler = function() {
};
$hxClasses["m3.serialization.StringHandler"] = m3.serialization.StringHandler;
m3.serialization.StringHandler.__name__ = ["m3","serialization","StringHandler"];
m3.serialization.StringHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.StringHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("StringHandler can not populate a passed in String, aka String's are immutable");
		var type = Type.getClass(fromJson);
		if(type == String || fromJson == null) return fromJson; else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not a String");
			return null;
		}
	}
	,__class__: m3.serialization.StringHandler
}
m3.serialization.DateHandler = function() {
};
$hxClasses["m3.serialization.DateHandler"] = m3.serialization.DateHandler;
m3.serialization.DateHandler.__name__ = ["m3","serialization","DateHandler"];
m3.serialization.DateHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.DateHandler.prototype = {
	write: function(value,writer) {
		return HxOverrides.dateStr(js.Boot.__cast(value , Date));
	}
	,read: function(fromJson,reader,instance) {
		return (function($this) {
			var $r;
			var s = fromJson;
			$r = HxOverrides.strDate(s);
			return $r;
		}(this));
	}
	,__class__: m3.serialization.DateHandler
}
m3.serialization.FunctionHandler = function() {
};
$hxClasses["m3.serialization.FunctionHandler"] = m3.serialization.FunctionHandler;
m3.serialization.FunctionHandler.__name__ = ["m3","serialization","FunctionHandler"];
m3.serialization.FunctionHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.FunctionHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("FunctionHandler can not populate a passed in String, aka String's are immutable");
		var type = Type.getClass(fromJson);
		if(type == String) {
			if(Std.string(fromJson).length > 0) try {
				return new Function('arg', fromJson);
			} catch( e ) {
				reader.error("unable to parse into a function -- " + Std.string(fromJson) + " -- " + Std.string(e));
				return null;
			} else return null;
		} else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not a String");
			return null;
		}
	}
	,__class__: m3.serialization.FunctionHandler
}
m3.serialization.Field = function() {
	this.required = true;
};
$hxClasses["m3.serialization.Field"] = m3.serialization.Field;
m3.serialization.Field.__name__ = ["m3","serialization","Field"];
m3.serialization.Field.prototype = {
	__class__: m3.serialization.Field
}
m3.serialization.ClassHandler = function(clazz,typename,serializer) {
	this._clazz = clazz;
	this._typename = typename;
	this._serializer = serializer;
	if(this._clazz == null) throw new m3.serialization.JsonException("clazz is null");
	var rtti = this._clazz.__rtti;
	if(rtti == null) {
		var msg = "no rtti found for " + this._typename;
		console.log(msg);
		throw new m3.serialization.JsonException(msg);
	}
	var x = Xml.parse(rtti).firstElement();
	var typeTree = new haxe.rtti.XmlParser().processElement(x);
	this._classDef = (function($this) {
		var $r;
		var $e = (typeTree);
		switch( $e[1] ) {
		case 1:
			var c = $e[2];
			$r = c;
			break;
		default:
			$r = (function($this) {
				var $r;
				throw new m3.serialization.JsonException("expected a class got " + Std.string(typeTree));
				return $r;
			}($this));
		}
		return $r;
	}(this));
	this._fields = new Array();
	var superClass = Type.getSuperClass(clazz);
	if(superClass != null) {
		var superClassHandler = new m3.serialization.ClassHandler(superClass,Type.getClassName(superClass),serializer);
		var _g = 0, _g1 = superClassHandler._fields;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this._fields.push(f);
		}
	}
	var $it0 = this._classDef.fields.iterator();
	while( $it0.hasNext() ) {
		var f = $it0.next();
		var field = new m3.serialization.Field();
		var $transient = false;
		var fieldXml = x.elementsNamed(f.name).next();
		var set = fieldXml.get("set");
		var $it1 = fieldXml.elementsNamed("meta");
		while( $it1.hasNext() ) {
			var meta = $it1.next();
			var $it2 = meta.elementsNamed("m");
			while( $it2.hasNext() ) {
				var m = $it2.next();
				var _g = m.get("n");
				switch(_g) {
				case ":optional":case "optional":
					field.required = false;
					break;
				case ":transient":case "transient":
					$transient = true;
					break;
				}
			}
		}
		if(!$transient && set != "method") {
			switch( (f.type)[1] ) {
			case 2:
			case 1:
			case 6:
			case 4:
			case 7:
				field.name = f.name;
				field.type = f.type;
				field.typename = m3.serialization.CTypeTools.typename(f.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			case 3:
				field.name = f.name;
				field.type = haxe.rtti.CType.CDynamic();
				field.typename = m3.serialization.CTypeTools.typename(field.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			default:
			}
		}
	}
	this._fieldsByName = new haxe.ds.StringMap();
	var _g = 0, _g1 = this._fields;
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		this._fieldsByName.set(f.name,f);
	}
};
$hxClasses["m3.serialization.ClassHandler"] = m3.serialization.ClassHandler;
m3.serialization.ClassHandler.__name__ = ["m3","serialization","ClassHandler"];
m3.serialization.ClassHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.ClassHandler.prototype = {
	write: function(instanceValue,writer) {
		var instance = { };
		if(instanceValue.writeResolve != null && Reflect.isFunction(instanceValue.writeResolve)) instanceValue.writeResolve();
		var _g = 0, _g1 = this._fields;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			try {
				var fieldValue = Reflect.field(instanceValue,f.name);
				if(fieldValue == null && !f.required) {
				} else {
					var jsonValue = f.handler.write(fieldValue,writer);
					instance[f.name] = jsonValue;
				}
			} catch( $e0 ) {
				if( js.Boot.__instanceof($e0,String) ) {
					var msg = $e0;
					throw new m3.serialization.JsonException("error writing field " + f.name + "\n" + msg);
				} else if( js.Boot.__instanceof($e0,m3.exception.Exception) ) {
					var e = $e0;
					throw new m3.serialization.JsonException("error writing field " + f.name,e);
				} else {
				var e = $e0;
				throw new m3.serialization.JsonException("error writing field " + f.name,e);
				}
			}
		}
		return instance;
	}
	,read: function(fromJson,reader,instance) {
		if(instance == null) instance = this.createInstance();
		var jsonFieldNames = Reflect.fields(fromJson);
		var _g = 0;
		while(_g < jsonFieldNames.length) {
			var jsonFieldName = jsonFieldNames[_g];
			++_g;
			if(!this._fieldsByName.exists(jsonFieldName)) reader.error("json has field named " + jsonFieldName + " instance of " + this._typename + " does not");
		}
		var _g = 0, _g1 = this._fields;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			if(f.required) {
				var found = false;
				if(m3.helper.ArrayHelper.contains(jsonFieldNames,f.name)) found = true;
				if(!found) reader.error("instance of " + this._typename + " has required field named " + f.name + " json does not does not " + haxe.Json.stringify(fromJson));
			}
		}
		var _g = 0;
		while(_g < jsonFieldNames.length) {
			var fieldName = jsonFieldNames[_g];
			++_g;
			var f = this._fieldsByName.get(fieldName);
			try {
				if(Lambda.empty(reader.stack)) reader.stack.push(fieldName); else reader.stack.push("." + fieldName);
				var rawValue = Reflect.field(fromJson,f.name);
				if(f.required || rawValue != null) {
					var value = f.handler.read(rawValue,reader);
					instance[f.name] = value;
				}
			} catch( $e0 ) {
				if( js.Boot.__instanceof($e0,String) ) {
					var msg = $e0;
					reader.error("error reading field " + fieldName + "\n" + msg);
				} else if( js.Boot.__instanceof($e0,m3.exception.Exception) ) {
					var e = $e0;
					reader.error("error reading field " + fieldName,e);
				} else {
				var e = $e0;
				reader.error("error reading field " + fieldName,e);
				}
			}
			reader.stack.pop();
		}
		if(instance.readResolve != null && Reflect.isFunction(instance.readResolve)) instance.readResolve();
		return instance;
	}
	,createInstance: function() {
		return Type.createInstance(this._clazz,[]);
	}
	,__class__: m3.serialization.ClassHandler
}
m3.serialization.JsonException = function(msg,cause) {
	m3.exception.Exception.call(this,msg,cause);
};
$hxClasses["m3.serialization.JsonException"] = m3.serialization.JsonException;
m3.serialization.JsonException.__name__ = ["m3","serialization","JsonException"];
m3.serialization.JsonException.__super__ = m3.exception.Exception;
m3.serialization.JsonException.prototype = $extend(m3.exception.Exception.prototype,{
	__class__: m3.serialization.JsonException
});
m3.serialization.JsonReader = function(serializer,strict) {
	this._serializer = serializer;
	this.stack = new Array();
	this.warnings = new Array();
	this.strict = strict;
};
$hxClasses["m3.serialization.JsonReader"] = m3.serialization.JsonReader;
m3.serialization.JsonReader.__name__ = ["m3","serialization","JsonReader"];
m3.serialization.JsonReader.prototype = {
	error: function(msg,cause) {
		if(this.strict) throw new m3.serialization.JsonException(msg,cause); else return null;
	}
	,read: function(fromJson,clazz,instance) {
		var handler = this._serializer.getHandlerViaClass(clazz);
		this.instance = handler.read(fromJson,this,instance);
	}
	,__class__: m3.serialization.JsonReader
}
m3.serialization.JsonWriter = function(serializer) {
	this._serializer = serializer;
};
$hxClasses["m3.serialization.JsonWriter"] = m3.serialization.JsonWriter;
m3.serialization.JsonWriter.__name__ = ["m3","serialization","JsonWriter"];
m3.serialization.JsonWriter.prototype = {
	write: function(value) {
		var clazz = m3.serialization.TypeTools.clazz(value);
		var handler = this._serializer.getHandlerViaClass(clazz);
		return handler.write(value,this);
	}
	,__class__: m3.serialization.JsonWriter
}
m3.serialization.TypeTools = function() { }
$hxClasses["m3.serialization.TypeTools"] = m3.serialization.TypeTools;
m3.serialization.TypeTools.__name__ = ["m3","serialization","TypeTools"];
m3.serialization.TypeTools.classname = function(clazz) {
	try {
		return Type.getClassName(clazz);
	} catch( err ) {
		throw new m3.exception.Exception(Std.string(err));
	}
}
m3.serialization.TypeTools.clazz = function(d) {
	var c = Type.getClass(d);
	if(c == null) console.log("tried to get class for type -- " + Std.string(Type["typeof"](d)) + " -- " + Std.string(d));
	return c;
}
m3.serialization.CTypeTools = function() { }
$hxClasses["m3.serialization.CTypeTools"] = m3.serialization.CTypeTools;
m3.serialization.CTypeTools.__name__ = ["m3","serialization","CTypeTools"];
m3.serialization.CTypeTools.classname = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 2:
			var parms = $e[3], path = $e[2];
			$r = path;
			break;
		case 1:
			var parms = $e[3], path = $e[2];
			$r = path;
			break;
		case 6:
			$r = "Dynamic";
			break;
		default:
			$r = (function($this) {
				var $r;
				throw new m3.exception.Exception("don't know how to handle " + Std.string(type));
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
m3.serialization.CTypeTools.typename = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 2:
			var parms = $e[3], path = $e[2];
			$r = m3.serialization.CTypeTools.makeTypename(path,parms);
			break;
		case 1:
			var parms = $e[3], path = $e[2];
			$r = m3.serialization.CTypeTools.makeTypename(path,parms);
			break;
		case 7:
			var parms = $e[3], path = $e[2];
			$r = m3.serialization.CTypeTools.makeTypename(path,parms);
			break;
		case 6:
			$r = "Dynamic";
			break;
		case 4:
			$r = "Function";
			break;
		default:
			$r = (function($this) {
				var $r;
				throw new m3.exception.Exception("don't know how to handle " + Std.string(type));
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
m3.serialization.CTypeTools.makeTypename = function(path,parms) {
	return parms.isEmpty()?path:path + "<" + Lambda.array(parms.map(function(ct) {
		return m3.serialization.CTypeTools.typename(ct);
	})).join(",") + ">";
}
m3.serialization.ValueTypeTools = function() { }
$hxClasses["m3.serialization.ValueTypeTools"] = m3.serialization.ValueTypeTools;
m3.serialization.ValueTypeTools.__name__ = ["m3","serialization","ValueTypeTools"];
m3.serialization.ValueTypeTools.getClassname = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 8:
			$r = "TUnknown";
			break;
		case 4:
			$r = "TObject";
			break;
		case 0:
			$r = "TNull";
			break;
		case 1:
			$r = "Int";
			break;
		case 5:
			$r = "TFunction";
			break;
		case 2:
			$r = "Float";
			break;
		case 3:
			$r = "Bool";
			break;
		case 7:
			var e = $e[2];
			$r = Type.getEnumName(e);
			break;
		case 6:
			var c = $e[2];
			$r = Type.getClassName(c);
			break;
		}
		return $r;
	}(this));
}
m3.serialization.ValueTypeTools.getName = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 8:
			$r = "TUnknown";
			break;
		case 4:
			$r = "TObject";
			break;
		case 0:
			$r = "TNull";
			break;
		case 1:
			$r = "Int";
			break;
		case 5:
			$r = "TFunction";
			break;
		case 2:
			$r = "Float";
			break;
		case 3:
			$r = "Bool";
			break;
		case 7:
			var e = $e[2];
			$r = "TEnum";
			break;
		case 6:
			var c = $e[2];
			$r = "TClass";
			break;
		}
		return $r;
	}(this));
}
m3.util.FixedSizeArray = function(maxSize) {
	this._maxSize = maxSize;
	this._delegate = new Array();
};
$hxClasses["m3.util.FixedSizeArray"] = m3.util.FixedSizeArray;
m3.util.FixedSizeArray.__name__ = ["m3","util","FixedSizeArray"];
m3.util.FixedSizeArray.prototype = {
	contains: function(t) {
		return m3.helper.ArrayHelper.contains(this._delegate,t);
	}
	,push: function(t) {
		if(this._delegate.length >= this._maxSize) this._delegate.shift();
		this._delegate.push(t);
	}
	,__class__: m3.util.FixedSizeArray
}
m3.util.ColorProvider = function() { }
$hxClasses["m3.util.ColorProvider"] = m3.util.ColorProvider;
m3.util.ColorProvider.__name__ = ["m3","util","ColorProvider"];
m3.util.ColorProvider.getNextColor = function() {
	if(m3.util.ColorProvider._INDEX >= m3.util.ColorProvider._COLORS.length) m3.util.ColorProvider._INDEX = 0;
	return m3.util.ColorProvider._COLORS[m3.util.ColorProvider._INDEX++];
}
m3.util.ColorProvider.getRandomColor = function() {
	var index;
	do index = Std.random(m3.util.ColorProvider._COLORS.length); while(m3.util.ColorProvider._LAST_COLORS_USED.contains(index));
	m3.util.ColorProvider._LAST_COLORS_USED.push(index);
	return m3.util.ColorProvider._COLORS[index];
}
m3.util.JqueryUtil = function() { }
$hxClasses["m3.util.JqueryUtil"] = m3.util.JqueryUtil;
$hxExpose(m3.util.JqueryUtil, "m3.util.JqueryUtil");
m3.util.JqueryUtil.__name__ = ["m3","util","JqueryUtil"];
m3.util.JqueryUtil.isAttached = function(elem) {
	return elem.parents("body").length > 0;
}
m3.util.JqueryUtil.labelSelect = function(elem,str) {
	try {
		m3.CrossMojo.jq("option",elem).filter(function() {
			return $(this).text() == str;
		})[0].selected = true;
	} catch( err ) {
	}
}
m3.util.JqueryUtil.getOrCreateDialog = function(selector,dlgOptions,createdFcn) {
	if(m3.helper.StringHelper.isBlank(selector)) selector = "dlg" + m3.util.UidGenerator.create(10);
	var dialog = new $(selector);
	if(dlgOptions == null) dlgOptions = { autoOpen : false, height : 380, width : 320, modal : true};
	if(!dialog.exists()) {
		dialog = new $("<div id=" + HxOverrides.substr(selector,1,null) + " style='display:none;'></div>");
		if(Reflect.isFunction(createdFcn)) createdFcn(dialog);
		new $("body").append(dialog);
		dialog.m3dialog(dlgOptions);
	} else if(!dialog["is"](":data(dialog)")) dialog.m3dialog(dlgOptions);
	return dialog;
}
m3.util.JqueryUtil.deleteEffects = function(dragstopEvt,width,duration,src) {
	if(src == null) src = "media/cloud.gif";
	if(duration == null) duration = 800;
	if(width == null) width = "70px";
	var img = new $("<img/>");
	img.appendTo("body");
	img.css("width",width);
	img.position({ my : "center", at : "center", of : dragstopEvt, collision : "fit"});
	img.attr("src",src);
	haxe.Timer.delay(function() {
		img.remove();
	},duration);
}
m3.util.JqueryUtil.confirm = function(title,question,action) {
	var dlg = new $("<div id=\"confirm-dialog\"></div>");
	var content = new $("<div style=\"width: 500px;text-align:left;\">" + question + "</div>");
	dlg.append(content);
	dlg.appendTo("body");
	var dlgOptions = { modal : true, title : title, zIndex : 10000, autoOpen : true, width : "auto", resizable : false, buttons : { Yes : function() {
		action();
		$(this).dialog("close");
	}, No : function() {
		$(this).dialog("close");
	}}, close : function(event,ui) {
		$(this).remove();
	}};
	dlg.dialog(dlgOptions);
}
m3.util.JqueryUtil.alert = function(statement,title,action) {
	if(title == null) title = "Alert";
	var dlg = new $("<div id=\"alert-dialog\"></div>");
	var content = new $("<div style=\"width: 500px;text-align:left;\">" + statement + "</div>");
	dlg.append(content);
	dlg.appendTo("body");
	var dlgOptions = { modal : true, title : title, zIndex : 10000, autoOpen : true, width : "auto", resizable : false, buttons : { OK : function() {
		$(this).dialog("close");
	}}, close : function(event,ui) {
		if(action != null) action();
		$(this).remove();
	}};
	dlg.dialog(dlgOptions);
}
m3.util.JqueryUtil.getWindowWidth = function() {
	return new $(js.Browser.window).width();
}
m3.util.JqueryUtil.getWindowHeight = function() {
	return new $(js.Browser.window).height();
}
m3.util.JqueryUtil.getDocumentWidth = function() {
	return new $(js.Browser.document).width();
}
m3.util.JqueryUtil.getDocumentHeight = function() {
	return new $(js.Browser.document).height();
}
m3.util.JqueryUtil.getEmptyDiv = function() {
	return new $("<div></div>");
}
m3.util.JqueryUtil.getEmptyTable = function() {
	return new $("<table style='margin:auto; text-align: center; width: 100%;'></table>");
}
m3.util.JqueryUtil.getEmptyRow = function() {
	return new $("<tr></tr>");
}
m3.util.JqueryUtil.getEmptyCell = function() {
	return new $("<td></td>");
}
m3.util.M = function() { }
$hxClasses["m3.util.M"] = m3.util.M;
m3.util.M.__name__ = ["m3","util","M"];
m3.util.M.makeSafeGetExpression = function(e,default0,pos) {
	if(default0 == null) default0 = m3.util.M.expr(haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("null")),pos);
	var dynamicType = haxe.macro.ComplexType.TPath({ sub : null, name : "Dynamic", pack : [], params : []});
	var catches = [{ type : dynamicType, name : "__e", expr : default0}];
	var result = haxe.macro.ExprDef.ETry(e,catches);
	return { expr : result, pos : pos};
}
m3.util.M.exprBlock = function(exprDefs,pos) {
	return { expr : haxe.macro.ExprDef.EBlock(m3.util.M.exprs(exprDefs,pos)), pos : pos};
}
m3.util.M.expr = function(exprDef,pos) {
	return { expr : exprDef, pos : pos};
}
m3.util.M.exprs = function(exprDefs,pos) {
	var arr = [];
	Lambda.iter(exprDefs,function(ed) {
		arr.push({ expr : ed, pos : pos});
	});
	return arr;
}
m3.util.SizedMap = function() {
	haxe.ds.StringMap.call(this);
	this.size = 0;
};
$hxClasses["m3.util.SizedMap"] = m3.util.SizedMap;
m3.util.SizedMap.__name__ = ["m3","util","SizedMap"];
m3.util.SizedMap.__super__ = haxe.ds.StringMap;
m3.util.SizedMap.prototype = $extend(haxe.ds.StringMap.prototype,{
	remove: function(key) {
		if(this.exists(key)) this.size--;
		return haxe.ds.StringMap.prototype.remove.call(this,key);
	}
	,set: function(key,val) {
		if(!this.exists(key)) this.size++;
		haxe.ds.StringMap.prototype.set.call(this,key,val);
	}
	,__class__: m3.util.SizedMap
});
m3.widget = {}
m3.widget.Widgets = function() { }
$hxClasses["m3.widget.Widgets"] = m3.widget.Widgets;
m3.widget.Widgets.__name__ = ["m3","widget","Widgets"];
m3.widget.Widgets.getSelf = function() {
	return this;
}
m3.widget.Widgets.getSelfElement = function() {
	return this.element;
}
m3.widget.Widgets.getWidgetClasses = function() {
	return " ui-widget";
}
var qoid = {}
qoid.AgentUi = function() { }
$hxClasses["qoid.AgentUi"] = qoid.AgentUi;
$hxExpose(qoid.AgentUi, "qoid.AgentUi");
qoid.AgentUi.__name__ = ["qoid","AgentUi"];
qoid.AgentUi.main = function() {
	qoid.AppContext.init();
	qoid.AgentUi.PROTOCOL = new qoid.api.ProtocolHandler();
	qoid.AgentUi.HOT_KEY_ACTIONS = new Array();
}
qoid.AgentUi.start = function() {
	var r = new $("<div></div>");
	qoid.AgentUi.HOT_KEY_ACTIONS.push(function(evt) {
		if(evt.altKey && evt.shiftKey && evt.keyCode == 82) {
			qoid.AppContext.LOGGER.debug("ALT + SHIFT + R");
			r.restoreWidget("open");
		}
	});
	new $("body").keyup(function(evt1) {
		if(m3.helper.ArrayHelper.hasValues(qoid.AgentUi.HOT_KEY_ACTIONS)) Lambda.iter(qoid.AgentUi.HOT_KEY_ACTIONS,function(act) {
			act(evt1);
		});
	});
	new $("#sideRightSearchInput").keyup(function(evt) {
		var search = new $(evt.target);
		var cl = new $("#connections");
		qoid.widget.ConnectionListHelper.filterConnections(cl,search.val());
	});
	new $("#middleContainer #content #tabs").tabs({ beforeActivate : function(evt,ui) {
		var max_height = Math.max(new $("#tabs-feed").height(),new $("#tabs-score").height());
		ui.newPanel.height(max_height);
	}});
	new $("#sideRight #chat").messagingComp();
	new $("#connectionsTabsDiv").connectionsTabs();
	new $("#labelsList").labelsList();
	new $("#filter").filterComp();
	new $("#feed").contentFeed();
	new $("#userId").AliasComp();
	new $("#postInput").postComp();
	new $("#sideRight #sideRightInvite").inviteComp();
	new $("#score-div").scoreComp();
	new $("body").click(function(evt) {
		new $(".nonmodalPopup").hide();
	});
	r.appendTo(new $(js.Browser.document.body));
	r.restoreWidget();
	qoid.widget.DialogManager.showLogin();
}
qoid.AppContext = function() { }
$hxClasses["qoid.AppContext"] = qoid.AppContext;
qoid.AppContext.__name__ = ["qoid","AppContext"];
qoid.AppContext.init = function() {
	qoid.AppContext.LOGGER = new m3.log.Logga(m3.log.LogLevel.DEBUG);
	qoid.AppContext.INTRODUCTIONS = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
	qoid.AppContext.MASTER_NOTIFICATIONS = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
	qoid.AppContext.NOTIFICATIONS = new m3.observable.FilteredSet(qoid.AppContext.MASTER_NOTIFICATIONS,function(a) {
		return !a.deleted && !a.consumed;
	});
	qoid.AppContext.MASTER_ALIASES = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
	qoid.AppContext.MASTER_ALIASES.listen(function(a,evt) {
		if(evt.isAddOrUpdate()) {
			var p = m3.helper.OSetHelper.getElementComplex(qoid.AppContext.PROFILES,a.iid,"aliasIid");
			if(p != null) a.profile = p;
			if(evt.isAdd()) qoid.model.EM.change(qoid.model.EMEvent.AliasCreated,a); else qoid.model.EM.change(qoid.model.EMEvent.AliasUpdated,a);
		}
	});
	qoid.AppContext.ALIASES = new m3.observable.FilteredSet(qoid.AppContext.MASTER_ALIASES,function(a) {
		return !a.deleted;
	});
	qoid.AppContext.MASTER_LABELS = new m3.observable.ObservableSet(qoid.model.Label.identifier);
	qoid.AppContext.LABELS = new m3.observable.FilteredSet(qoid.AppContext.MASTER_LABELS,function(c) {
		return !c.deleted;
	});
	qoid.AppContext.MASTER_CONNECTIONS = new m3.observable.ObservableSet(qoid.model.Connection.identifier);
	qoid.AppContext.MASTER_CONNECTIONS.listen(function(c,evt) {
		if(evt.isAdd()) qoid.AgentUi.PROTOCOL.getProfiles([c.iid]);
	});
	qoid.AppContext.GROUPED_CONNECTIONS = new m3.observable.GroupedSet(qoid.AppContext.MASTER_CONNECTIONS,function(c) {
		if(c.deleted) return "DELETED";
		return c.aliasIid;
	});
	qoid.AppContext.MASTER_LABELACLS = new m3.observable.ObservableSet(qoid.model.LabelAcl.identifier);
	qoid.AppContext.GROUPED_LABELACLS = new m3.observable.GroupedSet(qoid.AppContext.MASTER_LABELACLS,function(l) {
		if(l.deleted) return "DELETED";
		return l.connectionIid;
	});
	qoid.AppContext.MASTER_LABELCHILDREN = new m3.observable.ObservableSet(qoid.model.LabelChild.identifier);
	qoid.AppContext.GROUPED_LABELCHILDREN = new m3.observable.GroupedSet(qoid.AppContext.MASTER_LABELCHILDREN,function(lc) {
		if(lc.deleted) return "DELETED";
		return lc.parentIid;
	});
	qoid.AppContext.MASTER_LABELEDCONTENT = new m3.observable.ObservableSet(qoid.model.LabeledContent.identifier);
	qoid.AppContext.GROUPED_LABELEDCONTENT = new m3.observable.GroupedSet(qoid.AppContext.MASTER_LABELEDCONTENT,function(lc) {
		if(lc.deleted) return "DELETED";
		return lc.contentIid;
	});
	qoid.AppContext.PROFILES = new m3.observable.ObservableSet(qoid.model.Profile.identifier);
	qoid.AppContext.PROFILES.listen(function(p,evt) {
		if(evt.isAddOrUpdate()) {
			var alias = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_ALIASES,p.aliasIid);
			if(alias != null) {
				alias.profile = p;
				qoid.AppContext.MASTER_ALIASES.addOrUpdate(alias);
			}
		}
	});
	qoid.AppContext.SERIALIZER = new m3.serialization.Serializer();
	qoid.AppContext.SERIALIZER.addHandler(qoid.model.Content,new qoid.model.ContentHandler());
	qoid.AppContext.SERIALIZER.addHandler(qoid.model.Notification,new qoid.model.NotificationHandler());
	qoid.AppContext.registerGlobalListeners();
}
qoid.AppContext.isAliasRootLabel = function(iid) {
	var $it0 = qoid.AppContext.ALIASES.iterator();
	while( $it0.hasNext() ) {
		var alias = $it0.next();
		if(alias.rootLabelIid == iid) return true;
	}
	return false;
}
qoid.AppContext.getUberLabelIid = function() {
	return m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_ALIASES,qoid.AppContext.UBER_ALIAS_ID).rootLabelIid;
}
qoid.AppContext.registerGlobalListeners = function() {
	new $(js.Browser.window).on("unload",function(evt) {
		qoid.model.EM.change(qoid.model.EMEvent.UserLogout);
	});
	qoid.model.EM.addListener(qoid.model.EMEvent.InitialDataLoadComplete,function(nada) {
		var uberAlias = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_ALIASES,qoid.AppContext.UBER_ALIAS_ID);
		qoid.AppContext.ROOT_LABEL_ID = uberAlias.rootLabelIid;
		qoid.AppContext.currentAlias = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_ALIASES,qoid.AppContext.UBER_ALIAS_ID);
		var $it0 = qoid.AppContext.ALIASES.iterator();
		while( $it0.hasNext() ) {
			var alias = $it0.next();
			if(alias.data.isDefault == true) {
				qoid.AppContext.currentAlias = alias;
				break;
			}
		}
		qoid.model.EM.change(qoid.model.EMEvent.AliasLoaded,qoid.AppContext.currentAlias);
	},"AppContext-InitialDataLoadComplete");
	qoid.model.EM.addListener(qoid.model.EMEvent.FitWindow,function(n) {
		fitWindow();
	},"AppContext-FitWindow");
}
qoid.AppContext.getLabelDescendents = function(iid) {
	var labelDescendents = new m3.observable.ObservableSet(qoid.model.Label.identifier);
	var getDescendentIids;
	getDescendentIids = function(iid1,iidList) {
		iidList.splice(0,0,iid1);
		var children = new m3.observable.FilteredSet(qoid.AppContext.MASTER_LABELCHILDREN,function(lc) {
			return lc.parentIid == iid1 && !lc.deleted;
		}).asArray();
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var i = _g1++;
			getDescendentIids(children[i].childIid,iidList);
		}
	};
	var iid_list = new Array();
	getDescendentIids(iid,iid_list);
	var _g = 0;
	while(_g < iid_list.length) {
		var iid_ = iid_list[_g];
		++_g;
		var label = m3.helper.OSetHelper.getElement(qoid.AppContext.LABELS,iid_);
		if(label == null) qoid.AppContext.LOGGER.error("LabelChild references missing label: " + iid_); else if(!label.deleted) labelDescendents.add(label);
	}
	return labelDescendents;
}
qoid.AppContext.connectionFromMetaLabel = function(metaLabelIid) {
	var ret = null;
	var $it0 = qoid.AppContext.MASTER_CONNECTIONS.iterator();
	while( $it0.hasNext() ) {
		var connection = $it0.next();
		if(connection.metaLabelIid == metaLabelIid) {
			ret = connection;
			break;
		}
	}
	return ret;
}
qoid.api = {}
qoid.api.ChannelMessage = function() { }
$hxClasses["qoid.api.ChannelMessage"] = qoid.api.ChannelMessage;
qoid.api.ChannelMessage.__name__ = ["qoid","api","ChannelMessage"];
qoid.api.BennuMessage = function(type) {
	this.type = type;
};
$hxClasses["qoid.api.BennuMessage"] = qoid.api.BennuMessage;
qoid.api.BennuMessage.__name__ = ["qoid","api","BennuMessage"];
qoid.api.BennuMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.BennuMessage.prototype = {
	__class__: qoid.api.BennuMessage
}
qoid.api.DeleteMessage = function(type,primaryKey) {
	qoid.api.BennuMessage.call(this,type);
	this.primaryKey = primaryKey;
};
$hxClasses["qoid.api.DeleteMessage"] = qoid.api.DeleteMessage;
qoid.api.DeleteMessage.__name__ = ["qoid","api","DeleteMessage"];
qoid.api.DeleteMessage.create = function(object) {
	return new qoid.api.DeleteMessage(object.objectType(),object.iid);
}
qoid.api.DeleteMessage.__super__ = qoid.api.BennuMessage;
qoid.api.DeleteMessage.prototype = $extend(qoid.api.BennuMessage.prototype,{
	__class__: qoid.api.DeleteMessage
});
qoid.api.CrudMessage = function(type,instance,optionals) {
	qoid.api.BennuMessage.call(this,type);
	this.instance = instance;
	if(optionals != null) {
		this.parentIid = optionals.parentIid;
		this.profileName = optionals.profileName;
		this.profileImgSrc = optionals.profileImgSrc;
		this.labelIids = optionals.labelIids;
	}
};
$hxClasses["qoid.api.CrudMessage"] = qoid.api.CrudMessage;
qoid.api.CrudMessage.__name__ = ["qoid","api","CrudMessage"];
qoid.api.CrudMessage.create = function(object,optionals) {
	var instance = qoid.AppContext.SERIALIZER.toJson(object);
	return new qoid.api.CrudMessage(object.objectType(),instance,optionals);
}
qoid.api.CrudMessage.__super__ = qoid.api.BennuMessage;
qoid.api.CrudMessage.prototype = $extend(qoid.api.BennuMessage.prototype,{
	__class__: qoid.api.CrudMessage
});
qoid.api.DeregisterMessage = function(handle) {
	this.handle = handle;
};
$hxClasses["qoid.api.DeregisterMessage"] = qoid.api.DeregisterMessage;
qoid.api.DeregisterMessage.__name__ = ["qoid","api","DeregisterMessage"];
qoid.api.DeregisterMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.DeregisterMessage.prototype = {
	__class__: qoid.api.DeregisterMessage
}
qoid.api.IntroMessage = function(i) {
	this.aConnectionIid = i.aConnectionIid;
	this.aMessage = i.aMessage;
	this.bConnectionIid = i.bConnectionIid;
	this.bMessage = i.bMessage;
};
$hxClasses["qoid.api.IntroMessage"] = qoid.api.IntroMessage;
qoid.api.IntroMessage.__name__ = ["qoid","api","IntroMessage"];
qoid.api.IntroMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.IntroMessage.prototype = {
	__class__: qoid.api.IntroMessage
}
qoid.api.VerificationRequestMessage = function(vr) {
	this.contentIid = vr.contentIid;
	this.connectionIids = vr.connectionIids;
	this.message = vr.message;
};
$hxClasses["qoid.api.VerificationRequestMessage"] = qoid.api.VerificationRequestMessage;
qoid.api.VerificationRequestMessage.__name__ = ["qoid","api","VerificationRequestMessage"];
qoid.api.VerificationRequestMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.VerificationRequestMessage.prototype = {
	__class__: qoid.api.VerificationRequestMessage
}
qoid.api.VerificationResponseMessage = function(vr) {
	this.notificationIid = vr.notificationIid;
	this.verificationContent = vr.verificationContent;
};
$hxClasses["qoid.api.VerificationResponseMessage"] = qoid.api.VerificationResponseMessage;
qoid.api.VerificationResponseMessage.__name__ = ["qoid","api","VerificationResponseMessage"];
qoid.api.VerificationResponseMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.VerificationResponseMessage.prototype = {
	__class__: qoid.api.VerificationResponseMessage
}
qoid.api.AcceptVerificationMessage = function(notificationIid) {
	this.notificationIid = notificationIid;
};
$hxClasses["qoid.api.AcceptVerificationMessage"] = qoid.api.AcceptVerificationMessage;
qoid.api.AcceptVerificationMessage.__name__ = ["qoid","api","AcceptVerificationMessage"];
qoid.api.AcceptVerificationMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.AcceptVerificationMessage.prototype = {
	__class__: qoid.api.AcceptVerificationMessage
}
qoid.api.IntroResponseMessage = function(notificationIid,accepted) {
	this.notificationIid = notificationIid;
	this.accepted = accepted;
};
$hxClasses["qoid.api.IntroResponseMessage"] = qoid.api.IntroResponseMessage;
qoid.api.IntroResponseMessage.__name__ = ["qoid","api","IntroResponseMessage"];
qoid.api.IntroResponseMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.IntroResponseMessage.prototype = {
	__class__: qoid.api.IntroResponseMessage
}
qoid.api.GetProfileMessage = function(connectionIids) {
	this.connectionIids = connectionIids == null?new Array():connectionIids;
};
$hxClasses["qoid.api.GetProfileMessage"] = qoid.api.GetProfileMessage;
qoid.api.GetProfileMessage.__name__ = ["qoid","api","GetProfileMessage"];
qoid.api.GetProfileMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.GetProfileMessage.prototype = {
	__class__: qoid.api.GetProfileMessage
}
qoid.api.QueryMessage = function(fd,type,q) {
	if(fd == null) {
		this.type = type;
		this.q = q;
		this.aliasIid = null;
		this.connectionIids = new Array();
	} else {
		this.type = fd.type;
		this.q = fd.filter.q;
		this.aliasIid = fd.aliasIid;
		this.connectionIids = fd.connectionIids;
	}
	this.local = true;
	this.historical = true;
	this.standing = true;
};
$hxClasses["qoid.api.QueryMessage"] = qoid.api.QueryMessage;
qoid.api.QueryMessage.__name__ = ["qoid","api","QueryMessage"];
qoid.api.QueryMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.QueryMessage.create = function(type) {
	return new qoid.api.QueryMessage(null,type,"1=1");
}
qoid.api.QueryMessage.prototype = {
	__class__: qoid.api.QueryMessage
}
qoid.api.ChannelRequestMessage = function(path,context,msg) {
	this.path = path;
	this.context = context;
	this.parms = qoid.AppContext.SERIALIZER.toJson(msg);
};
$hxClasses["qoid.api.ChannelRequestMessage"] = qoid.api.ChannelRequestMessage;
qoid.api.ChannelRequestMessage.__name__ = ["qoid","api","ChannelRequestMessage"];
qoid.api.ChannelRequestMessage.prototype = {
	__class__: qoid.api.ChannelRequestMessage
}
qoid.api.ChannelRequestMessageBundle = function(requests_) {
	this.channel = qoid.AppContext.SUBMIT_CHANNEL;
	if(requests_ == null) this.requests = new Array(); else this.requests = requests_;
};
$hxClasses["qoid.api.ChannelRequestMessageBundle"] = qoid.api.ChannelRequestMessageBundle;
qoid.api.ChannelRequestMessageBundle.__name__ = ["qoid","api","ChannelRequestMessageBundle"];
qoid.api.ChannelRequestMessageBundle.prototype = {
	addRequest: function(path,context,parms) {
		var request = new qoid.api.ChannelRequestMessage(path,context,parms);
		this.addChannelRequest(request);
	}
	,addChannelRequest: function(request) {
		this.requests.push(request);
	}
	,__class__: qoid.api.ChannelRequestMessageBundle
}
qoid.api.EventDelegate = function(protocolHandler) {
	this.filterIsRunning = false;
	this.protocolHandler = protocolHandler;
	this._setUpEventListeners();
};
$hxClasses["qoid.api.EventDelegate"] = qoid.api.EventDelegate;
qoid.api.EventDelegate.__name__ = ["qoid","api","EventDelegate"];
qoid.api.EventDelegate.prototype = {
	_setUpEventListeners: function() {
		var _g = this;
		qoid.model.EM.addListener(qoid.model.EMEvent.FILTER_RUN,function(filterData) {
			_g.protocolHandler.filter(filterData);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.CreateAlias,function(alias) {
			_g.protocolHandler.createAlias(alias);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.DeleteAlias,function(alias) {
			_g.protocolHandler.deleteAlias(alias);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.UpdateAlias,function(alias) {
			_g.protocolHandler.updateAlias(alias);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.UserLogin,function(login) {
			_g.protocolHandler.login(login);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.CreateAgent,function(user) {
			_g.protocolHandler.createAgent(user);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.CreateContent,function(data) {
			_g.protocolHandler.createContent(data);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.UpdateContent,function(data) {
			_g.protocolHandler.updateContent(data);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.DeleteContent,function(data) {
			_g.protocolHandler.deleteContent(data);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.CreateLabel,function(data) {
			_g.protocolHandler.createLabel(data);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.UpdateLabel,function(data) {
			_g.protocolHandler.updateLabel(data);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.MoveLabel,function(data) {
			_g.protocolHandler.moveLabel(data);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.CopyLabel,function(data) {
			_g.protocolHandler.copyLabel(data);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.DeleteLabel,function(data) {
			_g.protocolHandler.deleteLabel(data);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.RespondToIntroduction,function(intro) {
			_g.protocolHandler.confirmIntroduction(intro);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.INTRODUCTION_REQUEST,function(intro) {
			_g.protocolHandler.beginIntroduction(intro);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.GrantAccess,function(parms) {
			_g.protocolHandler.grantAccess(parms.connectionIid,parms.labelIid);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.RevokeAccess,function(lacls) {
			_g.protocolHandler.revokeAccess(lacls);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.DeleteConnection,function(c) {
			_g.protocolHandler.deleteConnection(c);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.UserLogout,function(c) {
			_g.protocolHandler.deregisterAllSqueries();
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.TargetChange,function(conn) {
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.BACKUP,function(n) {
			_g.protocolHandler.backup();
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.RESTORE,function(n) {
			_g.protocolHandler.restore();
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.VerificationRequest,function(vr) {
			_g.protocolHandler.verificationRequest(vr);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.RespondToVerification,function(vr) {
			_g.protocolHandler.respondToVerificationRequest(vr);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.AcceptVerification,function(notificationIid) {
			_g.protocolHandler.acceptVerification(notificationIid);
		});
	}
	,__class__: qoid.api.EventDelegate
}
qoid.api.ProtocolHandler = function() {
	this.eventDelegate = new qoid.api.EventDelegate(this);
	this.registeredHandles = new Array();
};
$hxClasses["qoid.api.ProtocolHandler"] = qoid.api.ProtocolHandler;
qoid.api.ProtocolHandler.__name__ = ["qoid","api","ProtocolHandler"];
qoid.api.ProtocolHandler.prototype = {
	restores: function() {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,restore: function() {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,backup: function() {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,_startPolling: function(channelId) {
		var timeout = 10000;
		var ajaxOptions = { contentType : "", type : "GET"};
		this.listeningChannel = new m3.comm.LongPollingRequest(channelId,"",qoid.AppContext.LOGGER,qoid.api.ResponseProcessor.processResponse,ajaxOptions);
		this.listeningChannel.timeout = timeout;
		this.listeningChannel.start();
	}
	,onCreateSubmitChannel: function(data,textStatus,jqXHR) {
		qoid.AppContext.SUBMIT_CHANNEL = data.channelId;
		qoid.AppContext.UBER_ALIAS_ID = data.aliasIid;
		this._startPolling(data.channelId);
		var context = qoid.api.Synchronizer.createContext(9,"initialDataLoad");
		var requests = [new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("alias")),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("introduction")),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("connection")),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("notification")),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("label")),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("labelAcl")),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("labeledContent")),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("labelChild")),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("profile"))];
		new qoid.api.SubmitRequest(requests).start();
	}
	,acceptVerification: function(notificationIid) {
		var context = qoid.api.Synchronizer.createContext(1,"acceptVerification");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.VERIFICATION_ACCEPT,context,new qoid.api.AcceptVerificationMessage(notificationIid))]);
		req.start();
	}
	,respondToVerificationRequest: function(vr) {
		var context = qoid.api.Synchronizer.createContext(1,"respondToVerificationRequest");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.VERIFICATION_RESPONSE,context,new qoid.api.VerificationResponseMessage(vr))]);
		req.start();
	}
	,verificationRequest: function(vr) {
		var context = qoid.api.Synchronizer.createContext(1,"verificationRequest");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.VERIFICATION_REQUEST,context,new qoid.api.VerificationRequestMessage(vr))]);
		req.start();
	}
	,deleteLabel: function(data) {
		var labelChildren = new m3.observable.FilteredSet(qoid.AppContext.MASTER_LABELCHILDREN,function(lc) {
			return lc.parentIid == data.parentIid && lc.childIid == data.label.iid;
		}).asArray();
		var context = qoid.api.Synchronizer.createContext(labelChildren.length,"labelDeleted");
		var requests = new Array();
		var _g = 0;
		while(_g < labelChildren.length) {
			var lc = labelChildren[_g];
			++_g;
			lc.deleted = true;
			requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lc)));
		}
		new qoid.api.SubmitRequest(requests).start();
	}
	,copyLabel: function(data) {
		var lcToAdd = this.getExistingLabelChild(data.newParentId,data.label.iid);
		if(lcToAdd == null) lcToAdd = new qoid.model.LabelChild(data.newParentId,data.label.iid); else lcToAdd.deleted = false;
		var context = qoid.api.Synchronizer.createContext(1,"labelCopied");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(lcToAdd))]);
		req.start();
	}
	,moveLabel: function(data) {
		var lcs = new m3.observable.FilteredSet(qoid.AppContext.MASTER_LABELCHILDREN,function(lc) {
			return lc.parentIid == data.parentIid && lc.childIid == data.label.iid;
		});
		var lcToRemove = this.getExistingLabelChild(data.parentIid,data.label.iid);
		var lcToAdd = this.getExistingLabelChild(data.newParentId,data.label.iid);
		if(lcToAdd == null) lcToAdd = new qoid.model.LabelChild(data.newParentId,data.label.iid); else lcToAdd.deleted = false;
		var context = qoid.api.Synchronizer.createContext(2,"labelMoved");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lcToRemove)),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(lcToAdd))]);
		req.start();
	}
	,getExistingLabelChild: function(parentIid,childIid) {
		var lcs = new m3.observable.FilteredSet(qoid.AppContext.MASTER_LABELCHILDREN,function(lc) {
			return lc.parentIid == parentIid && lc.childIid == childIid;
		});
		return lcs.iterator().next();
	}
	,updateLabel: function(data) {
		var context = qoid.api.Synchronizer.createContext(1,"labelUpdated");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(data.label))]);
		req.start();
	}
	,createLabel: function(data) {
		var context = qoid.api.Synchronizer.createContext(1,"labelCreated");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(data.label,{ parentIid : data.parentIid}))]);
		req.start();
	}
	,deleteContent: function(data) {
		var context = qoid.api.Synchronizer.createContext(1 + data.labelIids.length,"contentDeleted");
		var requests = new Array();
		data.content.deleted = true;
		requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(data.content)));
		var $it0 = qoid.AppContext.GROUPED_LABELEDCONTENT.delegate().get(data.content.iid).iterator();
		while( $it0.hasNext() ) {
			var lc = $it0.next();
			lc.deleted = true;
			requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lc)));
		}
		new qoid.api.SubmitRequest(requests).start();
	}
	,updateContent: function(data) {
		var currentLabels = qoid.AppContext.GROUPED_LABELEDCONTENT.delegate().get(data.content.iid);
		var labelsToDelete = new Array();
		var $it0 = currentLabels.iterator();
		while( $it0.hasNext() ) {
			var labeledContent = $it0.next();
			var found = false;
			var _g = 0, _g1 = data.labelIids;
			while(_g < _g1.length) {
				var iid = _g1[_g];
				++_g;
				if(iid == labeledContent.labelIid) {
					found = true;
					break;
				}
			}
			if(!found) labelsToDelete.push(labeledContent);
		}
		var labelsToAdd = new Array();
		var _g = 0, _g1 = data.labelIids;
		while(_g < _g1.length) {
			var iid = _g1[_g];
			++_g;
			var found = false;
			var $it1 = currentLabels.iterator();
			while( $it1.hasNext() ) {
				var labeledContent = $it1.next();
				if(iid == labeledContent.labelIid) {
					found = true;
					break;
				}
			}
			if(!found) labelsToAdd.push(new qoid.model.LabeledContent(data.content.iid,iid));
		}
		var context = qoid.api.Synchronizer.createContext(1 + labelsToAdd.length + labelsToDelete.length,"contentUpdated");
		var requests = new Array();
		requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(data.content)));
		var _g = 0;
		while(_g < labelsToDelete.length) {
			var lc = labelsToDelete[_g];
			++_g;
			lc.deleted = true;
			requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lc)));
		}
		var _g = 0;
		while(_g < labelsToAdd.length) {
			var lc = labelsToAdd[_g];
			++_g;
			requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(lc)));
		}
		new qoid.api.SubmitRequest(requests).start();
	}
	,createContent: function(data) {
		var context = qoid.api.Synchronizer.createContext(1 + data.labelIids.length,"contentCreated");
		var requests = new Array();
		requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(data.content)));
		var _g = 0, _g1 = data.labelIids;
		while(_g < _g1.length) {
			var iid = _g1[_g];
			++_g;
			var labeledContent = new qoid.model.LabeledContent(data.content.iid,iid);
			requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(labeledContent)));
		}
		new qoid.api.SubmitRequest(requests).start();
	}
	,deleteAlias: function(alias) {
		alias.deleted = true;
		var context = qoid.api.Synchronizer.createContext(1,"aliasDeleted");
		new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(alias))]).start();
	}
	,updateAlias: function(alias) {
		alias.name = alias.profile.name;
		var context = qoid.api.Synchronizer.createContext(1,"aliasUpdated");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(alias)),new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(alias.profile))]);
		req.start();
	}
	,createAlias: function(alias) {
		alias.name = alias.profile.name;
		var options = { profileName : alias.profile.name, profileImgSrc : alias.profile.imgSrc, parentIid : qoid.AppContext.ROOT_LABEL_ID};
		var context = qoid.api.Synchronizer.createContext(1,"aliasCreated");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(alias,options))]);
		req.start();
	}
	,filter: function(filterData) {
		var context = qoid.api.Synchronizer.createContext(1,"filterContent");
		var requests = [new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,new qoid.api.QueryMessage(filterData))];
		new qoid.api.SubmitRequest(requests).start();
	}
	,revokeAccess: function(lacls) {
		var context = qoid.api.Synchronizer.createContext(1,"accessRevoked");
		var requests = new Array();
		var _g = 0;
		while(_g < lacls.length) {
			var lacl = lacls[_g];
			++_g;
			lacl.deleted = true;
			requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lacl)));
		}
		new qoid.api.SubmitRequest(requests).start();
	}
	,grantAccess: function(connectionIid,labelIid) {
		var acl = new qoid.model.LabelAcl(connectionIid,labelIid);
		var context = qoid.api.Synchronizer.createContext(1,"grantAccess");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(acl))]);
		req.start();
	}
	,deleteConnection: function(c) {
		c.deleted = true;
		var context = qoid.api.Synchronizer.createContext(1,"connectionDeleted");
		new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(c))]).start();
	}
	,confirmIntroduction: function(confirmation) {
		var context = qoid.api.Synchronizer.createContext(1,"confirmIntroduction");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.INTRO_RESPONSE,context,confirmation)]);
		req.start();
	}
	,beginIntroduction: function(intro) {
		var context = qoid.api.Synchronizer.createContext(1,"beginIntroduction");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.INTRODUCE,context,new qoid.api.IntroMessage(intro))]);
		req.start();
	}
	,createAgent: function(newUser) {
		var req = new qoid.api.SimpleRequest("/api/agent/create/" + newUser.name,"",function(data,textStatus,jqXHR) {
			qoid.model.EM.change(qoid.model.EMEvent.AgentCreated);
		});
		req.start();
	}
	,login: function(login) {
		this.createChannel(login.agentId,$bind(this,this.onCreateSubmitChannel));
	}
	,getProfiles: function(connectionIids) {
		var context = qoid.api.Synchronizer.createContext(1,"connectionProfile");
		var qm = qoid.api.QueryMessage.create("profile");
		qm.connectionIids = connectionIids;
		qm.local = false;
		new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.QUERY,context,qm)]).start();
	}
	,deregisterSqueries: function(handles) {
		var context = qoid.api.Synchronizer.createContext(handles.length,"deregisterSqueriesResponse");
		var requests = new Array();
		var _g = 0;
		while(_g < handles.length) {
			var handle = handles[_g];
			++_g;
			requests.push(new qoid.api.ChannelRequestMessage(qoid.api.ProtocolHandler.DEREGISTER,context,new qoid.api.DeregisterMessage(handle)));
			HxOverrides.remove(this.registeredHandles,handle);
		}
		new qoid.api.SubmitRequest(requests).start({ async : false});
	}
	,deregisterAllSqueries: function() {
		if(this.registeredHandles.length > 0) this.deregisterSqueries(this.registeredHandles.slice());
	}
	,addHandle: function(handle) {
		this.registeredHandles.push(handle);
	}
	,createChannel: function(aliasName,successFunc) {
		new qoid.api.SimpleRequest("/api/channel/create/" + aliasName,"",successFunc).start();
	}
	,__class__: qoid.api.ProtocolHandler
}
qoid.api.SimpleRequest = function(path,data,successFcn) {
	this.baseOpts = { async : true, url : path};
	m3.comm.BaseRequest.call(this,data,successFcn);
};
$hxClasses["qoid.api.SimpleRequest"] = qoid.api.SimpleRequest;
qoid.api.SimpleRequest.__name__ = ["qoid","api","SimpleRequest"];
qoid.api.SimpleRequest.__super__ = m3.comm.BaseRequest;
qoid.api.SimpleRequest.prototype = $extend(m3.comm.BaseRequest.prototype,{
	__class__: qoid.api.SimpleRequest
});
qoid.api.SubmitRequest = function(msgs,successFcn) {
	this.baseOpts = { dataType : "text", async : true, url : "/api/channel/submit"};
	if(successFcn == null) successFcn = function(data,textStatus,jqXHR) {
	};
	var bundle = new qoid.api.ChannelRequestMessageBundle(msgs);
	var data = qoid.AppContext.SERIALIZER.toJsonString(bundle);
	m3.comm.BaseRequest.call(this,data,successFcn);
};
$hxClasses["qoid.api.SubmitRequest"] = qoid.api.SubmitRequest;
qoid.api.SubmitRequest.__name__ = ["qoid","api","SubmitRequest"];
qoid.api.SubmitRequest.__super__ = m3.comm.BaseRequest;
qoid.api.SubmitRequest.prototype = $extend(m3.comm.BaseRequest.prototype,{
	__class__: qoid.api.SubmitRequest
});
qoid.api.ResponseProcessor = function() { }
$hxClasses["qoid.api.ResponseProcessor"] = qoid.api.ResponseProcessor;
qoid.api.ResponseProcessor.__name__ = ["qoid","api","ResponseProcessor"];
qoid.api.ResponseProcessor.processResponse = function(dataArr,textStatus,jqXHR) {
	if(dataArr == null || dataArr.length == 0) return;
	Lambda.iter(dataArr,function(data) {
		if(data.success == false) {
			m3.util.JqueryUtil.alert("ERROR:  " + Std.string(data.error.message) + "     Context: " + Std.string(data.context));
			qoid.AppContext.LOGGER.error(data.error.stacktrace);
		} else {
			if(data.context == null) return;
			var context = new qoid.model.Context(data.context);
			switch(context.oncomplete) {
			case "beginIntroduction":
				qoid.api.ResponseProcessor.beginIntroduction();
				break;
			case "confirmIntroduction":
				qoid.api.ResponseProcessor.confirmIntroduction();
				break;
			case "connectionProfile":
				qoid.api.ResponseProcessor.processProfile(data);
				break;
			case "grantAccess":
				qoid.api.ResponseProcessor.grantAccess();
				break;
			case "initialDataLoad":
				if(data.responseType == "query") qoid.api.Synchronizer.processResponse(data); else if(data.responseType == "squery") qoid.api.ResponseProcessor.updateModelObject(data.type,data.results); else if(data.result && data.result.handle) qoid.AgentUi.PROTOCOL.addHandle(data.result.handle);
				break;
			case "filterContent":
				if(data.responseType == "query") qoid.model.EM.change(qoid.model.EMEvent.LoadFilteredContent,data); else if(data.responseType == "squery") qoid.model.EM.change(qoid.model.EMEvent.AppendFilteredContent,data); else if(data.result && data.result.handle) qoid.AgentUi.PROTOCOL.addHandle(data.result.handle);
				break;
			case "verificationRequest":
				if(data.result == "success") qoid.model.EM.change(qoid.model.EMEvent.VerificationRequest_RESPONSE);
				break;
			case "respondToVerificationRequest":
				if(data.result == "success") qoid.model.EM.change(qoid.model.EMEvent.RespondToVerification_RESPONSE);
				break;
			case "acceptVerification":
				if(data.result == "success") qoid.model.EM.change(qoid.model.EMEvent.AcceptVerification_RESPONSE);
				break;
			default:
				qoid.api.Synchronizer.processResponse(data);
			}
		}
	});
}
qoid.api.ResponseProcessor.updateModelObject = function(type,data) {
	var type1 = type.toLowerCase();
	switch(type1) {
	case "alias":
		var _g = 0, _g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var alias_ = _g1[_g];
			++_g;
			qoid.AppContext.MASTER_ALIASES.addOrUpdate(qoid.AppContext.SERIALIZER.fromJsonX(alias_,qoid.model.Alias));
		}
		break;
	case "connection":
		var _g = 0, _g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var content_ = _g1[_g];
			++_g;
			qoid.AppContext.MASTER_CONNECTIONS.addOrUpdate(qoid.AppContext.SERIALIZER.fromJsonX(content_,qoid.model.Connection));
		}
		break;
	case "introduction":
		var _g = 0, _g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var content_ = _g1[_g];
			++_g;
			qoid.AppContext.INTRODUCTIONS.addOrUpdate(qoid.AppContext.SERIALIZER.fromJsonX(content_,qoid.model.Introduction));
		}
		break;
	case "label":
		var _g = 0, _g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var label_ = _g1[_g];
			++_g;
			qoid.AppContext.MASTER_LABELS.addOrUpdate(qoid.AppContext.SERIALIZER.fromJsonX(label_,qoid.model.Label));
		}
		break;
	case "labelacl":
		var _g = 0, _g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var label_ = _g1[_g];
			++_g;
			qoid.AppContext.MASTER_LABELACLS.addOrUpdate(qoid.AppContext.SERIALIZER.fromJsonX(label_,qoid.model.LabelAcl));
		}
		break;
	case "labelchild":
		var _g = 0, _g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var labelChild_ = _g1[_g];
			++_g;
			qoid.AppContext.MASTER_LABELCHILDREN.addOrUpdate(qoid.AppContext.SERIALIZER.fromJsonX(labelChild_,qoid.model.LabelChild));
		}
		break;
	case "labeledcontent":
		var _g = 0, _g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var labeledContent_ = _g1[_g];
			++_g;
			qoid.AppContext.MASTER_LABELEDCONTENT.addOrUpdate(qoid.AppContext.SERIALIZER.fromJsonX(labeledContent_,qoid.model.LabeledContent));
		}
		break;
	case "notification":
		var _g = 0, _g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var content_ = _g1[_g];
			++_g;
			qoid.AppContext.MASTER_NOTIFICATIONS.addOrUpdate(qoid.AppContext.SERIALIZER.fromJsonX(content_,qoid.model.Notification));
		}
		break;
	case "profile":
		var _g = 0, _g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var profile_ = _g1[_g];
			++_g;
			qoid.AppContext.PROFILES.addOrUpdate(qoid.AppContext.SERIALIZER.fromJsonX(profile_,qoid.model.Profile));
		}
		break;
	default:
		qoid.AppContext.LOGGER.error("Unknown type: " + type1);
	}
}
qoid.api.ResponseProcessor.initialDataLoad = function(data) {
	qoid.AppContext.MASTER_ALIASES.addAll(data.aliases);
	qoid.AppContext.MASTER_LABELS.addAll(data.labels);
	qoid.AppContext.MASTER_LABELCHILDREN.addAll(data.labelChildren);
	qoid.AppContext.MASTER_CONNECTIONS.addAll(data.connections);
	qoid.AppContext.INTRODUCTIONS.addAll(data.introductions);
	qoid.AppContext.MASTER_NOTIFICATIONS.addAll(data.notifications);
	qoid.AppContext.MASTER_LABELEDCONTENT.addAll(data.labeledContent);
	qoid.AppContext.MASTER_LABELACLS.addAll(data.labelAcls);
	qoid.AppContext.PROFILES.addAll(data.profiles);
	var $it0 = qoid.AppContext.MASTER_ALIASES.iterator();
	while( $it0.hasNext() ) {
		var alias_ = $it0.next();
		var $it1 = qoid.AppContext.PROFILES.iterator();
		while( $it1.hasNext() ) {
			var profile_ = $it1.next();
			if(profile_.aliasIid == alias_.iid) {
				alias_.profile = profile_;
				qoid.AppContext.MASTER_ALIASES.update(alias_);
			}
		}
	}
	qoid.model.EM.change(qoid.model.EMEvent.InitialDataLoadComplete);
}
qoid.api.ResponseProcessor.processProfile = function(rec) {
	if(rec.result && rec.result.handle) qoid.AgentUi.PROTOCOL.addHandle(rec.result.handle); else {
		var connection = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_CONNECTIONS,rec.connectionIid);
		connection.data = qoid.AppContext.SERIALIZER.fromJsonX(rec.results[0],qoid.model.Profile);
		qoid.AppContext.MASTER_CONNECTIONS.addOrUpdate(connection);
	}
}
qoid.api.ResponseProcessor.beginIntroduction = function() {
	qoid.model.EM.change(qoid.model.EMEvent.INTRODUCTION_RESPONSE);
}
qoid.api.ResponseProcessor.confirmIntroduction = function() {
	qoid.model.EM.change(qoid.model.EMEvent.RespondToIntroduction_RESPONSE);
}
qoid.api.ResponseProcessor.grantAccess = function() {
	qoid.model.EM.change(qoid.model.EMEvent.AccessGranted);
}
qoid.api.ResponseProcessor.filterContent = function(data,filterIid) {
	var displayedContent = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
	displayedContent.addAll(data.content);
	var fr = new qoid.model.FilterResponse(filterIid,displayedContent);
	qoid.model.EM.change(qoid.model.EMEvent.LoadFilteredContent,fr);
	qoid.model.EM.change(qoid.model.EMEvent.FitWindow);
}
qoid.api.SynchronizationParms = function() {
	this.aliases = new Array();
	this.content = new Array();
	this.connections = new Array();
	this.introductions = new Array();
	this.labels = new Array();
	this.labelAcls = new Array();
	this.labelChildren = new Array();
	this.labeledContent = new Array();
	this.notifications = new Array();
	this.profiles = new Array();
};
$hxClasses["qoid.api.SynchronizationParms"] = qoid.api.SynchronizationParms;
qoid.api.SynchronizationParms.__name__ = ["qoid","api","SynchronizationParms"];
qoid.api.SynchronizationParms.prototype = {
	__class__: qoid.api.SynchronizationParms
}
qoid.api.Synchronizer = function(iid,numResponsesExpected,oncomplete) {
	this.iid = iid;
	this.numResponsesExpected = numResponsesExpected;
	this.oncomplete = oncomplete;
	this.parms = new qoid.api.SynchronizationParms();
};
$hxClasses["qoid.api.Synchronizer"] = qoid.api.Synchronizer;
qoid.api.Synchronizer.__name__ = ["qoid","api","Synchronizer"];
qoid.api.Synchronizer.createContext = function(numResponsesExpected,oncomplete) {
	return m3.util.UidGenerator.create(32) + "-" + Std.string(numResponsesExpected) + "-" + oncomplete;
}
qoid.api.Synchronizer.processResponse = function(data) {
	var context = new qoid.model.Context(data.context);
	var synchronizer = qoid.api.Synchronizer.synchronizers.get(context.iid);
	if(synchronizer == null) synchronizer = qoid.api.Synchronizer.add(context);
	synchronizer.dataReceived(context,data);
}
qoid.api.Synchronizer.add = function(c) {
	var synchronizer = new qoid.api.Synchronizer(c.iid,c.numResponsesExpected,c.oncomplete);
	qoid.api.Synchronizer.synchronizers.set(c.iid,synchronizer);
	return synchronizer;
}
qoid.api.Synchronizer.remove = function(iid) {
	qoid.api.Synchronizer.synchronizers.remove(iid);
}
qoid.api.Synchronizer.prototype = {
	dataReceived: function(c,dataObj) {
		var data = dataObj.results;
		if(data == null) return;
		switch(dataObj.type) {
		case "alias":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var alias_ = _g1[_g];
				++_g;
				this.parms.aliases.push(qoid.AppContext.SERIALIZER.fromJsonX(alias_,qoid.model.Alias));
			}
			break;
		case "connection":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var content_ = _g1[_g];
				++_g;
				this.parms.connections.push(qoid.AppContext.SERIALIZER.fromJsonX(content_,qoid.model.Connection));
			}
			break;
		case "content":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var content_ = _g1[_g];
				++_g;
				this.parms.content.push(qoid.AppContext.SERIALIZER.fromJsonX(content_,qoid.model.Content));
			}
			break;
		case "introduction":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var content_ = _g1[_g];
				++_g;
				this.parms.introductions.push(qoid.AppContext.SERIALIZER.fromJsonX(content_,qoid.model.Introduction));
			}
			break;
		case "label":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var label_ = _g1[_g];
				++_g;
				this.parms.labels.push(qoid.AppContext.SERIALIZER.fromJsonX(label_,qoid.model.Label));
			}
			break;
		case "labelacl":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var label_ = _g1[_g];
				++_g;
				this.parms.labelAcls.push(qoid.AppContext.SERIALIZER.fromJsonX(label_,qoid.model.LabelAcl));
			}
			break;
		case "labelChild":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var labelChild_ = _g1[_g];
				++_g;
				this.parms.labelChildren.push(qoid.AppContext.SERIALIZER.fromJsonX(labelChild_,qoid.model.LabelChild));
			}
			break;
		case "labeledContent":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var labeledContent_ = _g1[_g];
				++_g;
				this.parms.labeledContent.push(qoid.AppContext.SERIALIZER.fromJsonX(labeledContent_,qoid.model.LabeledContent));
			}
			break;
		case "notification":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var content_ = _g1[_g];
				++_g;
				this.parms.notifications.push(qoid.AppContext.SERIALIZER.fromJsonX(content_,qoid.model.Notification));
			}
			break;
		case "profile":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var profile_ = _g1[_g];
				++_g;
				this.parms.profiles.push(qoid.AppContext.SERIALIZER.fromJsonX(profile_,qoid.model.Profile));
			}
			break;
		}
		this.numResponsesExpected -= 1;
		if(this.numResponsesExpected == 0) {
			var func = Reflect.field(qoid.api.ResponseProcessor,this.oncomplete);
			if(func == null) qoid.AppContext.LOGGER.info("Missing oncomplete function: " + this.oncomplete); else func.apply(qoid.api.ResponseProcessor,[this.parms]);
			qoid.api.Synchronizer.remove(this.iid);
			var length = 0;
			var $it0 = qoid.api.Synchronizer.synchronizers.keys();
			while( $it0.hasNext() ) {
				var key = $it0.next();
				length += 1;
			}
			qoid.AppContext.LOGGER.info("Number Synchronizers: " + length);
		}
	}
	,__class__: qoid.api.Synchronizer
}
qoid.model = {}
qoid.model.ContentSourceListener = function(mapListener,onBeforeSetContent,widgetCreator,content) {
	this.mapListener = mapListener;
	this.onBeforeSetContent = onBeforeSetContent;
	this.widgetCreator = widgetCreator;
	this.contentMap = new m3.observable.MappedSet(content,function(content1) {
		return widgetCreator(content1);
	});
	this.contentMap.mapListen(this.mapListener);
};
$hxClasses["qoid.model.ContentSourceListener"] = qoid.model.ContentSourceListener;
qoid.model.ContentSourceListener.__name__ = ["qoid","model","ContentSourceListener"];
qoid.model.ContentSourceListener.prototype = {
	__class__: qoid.model.ContentSourceListener
}
qoid.model.ModelObj = function() {
};
$hxClasses["qoid.model.ModelObj"] = qoid.model.ModelObj;
qoid.model.ModelObj.__name__ = ["qoid","model","ModelObj"];
qoid.model.ModelObj.prototype = {
	objectType: function() {
		var className = m3.serialization.TypeTools.classname(m3.serialization.TypeTools.clazz(this)).toLowerCase();
		var parts = className.split(".");
		return parts[parts.length - 1];
	}
	,__class__: qoid.model.ModelObj
}
qoid.model.ModelObjWithIid = function() {
	qoid.model.ModelObj.call(this);
	this.iid = m3.util.UidGenerator.create(32);
	this.deleted = false;
};
$hxClasses["qoid.model.ModelObjWithIid"] = qoid.model.ModelObjWithIid;
qoid.model.ModelObjWithIid.__name__ = ["qoid","model","ModelObjWithIid"];
qoid.model.ModelObjWithIid.identifier = function(t) {
	return t.iid;
}
qoid.model.ModelObjWithIid.__super__ = qoid.model.ModelObj;
qoid.model.ModelObjWithIid.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.ModelObjWithIid
});
qoid.model.EM = function() { }
$hxClasses["qoid.model.EM"] = qoid.model.EM;
qoid.model.EM.__name__ = ["qoid","model","EM"];
qoid.model.EM.addListener = function(id,func,listenerName) {
	return qoid.model.EM.delegate.addListener(id,func,listenerName);
}
qoid.model.EM.listenOnce = function(id,func,listenerName) {
	return qoid.model.EM.delegate.listenOnce(id,func,listenerName);
}
qoid.model.EM.removeListener = function(id,listenerUid) {
	qoid.model.EM.delegate.removeListener(id,listenerUid);
}
qoid.model.EM.change = function(id,t) {
	qoid.model.EM.delegate.change(id,t);
}
qoid.model.EMEvent = $hxClasses["qoid.model.EMEvent"] = { __ename__ : ["qoid","model","EMEvent"], __constructs__ : ["FILTER_RUN","FILTER_CHANGE","LoadFilteredContent","AppendFilteredContent","EditContentClosed","CreateAgent","AgentCreated","InitialDataLoadComplete","FitWindow","UserLogin","UserLogout","AliasLoaded","AliasCreated","AliasUpdated","CreateAlias","UpdateAlias","DeleteAlias","CreateContent","DeleteContent","UpdateContent","CreateLabel","UpdateLabel","MoveLabel","CopyLabel","DeleteLabel","GrantAccess","AccessGranted","RevokeAccess","DeleteConnection","INTRODUCTION_REQUEST","INTRODUCTION_RESPONSE","RespondToIntroduction","RespondToIntroduction_RESPONSE","TargetChange","VerificationRequest","VerificationRequest_RESPONSE","RespondToVerification","RespondToVerification_RESPONSE","AcceptVerification","AcceptVerification_RESPONSE","BACKUP","RESTORE","RESTORES_REQUEST","AVAILABLE_BACKUPS"] }
qoid.model.EMEvent.FILTER_RUN = ["FILTER_RUN",0];
qoid.model.EMEvent.FILTER_RUN.toString = $estr;
qoid.model.EMEvent.FILTER_RUN.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.FILTER_CHANGE = ["FILTER_CHANGE",1];
qoid.model.EMEvent.FILTER_CHANGE.toString = $estr;
qoid.model.EMEvent.FILTER_CHANGE.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.LoadFilteredContent = ["LoadFilteredContent",2];
qoid.model.EMEvent.LoadFilteredContent.toString = $estr;
qoid.model.EMEvent.LoadFilteredContent.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.AppendFilteredContent = ["AppendFilteredContent",3];
qoid.model.EMEvent.AppendFilteredContent.toString = $estr;
qoid.model.EMEvent.AppendFilteredContent.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.EditContentClosed = ["EditContentClosed",4];
qoid.model.EMEvent.EditContentClosed.toString = $estr;
qoid.model.EMEvent.EditContentClosed.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.CreateAgent = ["CreateAgent",5];
qoid.model.EMEvent.CreateAgent.toString = $estr;
qoid.model.EMEvent.CreateAgent.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.AgentCreated = ["AgentCreated",6];
qoid.model.EMEvent.AgentCreated.toString = $estr;
qoid.model.EMEvent.AgentCreated.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.InitialDataLoadComplete = ["InitialDataLoadComplete",7];
qoid.model.EMEvent.InitialDataLoadComplete.toString = $estr;
qoid.model.EMEvent.InitialDataLoadComplete.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.FitWindow = ["FitWindow",8];
qoid.model.EMEvent.FitWindow.toString = $estr;
qoid.model.EMEvent.FitWindow.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.UserLogin = ["UserLogin",9];
qoid.model.EMEvent.UserLogin.toString = $estr;
qoid.model.EMEvent.UserLogin.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.UserLogout = ["UserLogout",10];
qoid.model.EMEvent.UserLogout.toString = $estr;
qoid.model.EMEvent.UserLogout.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.AliasLoaded = ["AliasLoaded",11];
qoid.model.EMEvent.AliasLoaded.toString = $estr;
qoid.model.EMEvent.AliasLoaded.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.AliasCreated = ["AliasCreated",12];
qoid.model.EMEvent.AliasCreated.toString = $estr;
qoid.model.EMEvent.AliasCreated.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.AliasUpdated = ["AliasUpdated",13];
qoid.model.EMEvent.AliasUpdated.toString = $estr;
qoid.model.EMEvent.AliasUpdated.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.CreateAlias = ["CreateAlias",14];
qoid.model.EMEvent.CreateAlias.toString = $estr;
qoid.model.EMEvent.CreateAlias.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.UpdateAlias = ["UpdateAlias",15];
qoid.model.EMEvent.UpdateAlias.toString = $estr;
qoid.model.EMEvent.UpdateAlias.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.DeleteAlias = ["DeleteAlias",16];
qoid.model.EMEvent.DeleteAlias.toString = $estr;
qoid.model.EMEvent.DeleteAlias.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.CreateContent = ["CreateContent",17];
qoid.model.EMEvent.CreateContent.toString = $estr;
qoid.model.EMEvent.CreateContent.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.DeleteContent = ["DeleteContent",18];
qoid.model.EMEvent.DeleteContent.toString = $estr;
qoid.model.EMEvent.DeleteContent.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.UpdateContent = ["UpdateContent",19];
qoid.model.EMEvent.UpdateContent.toString = $estr;
qoid.model.EMEvent.UpdateContent.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.CreateLabel = ["CreateLabel",20];
qoid.model.EMEvent.CreateLabel.toString = $estr;
qoid.model.EMEvent.CreateLabel.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.UpdateLabel = ["UpdateLabel",21];
qoid.model.EMEvent.UpdateLabel.toString = $estr;
qoid.model.EMEvent.UpdateLabel.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.MoveLabel = ["MoveLabel",22];
qoid.model.EMEvent.MoveLabel.toString = $estr;
qoid.model.EMEvent.MoveLabel.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.CopyLabel = ["CopyLabel",23];
qoid.model.EMEvent.CopyLabel.toString = $estr;
qoid.model.EMEvent.CopyLabel.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.DeleteLabel = ["DeleteLabel",24];
qoid.model.EMEvent.DeleteLabel.toString = $estr;
qoid.model.EMEvent.DeleteLabel.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.GrantAccess = ["GrantAccess",25];
qoid.model.EMEvent.GrantAccess.toString = $estr;
qoid.model.EMEvent.GrantAccess.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.AccessGranted = ["AccessGranted",26];
qoid.model.EMEvent.AccessGranted.toString = $estr;
qoid.model.EMEvent.AccessGranted.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.RevokeAccess = ["RevokeAccess",27];
qoid.model.EMEvent.RevokeAccess.toString = $estr;
qoid.model.EMEvent.RevokeAccess.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.DeleteConnection = ["DeleteConnection",28];
qoid.model.EMEvent.DeleteConnection.toString = $estr;
qoid.model.EMEvent.DeleteConnection.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.INTRODUCTION_REQUEST = ["INTRODUCTION_REQUEST",29];
qoid.model.EMEvent.INTRODUCTION_REQUEST.toString = $estr;
qoid.model.EMEvent.INTRODUCTION_REQUEST.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.INTRODUCTION_RESPONSE = ["INTRODUCTION_RESPONSE",30];
qoid.model.EMEvent.INTRODUCTION_RESPONSE.toString = $estr;
qoid.model.EMEvent.INTRODUCTION_RESPONSE.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.RespondToIntroduction = ["RespondToIntroduction",31];
qoid.model.EMEvent.RespondToIntroduction.toString = $estr;
qoid.model.EMEvent.RespondToIntroduction.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.RespondToIntroduction_RESPONSE = ["RespondToIntroduction_RESPONSE",32];
qoid.model.EMEvent.RespondToIntroduction_RESPONSE.toString = $estr;
qoid.model.EMEvent.RespondToIntroduction_RESPONSE.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.TargetChange = ["TargetChange",33];
qoid.model.EMEvent.TargetChange.toString = $estr;
qoid.model.EMEvent.TargetChange.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.VerificationRequest = ["VerificationRequest",34];
qoid.model.EMEvent.VerificationRequest.toString = $estr;
qoid.model.EMEvent.VerificationRequest.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.VerificationRequest_RESPONSE = ["VerificationRequest_RESPONSE",35];
qoid.model.EMEvent.VerificationRequest_RESPONSE.toString = $estr;
qoid.model.EMEvent.VerificationRequest_RESPONSE.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.RespondToVerification = ["RespondToVerification",36];
qoid.model.EMEvent.RespondToVerification.toString = $estr;
qoid.model.EMEvent.RespondToVerification.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.RespondToVerification_RESPONSE = ["RespondToVerification_RESPONSE",37];
qoid.model.EMEvent.RespondToVerification_RESPONSE.toString = $estr;
qoid.model.EMEvent.RespondToVerification_RESPONSE.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.AcceptVerification = ["AcceptVerification",38];
qoid.model.EMEvent.AcceptVerification.toString = $estr;
qoid.model.EMEvent.AcceptVerification.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.AcceptVerification_RESPONSE = ["AcceptVerification_RESPONSE",39];
qoid.model.EMEvent.AcceptVerification_RESPONSE.toString = $estr;
qoid.model.EMEvent.AcceptVerification_RESPONSE.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.BACKUP = ["BACKUP",40];
qoid.model.EMEvent.BACKUP.toString = $estr;
qoid.model.EMEvent.BACKUP.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.RESTORE = ["RESTORE",41];
qoid.model.EMEvent.RESTORE.toString = $estr;
qoid.model.EMEvent.RESTORE.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.RESTORES_REQUEST = ["RESTORES_REQUEST",42];
qoid.model.EMEvent.RESTORES_REQUEST.toString = $estr;
qoid.model.EMEvent.RESTORES_REQUEST.__enum__ = qoid.model.EMEvent;
qoid.model.EMEvent.AVAILABLE_BACKUPS = ["AVAILABLE_BACKUPS",43];
qoid.model.EMEvent.AVAILABLE_BACKUPS.toString = $estr;
qoid.model.EMEvent.AVAILABLE_BACKUPS.__enum__ = qoid.model.EMEvent;
qoid.model.ContentSource = function() { }
$hxClasses["qoid.model.ContentSource"] = qoid.model.ContentSource;
qoid.model.ContentSource.__name__ = ["qoid","model","ContentSource"];
qoid.model.ContentSource.addListener = function(ml,obsc,wc) {
	var l = new qoid.model.ContentSourceListener(ml,obsc,wc,qoid.model.ContentSource.filteredContent);
	qoid.model.ContentSource.listeners.push(l);
}
qoid.model.ContentSource.addContent = function(results,connectionIid) {
	var _g = 0;
	while(_g < results.length) {
		var result = results[_g];
		++_g;
		var c = qoid.AppContext.SERIALIZER.fromJsonX(result,qoid.model.Content);
		if(connectionIid != null) {
			c.aliasIid = null;
			c.connectionIid = connectionIid;
		}
		qoid.model.ContentSource.filteredContent.addOrUpdate(c);
	}
}
qoid.model.ContentSource.onLoadFilteredContent = function(data) {
	if(qoid.model.ContentSource.handle == data.handle) qoid.model.ContentSource.addContent(data.results,data.connectionIid); else {
		qoid.model.ContentSource.clearQuery();
		qoid.model.ContentSource.handle = data.handle;
		qoid.model.ContentSource.beforeSetContent();
		qoid.model.ContentSource.addContent(data.results,data.connectionIid);
	}
}
qoid.model.ContentSource.clearQuery = function() {
	if(qoid.model.ContentSource.handle != null) {
		qoid.AgentUi.PROTOCOL.deregisterSqueries([qoid.model.ContentSource.handle]);
		qoid.model.ContentSource.filteredContent.clear();
		qoid.model.ContentSource.handle = null;
	}
}
qoid.model.ContentSource.onAppendFilteredContent = function(data) {
	qoid.model.ContentSource.addContent(data.results,data.connectionIid);
}
qoid.model.ContentSource.onAliasLoaded = function(alias) {
	qoid.model.ContentSource.clearQuery();
}
qoid.model.ContentSource.beforeSetContent = function() {
	var _g = 0, _g1 = qoid.model.ContentSource.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l.onBeforeSetContent();
	}
}
qoid.model.Context = function(context) {
	var c = context.split("-");
	if(c.length != 3) throw new m3.exception.Exception("invalid context");
	this.iid = c[0];
	this.numResponsesExpected = Std.parseInt(c[1]);
	this.oncomplete = c[2];
};
$hxClasses["qoid.model.Context"] = qoid.model.Context;
qoid.model.Context.__name__ = ["qoid","model","Context"];
qoid.model.Context.prototype = {
	__class__: qoid.model.Context
}
qoid.model.Filter = function(node) {
	this.rootNode = node;
	this.nodes = new Array();
	if(node.hasChildren()) {
		var _g = 0, _g1 = node.nodes;
		while(_g < _g1.length) {
			var childNode = _g1[_g];
			++_g;
			this.nodes.push(childNode);
		}
	}
	this.q = this.getQuery();
};
$hxClasses["qoid.model.Filter"] = qoid.model.Filter;
qoid.model.Filter.__name__ = ["qoid","model","Filter"];
qoid.model.Filter.prototype = {
	_queryify: function(nodes,joinWith) {
		var str = "";
		if(m3.helper.ArrayHelper.hasValues(nodes)) {
			str += "(";
			var iteration = 0;
			var _g1 = 0, _g = nodes.length;
			while(_g1 < _g) {
				var ln_ = _g1++;
				if(iteration++ > 0) str += joinWith;
				str += nodes[ln_].getQuery();
				if(nodes[ln_].hasChildren()) str += this._queryify(nodes[ln_].nodes,nodes[ln_].getQuery());
			}
			str += ")";
		}
		return str;
	}
	,getQuery: function() {
		return this._queryify(this.nodes,this.rootNode.getQuery());
	}
	,__class__: qoid.model.Filter
}
qoid.model.FilterData = function(type) {
	this.type = type;
	this.aliasIid = null;
	this.connectionIids = new Array();
};
$hxClasses["qoid.model.FilterData"] = qoid.model.FilterData;
qoid.model.FilterData.__name__ = ["qoid","model","FilterData"];
qoid.model.FilterData.prototype = {
	__class__: qoid.model.FilterData
}
qoid.model.FilterResponse = function(filterIid,content) {
	this.filterIid = filterIid;
	this.content = content;
};
$hxClasses["qoid.model.FilterResponse"] = qoid.model.FilterResponse;
qoid.model.FilterResponse.__name__ = ["qoid","model","FilterResponse"];
qoid.model.FilterResponse.prototype = {
	__class__: qoid.model.FilterResponse
}
qoid.model.Profile = function(name,imgSrc,aliasIid) {
	qoid.model.ModelObjWithIid.call(this);
	this.name = name == null?"Unknown":name;
	this.imgSrc = imgSrc == null?"media/koi.jpg":imgSrc;
	this.aliasIid = aliasIid;
};
$hxClasses["qoid.model.Profile"] = qoid.model.Profile;
qoid.model.Profile.__name__ = ["qoid","model","Profile"];
qoid.model.Profile.identifier = function(profile) {
	return profile.iid;
}
qoid.model.Profile.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Profile.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.Profile
});
qoid.model.AliasData = function() {
	qoid.model.ModelObj.call(this);
	this.isDefault = false;
};
$hxClasses["qoid.model.AliasData"] = qoid.model.AliasData;
qoid.model.AliasData.__name__ = ["qoid","model","AliasData"];
qoid.model.AliasData.__super__ = qoid.model.ModelObj;
qoid.model.AliasData.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.AliasData
});
qoid.model.Alias = function() {
	qoid.model.ModelObjWithIid.call(this);
	this.profile = new qoid.model.Profile();
	this.data = new qoid.model.AliasData();
};
$hxClasses["qoid.model.Alias"] = qoid.model.Alias;
qoid.model.Alias.__name__ = ["qoid","model","Alias"];
qoid.model.Alias.identifier = function(alias) {
	return alias.iid;
}
qoid.model.Alias.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Alias.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.Alias
});
qoid.model.LabelData = function() {
	qoid.model.ModelObj.call(this);
	this.color = m3.util.ColorProvider.getNextColor();
};
$hxClasses["qoid.model.LabelData"] = qoid.model.LabelData;
qoid.model.LabelData.__name__ = ["qoid","model","LabelData"];
qoid.model.LabelData.__super__ = qoid.model.ModelObj;
qoid.model.LabelData.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.LabelData
});
qoid.model.Label = function(name) {
	qoid.model.ModelObjWithIid.call(this);
	this.name = name;
	this.data = new qoid.model.LabelData();
};
$hxClasses["qoid.model.Label"] = qoid.model.Label;
qoid.model.Label.__name__ = ["qoid","model","Label"];
qoid.model.Label.identifier = function(l) {
	return l.iid;
}
qoid.model.Label.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Label.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.Label
});
qoid.model.LabelChild = function(parentIid,childIid) {
	if(parentIid != null && childIid != null && parentIid == childIid) throw new m3.exception.Exception("parentIid and childIid of LabelChild must be different");
	qoid.model.ModelObjWithIid.call(this);
	this.parentIid = parentIid;
	this.childIid = childIid;
};
$hxClasses["qoid.model.LabelChild"] = qoid.model.LabelChild;
qoid.model.LabelChild.__name__ = ["qoid","model","LabelChild"];
qoid.model.LabelChild.identifier = function(l) {
	return l.iid;
}
qoid.model.LabelChild.__super__ = qoid.model.ModelObjWithIid;
qoid.model.LabelChild.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.LabelChild
});
qoid.model.LabelAcl = function(connectionIid,labelIid) {
	qoid.model.ModelObjWithIid.call(this);
	this.connectionIid = connectionIid;
	this.labelIid = labelIid;
};
$hxClasses["qoid.model.LabelAcl"] = qoid.model.LabelAcl;
qoid.model.LabelAcl.__name__ = ["qoid","model","LabelAcl"];
qoid.model.LabelAcl.identifier = function(l) {
	return l.iid;
}
qoid.model.LabelAcl.__super__ = qoid.model.ModelObjWithIid;
qoid.model.LabelAcl.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.LabelAcl
});
qoid.model.Connection = function() {
	qoid.model.ModelObjWithIid.call(this);
	this.data = new qoid.model.Profile("-->*<--","");
};
$hxClasses["qoid.model.Connection"] = qoid.model.Connection;
qoid.model.Connection.__name__ = ["qoid","model","Connection"];
qoid.model.Connection.identifier = function(c) {
	return c.iid;
}
qoid.model.Connection.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Connection.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	equals: function(c) {
		return this.iid == c.iid;
	}
	,__class__: qoid.model.Connection
});
qoid.model.ContentType = $hxClasses["qoid.model.ContentType"] = { __ename__ : ["qoid","model","ContentType"], __constructs__ : ["AUDIO","IMAGE","URL","TEXT"] }
qoid.model.ContentType.AUDIO = ["AUDIO",0];
qoid.model.ContentType.AUDIO.toString = $estr;
qoid.model.ContentType.AUDIO.__enum__ = qoid.model.ContentType;
qoid.model.ContentType.IMAGE = ["IMAGE",1];
qoid.model.ContentType.IMAGE.toString = $estr;
qoid.model.ContentType.IMAGE.__enum__ = qoid.model.ContentType;
qoid.model.ContentType.URL = ["URL",2];
qoid.model.ContentType.URL.toString = $estr;
qoid.model.ContentType.URL.__enum__ = qoid.model.ContentType;
qoid.model.ContentType.TEXT = ["TEXT",3];
qoid.model.ContentType.TEXT.toString = $estr;
qoid.model.ContentType.TEXT.__enum__ = qoid.model.ContentType;
qoid.model.ContentHandler = function() {
};
$hxClasses["qoid.model.ContentHandler"] = qoid.model.ContentHandler;
qoid.model.ContentHandler.__name__ = ["qoid","model","ContentHandler"];
qoid.model.ContentHandler.__interfaces__ = [m3.serialization.TypeHandler];
qoid.model.ContentHandler.prototype = {
	write: function(value,writer) {
		return qoid.AppContext.SERIALIZER.toJson(value);
	}
	,read: function(fromJson,reader,instance) {
		var obj = null;
		var _g = Type.createEnum(qoid.model.ContentType,fromJson.contentType,null);
		switch( (_g)[1] ) {
		case 0:
			obj = qoid.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.AudioContent);
			break;
		case 1:
			obj = qoid.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.ImageContent);
			break;
		case 3:
			obj = qoid.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.MessageContent);
			break;
		case 2:
			obj = qoid.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.UrlContent);
			break;
		}
		return obj;
	}
	,__class__: qoid.model.ContentHandler
}
qoid.model.ContentFactory = function() { }
$hxClasses["qoid.model.ContentFactory"] = qoid.model.ContentFactory;
qoid.model.ContentFactory.__name__ = ["qoid","model","ContentFactory"];
qoid.model.ContentFactory.create = function(contentType,data) {
	var ret = null;
	switch( (contentType)[1] ) {
	case 0:
		var ac = new qoid.model.AudioContent();
		ac.props.audioSrc = js.Boot.__cast(data , String);
		ret = ac;
		break;
	case 1:
		var ic = new qoid.model.ImageContent();
		ic.props.imgSrc = js.Boot.__cast(data , String);
		ret = ic;
		break;
	case 3:
		var mc = new qoid.model.MessageContent();
		mc.props.text = js.Boot.__cast(data , String);
		ret = mc;
		break;
	case 2:
		var uc = new qoid.model.UrlContent();
		uc.props.url = js.Boot.__cast(data , String);
		ret = uc;
		break;
	}
	return ret;
}
qoid.model.LabeledContent = function(contentIid,labelIid) {
	qoid.model.ModelObjWithIid.call(this);
	this.contentIid = contentIid;
	this.labelIid = labelIid;
};
$hxClasses["qoid.model.LabeledContent"] = qoid.model.LabeledContent;
qoid.model.LabeledContent.__name__ = ["qoid","model","LabeledContent"];
qoid.model.LabeledContent.identifier = function(l) {
	return l.iid;
}
qoid.model.LabeledContent.__super__ = qoid.model.ModelObjWithIid;
qoid.model.LabeledContent.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.LabeledContent
});
qoid.model.ContentData = function() {
	this.created = new Date();
	this.modified = new Date();
};
$hxClasses["qoid.model.ContentData"] = qoid.model.ContentData;
qoid.model.ContentData.__name__ = ["qoid","model","ContentData"];
qoid.model.ContentData.prototype = {
	__class__: qoid.model.ContentData
}
qoid.model.ContentVerification = function() { }
$hxClasses["qoid.model.ContentVerification"] = qoid.model.ContentVerification;
qoid.model.ContentVerification.__name__ = ["qoid","model","ContentVerification"];
qoid.model.ContentVerification.prototype = {
	__class__: qoid.model.ContentVerification
}
qoid.model.ContentMetaData = function() { }
$hxClasses["qoid.model.ContentMetaData"] = qoid.model.ContentMetaData;
qoid.model.ContentMetaData.__name__ = ["qoid","model","ContentMetaData"];
qoid.model.ContentMetaData.prototype = {
	__class__: qoid.model.ContentMetaData
}
qoid.model.Content = function(contentType,type) {
	qoid.model.ModelObjWithIid.call(this);
	this.contentType = contentType;
	this.aliasIid = qoid.AppContext.currentAlias == null?null:qoid.AppContext.currentAlias.iid;
	this.data = { };
	this.type = type;
	this.props = Type.createInstance(type,[]);
};
$hxClasses["qoid.model.Content"] = qoid.model.Content;
qoid.model.Content.__name__ = ["qoid","model","Content"];
qoid.model.Content.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Content.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	objectType: function() {
		return "content";
	}
	,getTimestamp: function() {
		return DateTools.format(this.get_created(),"%Y-%m-%d %T");
	}
	,writeResolve: function() {
		this.data = qoid.AppContext.SERIALIZER.toJson(this.props);
	}
	,readResolve: function() {
		this.props = qoid.AppContext.SERIALIZER.fromJsonX(this.data,this.type);
	}
	,setData: function(data) {
		this.data = data;
	}
	,get_modified: function() {
		return this.props.modified;
	}
	,get_created: function() {
		return this.props.created;
	}
	,__class__: qoid.model.Content
});
qoid.model.ImageContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.ImageContentData"] = qoid.model.ImageContentData;
qoid.model.ImageContentData.__name__ = ["qoid","model","ImageContentData"];
qoid.model.ImageContentData.__super__ = qoid.model.ContentData;
qoid.model.ImageContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.ImageContentData
});
qoid.model.ImageContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.IMAGE,qoid.model.ImageContentData);
};
$hxClasses["qoid.model.ImageContent"] = qoid.model.ImageContent;
qoid.model.ImageContent.__name__ = ["qoid","model","ImageContent"];
qoid.model.ImageContent.__super__ = qoid.model.Content;
qoid.model.ImageContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.ImageContent
});
qoid.model.AudioContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.AudioContentData"] = qoid.model.AudioContentData;
qoid.model.AudioContentData.__name__ = ["qoid","model","AudioContentData"];
qoid.model.AudioContentData.__super__ = qoid.model.ContentData;
qoid.model.AudioContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.AudioContentData
});
qoid.model.AudioContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.AUDIO,qoid.model.AudioContentData);
};
$hxClasses["qoid.model.AudioContent"] = qoid.model.AudioContent;
qoid.model.AudioContent.__name__ = ["qoid","model","AudioContent"];
qoid.model.AudioContent.__super__ = qoid.model.Content;
qoid.model.AudioContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.AudioContent
});
qoid.model.MessageContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.MessageContentData"] = qoid.model.MessageContentData;
qoid.model.MessageContentData.__name__ = ["qoid","model","MessageContentData"];
qoid.model.MessageContentData.__super__ = qoid.model.ContentData;
qoid.model.MessageContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.MessageContentData
});
qoid.model.MessageContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.TEXT,qoid.model.MessageContentData);
};
$hxClasses["qoid.model.MessageContent"] = qoid.model.MessageContent;
qoid.model.MessageContent.__name__ = ["qoid","model","MessageContent"];
qoid.model.MessageContent.__super__ = qoid.model.Content;
qoid.model.MessageContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.MessageContent
});
qoid.model.UrlContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.UrlContentData"] = qoid.model.UrlContentData;
qoid.model.UrlContentData.__name__ = ["qoid","model","UrlContentData"];
qoid.model.UrlContentData.__super__ = qoid.model.ContentData;
qoid.model.UrlContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.UrlContentData
});
qoid.model.UrlContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.URL,qoid.model.UrlContentData);
};
$hxClasses["qoid.model.UrlContent"] = qoid.model.UrlContent;
qoid.model.UrlContent.__name__ = ["qoid","model","UrlContent"];
qoid.model.UrlContent.__super__ = qoid.model.Content;
qoid.model.UrlContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.UrlContent
});
qoid.model.NotificationHandler = function() {
};
$hxClasses["qoid.model.NotificationHandler"] = qoid.model.NotificationHandler;
qoid.model.NotificationHandler.__name__ = ["qoid","model","NotificationHandler"];
qoid.model.NotificationHandler.__interfaces__ = [m3.serialization.TypeHandler];
qoid.model.NotificationHandler.prototype = {
	write: function(value,writer) {
		return qoid.AppContext.SERIALIZER.toJson(value);
	}
	,read: function(fromJson,reader,instance) {
		var obj = null;
		var _g = Type.createEnum(qoid.model.NotificationKind,fromJson.kind,null);
		switch( (_g)[1] ) {
		case 0:
			obj = qoid.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.IntroductionRequestNotification);
			break;
		case 1:
			obj = qoid.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.VerificationRequestNotification);
			break;
		case 2:
			obj = qoid.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.VerificationResponseNotification);
			break;
		}
		return obj;
	}
	,__class__: qoid.model.NotificationHandler
}
qoid.model.NotificationKind = $hxClasses["qoid.model.NotificationKind"] = { __ename__ : ["qoid","model","NotificationKind"], __constructs__ : ["IntroductionRequest","VerificationRequest","VerificationResponse"] }
qoid.model.NotificationKind.IntroductionRequest = ["IntroductionRequest",0];
qoid.model.NotificationKind.IntroductionRequest.toString = $estr;
qoid.model.NotificationKind.IntroductionRequest.__enum__ = qoid.model.NotificationKind;
qoid.model.NotificationKind.VerificationRequest = ["VerificationRequest",1];
qoid.model.NotificationKind.VerificationRequest.toString = $estr;
qoid.model.NotificationKind.VerificationRequest.__enum__ = qoid.model.NotificationKind;
qoid.model.NotificationKind.VerificationResponse = ["VerificationResponse",2];
qoid.model.NotificationKind.VerificationResponse.toString = $estr;
qoid.model.NotificationKind.VerificationResponse.__enum__ = qoid.model.NotificationKind;
qoid.model.Notification = function(kind,type) {
	qoid.model.ModelObjWithIid.call(this);
	this.kind = kind;
	this.data = { };
	this.type = type;
	this.props = Type.createInstance(type,[]);
};
$hxClasses["qoid.model.Notification"] = qoid.model.Notification;
qoid.model.Notification.__name__ = ["qoid","model","Notification"];
qoid.model.Notification.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Notification.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	writeResolve: function() {
		this.data = qoid.AppContext.SERIALIZER.toJson(this.props);
	}
	,readResolve: function() {
		this.props = qoid.AppContext.SERIALIZER.fromJsonX(this.data,this.type);
	}
	,__class__: qoid.model.Notification
});
qoid.model.IntroductionState = $hxClasses["qoid.model.IntroductionState"] = { __ename__ : ["qoid","model","IntroductionState"], __constructs__ : ["NotResponded","Accepted","Rejected"] }
qoid.model.IntroductionState.NotResponded = ["NotResponded",0];
qoid.model.IntroductionState.NotResponded.toString = $estr;
qoid.model.IntroductionState.NotResponded.__enum__ = qoid.model.IntroductionState;
qoid.model.IntroductionState.Accepted = ["Accepted",1];
qoid.model.IntroductionState.Accepted.toString = $estr;
qoid.model.IntroductionState.Accepted.__enum__ = qoid.model.IntroductionState;
qoid.model.IntroductionState.Rejected = ["Rejected",2];
qoid.model.IntroductionState.Rejected.toString = $estr;
qoid.model.IntroductionState.Rejected.__enum__ = qoid.model.IntroductionState;
qoid.model.IntroductionRequest = function() {
	qoid.model.ModelObjWithIid.call(this);
};
$hxClasses["qoid.model.IntroductionRequest"] = qoid.model.IntroductionRequest;
qoid.model.IntroductionRequest.__name__ = ["qoid","model","IntroductionRequest"];
qoid.model.IntroductionRequest.__super__ = qoid.model.ModelObjWithIid;
qoid.model.IntroductionRequest.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.IntroductionRequest
});
qoid.model.Introduction = function() {
	qoid.model.ModelObjWithIid.call(this);
};
$hxClasses["qoid.model.Introduction"] = qoid.model.Introduction;
qoid.model.Introduction.__name__ = ["qoid","model","Introduction"];
qoid.model.Introduction.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Introduction.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.Introduction
});
qoid.model.IntroductionRequestNotification = function() {
	qoid.model.Notification.call(this,qoid.model.NotificationKind.IntroductionRequest,qoid.model.IntroductionRequestData);
};
$hxClasses["qoid.model.IntroductionRequestNotification"] = qoid.model.IntroductionRequestNotification;
qoid.model.IntroductionRequestNotification.__name__ = ["qoid","model","IntroductionRequestNotification"];
qoid.model.IntroductionRequestNotification.__super__ = qoid.model.Notification;
qoid.model.IntroductionRequestNotification.prototype = $extend(qoid.model.Notification.prototype,{
	__class__: qoid.model.IntroductionRequestNotification
});
qoid.model.IntroductionRequestData = function() { }
$hxClasses["qoid.model.IntroductionRequestData"] = qoid.model.IntroductionRequestData;
qoid.model.IntroductionRequestData.__name__ = ["qoid","model","IntroductionRequestData"];
qoid.model.IntroductionRequestData.prototype = {
	__class__: qoid.model.IntroductionRequestData
}
qoid.model.VerificationRequestNotification = function() {
	qoid.model.Notification.call(this,qoid.model.NotificationKind.VerificationRequest,qoid.model.VerificationRequestData);
};
$hxClasses["qoid.model.VerificationRequestNotification"] = qoid.model.VerificationRequestNotification;
qoid.model.VerificationRequestNotification.__name__ = ["qoid","model","VerificationRequestNotification"];
qoid.model.VerificationRequestNotification.__super__ = qoid.model.Notification;
qoid.model.VerificationRequestNotification.prototype = $extend(qoid.model.Notification.prototype,{
	__class__: qoid.model.VerificationRequestNotification
});
qoid.model.VerificationRequestData = function() { }
$hxClasses["qoid.model.VerificationRequestData"] = qoid.model.VerificationRequestData;
qoid.model.VerificationRequestData.__name__ = ["qoid","model","VerificationRequestData"];
qoid.model.VerificationRequestData.prototype = {
	__class__: qoid.model.VerificationRequestData
}
qoid.model.VerificationResponseNotification = function() {
	qoid.model.Notification.call(this,qoid.model.NotificationKind.VerificationRequest,qoid.model.VerificationResponseData);
};
$hxClasses["qoid.model.VerificationResponseNotification"] = qoid.model.VerificationResponseNotification;
qoid.model.VerificationResponseNotification.__name__ = ["qoid","model","VerificationResponseNotification"];
qoid.model.VerificationResponseNotification.__super__ = qoid.model.Notification;
qoid.model.VerificationResponseNotification.prototype = $extend(qoid.model.Notification.prototype,{
	__class__: qoid.model.VerificationResponseNotification
});
qoid.model.VerificationResponseData = function() { }
$hxClasses["qoid.model.VerificationResponseData"] = qoid.model.VerificationResponseData;
qoid.model.VerificationResponseData.__name__ = ["qoid","model","VerificationResponseData"];
qoid.model.VerificationResponseData.prototype = {
	__class__: qoid.model.VerificationResponseData
}
qoid.model.Login = function() {
	qoid.model.ModelObj.call(this);
};
$hxClasses["qoid.model.Login"] = qoid.model.Login;
qoid.model.Login.__name__ = ["qoid","model","Login"];
qoid.model.Login.__super__ = qoid.model.ModelObj;
qoid.model.Login.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.Login
});
qoid.model.NewUser = function() {
	qoid.model.ModelObj.call(this);
};
$hxClasses["qoid.model.NewUser"] = qoid.model.NewUser;
qoid.model.NewUser.__name__ = ["qoid","model","NewUser"];
qoid.model.NewUser.__super__ = qoid.model.ModelObj;
qoid.model.NewUser.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.NewUser
});
qoid.model.EditLabelData = function(label,parentIid,newParentId) {
	this.label = label;
	this.parentIid = parentIid;
	this.newParentId = newParentId;
};
$hxClasses["qoid.model.EditLabelData"] = qoid.model.EditLabelData;
qoid.model.EditLabelData.__name__ = ["qoid","model","EditLabelData"];
qoid.model.EditLabelData.prototype = {
	__class__: qoid.model.EditLabelData
}
qoid.model.EditContentData = function(content,labelIids) {
	this.content = content;
	if(labelIids == null) labelIids = new Array();
	this.labelIids = labelIids;
};
$hxClasses["qoid.model.EditContentData"] = qoid.model.EditContentData;
qoid.model.EditContentData.__name__ = ["qoid","model","EditContentData"];
qoid.model.EditContentData.prototype = {
	__class__: qoid.model.EditContentData
}
qoid.model.VerificationRequest = function(contentIid,connectionIids,message) {
	this.message = message;
	this.contentIid = contentIid;
	this.connectionIids = connectionIids;
};
$hxClasses["qoid.model.VerificationRequest"] = qoid.model.VerificationRequest;
qoid.model.VerificationRequest.__name__ = ["qoid","model","VerificationRequest"];
qoid.model.VerificationRequest.prototype = {
	__class__: qoid.model.VerificationRequest
}
qoid.model.VerificationResponse = function(notificationIid,verificationContent) {
	this.notificationIid = notificationIid;
	this.verificationContent = verificationContent;
};
$hxClasses["qoid.model.VerificationResponse"] = qoid.model.VerificationResponse;
qoid.model.VerificationResponse.__name__ = ["qoid","model","VerificationResponse"];
qoid.model.VerificationResponse.prototype = {
	__class__: qoid.model.VerificationResponse
}
qoid.model.Verification = function() { }
$hxClasses["qoid.model.Verification"] = qoid.model.Verification;
qoid.model.Verification.__name__ = ["qoid","model","Verification"];
qoid.model.Verification.prototype = {
	__class__: qoid.model.Verification
}
qoid.model.Node = function(type) {
	this.type = "ROOT";
	if(type != null) this.type = type;
};
$hxClasses["qoid.model.Node"] = qoid.model.Node;
qoid.model.Node.__name__ = ["qoid","model","Node"];
qoid.model.Node.prototype = {
	getQuery: function() {
		return "";
	}
	,hasChildren: function() {
		return m3.helper.ArrayHelper.hasValues(this.nodes);
	}
	,addNode: function(n) {
		this.nodes.push(n);
	}
	,__class__: qoid.model.Node
}
qoid.model.And = function() {
	qoid.model.Node.call(this,"AND");
	this.nodes = new Array();
};
$hxClasses["qoid.model.And"] = qoid.model.And;
qoid.model.And.__name__ = ["qoid","model","And"];
qoid.model.And.__super__ = qoid.model.Node;
qoid.model.And.prototype = $extend(qoid.model.Node.prototype,{
	getQuery: function() {
		return " AND ";
	}
	,__class__: qoid.model.And
});
qoid.model.Or = function() {
	qoid.model.Node.call(this,"OR");
	this.nodes = new Array();
};
$hxClasses["qoid.model.Or"] = qoid.model.Or;
qoid.model.Or.__name__ = ["qoid","model","Or"];
qoid.model.Or.__super__ = qoid.model.Node;
qoid.model.Or.prototype = $extend(qoid.model.Node.prototype,{
	getQuery: function() {
		return " OR ";
	}
	,__class__: qoid.model.Or
});
qoid.model.ContentNode = function(type,content) {
	qoid.model.Node.call(this,type);
	this.content = content;
};
$hxClasses["qoid.model.ContentNode"] = qoid.model.ContentNode;
qoid.model.ContentNode.__name__ = ["qoid","model","ContentNode"];
qoid.model.ContentNode.__super__ = qoid.model.Node;
qoid.model.ContentNode.prototype = $extend(qoid.model.Node.prototype,{
	hasChildren: function() {
		return false;
	}
	,__class__: qoid.model.ContentNode
});
qoid.model.LabelNode = function(label,labelPath) {
	qoid.model.ContentNode.call(this,"LABEL",label);
	this.labelPath = labelPath;
};
$hxClasses["qoid.model.LabelNode"] = qoid.model.LabelNode;
qoid.model.LabelNode.__name__ = ["qoid","model","LabelNode"];
qoid.model.LabelNode.__super__ = qoid.model.ContentNode;
qoid.model.LabelNode.prototype = $extend(qoid.model.ContentNode.prototype,{
	getQuery: function() {
		var ret = "hasLabelPath(";
		var _g1 = 1, _g = this.labelPath.length;
		while(_g1 < _g) {
			var i = _g1++;
			ret += "'" + StringTools.replace(this.labelPath[i],"'","\\'") + "'";
			if(i < this.labelPath.length - 1) ret += ",";
		}
		ret += ")";
		return ret;
	}
	,__class__: qoid.model.LabelNode
});
qoid.model.ConnectionNode = function(connection) {
	qoid.model.ContentNode.call(this,"CONNECTION",connection);
};
$hxClasses["qoid.model.ConnectionNode"] = qoid.model.ConnectionNode;
qoid.model.ConnectionNode.__name__ = ["qoid","model","ConnectionNode"];
qoid.model.ConnectionNode.__super__ = qoid.model.ContentNode;
qoid.model.ConnectionNode.prototype = $extend(qoid.model.ContentNode.prototype,{
	getQuery: function() {
		return "";
	}
	,__class__: qoid.model.ConnectionNode
});
qoid.widget = {}
qoid.widget.ConnectionAvatarHelper = function() { }
$hxClasses["qoid.widget.ConnectionAvatarHelper"] = qoid.widget.ConnectionAvatarHelper;
qoid.widget.ConnectionAvatarHelper.__name__ = ["qoid","widget","ConnectionAvatarHelper"];
qoid.widget.ConnectionAvatarHelper.getConnection = function(c) {
	return c.connectionAvatar("getConnection");
}
qoid.widget.ConnectionAvatarHelper.getAlias = function(c) {
	return c.connectionAvatar("getAlias");
}
qoid.widget.DialogManager = function() { }
$hxClasses["qoid.widget.DialogManager"] = qoid.widget.DialogManager;
$hxExpose(qoid.widget.DialogManager, "qoid.widget.DialogManager");
qoid.widget.DialogManager.__name__ = ["qoid","widget","DialogManager"];
qoid.widget.DialogManager.showDialog = function(dialogFcnName,options) {
	if(options == null) options = { };
	var selector = "." + dialogFcnName;
	var dialog = new $(selector);
	if(!dialog.exists()) {
		dialog = new $("<div></div>");
		dialog.appendTo(js.Browser.document.body);
		var dlg = (Reflect.field($.ui,dialogFcnName))(options);
		dlg.open();
	} else {
		var field = Reflect.field(dialog,dialogFcnName);
		var _g = 0, _g1 = Reflect.fields(options);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var value = Reflect.field(options,key);
			field.apply(dialog,["option",key,value]);
		}
		field.apply(dialog,["open"]);
	}
}
qoid.widget.DialogManager.showLogin = function() {
	qoid.widget.DialogManager.showDialog("loginDialog");
}
qoid.widget.DialogManager.showCreateAgent = function() {
	qoid.widget.DialogManager.showDialog("createAgentDialog");
}
qoid.widget.DialogManager.requestIntroduction = function(from,to) {
	var options = { };
	options.from = from;
	options.to = to;
	qoid.widget.DialogManager.showDialog("requestIntroductionDialog",options);
}
qoid.widget.DialogManager.showAliasManager = function() {
	qoid.widget.DialogManager.showDialog("aliasManagerDialog");
}
qoid.widget.DialogManager.allowAccess = function(label,connection) {
	var options = { };
	options.label = label;
	options.connection = connection;
	qoid.widget.DialogManager.showDialog("allowAccessDialog",options);
}
qoid.widget.DialogManager.revokeAccess = function(connection) {
	var options = { };
	options.connection = connection;
	qoid.widget.DialogManager.showDialog("revokeAccessDialog",options);
}
qoid.widget.DialogManager.requestVerification = function(content) {
	var options = { };
	options.content = content;
	qoid.widget.DialogManager.showDialog("verificationRequestDialog",options);
}
qoid.widget.LabelCompHelper = function() { }
$hxClasses["qoid.widget.LabelCompHelper"] = qoid.widget.LabelCompHelper;
qoid.widget.LabelCompHelper.__name__ = ["qoid","widget","LabelCompHelper"];
qoid.widget.LabelCompHelper.getLabel = function(l) {
	return l.labelComp("getLabel");
}
qoid.widget.LabelCompHelper.parentIid = function(l) {
	return l.labelComp("option","parentIid");
}
qoid.widget.ChatOrientation = $hxClasses["qoid.widget.ChatOrientation"] = { __ename__ : ["qoid","widget","ChatOrientation"], __constructs__ : ["chatRight","chatLeft"] }
qoid.widget.ChatOrientation.chatRight = ["chatRight",0];
qoid.widget.ChatOrientation.chatRight.toString = $estr;
qoid.widget.ChatOrientation.chatRight.__enum__ = qoid.widget.ChatOrientation;
qoid.widget.ChatOrientation.chatLeft = ["chatLeft",1];
qoid.widget.ChatOrientation.chatLeft.toString = $estr;
qoid.widget.ChatOrientation.chatLeft.__enum__ = qoid.widget.ChatOrientation;
qoid.widget.ConnectionCompHelper = function() { }
$hxClasses["qoid.widget.ConnectionCompHelper"] = qoid.widget.ConnectionCompHelper;
qoid.widget.ConnectionCompHelper.__name__ = ["qoid","widget","ConnectionCompHelper"];
qoid.widget.ConnectionCompHelper.connection = function(c) {
	return c.connectionComp("option","connection");
}
qoid.widget.ConnectionCompHelper.update = function(c,connection) {
	return c.connectionComp("update",connection);
}
qoid.widget.ConnectionCompHelper.addNotification = function(c) {
	return c.connectionComp("addNotification");
}
qoid.widget.ConnectionCompHelper.deleteNotification = function(c) {
	return c.connectionComp("deleteNotification");
}
qoid.widget.ConnectionListHelper = function() { }
$hxClasses["qoid.widget.ConnectionListHelper"] = qoid.widget.ConnectionListHelper;
qoid.widget.ConnectionListHelper.__name__ = ["qoid","widget","ConnectionListHelper"];
qoid.widget.ConnectionListHelper.filterConnections = function(c,term) {
	c.connectionsList("filterConnections",term);
}
qoid.widget.ContentCompHelper = function() { }
$hxClasses["qoid.widget.ContentCompHelper"] = qoid.widget.ContentCompHelper;
qoid.widget.ContentCompHelper.__name__ = ["qoid","widget","ContentCompHelper"];
qoid.widget.ContentCompHelper.content = function(cc) {
	return cc.contentComp("option","content");
}
qoid.widget.ContentCompHelper.update = function(cc,c) {
	return cc.contentComp("update",c);
}
qoid.widget.UploadCompHelper = function() { }
$hxClasses["qoid.widget.UploadCompHelper"] = qoid.widget.UploadCompHelper;
qoid.widget.UploadCompHelper.__name__ = ["qoid","widget","UploadCompHelper"];
qoid.widget.UploadCompHelper.value = function(m) {
	return m.uploadComp("value");
}
qoid.widget.UploadCompHelper.clear = function(m) {
	m.uploadComp("clear");
}
qoid.widget.UploadCompHelper.setPreviewImage = function(m,src) {
	m.uploadComp("setPreviewImage",src);
}
qoid.widget.UrlCompHelper = function() { }
$hxClasses["qoid.widget.UrlCompHelper"] = qoid.widget.UrlCompHelper;
qoid.widget.UrlCompHelper.__name__ = ["qoid","widget","UrlCompHelper"];
qoid.widget.UrlCompHelper.urlInput = function(m) {
	return m.urlComp("valEle");
}
qoid.widget.FilterCompHelper = function() { }
$hxClasses["qoid.widget.FilterCompHelper"] = qoid.widget.FilterCompHelper;
qoid.widget.FilterCompHelper.__name__ = ["qoid","widget","FilterCompHelper"];
qoid.widget.FilterCompHelper.fireFilter = function(f) {
	f.filterComp("fireFilter");
}
qoid.widget.LiveBuildToggleHelper = function() { }
$hxClasses["qoid.widget.LiveBuildToggleHelper"] = qoid.widget.LiveBuildToggleHelper;
qoid.widget.LiveBuildToggleHelper.__name__ = ["qoid","widget","LiveBuildToggleHelper"];
qoid.widget.LiveBuildToggleHelper.isLive = function(l) {
	return l.liveBuildToggle("isLive");
}
qoid.widget.IntroductionNotificationCompHelper = function() { }
$hxClasses["qoid.widget.IntroductionNotificationCompHelper"] = qoid.widget.IntroductionNotificationCompHelper;
qoid.widget.IntroductionNotificationCompHelper.__name__ = ["qoid","widget","IntroductionNotificationCompHelper"];
qoid.widget.LabelsListHelper = function() { }
$hxClasses["qoid.widget.LabelsListHelper"] = qoid.widget.LabelsListHelper;
qoid.widget.LabelsListHelper.__name__ = ["qoid","widget","LabelsListHelper"];
qoid.widget.LabelsListHelper.getSelected = function(l) {
	return l.labelsList("getSelected");
}
qoid.widget.VerificationRequestNotificationCompHelper = function() { }
$hxClasses["qoid.widget.VerificationRequestNotificationCompHelper"] = qoid.widget.VerificationRequestNotificationCompHelper;
qoid.widget.VerificationRequestNotificationCompHelper.__name__ = ["qoid","widget","VerificationRequestNotificationCompHelper"];
qoid.widget.VerificationResponseNotificationCompHelper = function() { }
$hxClasses["qoid.widget.VerificationResponseNotificationCompHelper"] = qoid.widget.VerificationResponseNotificationCompHelper;
qoid.widget.VerificationResponseNotificationCompHelper.__name__ = ["qoid","widget","VerificationResponseNotificationCompHelper"];
qoid.widget.score = {}
qoid.widget.score.ContentTimeLine = function(paper,profile,startTime,endTime,initialWidth) {
	this.paper = paper;
	this.profile = profile;
	this.startTime = startTime;
	this.endTime = endTime;
	this.initialWidth = initialWidth;
	this.contents = new Array();
	this.contentElements = new Array();
	if(qoid.widget.score.ContentTimeLine.next_y_pos > qoid.widget.score.ContentTimeLine.initial_y_pos) qoid.widget.score.ContentTimeLine.next_y_pos += qoid.widget.score.ContentTimeLine.height + 20;
	qoid.widget.score.ContentTimeLine.next_y_pos += 10;
	this.time_line_x = qoid.widget.score.ContentTimeLine.next_x_pos;
	this.time_line_y = qoid.widget.score.ContentTimeLine.next_y_pos;
	this.connectionElement = this.createConnectionElement();
	this.timeLineElement = (function($this) {
		var $r;
		var e123 = [$this.connectionElement];
		var me123 = paper;
		$r = me123.group.apply(me123, e123);
		return $r;
	}(this));
};
$hxClasses["qoid.widget.score.ContentTimeLine"] = qoid.widget.score.ContentTimeLine;
qoid.widget.score.ContentTimeLine.__name__ = ["qoid","widget","score","ContentTimeLine"];
qoid.widget.score.ContentTimeLine.resetPositions = function() {
	qoid.widget.score.ContentTimeLine.next_y_pos = qoid.widget.score.ContentTimeLine.initial_y_pos;
	qoid.widget.score.ContentTimeLine.next_x_pos = 10;
}
qoid.widget.score.ContentTimeLine.prototype = {
	createAudioElement: function(content,x,y,rx,ry) {
		var ellipse = this.paper.ellipse(x,y,rx,ry).attr({ 'class' : "audioEllipse"});
		var icon = qoid.widget.score.Icons.audioIcon(ellipse.getBBox());
		var g = (function($this) {
			var $r;
			var e123 = [ellipse,icon];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
		g.attr("contentType","AUDIO");
		return g;
	}
	,createLinkElement: function(content,x,y,radius) {
		var hex = qoid.widget.score.Shapes.createHexagon(this.paper,x,y,radius).attr({ 'class' : "urlContent"});
		var icon = qoid.widget.score.Icons.linkIcon(hex.getBBox());
		var g = (function($this) {
			var $r;
			var e123 = [hex,icon];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
		g.attr("contentType","URL");
		return g;
	}
	,createImageElement: function(content,x,y,ele_width,ele_height) {
		var rect = this.paper.rect(x - ele_width / 2,y - ele_height / 2,ele_width,ele_height,3,3).attr({ 'class' : "imageContent"});
		var bbox = { cx : x, cy : y, width : ele_height, height : ele_height};
		var icon = qoid.widget.score.Icons.imageIcon(bbox);
		var g = (function($this) {
			var $r;
			var e123 = [rect,icon];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
		g.attr("contentType","IMAGE");
		return g;
	}
	,createTextElement: function(content,x,y,ele_width,ele_height) {
		var rect = this.paper.rect(x - ele_width / 2,y - ele_height / 2,ele_width,ele_height,3,3).attr({ 'class' : "messageContent"});
		var bbox = { cx : x, cy : y, width : ele_height, height : ele_height};
		var icon = qoid.widget.score.Icons.messageIcon(bbox);
		var g = (function($this) {
			var $r;
			var e123 = [rect,icon];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
		g.attr("contentType","TEXT");
		return g;
	}
	,splitText: function(text,max_chars,max_lines) {
		if(max_lines == null) max_lines = 0;
		var words = text.split(" ");
		var lines = new Array();
		var line_no = 0;
		lines[line_no] = "";
		var _g1 = 0, _g = words.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(lines[line_no].length + words[i].length > max_chars) {
				line_no += 1;
				if(line_no == max_lines) break;
				lines[line_no] = "";
			} else lines[line_no] += " ";
			lines[line_no] += words[i];
		}
		return lines;
	}
	,addContentElement: function(content,ele) {
		var _g = this;
		ele = ele.click(function(evt) {
			var clone = _g.cloneElement(ele);
			var after_anim = function() {
				var bbox = clone.getBBox();
				var cx = bbox.x + bbox.width / 2;
				var cy = bbox.y + bbox.height / 2;
				var g_id = clone.attr("id");
				var g_type = clone.attr("contentType");
				clone.remove();
				var ele1 = null;
				switch(g_type) {
				case "AUDIO":
					ele1 = _g.paper.ellipse(cx,cy,bbox.width / 2,bbox.height / 2).attr({ 'class' : "audioEllipse"});
					break;
				case "IMAGE":
					ele1 = _g.paper.image((js.Boot.__cast(content , qoid.model.ImageContent)).props.imgSrc,bbox.x,bbox.y,bbox.width,bbox.height);
					break;
				case "URL":
					ele1 = qoid.widget.score.Shapes.createHexagon(_g.paper,cx,cy,bbox.width / 2).attr({ 'class' : "urlContent"});
					break;
				case "TEXT":
					ele1 = _g.paper.rect(bbox.x,bbox.y,bbox.width,bbox.height,5,5).attr({ 'class' : "messageContentLarge"});
					break;
				default:
					qoid.AppContext.LOGGER.warn("Unknown Content Type: " + g_type);
				}
				var g = (function($this) {
					var $r;
					var e123 = [ele1];
					var me123 = _g.paper;
					$r = me123.group.apply(me123, e123);
					return $r;
				}(this));
				g.attr({ contentType : g_type});
				g.attr({ id : g_id});
				g.id = g_id;
				g.click(function(evt1) {
					g.remove();
				});
				switch(g_type) {
				case "AUDIO":
					qoid.widget.score.ForeignObject.appendAudioContent(g_id,bbox,(js.Boot.__cast(content , qoid.model.AudioContent)).props);
					break;
				case "URL":
					qoid.widget.score.ForeignObject.appendUrlContent(g_id,bbox,(js.Boot.__cast(content , qoid.model.UrlContent)).props);
					break;
				case "TEXT":
					qoid.widget.score.ForeignObject.appendMessageContent(g_id,bbox,(js.Boot.__cast(content , qoid.model.MessageContent)).props);
					break;
				}
			};
			clone.animate({ transform : "t10,10 s5"},200,"",function() {
				clone.animate({ transform : "t10,10 s4"},100,"",after_anim);
			});
		});
		this.contentElements.push(ele);
		this.timeLineElement.append(ele);
	}
	,cloneElement: function(ele) {
		var clone = ele.clone();
		clone.attr({ contentType : ele.attr("contentType")});
		clone.id = ele.id + "-clone";
		clone.attr({ id : clone.id});
		return clone;
	}
	,createContentElement: function(content) {
		var radius = 10;
		var gap = 10;
		var x = (this.endTime - content.get_created().getTime()) / (this.endTime - this.startTime) * this.initialWidth + this.time_line_x + qoid.widget.score.ContentTimeLine.width;
		var y = this.time_line_y + qoid.widget.score.ContentTimeLine.height / 2;
		var ele;
		if(content.contentType == qoid.model.ContentType.TEXT) this.addContentElement(content,this.createTextElement(js.Boot.__cast(content , qoid.model.MessageContent),x,y,40,40)); else if(content.contentType == qoid.model.ContentType.IMAGE) this.addContentElement(content,this.createImageElement(js.Boot.__cast(content , qoid.model.ImageContent),x,y,40,40)); else if(content.contentType == qoid.model.ContentType.URL) this.addContentElement(content,this.createLinkElement(js.Boot.__cast(content , qoid.model.UrlContent),x,y,20)); else if(content.contentType == qoid.model.ContentType.AUDIO) this.addContentElement(content,this.createAudioElement(js.Boot.__cast(content , qoid.model.AudioContent),x,y,20,20));
	}
	,addContent: function(content) {
		this.contents.push(content);
		this.createContentElement(content);
	}
	,createConnectionElement: function() {
		var line = this.paper.line(this.time_line_x,this.time_line_y + qoid.widget.score.ContentTimeLine.height / 2,this.initialWidth,this.time_line_y + qoid.widget.score.ContentTimeLine.height / 2).attr({ 'class' : "contentLine"});
		var ellipse = this.paper.ellipse(this.time_line_x + qoid.widget.score.ContentTimeLine.width / 2,this.time_line_y + qoid.widget.score.ContentTimeLine.height / 2,qoid.widget.score.ContentTimeLine.width / 2,qoid.widget.score.ContentTimeLine.height / 2);
		ellipse.attr({ fill : "#fff", stroke : "#000", strokeWidth : "1px"});
		var imgSrc = (function($this) {
			var $r;
			try {
				$r = $this.profile.imgSrc;
			} catch( __e ) {
				$r = "media/default_avatar.jpg";
			}
			return $r;
		}(this));
		var img = this.paper.image(imgSrc,this.time_line_x,this.time_line_y,qoid.widget.score.ContentTimeLine.width,qoid.widget.score.ContentTimeLine.height);
		img.attr({ mask : ellipse});
		var border_ellipse = this.paper.ellipse(this.time_line_x + qoid.widget.score.ContentTimeLine.width / 2,this.time_line_y + qoid.widget.score.ContentTimeLine.height / 2,qoid.widget.score.ContentTimeLine.width / 2,qoid.widget.score.ContentTimeLine.height / 2);
		var filter = this.paper.filter((function($this) {
			var $r;
			var dx1 = 4;
			var dy1 = 4;
			var blur1 = 4;
			var color1 = "#000000";
			$r = Snap.filter.shadow(dx1, dy1, blur1, color1);
			return $r;
		}(this)));
		border_ellipse.attr({ fill : "none", stroke : "#5c9ccc", strokeWidth : "1px", filter : filter});
		return (function($this) {
			var $r;
			var e123 = [line,img,border_ellipse];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
	}
	,removeElements: function() {
		this.connectionElement.remove();
		var iter = HxOverrides.iter(this.contentElements);
		while(iter.hasNext()) iter.next().remove();
	}
	,reposition: function(startTime,endTime) {
		if(this.startTime == startTime && this.endTime == endTime) return;
		this.startTime = startTime;
		this.endTime = endTime;
		var _g1 = 0, _g = this.contentElements.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ele = this.contentElements[i];
			var content = this.contents[i];
			var x_start = ele.attr("x");
			var x_end = (endTime - content.get_created().getTime()) / (endTime - startTime) * this.initialWidth + this.time_line_x + qoid.widget.score.ContentTimeLine.width;
		}
	}
	,__class__: qoid.widget.score.ContentTimeLine
}
qoid.widget.score.ForeignObject = function() { }
$hxClasses["qoid.widget.score.ForeignObject"] = qoid.widget.score.ForeignObject;
qoid.widget.score.ForeignObject.__name__ = ["qoid","widget","score","ForeignObject"];
qoid.widget.score.ForeignObject.createForeignObject = function(ele_id,bbox) {
	var klone = d3.select("#" + ele_id);
	var fo = klone.append("foreignObject").attr("width",Std.string(bbox.width - 21)).attr("height",bbox.height).attr("x",Std.string(bbox.x)).attr("y",Std.string(bbox.y)).append("xhtml:body");
	return fo;
}
qoid.widget.score.ForeignObject.appendMessageContent = function(ele_id,bbox,content) {
	var fo = qoid.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	fo.append("div").attr("class","messageContent-large-text").style("width",Std.string(bbox.width - 49) + "px").style("height",Std.string(bbox.height) + "px").html(content.text);
}
qoid.widget.score.ForeignObject.appendUrlContent = function(ele_id,bbox,content) {
	bbox.y = bbox.y + bbox.height / 2 - 12;
	bbox.x += 12;
	var fo = qoid.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	var div = fo.append("div").style("width",Std.string(bbox.width - 49) + "px").style("font-size","12px");
	div.append("a").attr("href",content.url).attr("target","_blank").html(content.text).on("click",function() {
		d3.event.stopPropagation();
	});
}
qoid.widget.score.ForeignObject.appendImageContent = function(ele_id,bbox,content) {
	bbox.y = bbox.y + bbox.height / 2;
	var fo = qoid.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	var div = fo.append("div");
	div.append("div").attr("class","imageCaption").html(content.caption);
	div.append("img").attr("src",content.imgSrc).style("width",Std.string(bbox.width - 49) + "px").style("height",Std.string(bbox.height) + "px");
}
qoid.widget.score.ForeignObject.appendAudioContent = function(ele_id,bbox,content) {
	bbox.y = bbox.y + bbox.height / 2 - 12;
	bbox.x = bbox.x + bbox.width / 3;
	var fo = qoid.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	var div = fo.append("div");
	div.append("div").attr("class","audioTitle").style("width",Std.string(bbox.width - 49) + "px").style("font-size","12px").html(content.title);
	var audioDiv = div.append("div").style("width",Std.string(bbox.width - 49) + "px");
	audioDiv.append("audio").attr("src",content.audioSrc).attr("controls","controls").style("width","230px").style("height","50px").on("click",function() {
		d3.event.stopPropagation();
	});
}
qoid.widget.score.Icons = function() { }
$hxClasses["qoid.widget.score.Icons"] = qoid.widget.score.Icons;
qoid.widget.score.Icons.__name__ = ["qoid","widget","score","Icons"];
qoid.widget.score.Icons.createIcon = function(iconPath,className,bbox) {
	var paper = new Snap("#score-comp-svg");
	var ret = paper.path(iconPath);
	ret.attr("class",className);
	if(bbox != null) {
		var bbox_p = ret.getBBox();
		ret.transform("t" + Std.string(bbox.cx - bbox_p.width / 2 - bbox_p.x) + " " + Std.string(bbox.cy - bbox_p.height / 2 - bbox_p.y));
	}
	return ret;
}
qoid.widget.score.Icons.audioIcon = function(bbox) {
	var audioPath = "M4.998,12.127v7.896h4.495l6.729,5.526l0.004-18.948l-6.73,5.526H4.998z M18.806,11.219c-0.393-0.389-1.024-0.389-1.415,0.002c-0.39,0.391-0.39,1.024,0.002,1.416v-0.002c0.863,0.864,1.395,2.049,1.395,3.366c0,1.316-0.531,2.497-1.393,3.361c-0.394,0.389-0.394,1.022-0.002,1.415c0.195,0.195,0.451,0.293,0.707,0.293c0.257,0,0.513-0.098,0.708-0.293c1.222-1.22,1.98-2.915,1.979-4.776C20.788,14.136,20.027,12.439,18.806,11.219z M21.101,8.925c-0.393-0.391-1.024-0.391-1.413,0c-0.392,0.391-0.392,1.025,0,1.414c1.45,1.451,2.344,3.447,2.344,5.661c0,2.212-0.894,4.207-2.342,5.659c-0.392,0.39-0.392,1.023,0,1.414c0.195,0.195,0.451,0.293,0.708,0.293c0.256,0,0.512-0.098,0.707-0.293c1.808-1.809,2.929-4.315,2.927-7.073C24.033,13.24,22.912,10.732,21.101,8.925z M23.28,6.746c-0.393-0.391-1.025-0.389-1.414,0.002c-0.391,0.389-0.391,1.023,0.002,1.413h-0.002c2.009,2.009,3.248,4.773,3.248,7.839c0,3.063-1.239,5.828-3.246,7.838c-0.391,0.39-0.391,1.023,0.002,1.415c0.194,0.194,0.45,0.291,0.706,0.291s0.513-0.098,0.708-0.293c2.363-2.366,3.831-5.643,3.829-9.251C27.115,12.389,25.647,9.111,23.28,6.746z";
	return qoid.widget.score.Icons.createIcon(audioPath,"audioIcon",bbox);
}
qoid.widget.score.Icons.messageIcon = function(bbox) {
	var messagePath = "M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z";
	return qoid.widget.score.Icons.createIcon(messagePath,"messageIcon",bbox);
}
qoid.widget.score.Icons.linkIcon = function(bbox) {
	var linkPath = "M16.45,18.085l-2.47,2.471c0.054,1.023-0.297,2.062-1.078,2.846c-1.465,1.459-3.837,1.459-5.302-0.002c-1.461-1.465-1.46-3.836-0.001-5.301c0.783-0.781,1.824-1.131,2.847-1.078l2.469-2.469c-2.463-1.057-5.425-0.586-7.438,1.426c-2.634,2.637-2.636,6.907,0,9.545c2.638,2.637,6.909,2.635,9.545,0l0.001,0.002C17.033,23.511,17.506,20.548,16.45,18.085zM14.552,12.915l2.467-2.469c-0.053-1.023,0.297-2.062,1.078-2.848C19.564,6.139,21.934,6.137,23.4,7.6c1.462,1.465,1.462,3.837,0,5.301c-0.783,0.783-1.822,1.132-2.846,1.079l-2.469,2.468c2.463,1.057,5.424,0.584,7.438-1.424c2.634-2.639,2.633-6.91,0-9.546c-2.639-2.636-6.91-2.637-9.545-0.001C13.967,7.489,13.495,10.451,14.552,12.915zM18.152,10.727l-7.424,7.426c-0.585,0.584-0.587,1.535,0,2.121c0.585,0.584,1.536,0.584,2.121-0.002l7.425-7.424c0.584-0.586,0.584-1.535,0-2.121C19.687,10.141,18.736,10.142,18.152,10.727z";
	return qoid.widget.score.Icons.createIcon(linkPath,"linkIcon",bbox);
}
qoid.widget.score.Icons.imageIcon = function(bbox) {
	var imagePath = "M2.5,4.833v22.334h27V4.833H2.5zM25.25,25.25H6.75V6.75h18.5V25.25zM11.25,14c1.426,0,2.583-1.157,2.583-2.583c0-1.427-1.157-2.583-2.583-2.583c-1.427,0-2.583,1.157-2.583,2.583C8.667,12.843,9.823,14,11.25,14zM24.251,16.25l-4.917-4.917l-6.917,6.917L10.5,16.333l-2.752,2.752v5.165h16.503V16.25z";
	return qoid.widget.score.Icons.createIcon(imagePath,"imageIcon",bbox);
}
qoid.widget.score.TimeMarker = function(uberGroup,paper,width,start,end) {
	this.paper = paper;
	this.width = width;
	this.group = ((function($this) {
		var $r;
		var e123 = [];
		var me123 = paper;
		$r = me123.group.apply(me123, e123);
		return $r;
	}(this))).attr("id","time-marker");
	uberGroup.append(this.group);
	this.start = start.getTime();
	this.end = end.getTime();
	this.drawTimeLine();
};
$hxClasses["qoid.widget.score.TimeMarker"] = qoid.widget.score.TimeMarker;
qoid.widget.score.TimeMarker.__name__ = ["qoid","widget","score","TimeMarker"];
qoid.widget.score.TimeMarker.prototype = {
	drawTimeLine: function() {
		var margin = 7;
		var y = 3 * margin;
		var attrs = { strokeOpacity : 0.6, stroke : "#cccccc", strokeWidth : 1};
		var eles = this.group.selectAll("*");
		eles.forEach(function(ele) {
			ele.remove();
		},{ });
		this.line = this.paper.line(margin,y,this.width - margin,y).attr(attrs);
		this.group.append(this.line);
		var interval = this.end - this.start;
		var interval1 = (this.width - 2 * margin) / 24;
		var x = margin;
		var _g = 0;
		while(_g < 25) {
			var i = _g++;
			switch(i) {
			case 0:case 12:case 24:
				this.group.append(this.paper.line(x,y - margin,x,y + margin).attr(attrs));
				x += interval1;
				break;
			case 3:case 15:
				this.group.append(this.paper.line(x,y,x,y + margin + 2).attr(attrs));
				x += interval1;
				break;
			case 6:case 18:
				this.group.append(this.paper.line(x,y,x,y + margin + 2).attr(attrs));
				x += interval1;
				break;
			case 9:case 21:
				this.group.append(this.paper.line(x,y,x,y + margin + 2).attr(attrs));
				x += interval1;
				break;
			default:
				this.group.append(this.paper.line(x,y,x,y + margin).attr(attrs));
				x += interval1;
			}
		}
	}
	,setEnd: function(date) {
		this.end = date.getTime();
		this.drawTimeLine();
	}
	,setStart: function(date) {
		this.start = date.getTime();
		this.drawTimeLine();
	}
	,__class__: qoid.widget.score.TimeMarker
}
qoid.widget.score.Shapes = function() { }
$hxClasses["qoid.widget.score.Shapes"] = qoid.widget.score.Shapes;
qoid.widget.score.Shapes.__name__ = ["qoid","widget","score","Shapes"];
qoid.widget.score.Shapes.createHexagon = function(paper,cx,cy,r) {
	var theta = 0.523598775;
	var hexagon = paper.polygon([cx - r * Math.sin(theta),cy - r * Math.cos(theta),cx - r,cy,cx - r * Math.sin(theta),cy + r * Math.cos(theta),cx + r * Math.sin(theta),cy + r * Math.cos(theta),cx + r,cy,cx + r * Math.sin(theta),cy - r * Math.cos(theta)]);
	hexagon.attr("cx",cx);
	hexagon.attr("cy",cy);
	hexagon.attr("r",r);
	return hexagon;
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
if(typeof(JSON) != "undefined") haxe.Json = JSON;
var q = window.jQuery;
js.JQuery = q;
$.fn.exists = function() {
	return $(this).length > 0;
};
$.fn.isVisible = function() {
	return $(this).css("display") != "none";
};
$.fn.hasAttr = function(name) {
	return $(this).attr(name) != undefined;
};
$.fn.intersects = function(el) {
	var tAxis = $(this).offset();
	var t_x = [tAxis.left,tAxis.left + $(this).outerWidth()];
	var t_y = [tAxis.top,tAxis.top + $(this).outerHeight()];
	var thisPos = el.offset();
	var i_x = [thisPos.left,thisPos.left + el.outerWidth()];
	var i_y = [thisPos.top,thisPos.top + el.outerHeight()];
	var intersects = false;
	if(t_x[0] < i_x[1] && t_x[1] > i_x[0] && t_y[0] < i_y[1] && t_y[1] > i_y[0]) intersects = true;
	return intersects;
};
var defineWidget = function() {
	return { options : { autoOpen : true, height : 320, width : 320, modal : true, buttons : { }, showHelp : false, onMaxToggle : $.noop}, originalSize : { width : 10, height : 10}, _create : function() {
		this._super("create");
		var self = this;
		var selfElement = this.element;
		var closeBtn = selfElement.prev().find(".ui-dialog-titlebar-close");
		var hovers = new $("blah");
		if(self.options.showHelp && false) {
			if(!Reflect.isFunction(self.options.buildHelp)) m3.log.Logga.get_DEFAULT().error("Supposed to show help but buildHelp is not a function"); else {
				var helpIconWrapper = new $("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px;' role='button'>");
				var helpIcon = new $("<span class='ui-icon ui-icon-help'>help</span>");
				hovers = hovers.add(helpIconWrapper);
				helpIconWrapper.append(helpIcon);
				closeBtn.before(helpIconWrapper);
				helpIconWrapper.click(function(evt) {
					self.options.buildHelp();
				});
			}
		}
		if(self.options.showMaximizer) {
			self.maxIconWrapper = new $("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px;' role='button'>");
			var maxIcon = new $("<span class='ui-icon ui-icon-extlink'>maximize</span>");
			hovers = hovers.add(self.maxIconWrapper);
			self.maxIconWrapper.append(maxIcon);
			closeBtn.before(self.maxIconWrapper);
			self.maxIconWrapper.click(function(evt) {
				self.maximize();
			});
		}
		self.restoreIconWrapper = new $("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px; display: none;' role='button'>");
		var restoreIcon = new $("<span class='ui-icon ui-icon-newwin'>restore</span>");
		hovers = hovers.add(self.restoreIconWrapper);
		self.restoreIconWrapper.append(restoreIcon);
		closeBtn.before(self.restoreIconWrapper);
		self.restoreIconWrapper.click(function(evt) {
			self.restore();
		});
		hovers.hover(function(evt) {
			$(this).addClass("ui-state-hover");
		},function(evt) {
			$(this).removeClass("ui-state-hover");
		});
	}, restore : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.m3dialog("option","height",self.originalSize.height);
		selfElement.m3dialog("option","width",self.originalSize.width);
		selfElement.parent().position({ my : "middle", at : "middle", of : js.Browser.window});
		self.restoreIconWrapper.hide();
		self.maxIconWrapper.show();
		self.options.onMaxToggle();
	}, maximize : function() {
		var self = this;
		var selfElement = this.element;
		self.originalSize = { height : selfElement.parent().height(), width : selfElement.parent().width()};
		var window = new $(js.Browser.window);
		var windowDimensions = { height : window.height(), width : window.width()};
		selfElement.m3dialog("option","height",windowDimensions.height * .85);
		selfElement.m3dialog("option","width",windowDimensions.width * .85);
		selfElement.parent().position({ my : "middle", at : "middle", of : window});
		self.maxIconWrapper.hide();
		self.restoreIconWrapper.show();
		self.options.onMaxToggle();
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.m3dialog",$.ui.dialog,defineWidget());
var defineWidget = function() {
	return { options : { menuOptions : null, width : 200, classes : ""}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("ul")) throw new m3.exception.Exception("Root of M3Menu should be a ul");
		selfElement.css("position","absolute");
		selfElement.addClass("m3menu nonmodalPopup");
		if(m3.helper.StringHelper.isNotBlank(self.options.classes)) selfElement.addClass(self.options.classes);
		selfElement.width(self.options.width);
		var _g = 0, _g1 = self.options.menuOptions;
		while(_g < _g1.length) {
			var menuOption = [_g1[_g]];
			++_g;
			var icon = m3.helper.StringHelper.isNotBlank(menuOption[0].icon)?"<span class='ui-icon " + menuOption[0].icon + "'></span>":"";
			new $("<li><a href='#'>" + icon + menuOption[0].label + "</a></li>").appendTo(selfElement).click((function(menuOption) {
				return function(evt) {
					menuOption[0].action(evt,selfElement);
				};
			})(menuOption));
		}
		selfElement.on("contextmenu",function(evt) {
			return false;
		});
		this._super("create");
	}, _closeOnDocumentClick : function(evt) {
		return true;
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.m3menu",$.ui.menu,defineWidget());
m3.util.ColorProvider._COLORS = new Array();
m3.util.ColorProvider._COLORS.push("#5C9BCC");
m3.util.ColorProvider._COLORS.push("#CC5C64");
m3.util.ColorProvider._COLORS.push("#5CCC8C");
m3.util.ColorProvider._COLORS.push("#5C64CC");
m3.util.ColorProvider._COLORS.push("#8C5CCC");
m3.util.ColorProvider._COLORS.push("#C45CCC");
m3.util.ColorProvider._COLORS.push("#5CCCC4");
m3.util.ColorProvider._COLORS.push("#8BB8DA");
m3.util.ColorProvider._COLORS.push("#B9D4E9");
m3.util.ColorProvider._COLORS.push("#CC5C9B");
m3.util.ColorProvider._COLORS.push("#E9CEB9");
m3.util.ColorProvider._COLORS.push("#DAAD8B");
m3.util.ColorProvider._COLORS.push("#64CC5C");
m3.util.ColorProvider._COLORS.push("#9BCC5C");
m3.util.ColorProvider._COLORS.push("#CCC45C");
m3.util.ColorProvider._COLORS.push("#CC8C5C");
m3.util.ColorProvider._LAST_COLORS_USED = new m3.util.FixedSizeArray(10);
qoid.model.EM.delegate = new m3.event.EventManager();
qoid.model.ContentSource.filteredContent = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
qoid.model.ContentSource.listeners = new Array();
qoid.model.EM.addListener(qoid.model.EMEvent.AliasLoaded,qoid.model.ContentSource.onAliasLoaded,"ContentSource-AliasLoaded");
qoid.model.EM.addListener(qoid.model.EMEvent.LoadFilteredContent,qoid.model.ContentSource.onLoadFilteredContent,"ContentSource-LoadFilteredContent");
qoid.model.EM.addListener(qoid.model.EMEvent.AppendFilteredContent,qoid.model.ContentSource.onAppendFilteredContent,"ContentSource-AppendFilteredContent");
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AndOrToggle must be a div element");
		selfElement.addClass("andOrToggle");
		var or = new $("<div class='ui-widget-content ui-state-active ui-corner-top any'>Any</div>");
		var and = new $("<div class='ui-widget-content ui-corner-bottom all'>All</div>");
		selfElement.append(or).append(and);
		var children = selfElement.children();
		children.hover(function(evt) {
			$(this).addClass("ui-state-hover");
		},function(evt) {
			$(this).removeClass("ui-state-hover");
		}).click(function(evt) {
			children.toggleClass("ui-state-active");
			self._fireFilter();
		});
		selfElement.data("getNode",function() {
			var root;
			if(or.hasClass("ui-state-active")) root = new qoid.model.Or(); else root = new qoid.model.And();
			return root;
		});
	}, _fireFilter : function() {
		var selfElement = this.element;
		var filter = js.Boot.__cast(selfElement.closest("#filter") , $);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.andOrToggle",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of FilterCombination must be a div element");
		selfElement.data("getNode",function() {
			var root = (selfElement.children(".andOrToggle").data("getNode"))();
			var filterables = selfElement.children(".filterable");
			filterables.each(function(idx,el) {
				var filterable = new $(el);
				var node = (filterable.data("getNode"))();
				root.addNode(node);
			});
			return root;
		});
		self._filterables = new m3.observable.ObservableSet(function(fc) {
			return fc.attr("id");
		});
		self._filterables.listen(function(fc,evt) {
			if(evt.isAdd()) self._add(fc); else if(evt.isUpdate()) {
				fc.css("position","absolute").css({ left : "", top : ""});
				self._layout();
			} else if(evt.isDelete()) self._remove(fc);
		});
		selfElement.on("dragstop",function(dragstopEvt,dragstopUi) {
			qoid.AppContext.LOGGER.debug("dragstop on filtercombo");
			if(self.options.dragstop != null) self.options.dragstop(dragstopEvt,dragstopUi);
		});
		selfElement.addClass("ui-state-highlight connectionDT labelDT filterable dropCombiner filterCombination filterTrashable container shadow" + m3.widget.Widgets.getWidgetClasses());
		self._id = selfElement.attr("id");
		if(m3.helper.StringHelper.isBlank(self._id)) {
			self._id = m3.util.UidGenerator.create(8);
			selfElement.attr("id",self._id);
		}
		selfElement.position({ my : "bottom right", at : "left top", of : self.options.event, collision : "flipfit", within : "#filter"});
		selfElement.data("clone",function(filterableComp,isDragByHelper,containment) {
			if(containment == null) containment = false;
			if(isDragByHelper == null) isDragByHelper = false;
			var fc = js.Boot.__cast(filterableComp , $);
			return fc;
		});
		var toggle = new $("<div class='andOrToggle'></div>").andOrToggle();
		selfElement.append(toggle);
		(js.Boot.__cast(selfElement , $)).draggable({ distance : 10, scroll : false});
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return self.options.type == "LABEL" && d["is"](".label") || self.options.type == "CONNECTION" && d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"window");
			clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass"))).appendTo(selfElement).css("position","absolute").css({ left : "", top : ""});
			self.addFilterable(clone);
			selfElement.position({ collision : "flipfit", within : "#filter"});
		}, tolerance : "pointer"});
	}, position : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.position({ my : "center", at : "center", of : self.options.event, collision : "flipfit", within : "#filter"});
	}, addFilterable : function(filterable) {
		var self = this;
		self._filterables.add(filterable);
		if(self._filterables.size() > 1) self._fireFilter();
	}, removeFilterable : function(filterable) {
		var self = this;
		self._filterables["delete"](filterable);
	}, _add : function(filterable1) {
		var self1 = this;
		var selfElement = this.element;
		filterable1.appendTo(selfElement).addClass("inFilterCombination").css("position","absolute").css({ left : "", top : ""}).on("dragstop",function(evt) {
			if(!filterable1.parent("#" + self1._id).exists()) self1.removeFilterable(filterable1);
		});
		self1._layout();
	}, _remove : function(filterable) {
		var self = this;
		var selfElement = this.element;
		filterable.removeClass("inFilterCombination");
		var iter = self._filterables.iterator();
		if(iter.hasNext()) {
			var filterable1 = iter.next();
			if(iter.hasNext()) self._layout(); else {
				var position = filterable1.offset();
				filterable1.appendTo(selfElement.parent()).offset(position);
				selfElement.remove();
				self.destroy();
			}
		} else {
			self.destroy();
			selfElement.remove();
		}
	}, _layout : function() {
		var self = this;
		var selfElement = this.element;
		var filterableConns = new m3.observable.FilteredSet(self._filterables,function(fc) {
			return fc.hasClass("connectionAvatar");
		});
		var filterableLabels = new m3.observable.FilteredSet(self._filterables,function(fc) {
			return fc.hasClass("label");
		});
		var leftPadding = 30;
		var topPadding = 6;
		var typeGap = 10;
		var rowGap = 50;
		var iterC = filterableConns.iterator();
		var connCount = 0;
		var connPairs = 0;
		while(iterC.hasNext()) {
			connCount++;
			connPairs = (connCount / 2 | 0) + connCount % 2;
			var connAvatar = iterC.next();
			connAvatar.css({ left : leftPadding + 35 * (connPairs - 1), top : topPadding + rowGap * ((connCount + 1) % 2)});
		}
		var connectionWidth = 35 * connPairs;
		var iterL = filterableLabels.iterator();
		var labelCount = 0;
		var labelPairs = 0;
		while(iterL.hasNext()) {
			labelCount++;
			labelPairs = (labelCount / 2 | 0) + labelCount % 2;
			var labelComp = iterL.next();
			labelComp.css({ left : leftPadding + connectionWidth + typeGap + 135 * (labelPairs - 1), top : topPadding + rowGap * ((labelCount + 1) % 2)});
		}
		selfElement.css({ width : 35 * connPairs + 135 * labelPairs + "px", 'min-width' : 35 * connPairs + 135 * labelPairs + "px"});
	}, _fireFilter : function() {
		var selfElement = this.element;
		var filter = js.Boot.__cast(selfElement.parent("#filter") , $);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.filterCombination",defineWidget());
var defineWidget = function() {
	return { options : { isDragByHelper : true, containment : false, dndEnabled : true, classes : null, dragstop : null, cloneFcn : function(filterableComp,isDragByHelper,containment,dragstop) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var connectionAvatar = js.Boot.__cast(filterableComp , $);
		if(connectionAvatar.hasClass("clone")) return connectionAvatar;
		var clone = new $("<div class='clone'></div>");
		clone.connectionAvatar({ connectionIid : connectionAvatar.connectionAvatar("option","connectionIid"), aliasIid : connectionAvatar.connectionAvatar("option","aliasIid"), isDragByHelper : isDragByHelper, containment : containment, dragstop : dragstop, classes : connectionAvatar.connectionAvatar("option","classes"), cloneFcn : connectionAvatar.connectionAvatar("option","cloneFcn"), dropTargetClass : connectionAvatar.connectionAvatar("option","dropTargetClass"), helperFcn : connectionAvatar.connectionAvatar("option","helperFcn")});
		return clone;
	}, dropTargetClass : "connectionDT", helperFcn : function() {
		var clone = $(this).clone();
		return clone.children("img").addClass("connectionDraggingImg");
	}}, getConnection : function() {
		var self = this;
		return m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_CONNECTIONS,self.options.connectionIid);
	}, getAlias : function() {
		var self = this;
		return m3.helper.OSetHelper.getElement(qoid.AppContext.ALIASES,self.options.aliasIid);
	}, _create : function() {
		var self1 = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionAvatar must be a div element");
		var id = "connavatar_" + (self1.options.aliasIid == null?self1.options.connectionIid:self1.options.aliasIid);
		selfElement.attr("id",id);
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connectionAvatar filterable");
		if(self1.options.aliasIid != null) selfElement.addClass("aliasAvatar");
		var img = new $("<img class='shadow'/>");
		selfElement.append(img);
		self1._updateWidgets(new qoid.model.Profile());
		if(self1.options.connectionIid != null) {
			self1.filteredSetConnection = new m3.observable.FilteredSet(qoid.AppContext.MASTER_CONNECTIONS,function(c) {
				return c.iid == self1.options.connectionIid;
			});
			self1._onUpdateConnection = function(c,evt) {
				if(evt.isAddOrUpdate()) self1._updateWidgets(c.data);
				if(evt.isDelete() || c.deleted) {
					self1.destroy();
					selfElement.remove();
				}
			};
			self1.filteredSetConnection.listen(self1._onUpdateConnection);
		} else if(self1.options.aliasIid != null) {
			self1.filteredSetAlias = new m3.observable.FilteredSet(qoid.AppContext.MASTER_ALIASES,function(a) {
				return a.iid == self1.options.aliasIid;
			});
			self1._onUpdateAlias = function(a,evt) {
				if(evt.isAddOrUpdate()) self1._updateWidgets(a.profile);
				if(evt.isDelete() || a.deleted) {
					self1.destroy();
					selfElement.remove();
				}
			};
			self1.filteredSetAlias.listen(self1._onUpdateAlias);
		} else qoid.AppContext.LOGGER.warn("Both connectionIid and aliasIid are not set for Avatar");
		(js.Boot.__cast(selfElement , $)).tooltip();
		if(!self1.options.dndEnabled) img.mousedown(function(evt) {
			return false;;
		}); else {
			selfElement.addClass("filterable");
			selfElement.data("clone",self1.options.cloneFcn);
			selfElement.data("dropTargetClass",self1.options.dropTargetClass);
			selfElement.data("getNode",function() {
				if(self1.options.connectionIid != null) return new qoid.model.ConnectionNode(self1.getConnection()); else return null;
			});
			selfElement.on("dragstop",function(dragstopEvt,dragstopUi) {
				if(self1.options.dragstop != null) self1.options.dragstop(dragstopEvt,dragstopUi);
			});
			var helper = "clone";
			if(!self1.options.isDragByHelper) helper = "original"; else if(self1.options.helperFcn != null && Reflect.isFunction(self1.options.helperFcn)) helper = self1.options.helperFcn;
			(js.Boot.__cast(selfElement , $)).draggable({ containment : self1.options.containment, helper : helper, distance : 10, revertDuration : 200, scroll : false, start : function(evt,_ui) {
				(js.Boot.__cast(selfElement , $)).draggable("option","revert",false);
			}});
			(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
				return !$(this).parent()["is"](".filterCombination") && (d["is"](".labelComp") || $(this).parent()["is"](".dropCombiner") && d["is"](".connectionAvatar"));
			}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
				if(_ui.draggable["is"](".labelComp")) {
					var labelComp = js.Boot.__cast(_ui.draggable , $);
					var connection = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_CONNECTIONS,self1.options.connectionIid);
					qoid.widget.DialogManager.allowAccess(labelComp.labelComp("getLabel"),connection);
				} else {
					var filterCombiner = new $("<div></div>");
					filterCombiner.appendTo($(this).parent());
					filterCombiner.filterCombination({ event : event, type : "CONNECTION", dragstop : self1.options.dragstop});
					filterCombiner.filterCombination("addFilterable",$(this));
					var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
					clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
					filterCombiner.filterCombination("addFilterable",clone);
					filterCombiner.filterCombination("position");
				}
			}, tolerance : "pointer"});
		}
	}, _updateWidgets : function(profile) {
		var self = this;
		var selfElement = this.element;
		var imgSrc = "media/default_avatar.jpg";
		if(m3.helper.StringHelper.isNotBlank((function($this) {
			var $r;
			try {
				$r = profile.imgSrc;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc = profile.imgSrc;
		selfElement.children("img").attr("src",imgSrc);
		selfElement.attr("title",(function($this) {
			var $r;
			try {
				$r = profile.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)));
	}, destroy : function() {
		var self = this;
		if(self.filteredSetConnection != null) self.filteredSetConnection.removeListener(self._onUpdateConnection); else if(self.filteredSetAlias != null) self.filteredSetAlias.removeListener(self._onUpdateAlias);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.connectionAvatar",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AliasComp must be a div element");
		selfElement.addClass("ocontainer shadow ");
		self.container = new $("<div class='container'></div>");
		selfElement.append(self.container);
		self.avatar = new $("<div></div>").appendTo(self.container);
		self.userIdTxt = new $("<div class='userIdTxt'></div>");
		self.container.append(self.userIdTxt);
		self.userIdTxt.html("...");
		self._setAlias(new qoid.model.Alias());
		var changeDiv = new $("<div class='ui-helper-clearfix'></div>");
		self.container.append(changeDiv);
		self.switchAliasLink = new $("<a class='aliasToggle'>Aliases</a>");
		changeDiv.append(self.switchAliasLink);
		self.switchAliasLink.click(function(evt) {
			var aliasMenu = self._createAliasMenu();
			aliasMenu.show();
			aliasMenu.position({ my : "left top", at : "right-6px center", of : selfElement});
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.AliasLoaded,function(alias) {
			self._setAlias(alias);
		},"AliasComp-Alias");
		(js.Boot.__cast(self.container , $)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			var dragstop = function(dragstopEvt,dragstopUi) {
				if(!self.container.intersects(dragstopUi.helper)) {
					dragstopUi.helper.remove();
					selfElement.removeClass("targetChange");
					m3.util.JqueryUtil.deleteEffects(dragstopEvt);
					qoid.AppContext.TARGET = null;
					self._setAlias(qoid.AppContext.currentAlias);
				}
			};
			selfElement.addClass("targetChange");
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,dragstop);
			clone.addClass("small");
			clone.insertBefore(new $(".ui-helper-clearfix",self.container));
			self._setTarget(qoid.widget.ConnectionAvatarHelper.getConnection(clone));
		}});
		self._onupdate = function(alias,t) {
			if(t.isAddOrUpdate()) {
				if(alias.deleted) {
					self.destroy();
					selfElement.remove();
				} else self._updateAliasWidgets(alias);
			} else if(t.isDelete()) {
				self.destroy();
				selfElement.remove();
			}
		};
		self._onupdateProfile = function(p,t) {
			var alias = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_ALIASES,p.aliasIid);
			self._updateAliasWidgets(alias);
		};
	}, _createAliasMenu : function() {
		var self = this;
		new $("#userAliasMenu").remove();
		var menu = new $("<ul id='userAliasMenu'></ul>");
		menu.appendTo(self.container);
		var menuOptions = [];
		var menuOption;
		var aliases = new m3.observable.SortedSet(qoid.AppContext.ALIASES,function(a) {
			return a.profile.name.toLowerCase();
		});
		var $it0 = aliases.iterator();
		while( $it0.hasNext() ) {
			var alias = $it0.next();
			var alias1 = [alias];
			menuOption = { label : alias1[0].profile.name, icon : "ui-icon-person", action : (function(alias1) {
				return function(evt,m) {
					if(qoid.model.Alias.identifier(qoid.AppContext.currentAlias) == qoid.model.Alias.identifier(alias1[0])) menu.hide(); else {
						qoid.AppContext.currentAlias = alias1[0];
						qoid.model.EM.change(qoid.model.EMEvent.AliasLoaded,alias1[0]);
					}
				};
			})(alias1)};
			menuOptions.push(menuOption);
		}
		menuOption = { label : "Manage Aliases...", icon : "ui-icon-circle-plus", action : function(evt,m) {
			qoid.widget.DialogManager.showAliasManager();
		}};
		menuOptions.push(menuOption);
		menu.m3menu({ menuOptions : menuOptions}).hide();
		return menu;
	}, _updateAliasWidgets : function(alias) {
		var self = this;
		var avatar = new $("<div class='avatar' style='position:relative;left:50px;'></div>").connectionAvatar({ aliasIid : alias.iid, dndEnabled : true, isDragByHelper : true, containment : false});
		self.avatar.replaceWith(avatar);
		self.avatar = avatar;
		new $(".userIdTxt").html(alias.profile.name);
	}, _setAlias : function(alias2) {
		var self = this;
		var selfElement = this.element;
		self._updateAliasWidgets(alias2);
		if(self.aliasSet != null) self.aliasSet.removeListener(self._onupdate);
		self.aliasSet = new m3.observable.FilteredSet(qoid.AppContext.MASTER_ALIASES,function(a) {
			return a.iid == alias2.iid;
		});
		self.aliasSet.listen(self._onupdate);
		if(self.profileSet != null) self.profileSet.removeListener(self._onupdateProfile);
		self.profileSet = new m3.observable.FilteredSet(qoid.AppContext.PROFILES,function(p) {
			return p.aliasIid == alias2.iid;
		});
		self.profileSet.listen(self._onupdateProfile);
	}, _setTarget : function(conn) {
		var self = this;
		self.switchAliasLink.hide();
		self.userIdTxt.html(conn.data.name);
		qoid.AppContext.TARGET = conn;
		qoid.model.EM.change(qoid.model.EMEvent.TargetChange,conn);
	}, destroy : function() {
		var self = this;
		if(self.aliasSet != null) self.aliasSet.removeListener(self._onupdate);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.AliasComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of UploadComp must be a div element");
		selfElement.addClass("uploadComp container " + m3.widget.Widgets.getWidgetClasses());
		self._createFileUploadComponent();
		selfElement.on("dragleave",function(evt,d) {
			qoid.AppContext.LOGGER.debug("dragleave");
			var target = evt.target;
			if(target != null && target == selfElement[0]) $(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragenter",function(evt,d) {
			qoid.AppContext.LOGGER.debug("dragenter");
			$(this).addClass("over");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragover",function(evt,d) {
			qoid.AppContext.LOGGER.debug("dragover");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("drop",function(evt,d) {
			qoid.AppContext.LOGGER.debug("drop");
			self._traverseFiles(evt.originalEvent.dataTransfer.files);
			$(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
	}, _createFileUploadComponent : function() {
		var self1 = this;
		var selfElement = this.element;
		if(self1.inner_element_id != null) new $("#" + self1.inner_element_id).remove();
		self1.inner_element_id = "files-upload-" + StringTools.hex(Std.random(999999));
		var filesUpload = new $("<input id='" + self1.inner_element_id + "' class='files-upload' type='file'/>").prependTo(selfElement);
		filesUpload.change(function(evt) {
			self1._traverseFiles(this.files);
		});
	}, _uploadFile : function(file) {
		var self2 = this;
		var selfElement = this.element;
		if(typeof FileReader === 'undefined') {
			m3.util.JqueryUtil.alert("FileUpload is not supported by your browser");
			return;
		}
		if(self2.options.contentType == qoid.model.ContentType.IMAGE && !new EReg("image","i").match(file.type)) {
			m3.util.JqueryUtil.alert("Please select an image file.");
			return;
		}
		if(self2.options.contentType == qoid.model.ContentType.AUDIO && !new EReg("audio","i").match(file.type)) {
			m3.util.JqueryUtil.alert("Please select an audio file.");
			return;
		}
		qoid.AppContext.LOGGER.debug("upload " + Std.string(file.name));
		var reader = new FileReader();
		reader.onload = function(evt) {
			self2.setPreviewImage(evt.target.result);
			if(self2.options.onload != null) self2.options.onload(evt.target.result);
		};
		reader.readAsDataURL(file);
	}, setPreviewImage : function(src) {
		var self = this;
		if(self.previewImg == null) {
			var selfElement = this.element;
			self.previewImg = new $("<img class='file_about_to_be_uploaded'/>").appendTo(selfElement);
		}
		self.previewImg.attr("src",src);
	}, _traverseFiles : function(files) {
		qoid.AppContext.LOGGER.debug("traverse the files");
		var self = this;
		if(m3.helper.ArrayHelper.hasValues(files)) {
			var _g = 0;
			while(_g < 1) {
				var i = _g++;
				self._uploadFile(files[i]);
			}
		} else {
		}
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, value : function() {
		var self = this;
		return self.previewImg.attr("src");
	}, clear : function() {
		var self = this;
		self.previewImg.remove();
		self.previewImg = null;
		self._createFileUploadComponent();
	}};
};
$.widget("ui.uploadComp",defineWidget());
var defineWidget = function() {
	return { initialized : false, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AliasManagerDialog must be a div element");
		selfElement.addClass("_aliasManagerDialog").hide();
		self.leftDiv = new $("<div class='fleft boxsizingBorder' id='leftDiv'></div>").appendTo(selfElement);
		self.rightDiv = new $("<div class='fright ui-corner-all'  id='rightDiv'></div>").appendTo(selfElement);
		self.rightDiv.append("<h2>Aliases</h2>");
		var alii_div = new $("<div class='alii'><div>").appendTo(self.rightDiv);
		self.aliasMap = new m3.observable.MappedSet(qoid.AppContext.MASTER_ALIASES,function(a) {
			return new $("<div class='clickable alias_link' id='a_" + a.iid + "'></div>").appendTo(alii_div).click(function(evt) {
				self._showAliasDetail(a);
			}).append(a.profile.name);
		});
		self.aliasMap.mapListen(function(a,w,evt) {
			if(evt.isAddOrUpdate()) {
				if(a.deleted) self._onAliasDeleted(a,w); else w.html(a.profile.name);
			} else if(evt.isDelete()) self._onAliasDeleted(a,w);
		});
		self.newAliasButton = new $("<button id='new_alias_button'>New Alias</button>").button().click(function(evt) {
			self._showAliasEditor(null);
		}).appendTo(self.rightDiv);
		self._showAliasDetail(qoid.AppContext.currentAlias);
	}, _onAliasDeleted : function(alias,w) {
		var self = this;
		w.remove();
		new $(".alias_link")[0].click();
	}, _showAliasDetail : function(alias1) {
		var self1 = this;
		var selfElement1 = this.element;
		self1.leftDiv.empty();
		var imgSrc = "media/default_avatar.jpg";
		var loadAliasBtn = new $("<button class='fleft'>Use This Alias</button>").appendTo(self1.leftDiv).button().click(function(evt) {
			qoid.AppContext.currentAlias = alias1;
			qoid.model.EM.change(qoid.model.EMEvent.AliasLoaded,alias1);
			m3.jq.JQDialogHelper.close(selfElement1);
		});
		self1.leftDiv.append("<br class='clear'/><br/>");
		if(m3.helper.StringHelper.isNotBlank((function($this) {
			var $r;
			try {
				$r = alias1.profile.imgSrc;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc = alias1.profile.imgSrc;
		self1.leftDiv.append(new $("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>"));
		self1.leftDiv.append(new $("<h2>" + alias1.profile.name + "</h2>"));
		var btnDiv = new $("<div></div>").appendTo(self1.leftDiv);
		var setDefaultBtn = new $("<button>Set Default</button>").appendTo(btnDiv).button().click(function(evt) {
			alias1.data.isDefault = true;
			qoid.model.EM.change(qoid.model.EMEvent.UpdateAlias,alias1);
		});
		var editBtn = new $("<button>Edit</button>").appendTo(btnDiv).button().click(function(evt) {
			self1._showAliasEditor(alias1);
		});
		var deleteBtn = new $("<button>Delete</button>").appendTo(btnDiv).button().click(function(evt) {
			qoid.model.EM.change(qoid.model.EMEvent.DeleteAlias,alias1);
		});
		self1.newAliasButton.show();
	}, _showAliasEditor : function(alias2) {
		var self2 = this;
		var selfElement2 = this.element;
		self2.leftDiv.empty();
		var imgSrc = "media/default_avatar.jpg";
		self2.leftDiv.append("<div id='alias_name_label'>Alias Name:</div>");
		var aliasName = new $("<input class='ui-corner-all ui-state-active ui-widget-content' id='alias_name_input'/>").appendTo(self2.leftDiv);
		if(alias2 != null) aliasName.val(alias2.profile.name);
		self2.leftDiv.append("<br/><br/>");
		var aliasImg = null;
		self2.leftDiv.append(new $("<div id='profile_picture_label'>Profile Picture: </div>").append(new $("<a id='change_profile_picture'>Change</a>").click(function(evt) {
			var dlg = new $("<div id='profilePictureUploader'></div>");
			dlg.appendTo(selfElement2);
			var uploadComp = new $("<div class='boxsizingBorder' style='height: 150px;'></div>");
			uploadComp.appendTo(dlg);
			uploadComp.uploadComp({ onload : function(bytes) {
				m3.jq.M3DialogHelper.close(dlg);
				aliasImg.attr("src",bytes);
			}});
			dlg.m3dialog({ width : 600, height : 305, title : "Profile Image Uploader", buttons : { Cancel : function() {
				m3.jq.M3DialogHelper.close($(this));
			}}});
		})));
		if(m3.helper.StringHelper.isNotBlank((function($this) {
			var $r;
			try {
				$r = alias2.profile.imgSrc;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc = alias2.profile.imgSrc;
		aliasImg = new $("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>");
		self2.leftDiv.append(aliasImg);
		self2.leftDiv.append("<br/><br/>");
		var btnDiv = new $("<div></div>").appendTo(self2.leftDiv);
		var updateBtn = new $("<button>" + (alias2 != null?"Update":"Create") + "</button>").appendTo(btnDiv).button().click(function(evt) {
			var name = aliasName.val();
			if(m3.helper.StringHelper.isBlank(name)) {
				m3.util.JqueryUtil.alert("Alias name cannot be blank.","Error");
				return;
			}
			var profilePic = aliasImg.attr("src");
			if(m3.helper.StringHelper.startsWithAny(profilePic,["media"])) profilePic = "";
			var applyDlg = alias2 == null?(function($this) {
				var $r;
				alias2 = new qoid.model.Alias();
				alias2.profile.name = name;
				alias2.profile.imgSrc = profilePic;
				alias2.rootLabelIid = qoid.AppContext.ROOT_LABEL_ID;
				$r = function() {
					qoid.model.EM.listenOnce(qoid.model.EMEvent.AliasCreated,function(alias3) {
						haxe.Timer.delay(function() {
							self2._showAliasDetail(alias3);
						},100);
					});
					qoid.model.EM.change(qoid.model.EMEvent.CreateAlias,alias2);
				};
				return $r;
			}(this)):(function($this) {
				var $r;
				alias2.profile.name = name;
				alias2.profile.imgSrc = profilePic;
				$r = function() {
					qoid.model.EM.listenOnce(qoid.model.EMEvent.AliasUpdated,function(alias) {
						self2._showAliasDetail(alias);
					});
					qoid.model.EM.change(qoid.model.EMEvent.UpdateAlias,alias2);
				};
				return $r;
			}(this));
			applyDlg();
		});
		var cancelBtn = new $("<button>Cancel</button>").appendTo(btnDiv).button().click(function(evt) {
			self2._showAliasDetail(alias2);
		});
		self2.newAliasButton.hide();
	}, _createAliasManager : function() {
		var self = this;
		var selfElement = this.element;
		var alias = new qoid.model.Alias();
		alias.profile.name = self.aliasName.val();
		alias.profile.name = self.username.val();
		if(m3.helper.StringHelper.isBlank(alias.profile.name) || m3.helper.StringHelper.isBlank(alias.profile.name)) return;
		selfElement.find(".ui-state-error").removeClass("ui-state-error");
		qoid.model.EM.change(qoid.model.EMEvent.CreateAlias,alias);
	}, _buildDialog : function() {
		var self = this;
		var selfElement3 = this.element;
		self.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Alias Manager", height : 440, width : 550, buttons : { }, close : function(evt,ui) {
			selfElement3.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement3.dialog(dlgOptions);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(!self.initialized) self._buildDialog();
		m3.jq.JQDialogHelper.open(selfElement);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.aliasManagerDialog",defineWidget());
var defineWidget = function() {
	return { options : { labelIid : null, isDragByHelper : true, containment : false, dndEnabled : true, classes : null, dropTargetClass : "labelDT", dragstop : null, cloneFcn : function(filterableComp,isDragByHelper,containment,dragstop) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var labelComp = js.Boot.__cast(filterableComp , $);
		if(labelComp.hasClass("clone")) return labelComp;
		var clone = new $("<div class='clone'></div>");
		clone.labelComp({ labelIid : labelComp.labelComp("option","labelIid"), parentIid : labelComp.labelComp("option","parentIid"), labelPath : labelComp.labelComp("option","labelPath"), isDragByHelper : isDragByHelper, containment : containment, dragstop : dragstop, classes : labelComp.labelComp("option","classes"), cloneFcn : labelComp.labelComp("option","cloneFcn"), dropTargetClass : labelComp.labelComp("option","dropTargetClass")});
		return clone;
	}}, getLabel : function() {
		var self = this;
		return self.label;
	}, getLabelPathNames : function() {
		var self = this;
		var ret = new Array();
		var _g = 0, _g1 = self.options.labelPath;
		while(_g < _g1.length) {
			var iid = _g1[_g];
			++_g;
			var label = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_LABELS,iid);
			ret.push(label.name);
		}
		return ret;
	}, _registerListeners : function() {
		var self1 = this;
		var selfElement = this.element;
		self1._onupdate = function(label,t) {
			if(t.isAddOrUpdate()) {
				if(label.deleted) {
					self1.destroy();
					selfElement.remove();
				} else {
					self1.label = label;
					selfElement.find(".labelBody").text(label.name);
					selfElement.find(".labelTail").css("border-right-color",label.data.color);
					selfElement.find(".labelBox").css("background",label.data.color);
				}
			} else if(t.isDelete()) {
				self1.destroy();
				selfElement.remove();
			}
		};
		self1.filteredSet = new m3.observable.FilteredSet(qoid.AppContext.MASTER_LABELS,function(label) {
			return label.iid == self1.options.labelIid;
		});
		self1.filteredSet.listen(self1._onupdate);
	}, _create : function() {
		var self2 = this;
		var selfElement1 = this.element;
		if(!selfElement1["is"]("div")) throw new m3.exception.Exception("Root of LabelComp must be a div element");
		self2.label = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_LABELS,self2.options.labelIid);
		if(self2.label == null) {
			self2.label = new qoid.model.Label("-->*<--");
			self2.label.iid = self2.options.labelIid;
			qoid.AppContext.MASTER_LABELS.add(self2.label);
		}
		selfElement1.addClass("label labelComp ").attr("id",StringTools.htmlEscape(self2.label.name) + "_" + m3.util.UidGenerator.create(8));
		var labelTail = new $("<div class='labelTail'></div>");
		labelTail.css("border-right-color",self2.label.data.color);
		selfElement1.append(labelTail);
		var labelBox = new $("<div class='labelBox shadowRight'></div>");
		labelBox.css("background",self2.label.data.color);
		var labelBody = new $("<div class='labelBody'></div>");
		var labelText = new $("<div>" + self2.label.name + "</div>");
		labelBody.append(labelText);
		labelBox.append(labelBody);
		selfElement1.append(labelBox).append("<div class='clear'></div>");
		selfElement1.addClass("filterable");
		self2._registerListeners();
		if(self2.options.dndEnabled) {
			selfElement1.data("clone",self2.options.cloneFcn);
			selfElement1.data("dropTargetClass",self2.options.dropTargetClass);
			selfElement1.data("getNode",function() {
				return new qoid.model.LabelNode(self2.label,self2.getLabelPathNames());
			});
			var helper = "clone";
			if(!self2.options.isDragByHelper) helper = "original"; else if(self2.options.helperFcn != null && Reflect.isFunction(self2.options.helperFcn)) helper = self2.options.helperFcn;
			selfElement1.on("dragstop",function(dragstopEvt,_ui) {
				qoid.AppContext.LOGGER.debug("dragstop on label | " + self2.label.name);
				if(self2.options.dragstop != null) self2.options.dragstop(dragstopEvt,_ui);
				new $(js.Browser.document).off("keydown keyup");
				_ui.helper.find("#copyIndicator").remove();
			});
			var showOrHideCopyIndicator = function(event,_ui) {
				var ci = _ui.helper.find("#copyIndicator");
				if(event.ctrlKey) {
					if(ci.length == 0) new $("<img src='svg/add.svg' id='copyIndicator'/>").appendTo(_ui.helper); else ci.show();
				} else ci.hide();
			};
			selfElement1.on("dragstart",function(event,_ui1) {
				new $(js.Browser.document).on("keydown keyup",function(event1) {
					showOrHideCopyIndicator(event1,_ui1);
				});
			});
			selfElement1.on("drag",function(event,_ui) {
				showOrHideCopyIndicator(event,_ui);
			});
			(js.Boot.__cast(selfElement1 , $)).draggable({ containment : self2.options.containment, helper : helper, distance : 10, scroll : false, revertDuration : 200, start : function(evt,_ui) {
				(js.Boot.__cast(selfElement1 , $)).draggable("option","revert",false);
			}});
			var copyOrMoveLabel = function(event,_ui) {
				var labelComp = js.Boot.__cast(_ui.draggable , $);
				var eld = new qoid.model.EditLabelData(qoid.widget.LabelCompHelper.getLabel(labelComp),qoid.widget.LabelCompHelper.parentIid(labelComp),self2.getLabel().iid);
				if(event.ctrlKey) qoid.model.EM.change(qoid.model.EMEvent.CopyLabel,eld); else qoid.model.EM.change(qoid.model.EMEvent.MoveLabel,eld);
			};
			(js.Boot.__cast(selfElement1 , $)).droppable({ accept : function(d) {
				return !$(this).parent()["is"](".filterCombination") && d["is"](".label") && ($(this).parent()["is"](".dropCombiner") || $(this).parent()["is"](".labelTreeBranch"));
			}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
				if($(this).parent()["is"](".labelTreeBranch")) copyOrMoveLabel(event,_ui); else {
					var filterCombiner = new $("<div></div>");
					filterCombiner.appendTo($(this).parent());
					filterCombiner.filterCombination({ event : event, type : "LABEL", dragstop : self2.options.dragstop});
					filterCombiner.filterCombination("addFilterable",$(this));
					var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"window");
					clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
					filterCombiner.filterCombination("addFilterable",clone);
					filterCombiner.filterCombination("position");
				}
			}, tolerance : "pointer"});
		}
	}, destroy : function() {
		var self = this;
		self.filteredSet.removeListener(self._onupdate);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AllowAccessDialog must be a div element");
		selfElement.addClass("allowAccessDialog").hide();
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement = this.element;
		selfElement.append("<div>Would you like to allow</div>");
		new $("<div></div>").connectionAvatar({ dndEnabled : false, connectionIid : self1.options.connection.iid}).appendTo(selfElement);
		selfElement.append("<div>" + self1.options.connection.data.name + "</div>");
		selfElement.append("<div>&nbsp;</div>");
		selfElement.append("<div>to access the label:</div>");
		selfElement.append("<div>&nbsp;</div>");
		new $("<div></div>").labelComp({ dndEnabled : false, labelIid : self1.options.label.iid}).appendTo(selfElement);
		var dlgOptions = { autoOpen : false, title : "Allow Access", height : 290, width : 400, modal : true, buttons : { Allow : function() {
			self1._allowAccess();
		}, Cancel : function() {
			$(this).dialog("close");
		}}};
		selfElement.dialog(dlgOptions);
	}, _allowAccess : function() {
		var self = this;
		var selfElement1 = this.element;
		qoid.model.EM.listenOnce(qoid.model.EMEvent.AccessGranted,function(n) {
			m3.jq.JQDialogHelper.close(selfElement1);
		});
		var parms = { connectionIid : self.options.connection.iid, labelIid : self.options.label.iid};
		qoid.model.EM.change(qoid.model.EMEvent.GrantAccess,parms);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(selfElement.exists()) {
			selfElement.empty();
			self._create();
		}
		self._buildDialog();
		selfElement.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.allowAccessDialog",defineWidget());
var defineWidget = function() {
	return { options : { message : null, orientation : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ChatMessageComp must be a div element");
		selfElement.addClass("chatMessageComp ui-helper-clearfix " + Std.string(self.options.orientation) + m3.widget.Widgets.getWidgetClasses());
		new $("<div>" + self.options.message.props.text + "</div>").appendTo(selfElement);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.chatMessageComp",defineWidget());
var defineWidget = function() {
	return { options : { connection : null, messages : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ChatComp must be a div element");
		selfElement.addClass("chatComp " + m3.widget.Widgets.getWidgetClasses());
		var chatMsgs = new $("<div class='chatMsgs'></div>").appendTo(selfElement);
		var chatInput = new $("<div class='chatInput'></div>").appendTo(selfElement);
		var input = new $("<input class='ui-corner-all ui-widget-content boxsizingBorder' />").appendTo(chatInput);
		self.chatMessages = new m3.observable.MappedSet(self.options.messages,function(msg) {
			return new $("<div></div>").chatMessageComp({ message : msg, orientation : qoid.widget.ChatOrientation.chatRight});
		});
		self.chatMessages.listen(function(chatMessageComp,evt) {
			if(evt.isAdd()) {
				chatMsgs.append(chatMessageComp);
				chatMsgs.scrollTop(chatMsgs.height());
			} else if(evt.isUpdate()) chatMessageComp.chatMessageComp("update"); else if(evt.isDelete()) chatMessageComp.remove();
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.chatComp",defineWidget());
var defineWidget = function() {
	return { options : { connection : null, classes : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionComp must be a div element");
		self.filteredSetConnection = new m3.observable.FilteredSet(qoid.AppContext.MASTER_CONNECTIONS,function(c) {
			return c.iid == self.options.connection.iid;
		});
		self._onUpdateConnection = function(c,evt) {
			if(evt.isDelete() || c.deleted) {
				self.destroy();
				selfElement.remove();
			}
		};
		self.filteredSetConnection.listen(self._onUpdateConnection);
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connection container boxsizingBorder");
		self._avatar = new $("<div class='avatar'></div>").connectionAvatar({ connectionIid : self.options.connection.iid, dndEnabled : true, isDragByHelper : true, containment : false});
		var notificationDiv = new $(".notifications",selfElement);
		if(!notificationDiv.exists()) notificationDiv = new $("<div class='notifications'>0</div>");
		notificationDiv.appendTo(selfElement);
		selfElement.append(self._avatar);
		selfElement.append("<div class='name'>" + self.options.connection.data.name + "</div>");
		selfElement.append("<div class='clear'></div>");
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var dropper = qoid.widget.ConnectionAvatarHelper.getConnection(js.Boot.__cast(_ui.draggable , $));
			var droppee = self.options.connection;
			if(!dropper.equals(droppee)) {
				var intro = null;
				var $it1 = qoid.AppContext.INTRODUCTIONS.iterator();
				while( $it1.hasNext() ) {
					var i = $it1.next();
					if(i.aConnectionIid == dropper.iid && i.bConnectionIid == droppee.iid || i.bConnectionIid == dropper.iid && i.aConnectionIid == droppee.iid) {
						intro = i;
						break;
					}
				}
				if(intro != null) {
					if(intro.bState == qoid.model.IntroductionState.NotResponded || intro.aState == qoid.model.IntroductionState.NotResponded) m3.util.JqueryUtil.alert("There is already a pending introduction between these two aliases"); else if(intro.bState == qoid.model.IntroductionState.Accepted && intro.aState == qoid.model.IntroductionState.Accepted) m3.util.JqueryUtil.alert("These two aliases are already connected");
				} else qoid.widget.DialogManager.requestIntroduction(dropper,droppee);
			}
		}, tolerance : "pointer"});
		var set = new m3.observable.FilteredSet(qoid.AppContext.NOTIFICATIONS,function(n) {
			return n.fromConnectionIid == self.options.connection.iid;
		});
		set.listen(function(i,evt) {
			if(evt.isAdd()) self.addNotification(); else if(evt.isDelete()) self.deleteNotification();
		});
	}, update : function(conn) {
		var self = this;
		var selfElement = this.element;
		self.options.connection = conn;
		selfElement.children(".name").text((function($this) {
			var $r;
			try {
				$r = self.options.connection.data.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)));
	}, addNotification : function() {
		var self = this;
		var selfElement = this.element;
		var notificationDiv = new $(".notifications",selfElement);
		var count = Std.parseInt(notificationDiv.html());
		count += 1;
		notificationDiv.html(Std.string(count));
		notificationDiv.css("visibility","visible");
	}, deleteNotification : function() {
		var self = this;
		var selfElement = this.element;
		var notificationDiv = new $(".notifications",selfElement);
		var count = Std.parseInt(notificationDiv.html());
		if(count <= 1) {
			notificationDiv.html("0");
			notificationDiv.css("visibility","hidden");
		} else {
			count -= 1;
			notificationDiv.html(Std.string(count));
		}
	}, destroy : function() {
		var self = this;
		$.Widget.prototype.destroy.call(this);
		if(self.filteredSetConnection != null) self.filteredSetConnection.removeListener(self._onUpdateConnection);
	}};
};
$.widget("ui.connectionComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionsList must be a div element");
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connectionsList");
		self.id = selfElement.attr("id");
		var spacer = new $("<div id=\"" + self.id + "-spacer\" class=\"sideRightSpacer spacer clear\"></div>").appendTo(selfElement);
		var menu = new $("<ul id='label-action-menu'></ul>");
		menu.appendTo(selfElement);
		menu.m3menu({ classes : "container shadow", menuOptions : [{ label : "Revoke Access...", icon : "ui-icon-circle-plus", action : function(evt,m) {
			qoid.widget.DialogManager.revokeAccess(qoid.widget.ConnectionCompHelper.connection(self.selectedConnectionComp));
		}},{ label : "Delete Connection", icon : "ui-icon-circle-minus", action : function(evt,m) {
			if(self.selectedConnectionComp != null) m3.util.JqueryUtil.confirm("Delete Connection","Are you sure you want to delete this connection?",function() {
				qoid.model.EM.change(qoid.model.EMEvent.DeleteConnection,qoid.widget.ConnectionCompHelper.connection(self.selectedConnectionComp));
			});
		}}], width : 225}).hide();
		selfElement.bind("contextmenu",function(evt) {
			menu.show();
			menu.position({ my : "left top", of : evt});
			var target = new $(evt.target);
			if(!target.hasClass("connection")) {
				var parents = target.parents(".connection");
				if(parents.length > 0) target = new $(parents[0]); else target = null;
			}
			if(target != null) self.selectedConnectionComp = new $(target); else self.selectedConnectionComp = null;
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
		self._mapListener = function(conn,connComp,evt) {
			if(evt.isAdd()) spacer.before(connComp); else if(evt.isUpdate()) {
				if(conn.deleted) connComp.remove(); else qoid.widget.ConnectionCompHelper.update(connComp,conn);
			} else if(evt.isDelete()) connComp.remove();
			qoid.model.EM.change(qoid.model.EMEvent.FitWindow);
		};
		var connections = null;
		if(selfElement.attr("id") == "connections-all") connections = qoid.AppContext.MASTER_CONNECTIONS; else {
			var aliasIid = selfElement.attr("id").split("-")[1];
			connections = qoid.AppContext.GROUPED_CONNECTIONS.delegate().get(aliasIid);
			if(connections == null) connections = qoid.AppContext.GROUPED_CONNECTIONS.addEmptyGroup(aliasIid);
		}
		self._setConnections(connections);
	}, _setConnections : function(connections) {
		var self = this;
		var selfElement = this.element;
		selfElement.children(".connection").remove();
		if(self.connectionsMap != null) self.connectionsMap.removeListeners(self._mapListener);
		self.connectionsMap = new m3.observable.MappedSet(connections,function(conn) {
			return new $("<div></div>").connectionComp({ connection : conn});
		});
		self.connectionsMap.mapListen(self._mapListener);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, filterConnections : function(term) {
		term = term.toLowerCase();
		var self = this;
		var iter = self.connectionsMap.iterator();
		while(iter.hasNext()) {
			var c = iter.next();
			if(term == "" || qoid.widget.ConnectionCompHelper.connection(c).data.name.toLowerCase().indexOf(term) != -1) c.show(); else c.hide();
		}
	}};
};
$.widget("ui.connectionsList",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionsTabs must be a div element");
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connectionTabs");
		new $("#connectionsTabs").tabs();
		self._listener = function(a,evt) {
			if(a.deleted) {
				new $("#tab-" + a.iid).remove();
				new $("#connections-" + a.iid).remove();
			} else if(evt.isAdd()) self._addTab(a.iid,a.profile.name); else if(evt.isDelete()) {
				new $("#tab-" + a.iid).remove();
				new $("#connections-" + a.iid).remove();
			}
		};
		self.aliases = new m3.observable.SortedSet(qoid.AppContext.ALIASES,function(a) {
			return a.profile.name.toLowerCase();
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.InitialDataLoadComplete,function(n) {
			self._addTab("all","All");
			new $("#tab-all").click();
			self.aliases.listen(self._listener);
		});
		qoid.model.EM.addListener(qoid.model.EMEvent.AliasLoaded,function(alias) {
			new $("#tab-" + alias.iid).click();
		});
	}, _addTab : function(iid,name) {
		var self = this;
		var tabs = new $("#connectionsTabs");
		var ul = new $("#connectionsTabsHeader");
		var tab = new $("<li><a id='tab-" + iid + "' href='#connections-" + iid + "'>" + name + "</a></li>").appendTo(ul);
		var connectionDiv = new $("<div id='connections-" + iid + "'></div>").appendTo(tabs);
		var cl = new $("#connections-" + iid).connectionsList();
		tabs.tabs("refresh");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.connectionsTabs",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		$.API_KEY = "2e63db21c89b06a54fd2eac5fd96e488";
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of UrlComp must be a div element");
		selfElement.addClass("urlComp container " + m3.widget.Widgets.getWidgetClasses());
		new $("<label class='fleft ui-helper-clearfix' style='margin-left: 5px;'>Enter URL</label>").appendTo(selfElement);
		self.urlInput = new $("<input id='' class='clear textInput boxsizingBorder' style='float: left;margin-top: 5px;'/>").appendTo(selfElement);
	}, _post : function() {
		var self = this;
		var selfElement = this.element;
		qoid.AppContext.LOGGER.debug("post " + self.urlInput.val());
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, valEle : function() {
		var self = this;
		return self.urlInput;
	}};
};
$.widget("ui.urlComp",defineWidget());
var defineWidget = function() {
	return { _getDragStop : function() {
		var self = this;
		return function(dragstopEvt,dragstopUi) {
			if(!self.tags.intersects(dragstopUi.helper)) {
				dragstopUi.helper.remove();
				m3.util.JqueryUtil.deleteEffects(dragstopEvt);
			}
		};
	}, _addToTagsContainer : function(_ui) {
		var self = this;
		var selfElement = this.element;
		var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,self._getDragStop());
		clone.addClass("small");
		var cloneOffset = clone.offset();
		self.tags.append(clone);
		clone.css({ position : "absolute"});
		if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : self.tags});
	}, _initLabels : function(of) {
		var self1 = this;
		var selfElement = this.element;
		var edit_post_comps_tags = new $("#edit_post_comps_tags",selfElement);
		if(qoid.AppContext.GROUPED_LABELEDCONTENT.delegate().get(self1.options.content.iid) == null) qoid.AppContext.GROUPED_LABELEDCONTENT.addEmptyGroup(self1.options.content.iid);
		self1.onchangeLabelChildren = function(jq,evt) {
			if(evt.isAdd()) edit_post_comps_tags.append(jq); else if(evt.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt.isDelete()) jq.remove();
		};
		self1.mappedLabels = new m3.observable.MappedSet(qoid.AppContext.GROUPED_LABELEDCONTENT.delegate().get(self1.options.content.iid),function(lc) {
			var connection = qoid.AppContext.connectionFromMetaLabel(lc.labelIid);
			if(connection != null) {
				var ca = new $("<div></div>").connectionAvatar({ connectionIid : connection.iid, dndEnabled : true, isDragByHelper : false, containment : false, dragstop : self1._getDragStop()}).appendTo(edit_post_comps_tags).css("position","absolute");
				ca.position({ my : "left", at : "right", of : of, collision : "flipfit", within : self1.tags});
				of = ca;
				return ca;
			} else {
				var lc1 = new $("<div></div>").labelComp({ labelIid : lc.labelIid, dndEnabled : true, isDragByHelper : false, containment : false, dragstop : self1._getDragStop()});
				lc1.css("position","absolute").addClass("small");
				lc1.position({ my : "top", at : "bottom", of : of, collision : "flipfit", within : self1.tags});
				of = lc1;
				return lc1;
			}
		});
		self1.mappedLabels.listen(self1.onchangeLabelChildren);
	}, _createButtonBlock : function(self2,selfElement1) {
		var close = function() {
			selfElement1.remove();
			self2.destroy();
			qoid.model.EM.change(qoid.model.EMEvent.FitWindow);
		};
		var buttonBlock = new $("<div></div>").css("text-align","right").appendTo(selfElement1);
		new $("<button title='Update Post'></button>").appendTo(buttonBlock).button({ text : false, icons : { primary : "ui-icon-disk"}}).css("width","23px").click(function(evt) {
			var ecd = self2._updateContent();
			qoid.model.EM.change(qoid.model.EMEvent.UpdateContent,ecd);
			close();
		});
		new $("<button title='Close'></button>").appendTo(buttonBlock).button({ text : false, icons : { primary : "ui-icon-closethick"}}).css("width","23px").click(function(evt) {
			qoid.model.EM.change(qoid.model.EMEvent.EditContentClosed,self2.options.content);
			close();
		});
	}, _updateContent : function() {
		var self = this;
		var selfElement = this.element;
		switch( (self.options.content.contentType)[1] ) {
		case 3:
			(js.Boot.__cast(self.options.content , qoid.model.MessageContent)).props.text = self.valueElement.val();
			break;
		case 2:
			(js.Boot.__cast(self.options.content , qoid.model.UrlContent)).props.url = self.valueElement.val();
			break;
		case 1:
			(js.Boot.__cast(self.options.content , qoid.model.ImageContent)).props.imgSrc = qoid.widget.UploadCompHelper.value(self.uploadComp);
			break;
		case 0:
			(js.Boot.__cast(self.options.content , qoid.model.AudioContent)).props.audioSrc = qoid.widget.UploadCompHelper.value(self.uploadComp);
			break;
		}
		var ecd1 = new qoid.model.EditContentData(self.options.content);
		self.tags.children(".label").each(function(i,dom) {
			var labelComp = new $(dom);
			ecd1.labelIids.push(qoid.widget.LabelCompHelper.getLabel(labelComp).iid);
		});
		self.tags.children(".connectionAvatar").each(function(i,dom) {
			var conn = new $(dom);
			ecd1.labelIids.push(qoid.widget.ConnectionAvatarHelper.getConnection(conn).metaLabelIid);
		});
		return ecd1;
	}, _create : function() {
		var self3 = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of EditPostComp must be a div element");
		selfElement.addClass("post container shadow " + m3.widget.Widgets.getWidgetClasses());
		self3._createButtonBlock(self3,selfElement);
		var section = new $("<section id='postSection'></section>").appendTo(selfElement);
		var tab_class = "";
		if(self3.options.content.contentType == qoid.model.ContentType.TEXT) {
			var textInput = new $("<div class='postContainer boxsizingBorder'></div>");
			textInput.appendTo(section);
			self3.valueElement = new $("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>").appendTo(textInput).attr("id","textInput_ta");
			self3.valueElement.val((js.Boot.__cast(self3.options.content , qoid.model.MessageContent)).props.text);
			tab_class = "ui-icon-document";
		} else if(self3.options.content.contentType == qoid.model.ContentType.URL) {
			var urlComp = new $("<div class='postContainer boxsizingBorder'></div>").urlComp();
			self3.valueElement = qoid.widget.UrlCompHelper.urlInput(urlComp);
			urlComp.appendTo(section);
			qoid.widget.UrlCompHelper.urlInput(urlComp).val((js.Boot.__cast(self3.options.content , qoid.model.UrlContent)).props.url);
			tab_class = "ui-icon-link";
		} else if(self3.options.content.contentType == qoid.model.ContentType.IMAGE) {
			var options = { contentType : qoid.model.ContentType.IMAGE};
			var imageInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
			self3.uploadComp = imageInput;
			imageInput.appendTo(section);
			qoid.widget.UploadCompHelper.setPreviewImage(imageInput,(js.Boot.__cast(self3.options.content , qoid.model.ImageContent)).props.imgSrc);
			tab_class = "ui-icon-image";
		} else if(self3.options.content.contentType == qoid.model.ContentType.AUDIO) {
			var options = { contentType : qoid.model.ContentType.AUDIO};
			var audioInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
			self3.uploadComp = audioInput;
			audioInput.appendTo(section);
			qoid.widget.UploadCompHelper.setPreviewImage(audioInput,(js.Boot.__cast(self3.options.content , qoid.model.AudioContent)).props.audioSrc);
			tab_class = "ui-icon-volume-on";
		}
		var tabs = new $("<aside class='tabs'></aside>").appendTo(section);
		var tab = new $("<span class='ui-icon " + tab_class + " ui-icon-document active ui-corner-left active'></span>").appendTo(tabs);
		var isDuplicate = function(selector,ele,container,getUid) {
			var is_duplicate = false;
			if(ele["is"](selector)) {
				var new_uid = getUid(ele);
				container.children(selector).each(function(i,dom) {
					var uid = getUid(new $(dom));
					if(new_uid == uid) is_duplicate = true;
				});
			}
			return is_duplicate;
		};
		var tags = new $("<aside id='edit_post_comps_tags' class='tags container boxsizingBorder'></aside>");
		tags.appendTo(section);
		tags.droppable({ accept : function(d) {
			return d["is"](".filterable") && !d["is"](".aliasAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			if(isDuplicate(".connectionAvatar",_ui.draggable,tags,function(ele) {
				return qoid.widget.ConnectionAvatarHelper.getConnection(new $(ele)).iid;
			}) || isDuplicate(".labelComp",_ui.draggable,tags,function(ele) {
				return qoid.widget.LabelCompHelper.getLabel(new $(ele)).iid;
			})) {
				if(_ui.draggable.parent().attr("id") != "edit_post_comps_tags") _ui.draggable.draggable("option","revert",true);
				return;
			}
			self3._addToTagsContainer(_ui);
		}});
		self3.tags = tags;
		self3._initLabels(null);
	}, destroy : function() {
		var self = this;
		self.mappedLabels.removeListener(self.onchangeLabelChildren);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.editPostComp",defineWidget());
var defineWidget = function() {
	return { _createWidgets : function(selfElement,self) {
		selfElement.empty();
		var content = self.options.content;
		var postWr = new $("<section class='postWr'></section>");
		selfElement.append(postWr);
		var postContentWr = new $("<div class='postContentWr'></div>");
		postWr.append(postContentWr);
		var postContent = new $("<div class='postContent'></div>");
		postContentWr.append(postContent);
		postContent.append("<div class='content-timestamp'>" + Std.string(content.get_created()) + "</div>");
		switch( (content.contentType)[1] ) {
		case 0:
			var audio = js.Boot.__cast(content , qoid.model.AudioContent);
			postContent.append(audio.props.title + "<br/>");
			var audioControls = new $("<audio controls></audio>");
			postContent.append(audioControls);
			audioControls.append("<source src='" + audio.props.audioSrc + "' type='" + audio.props.audioType + "'>Your browser does not support the audio element.");
			break;
		case 1:
			var img = js.Boot.__cast(content , qoid.model.ImageContent);
			postContent.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");
			break;
		case 2:
			var urlContent = js.Boot.__cast(content , qoid.model.UrlContent);
			postContent.append("<img src='http://picoshot.com/t.php?picurl=" + urlContent.props.url + "'>");
			break;
		case 3:
			var textContent = js.Boot.__cast(content , qoid.model.MessageContent);
			postContent.append("<div class='content-text'><pre class='text-content'>" + textContent.props.text + "</pre></div>");
			break;
		}
		self.buttonBlock = new $("<div class='button-block' ></div>").css("text-align","left").hide().appendTo(postContent);
		var mb = new $("<button title='Options'></button>").appendTo(self.buttonBlock).button({ text : false, icons : { primary : "ui-icon-circle-triangle-s"}}).css("width","23px");
		mb.click(function(evt) {
			var menu = self._createContentMenu();
			menu.show();
			menu.position({ my : "left top", at : "right-6px center", of : mb});
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
		var postCreator = new $("<aside class='postCreator'></aside>").appendTo(postWr);
		var aliasIid = null;
		var connectionIid = null;
		if(qoid.AppContext.ALIASES.delegate().get(self.options.content.aliasIid) != null) aliasIid = self.options.content.aliasIid; else if(qoid.AppContext.MASTER_CONNECTIONS.delegate().get(self.options.content.connectionIid) != null) connectionIid = self.options.content.connectionIid;
		new $("<div></div>").connectionAvatar({ dndEnabled : false, aliasIid : aliasIid, connectionIid : connectionIid}).appendTo(postCreator);
		var postLabels = new $("<aside class='postLabels'></div>").appendTo(postWr);
		var postConnections = new $("<aside class='postConnections'></aside>").appendTo(postWr);
		if(qoid.AppContext.GROUPED_LABELEDCONTENT.delegate().get(self.options.content.iid) == null) qoid.AppContext.GROUPED_LABELEDCONTENT.addEmptyGroup(self.options.content.iid);
		self.onchangeLabelChildren = function(ele,evt) {
			if(evt.isAdd()) {
				if(ele["is"](".connectionAvatar")) postConnections.append(ele); else postLabels.append(ele);
			} else if(evt.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt.isDelete()) ele.remove();
		};
		self.mappedLabels = new m3.observable.MappedSet(qoid.AppContext.GROUPED_LABELEDCONTENT.delegate().get(self.options.content.iid),function(lc) {
			var connection = qoid.AppContext.connectionFromMetaLabel(lc.labelIid);
			if(connection != null) return new $("<div></div>").connectionAvatar({ dndEnabled : false, connectionIid : connection.iid}); else return new $("<div class='small'></div>").labelComp({ dndEnabled : false, labelIid : lc.labelIid});
		});
		self.mappedLabels.listen(self.onchangeLabelChildren);
	}, _create : function() {
		var self1 = this;
		var selfElement1 = this.element;
		if(!selfElement1["is"]("div")) throw new m3.exception.Exception("Root of ContentComp must be a div element");
		selfElement1.addClass("contentComp post container shadow " + m3.widget.Widgets.getWidgetClasses());
		selfElement1.click(function(evt) {
			if(!selfElement1.hasClass("postActive")) {
				new $(".postActive .button-block").toggle();
				new $(".postActive").toggleClass("postActive");
			}
			self1.toggleActive();
		});
		self1._createWidgets(selfElement1,self1);
		qoid.model.EM.addListener(qoid.model.EMEvent.EditContentClosed,function(content) {
			if(content.iid == self1.options.content.iid) selfElement1.show();
		});
	}, _createContentMenu : function() {
		var self2 = this;
		var selfElement2 = this.element;
		if(self2.menu == null) {
			var menu = new $("<ul id='contentCompMenu-" + self2.options.content.iid + "'></ul>");
			menu.appendTo(selfElement2);
			var menuOptions = [];
			var menuOption;
			menuOption = { label : "Edit...", icon : "ui-icon-pencil", action : function(evt,m) {
				evt.stopPropagation();
				var comp = new $("<div id='edit-post-comp'></div>");
				comp.insertBefore(selfElement2);
				comp.width(selfElement2.width());
				comp.height(selfElement2.height());
				selfElement2.hide();
				var editPostComp = new $(comp).editPostComp({ content : self2.options.content});
			}};
			menuOptions.push(menuOption);
			menuOption = { label : "Delete...", icon : "ui-icon-circle-close", action : function(evt,m) {
				evt.stopPropagation();
				m3.util.JqueryUtil.confirm("Delete Post","Are you sure you want to delete this content?",function() {
					var ecd = new qoid.model.EditContentData(self2.options.content);
					qoid.model.EM.change(qoid.model.EMEvent.DeleteContent,ecd);
				});
			}};
			menuOptions.push(menuOption);
			menuOption = { label : "Request Verification...", icon : "ui-icon-circle-triangle-n", action : function(evt,m) {
				evt.preventDefault();
				evt.stopPropagation();
				qoid.widget.DialogManager.requestVerification(self2.options.content);
			}};
			menuOptions.push(menuOption);
			menu.m3menu({ menuOptions : menuOptions}).hide();
			self2.menu = menu;
		}
		return self2.menu;
	}, update : function(content) {
		var self = this;
		var selfElement = this.element;
		var showButtonBlock = self.buttonBlock.isVisible();
		self.options.content = content;
		self._createWidgets(selfElement,self);
		if(showButtonBlock) self.buttonBlock.show();
		selfElement.show();
	}, toggleActive : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.toggleClass("postActive");
		self.buttonBlock.toggle();
	}, destroy : function() {
		var self = this;
		self.mappedLabels.removeListener(self.onchangeLabelChildren);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.contentComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ContentFeed must be a div element");
		selfElement.addClass("container " + m3.widget.Widgets.getWidgetClasses()).css("padding","10px");
		selfElement.append("<div id='middleContainerSpacer' class='spacer'></div>");
		var mapListener = function(content,contentComp,evt) {
			if(evt.isAdd()) {
				var contentComps = new $(".contentComp");
				if(contentComps.length == 0) new $("#postInput").after(contentComp); else {
					var comps = new $(".contentComp");
					var inserted = false;
					comps.each(function(i,dom) {
						var cc = new $(dom);
						var cmp = m3.helper.StringHelper.compare(qoid.widget.ContentCompHelper.content(contentComp).getTimestamp(),qoid.widget.ContentCompHelper.content(cc).getTimestamp());
						if(cmp > 0) {
							cc.before(contentComp);
							inserted = true;
							return false;
						} else return true;
					});
					if(!inserted) comps.last().after(contentComp);
				}
				qoid.model.EM.change(qoid.model.EMEvent.FitWindow);
			} else if(evt.isUpdate()) qoid.widget.ContentCompHelper.update(contentComp,content); else if(evt.isDelete()) contentComp.remove();
		};
		var beforeSetContent = function() {
			selfElement.find(".contentComp").remove();
		};
		var widgetCreator = function(content) {
			return new $("<div></div>").contentComp({ content : content});
		};
		qoid.model.ContentSource.addListener(mapListener,beforeSetContent,widgetCreator);
	}, destroy : function() {
		var self = this;
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.contentFeed",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of CreateAgentDialog must be a div element");
		self._cancelled = false;
		selfElement.addClass("createAgentDialog").hide();
		var labels = new $("<div class='fleft'></div>").appendTo(selfElement);
		var inputs = new $("<div class='fleft'></div>").appendTo(selfElement);
		labels.append("<div class='labelDiv'><label id='n_label' for='newu_n'>Name</label></div>");
		labels.append("<div class='labelDiv'><label id='em_label' for='newu_em'>Email</label></div>");
		labels.append("<div class='labelDiv'><label id='pw_label' for='newu_pw'>Password</label></div>");
		self.input_n = new $("<input id='newu_n' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		self.placeholder_n = new $("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Name'>").appendTo(inputs);
		inputs.append("<br/>");
		self.input_em = new $("<input id='newu_em' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		self.placeholder_em = new $("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Email'>").appendTo(inputs);
		inputs.append("<br/>");
		self.input_pw = new $("<input type='password' id='newu_pw' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		self.placeholder_pw = new $("<input id='login_pw_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);
		inputs.append("<br/>");
		inputs.children("input").keypress(function(evt) {
			if(evt.keyCode == 13) self._createNewUser();
		});
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_n,self.placeholder_n);
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_pw,self.placeholder_pw);
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_em,self.placeholder_em);
	}, initialized : false, _createNewUser : function() {
		var self = this;
		var selfElement1 = this.element;
		var valid = true;
		var newUser = new qoid.model.NewUser();
		newUser.name = self.input_n.val();
		if(m3.helper.StringHelper.isBlank(newUser.name)) {
			self.placeholder_n.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement1.find(".ui-state-error").removeClass("ui-state-error");
		qoid.model.EM.change(qoid.model.EMEvent.CreateAgent,newUser);
		qoid.model.EM.listenOnce(qoid.model.EMEvent.AgentCreated,function(n) {
			selfElement1.dialog("close");
		},"CreateAgentDialog-UserSignup");
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement2 = this.element;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Create New Agent", height : 320, width : 400, modal : true, buttons : { 'Create My Agent' : function() {
			self1._registered = true;
			self1._createNewUser();
		}, Cancel : function() {
			self1._cancelled = true;
			$(this).dialog("close");
		}}, close : function(evt,ui) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
			qoid.widget.DialogManager.showLogin();
		}};
		selfElement2.dialog(dlgOptions);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		self._cancelled = false;
		if(!self.initialized) self._buildDialog();
		selfElement.children("#n_label").focus();
		self.input_n.blur();
		selfElement.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.createAgentDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LiveBuildToggle must be a div element");
		selfElement.addClass("liveBuildToggle");
		var build = new $("<div class='ui-widget-content ui-state-active ui-corner-left build'>Build</div>");
		var live = new $("<div class='ui-widget-content ui-corner-right live'>Live</div>");
		selfElement.append(build).append(live);
		var children = selfElement.children();
		children.hover(function(evt) {
			$(this).addClass("ui-state-hover");
		},function(evt) {
			$(this).removeClass("ui-state-hover");
		}).click(function(evt) {
			children.toggleClass("ui-state-active");
			self._fireFilter();
		});
	}, isLive : function() {
		var selfElement = this.element;
		return selfElement.children(".live").hasClass("ui-state-active");
	}, _fireFilter : function() {
		var selfElement = this.element;
		var filter = js.Boot.__cast(selfElement.closest("#filter") , $);
		qoid.widget.FilterCompHelper.fireFilter(filter);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.liveBuildToggle",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of IntroductionNotificationComp must be a div element");
		selfElement.addClass("introductionNotificationComp container boxsizingBorder");
		var conn = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_CONNECTIONS,self.options.notification.fromConnectionIid);
		self.listenerUid = qoid.model.EM.addListener(qoid.model.EMEvent.RespondToIntroduction_RESPONSE,function(e) {
			m3.util.JqueryUtil.alert("Your response has been received.","Introduction",function() {
				self.destroy();
				selfElement.remove();
			});
		});
		var intro_table = new $("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);
		var avatar = new $("<div class='avatar introduction-avatar'></div>").connectionAvatar({ connectionIid : conn.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(intro_table.find("td:nth-child(1)"));
		var invitationConfirmation = function(accepted) {
			var confirmation = new qoid.api.IntroResponseMessage(self.options.notification.iid,accepted);
			qoid.model.EM.change(qoid.model.EMEvent.RespondToIntroduction,confirmation);
		};
		var invitationText = new $("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		var title = new $("<div class='intro-title'>Introduction Request</div>").appendTo(invitationText);
		var from = new $("<div class='content-timestamp'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		var date = new $("<div class='content-timestamp'><b>Date:</b> " + Std.string(new Date()) + "</div>").appendTo(invitationText);
		var message = new $("<div class='invitation-message'>" + self.options.notification.props.message + "</div>").appendTo(invitationText);
		var accept = new $("<button>Accept</button>").appendTo(invitationText).button().click(function(evt) {
			invitationConfirmation(true);
		});
		var reject = new $("<button>Reject</button>").appendTo(invitationText).button().click(function(evt) {
			invitationConfirmation(false);
		});
		intro_table.find("td:nth-child(3)").append("<div>" + self.options.notification.props.profile.name + "</div><div><img class='intro-profile-img container' src='" + self.options.notification.props.profile.imgSrc + "'/></div>");
	}, destroy : function() {
		var self = this;
		qoid.model.EM.removeListener(qoid.model.EMEvent.RespondToIntroduction_RESPONSE,self.listenerUid);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.introductionNotificationComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of VerificationRequestNotificationComp must be a div element");
		selfElement.addClass("verificationRequestNotificationComp container boxsizingBorder");
		var conn = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_CONNECTIONS,self.options.notification.fromConnectionIid);
		var intro_table = new $("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);
		var avatar = new $("<div class='avatar introduction-avatar'></div>").connectionAvatar({ connectionIid : conn.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(intro_table.find("td:nth-child(1)"));
		var invitationText = new $("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		var title = new $("<div class='intro-title'>Verification Request</div>").appendTo(invitationText);
		var from = new $("<div class='content-timestamp'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		var date = new $("<div class='content-timestamp'><b>Date:</b> " + Std.string(new Date()) + "</div>").appendTo(invitationText);
		var message = new $("<div class='invitation-message'>" + self.options.notification.props.message + "</div>").appendTo(invitationText);
		var accept = new $("<button>Accept</button>").appendTo(invitationText).button().click(function(evt) {
			self.acceptVerification();
		});
		var reject = new $("<button>Reject</button>").appendTo(invitationText).button().click(function(evt) {
			self.rejectVerification();
		});
	}, acceptVerification : function() {
		var self1 = this;
		var selfElement1 = this.element;
		var msg = new qoid.model.VerificationResponse(self1.options.notification.iid,"The claim is true");
		qoid.model.EM.listenOnce(qoid.model.EMEvent.RespondToVerification_RESPONSE,function(e) {
			m3.util.JqueryUtil.alert("Your response has been received.","Verification",function() {
				self1.destroy();
				selfElement1.remove();
			});
		});
		qoid.model.EM.change(qoid.model.EMEvent.RespondToVerification,msg);
	}, rejectVerification : function() {
		var self = this;
		var selfElement = this.element;
		self.destroy();
		selfElement.remove();
	}, destroy : function() {
		var self = this;
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.verificationRequestNotificationComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of VerificationResponseNotificationComp must be a div element");
		selfElement.addClass("verificationResponseNotificationComp container boxsizingBorder");
		var conn = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_CONNECTIONS,self.options.notification.fromConnectionIid);
		var intro_table = new $("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);
		var avatar = new $("<div class='avatar introduction-avatar'></div>").connectionAvatar({ connectionIid : conn.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(intro_table.find("td:nth-child(1)"));
		var invitationText = new $("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		var title = new $("<div class='intro-title'>Verification Response</div>").appendTo(invitationText);
		var from = new $("<div class='content-timestamp'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		var date = new $("<div class='content-timestamp'><b>Date:</b> " + Std.string(new Date()) + "</div>").appendTo(invitationText);
		var message = new $("<div class='invitation-message'>" + Std.string(self.options.notification.props.verificationContentData) + "</div>").appendTo(invitationText);
		var accept = new $("<button>Accept</button>").appendTo(invitationText).button().click(function(evt) {
			self.acceptVerification();
		});
		var reject = new $("<button>Reject</button>").appendTo(invitationText).button().click(function(evt) {
			self.rejectVerification();
		});
	}, acceptVerification : function() {
		var self1 = this;
		var selfElement1 = this.element;
		var msg = new qoid.model.VerificationResponse(self1.options.notification.iid,"The claim is true");
		qoid.model.EM.listenOnce(qoid.model.EMEvent.AcceptVerification_RESPONSE,function(e) {
			m3.util.JqueryUtil.alert("Your response has been received.","Verification Accepted",function() {
				self1.destroy();
				selfElement1.remove();
			});
		});
		qoid.model.EM.change(qoid.model.EMEvent.AcceptVerification,self1.options.notification.iid);
	}, rejectVerification : function() {
		var self = this;
		var selfElement = this.element;
		self.destroy();
		selfElement.remove();
	}, destroy : function() {
		var self = this;
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.verificationResponseNotificationComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of FilterComp must be a div element");
		selfElement.addClass("connectionDT labelDT dropCombiner " + m3.widget.Widgets.getWidgetClasses());
		var toggle = new $("<div class='rootToggle andOrToggle'></div>").andOrToggle();
		selfElement.append(toggle);
		var liveToggle = new $("<div class='liveBuildToggle'></div>").liveBuildToggle();
		selfElement.append(liveToggle);
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return d["is"](".filterable");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			var dragstop = function(dragstopEvt,dragstopUi) {
				if(!selfElement.intersects(dragstopUi.helper)) {
					dragstopUi.helper.remove();
					m3.util.JqueryUtil.deleteEffects(dragstopEvt);
					self.fireFilter();
				}
			};
			if($(this).children(".connectionAvatar").length == 0) {
				if(_ui.draggable.hasClass("connectionAvatar")) {
					var connection = qoid.widget.ConnectionAvatarHelper.getConnection(js.Boot.__cast(_ui.draggable , $));
					var set = new m3.observable.FilteredSet(qoid.AppContext.NOTIFICATIONS,function(n) {
						return n.fromConnectionIid == connection.iid;
					});
					if(m3.helper.OSetHelper.hasValues(set)) {
						var iter = set.iterator();
						var notification = iter.next();
						var comp;
						switch( (notification.kind)[1] ) {
						case 0:
							comp = new $("<div></div>").introductionNotificationComp({ notification : js.Boot.__cast(notification , qoid.model.IntroductionRequestNotification)});
							break;
						case 1:
							comp = new $("<div></div>").verificationRequestNotificationComp({ notification : js.Boot.__cast(notification , qoid.model.VerificationRequestNotification)});
							break;
						case 2:
							comp = new $("<div></div>").verificationResponseNotificationComp({ notification : js.Boot.__cast(notification , qoid.model.VerificationResponseNotification)});
							break;
						}
						comp.insertAfter(new $("#filter"));
						return;
					}
				}
			}
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,dragstop);
			clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
			var cloneOffset = clone.offset();
			$(this).append(clone);
			clone.css({ position : "absolute"});
			if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : "#filter"});
			self.fireFilter();
		}});
		qoid.model.EM.addListener(qoid.model.EMEvent.AliasLoaded,function(alias) {
			self.clearFilter();
		},"FilterComp-AliasLoaded");
	}, clearFilter : function() {
		var selfElement = this.element;
		var filterables = selfElement.children(".filterable");
		filterables.each(function(idx,ele) {
			var jq = new $(ele);
			jq.remove();
		});
	}, fireFilter : function() {
		var self = this;
		var selfElement = this.element;
		var liveToggle = js.Boot.__cast(selfElement.children(".liveBuildToggle") , $);
		var root = (selfElement.children(".rootToggle").data("getNode"))();
		root.type = "ROOT";
		var filterables = selfElement.children(".filterable");
		if(filterables.length == 0) qoid.model.EM.change(qoid.model.EMEvent.AliasLoaded,qoid.AppContext.currentAlias); else {
			filterables.each(function(idx,el) {
				var jqEle = new $(el);
				if(!jqEle["is"](".connectionAvatar")) {
					var filterable = new $(el);
					var node = (filterable.data("getNode"))();
					root.addNode(node);
				}
			});
			var connectionIids = new Array();
			var aliasIid = null;
			var connComps = selfElement.children(".connectionAvatar");
			connComps.each(function(idx,el) {
				var avatar = new $(el);
				var conn = qoid.widget.ConnectionAvatarHelper.getConnection(avatar);
				if(conn != null) connectionIids.push(conn.iid); else {
					var alias = qoid.widget.ConnectionAvatarHelper.getAlias(avatar);
					aliasIid = alias.iid;
				}
			});
			var filterData = new qoid.model.FilterData("content");
			filterData.filter = new qoid.model.Filter(root);
			filterData.connectionIids = connectionIids;
			filterData.aliasIid = aliasIid;
			if(!qoid.widget.LiveBuildToggleHelper.isLive(liveToggle)) qoid.model.EM.change(qoid.model.EMEvent.FILTER_CHANGE,filterData); else qoid.model.EM.change(qoid.model.EMEvent.FILTER_RUN,filterData);
		}
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.filterComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of InviteComp must be a div element");
		selfElement.addClass("inviteComp ui-helper-clearfix " + m3.widget.Widgets.getWidgetClasses());
		var input = new $("<input id=\"sideRightInviteInput\" style=\"display: none;\" class=\"ui-widget-content boxsizingBorder textInput\"/>");
		var input_placeHolder = new $("<input id=\"sideRightInviteInput_PH\" class=\"placeholder ui-widget-content boxsizingBorder textInput\" value=\"Enter Email Address\"/>");
		var btn = new $("<button class='fright'>Invite</button>").button();
		selfElement.append(input).append(input_placeHolder).append(btn);
		input_placeHolder.focus(function(evt) {
			input_placeHolder.hide();
			input.show().focus();
		});
		input.blur(function(evt) {
			if(m3.helper.StringHelper.isBlank(input.val())) {
				input_placeHolder.show();
				input.hide();
			}
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.inviteComp",defineWidget());
var defineWidget = function() {
	return { options : { createFcn : null, modal : false, positionalElement : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of Popup must be a div element");
		selfElement.addClass("ocontainer shadow popup");
		if(!self.options.modal) new $("body").one("click",function(evt) {
			selfElement.remove();
			self.destroy();
		});
		self.options.createFcn(selfElement);
		selfElement.position({ my : "left", at : "right", of : self.options.positionalElement});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.popup",defineWidget());
var defineWidget = function() {
	return { getSelected : function() {
		var self = this;
		return self.selectedLabelComp;
	}, _showNewLabelPopup : function(reference,isUpdate) {
		var self1 = this;
		var selfElement = this.element;
		var popup = new $("<div style='position: absolute;width:300px;'></div>");
		popup.appendTo(selfElement);
		popup = popup.popup({ createFcn : function(el) {
			var createLabel = null;
			var updateLabel = null;
			var stopFcn = function(evt) {
				evt.stopPropagation();
			};
			var enterFcn = function(evt) {
				if(evt.keyCode == 13) {
					if(isUpdate) updateLabel(); else createLabel();
				}
			};
			var container = new $("<div class='icontainer'></div>").appendTo(el);
			container.click(stopFcn).keypress(enterFcn);
			var parent = null;
			if(!isUpdate) {
				container.append("<label for='labelParent'>Parent: </label> ");
				parent = new $("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'><option value='" + qoid.AppContext.currentAlias.rootLabelIid + "'>No Parent</option></select>").appendTo(container);
				parent.click(stopFcn);
				var aliasLabels = qoid.AppContext.getLabelDescendents(qoid.AppContext.currentAlias.rootLabelIid);
				var iter = aliasLabels.iterator();
				while(iter.hasNext()) {
					var label = iter.next();
					if(label.iid != qoid.AppContext.currentAlias.rootLabelIid) {
						var option = "<option value='" + label.iid + "'";
						if(self1.selectedLabelComp != null && qoid.widget.LabelCompHelper.getLabel(self1.selectedLabelComp).iid == label.iid) option += " SELECTED";
						option += ">" + label.name + "</option>";
						parent.append(option);
					}
				}
			}
			container.append("<br/><label for='labelName'>Name: </label> ");
			var input = new $("<input id='labelName' class='ui-corner-all ui-widget-content' value='New Label'/>").appendTo(container);
			input.keypress(enterFcn).click(function(evt) {
				evt.stopPropagation();
				if($(this).val() == "New Label") $(this).val("");
			}).focus();
			var buttonText = "Add Label";
			if(isUpdate) {
				buttonText = "Update Label";
				input.val(qoid.widget.LabelCompHelper.getLabel(self1.selectedLabelComp).name);
			}
			container.append("<br/>");
			new $("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>").button().appendTo(container).click(function(evt) {
				if(isUpdate) updateLabel(); else createLabel();
			});
			createLabel = function() {
				if(input.val().length == 0) return;
				qoid.AppContext.LOGGER.info("Create new label | " + input.val());
				var label = new qoid.model.Label();
				label.name = input.val();
				var eventData = new qoid.model.EditLabelData(label,parent.val());
				qoid.model.EM.change(qoid.model.EMEvent.CreateLabel,eventData);
				new $("body").click();
			};
			updateLabel = function() {
				if(input.val().length == 0) return;
				var label = qoid.widget.LabelCompHelper.getLabel(self1.selectedLabelComp);
				qoid.AppContext.LOGGER.info("Update label | " + label.iid);
				label.name = input.val();
				var eventData = new qoid.model.EditLabelData(label);
				qoid.model.EM.change(qoid.model.EMEvent.UpdateLabel,eventData);
				new $("body").click();
			};
		}, positionalElement : reference});
	}, _create : function() {
		var self2 = this;
		var selfElement1 = this.element;
		if(!selfElement1["is"]("div")) throw new m3.exception.Exception("Root of LabelsList must be a div element");
		selfElement1.addClass("icontainer labelsList " + m3.widget.Widgets.getWidgetClasses());
		self2.selectedLabelComp = null;
		qoid.model.EM.addListener(qoid.model.EMEvent.AliasLoaded,function(alias) {
			self2.selectedLabelComp = null;
			selfElement1.children(".labelTree").remove();
			var labelTree = new $("<div id='labels' class='labelDT'></div>").labelTree({ parentIid : alias.rootLabelIid, labelPath : [alias.rootLabelIid]});
			selfElement1.prepend(labelTree);
		},"LabelsList-Alias");
		var newLabelButton = new $("<button class='newLabelButton'>New Label</button>");
		selfElement1.append(newLabelButton).append("<div class='clear'></div>");
		newLabelButton.button().click(function(evt) {
			evt.stopPropagation();
			self2.selectedLabelComp = null;
			self2._showNewLabelPopup(newLabelButton,false);
		});
		var menu = new $("<ul id='label-action-menu'></ul>");
		menu.appendTo(selfElement1);
		menu.m3menu({ classes : "container shadow", menuOptions : [{ label : "New Child Label", icon : "ui-icon-circle-plus", action : function(evt,m) {
			evt.stopPropagation();
			var reference = self2.selectedLabelComp;
			if(reference == null) reference = new $(evt.target);
			self2._showNewLabelPopup(reference,false);
			menu.hide();
			return false;
		}},{ label : "Edit Label", icon : "ui-icon-pencil", action : function(evt,m) {
			evt.stopPropagation();
			var reference = self2.selectedLabelComp;
			if(reference == null) reference = new $(evt.target);
			self2._showNewLabelPopup(reference,true);
			menu.hide();
			return false;
		}},{ label : "Delete Label", icon : "ui-icon-circle-minus", action : function(evt,m) {
			if(self2.selectedLabelComp != null) m3.util.JqueryUtil.confirm("Delete Label","Are you sure you want to delete this label?",function() {
				qoid.model.EM.change(qoid.model.EMEvent.DeleteLabel,new qoid.model.EditLabelData(qoid.widget.LabelCompHelper.getLabel(self2.selectedLabelComp),qoid.widget.LabelCompHelper.parentIid(self2.selectedLabelComp)));
			});
		}}], width : 225}).hide();
		selfElement1.bind("contextmenu",function(evt) {
			menu.show();
			menu.position({ my : "left top", of : evt});
			var target = new $(evt.target);
			if(!target.hasClass("labelComp")) {
				var parents = target.parents(".labelComp");
				if(parents.length > 0) target = new $(parents[0]); else target = null;
			}
			if(target != null) self2.selectedLabelComp = new $(target); else self2.selectedLabelComp = null;
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelsList",defineWidget());
var defineWidget = function() {
	return { options : { parentIid : null, labelIid : null, labelPath : []}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelTreeBranch must be a div element");
		selfElement.addClass("labelTreeBranch ");
		var expander = new $("<div class='labelTreeExpander' style='visibility:hidden;'><b>+</b></div>");
		selfElement.append(expander);
		var label = new $("<div></div>").labelComp({ parentIid : self.options.parentIid, labelIid : self.options.labelIid, labelPath : self.options.labelPath, isDragByHelper : true, containment : false, dragstop : null});
		selfElement.append(label);
		selfElement.hover(function() {
			if(m3.helper.OSetHelper.hasValues(self.children)) expander.css("visibility","visible");
		},function() {
			expander.css("visibility","hidden");
		});
		if(qoid.AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.labelIid) == null) qoid.AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(self.options.labelIid);
		self.children = qoid.AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.labelIid);
		var labelChildren = new $("<div class='labelChildren' style='display: none;'></div>");
		labelChildren.labelTree({ parentIid : self.options.labelIid, labelPath : self.options.labelPath});
		self.children.listen(function(lc,evt) {
			if(evt.isAdd()) {
				var ll = new $("#labelsList");
				var sel = ll.labelsList("getSelected");
				if(sel != null && sel.labelComp("getLabel").iid == lc.parentIid) {
					if(m3.helper.OSetHelper.hasValues(self.children)) {
						labelChildren.show();
						labelChildren.addClass("labelTreeFullWidth");
					}
				}
			}
		});
		selfElement.append(labelChildren);
		label.add(expander).click(function(evt) {
			if(m3.helper.OSetHelper.hasValues(self.children)) {
				labelChildren.toggle();
				labelChildren.toggleClass("labelTreeFullWidth");
			} else labelChildren.hide();
			if(labelChildren.css("display") == "none") expander.html("<b>+</b>"); else expander.html("<b>-</b>");
			qoid.model.EM.change(qoid.model.EMEvent.FitWindow);
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelTreeBranch",defineWidget());
var defineWidget = function() {
	return { options : { parentIid : null, itemsClass : null, labelPath : []}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelTree must be a div element");
		selfElement.addClass("labelTree boxsizingBorder " + m3.widget.Widgets.getWidgetClasses());
		if(qoid.AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.parentIid) == null) qoid.AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(self.options.parentIid);
		self.onchangeLabelChildren = function(labelTreeBranch,evt) {
			if(evt.isAdd()) selfElement.append(labelTreeBranch); else if(evt.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt.isDelete()) labelTreeBranch.remove();
		};
		self.mappedLabels = new m3.observable.MappedSet(qoid.AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.parentIid),function(labelChild) {
			var labelPath = self.options.labelPath.slice();
			labelPath.push(labelChild.childIid);
			return new $("<div></div>").labelTreeBranch({ parentIid : self.options.parentIid, labelIid : labelChild.childIid, labelPath : labelPath});
		});
		self.mappedLabels.visualId = self.options.parentIid + "_map";
		self.mappedLabels.listen(self.onchangeLabelChildren);
	}, destroy : function() {
		var self = this;
		self.mappedLabels.removeListener(self.onchangeLabelChildren);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelTree",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LoginDialog must be a div element");
		selfElement.addClass("loginDialog").hide();
		var labels = new $("<div class='fleft'></div>").appendTo(selfElement);
		var inputs = new $("<div class='fleft'></div>").appendTo(selfElement);
		labels.append("<div class='labelDiv'><label id='un_label' for='login_un'>Agent Id</label></div>");
		labels.append("<div class='labelDiv'><label for='login_pw'>Password</label></div>");
		self.input_un = new $("<input id='login_un' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		self.placeholder_un = new $("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Email'>").appendTo(inputs);
		inputs.append("<br/>");
		self.input_pw = new $("<input type='password' id='login_pw' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		self.placeholder_pw = new $("<input id='login_pw_f' style='display: none;' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);
		self.input_un.val("");
		self.input_pw.val("ohyea");
		inputs.children("input").keypress(function(evt) {
			if(evt.keyCode == 13) self._login();
		});
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_un,self.placeholder_un);
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_pw,self.placeholder_pw);
		qoid.model.EM.addListener(qoid.model.EMEvent.InitialDataLoadComplete,function(n) {
			selfElement.dialog("close");
		},"Login-InitialDataLoadComplete");
	}, initialized : false, _login : function() {
		var self = this;
		var selfElement = this.element;
		var valid = true;
		var login = new qoid.model.Login();
		login.agentId = self.input_un.val();
		if(m3.helper.StringHelper.isBlank(login.agentId)) {
			self.placeholder_un.addClass("ui-state-error");
			valid = false;
		}
		login.password = self.input_pw.val();
		if(m3.helper.StringHelper.isBlank(login.password)) {
			self.placeholder_pw.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement.find(".ui-state-error").removeClass("ui-state-error");
		qoid.model.EM.change(qoid.model.EMEvent.UserLogin,login);
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement = this.element;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Login", height : 280, width : 400, modal : true, buttons : { Login : function() {
			self1._login();
		}, 'I\'m New...' : function() {
			qoid.widget.DialogManager.showCreateAgent();
		}}, beforeClose : function(evt,ui) {
			if(qoid.AppContext.UBER_ALIAS_ID == null) {
				m3.util.JqueryUtil.alert("A valid login is required to use the app");
				return false;
			}
			return true;
		}};
		selfElement.dialog(dlgOptions);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(!self.initialized) self._buildDialog();
		selfElement.children("#un_label").focus();
		self.input_un.blur();
		self.input_pw.blur();
		selfElement.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.loginDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of MessagingComp must be a div element");
		var tabs = selfElement.tabs({ activate : function(evt,ui) {
			ui.newPanel.find(".chatMsgs").each(function() {
				$(this).scrollTop($(this).height());
			});
		}}).find(".ui-tabs-nav");
		(js.Boot.__cast(tabs , $)).sortable({ axis : "x", stop : function(evt,ui) {
			selfElement.tabs("refresh");
		}});
		selfElement.addClass("messagingComp icontainer " + m3.widget.Widgets.getWidgetClasses());
		var ul = new $("<ul></ul>").appendTo(selfElement);
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var connection = (js.Boot.__cast(_ui.draggable , $)).connectionAvatar("option","connection");
			var id = "chat-" + connection.iid;
			var li = new $("<li><a href='#" + id + "'><img src='" + (function($this) {
				var $r;
				try {
					$r = connection.data.imgSrc;
				} catch( __e ) {
					$r = "";
				}
				return $r;
			}(this)) + "'></a></li>").appendTo(ul);
			var chatComp = new $("<div id='" + id + "'></div>").chatComp({ connection : connection, messages : new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier)});
			chatComp.appendTo(selfElement);
			selfElement.tabs("refresh");
		}, tolerance : "pointer"});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.messagingComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of PostComp must be a div element");
		selfElement.addClass("postComp container shadow " + m3.widget.Widgets.getWidgetClasses());
		var section = new $("<section id='postSection'></section>").appendTo(selfElement);
		var addConnectionsAndLabels = null;
		var doTextPost = function(evt,contentType,value) {
			qoid.AppContext.LOGGER.debug("Post new text content");
			evt.preventDefault();
			var ccd = new qoid.model.EditContentData(qoid.model.ContentFactory.create(contentType,value));
			addConnectionsAndLabels(ccd);
			qoid.model.EM.change(qoid.model.EMEvent.CreateContent,ccd);
		};
		var doTextPostForElement = function(evt,contentType,ele) {
			doTextPost(evt,contentType,ele.val());
			ele.val("");
		};
		var textInput = new $("<div class='postContainer'></div>").appendTo(section);
		var ta = new $("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>").appendTo(textInput).attr("id","textInput_ta").keypress(function(evt) {
			if(!(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13) doTextPostForElement(evt,qoid.model.ContentType.TEXT,new $(evt.target));
		});
		var urlComp = new $("<div class='postContainer boxsizingBorder'></div>").urlComp();
		urlComp.appendTo(section).keypress(function(evt) {
			if(!(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13) doTextPostForElement(evt,qoid.model.ContentType.URL,new $(evt.target));
		});
		var options = { contentType : qoid.model.ContentType.IMAGE};
		var imageInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		imageInput.appendTo(section);
		options.contentType = qoid.model.ContentType.AUDIO;
		var audioInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		audioInput.appendTo(section);
		var tabs = new $("<aside class='tabs'></aside>").appendTo(section);
		var textTab = new $("<span class='ui-icon ui-icon-document active ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.show();
			urlComp.hide();
			imageInput.hide();
			audioInput.hide();
		});
		var urlTab = new $("<span class='ui-icon ui-icon-link ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlComp.show();
			imageInput.hide();
			audioInput.hide();
		});
		var imgTab = new $("<span class='ui-icon ui-icon-image ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlComp.hide();
			imageInput.show();
			audioInput.hide();
		});
		var audioTab = new $("<span class='ui-icon ui-icon-volume-on ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlComp.hide();
			imageInput.hide();
			audioInput.show();
		});
		urlComp.hide();
		imageInput.hide();
		audioInput.hide();
		var isDuplicate = function(selector,ele,container,getUid) {
			var is_duplicate = false;
			if(ele["is"](selector)) {
				var new_uid = getUid(ele);
				container.children(selector).each(function(i,dom) {
					var uid = getUid(new $(dom));
					if(new_uid == uid) is_duplicate = true;
				});
			}
			return is_duplicate;
		};
		var tags = new $("<aside id='post_comps_tags' class='tags container boxsizingBorder'></aside>");
		tags.appendTo(section);
		tags.droppable({ accept : function(d) {
			return d["is"](".filterable") && !d["is"](".aliasAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			if(isDuplicate(".connectionAvatar",_ui.draggable,tags,function(ele) {
				return qoid.widget.ConnectionAvatarHelper.getConnection(new $(ele)).iid;
			}) || isDuplicate(".labelComp",_ui.draggable,tags,function(ele) {
				return qoid.widget.LabelCompHelper.getLabel(new $(ele)).iid;
			})) {
				if(_ui.draggable.parent().attr("id") != "post_comps_tags") _ui.draggable.draggable("option","revert",true);
				return;
			}
			var dragstop = function(dragstopEvt,dragstopUi) {
				if(!tags.intersects(dragstopUi.helper)) {
					dragstopUi.helper.remove();
					m3.util.JqueryUtil.deleteEffects(dragstopEvt);
				}
			};
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,dragstop);
			clone.addClass("small");
			var cloneOffset = clone.offset();
			$(this).append(clone);
			clone.css({ position : "absolute"});
			if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : ".tags"});
		}});
		addConnectionsAndLabels = function(ccd1) {
			tags.children(".label").each(function(i,dom) {
				var labelComp = new $(dom);
				ccd1.labelIids.push(qoid.widget.LabelCompHelper.getLabel(labelComp).iid);
			});
			tags.children(".connectionAvatar").each(function(i,dom) {
				var avatar = new $(dom);
				var connection = qoid.widget.ConnectionAvatarHelper.getConnection(avatar);
				ccd1.labelIids.push(connection.metaLabelIid);
			});
		};
		var postButton = new $("<button>Post</button>").appendTo(selfElement).button().click(function(evt) {
			if(tags.children(".label").length == 0) {
				m3.util.JqueryUtil.alert("Labels are required.  Please add at least one label to this content.");
				return;
			}
			if(textInput.isVisible()) {
				var ta1 = new $("#textInput_ta");
				doTextPostForElement(evt,qoid.model.ContentType.TEXT,ta1);
			} else if(urlComp.isVisible()) doTextPostForElement(evt,qoid.model.ContentType.URL,qoid.widget.UrlCompHelper.urlInput(urlComp)); else {
				doTextPost(evt,qoid.model.ContentType.IMAGE,qoid.widget.UploadCompHelper.value(imageInput));
				qoid.widget.UploadCompHelper.clear(imageInput);
			}
			tags.children(".label").remove();
			tags.children(".connectionAvatar").remove();
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.postComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of RequestIntroductionDialog must be a div element");
		selfElement.addClass("requestIntroductionDialog").hide();
		var connections = new $("<div></div>").appendTo(selfElement);
		connections.append("<div class='labelDiv' style='display:inline'>Introduce&nbsp;&nbsp;</div>");
		self._appendConnectionAvatar(self.options.to,connections);
		connections.append("<div class='labelDiv' style='display:inline'>&nbsp;to&nbsp;</div>");
		self._appendConnectionAvatar(self.options.from,connections);
		connections.append("<div class='labelDiv'>&nbsp;</div>");
		var toName = self.options.to.data.name;
		var fromName = self.options.from.data.name;
		var ridTitle = new $("<div class='rid_row'></div>").appendTo(selfElement);
		var introDiv = new $("<div class='rid_cell' style='text-align:left;'>Introduction Message for " + toName + "</div>").appendTo(ridTitle);
		var sameDiv = new $("<div class='rid_cell' id='same_messsage_div' style='text-align:right;'>Same Message for " + fromName + "</div>").appendTo(ridTitle);
		var cb = new $("<input type='checkbox' id='same_messsage' checked='checked'>").prependTo(sameDiv).change(function(evt) {
			var tgt = new $(evt.target);
			var from_text = new $("#from_text");
			var to_text = new $("#to_text");
			to_text.prop("readonly",tgt.prop("checked"));
			if(tgt.prop("checked")) to_text.val(from_text.val());
		});
		cb.prop("checked",true);
		var ridTa = new $("<div class='rid_row'></div>").appendTo(selfElement);
		var from_text_changed = function(evt) {
			var same_messsage = new $("#same_messsage");
			if(same_messsage.prop("checked")) {
				var from_text = new $("#from_text");
				var to_text = new $("#to_text");
				to_text.val(from_text.val());
			}
		};
		var divTa1 = new $("<div class='rid_cell' style='height:140px;'></div>").appendTo(ridTa);
		var from_text = new $("<textarea class='boxsizingBorder container rid_ta'></textarea>").appendTo(divTa1).attr("id","from_text").keyup(from_text_changed).val("Hi " + toName + " & " + fromName + ",\nHere's an introduction for the two of you to connect.\nwith love,\n" + qoid.AppContext.currentAlias.profile.name);
		var divTa2 = new $("<div class='rid_cell' style='height:140px;text-align:right;padding-left: 7px;'></div>").appendTo(ridTa);
		var to_text = new $("<textarea class='boxsizingBorder container rid_ta' readonly='readonly'></textarea>").appendTo(divTa2).attr("id","to_text").val(from_text.val());
	}, _appendConnectionAvatar : function(connection,parent) {
		var avatar = new $("<div class='avatar'></div>").connectionAvatar({ connectionIid : connection.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(parent).css("display","inline");
		parent.append("<div class='labelDiv' style='display:inline'>" + connection.data.name + "</div>");
	}, initialized : false, _sendRequest : function() {
		var self = this;
		var selfElement1 = this.element;
		var alias = qoid.AppContext.currentAlias.profile.name;
		var intro = new qoid.model.IntroductionRequest();
		intro.aConnectionIid = self.options.to.iid;
		intro.bConnectionIid = self.options.from.iid;
		intro.aMessage = new $("#to_text").val();
		intro.bMessage = new $("#from_text").val();
		qoid.model.EM.addListener(qoid.model.EMEvent.INTRODUCTION_RESPONSE,function(n) {
			selfElement1.dialog("close");
		},"RequestIntroductionDialog-Introduction-Response");
		qoid.model.EM.change(qoid.model.EMEvent.INTRODUCTION_REQUEST,intro);
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement2 = this.element;
		if(self1.initialized) return;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Introduction Request", height : 400, width : 600, buttons : { Send : function() {
			self1._sendRequest();
		}, Cancel : function() {
			$(this).dialog("close");
		}}, close : function(evt,ui) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement2.dialog(dlgOptions);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(selfElement.exists()) {
			selfElement.empty();
			self._create();
		}
		self._buildDialog();
		selfElement.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.requestIntroductionDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of RestoreWidget must be a div element");
		selfElement.addClass("RestoreWidget");
		self.container = new $("<div class=''></div>");
		selfElement.append(self.container);
		self.inputContainer = new $("<div class='' style='margin-top: 15px;'></div>");
		selfElement.append(self.inputContainer);
		new $("<button>Backup</button>").button().click(function(evt) {
			self.inputContainer.empty();
			self.inputContainer.append("<h3>Backup Options</h3>").append("<label>Name of Backup</label>");
			var name = new $("<input style='width: 80%;' class='ui-corner-all ui-widget-content'/>").appendTo(self.inputContainer);
			var submit = new $("<button>Submit Backup</button>").appendTo(self.inputContainer).click(function(evt1) {
				if(confirm("Perform Backup?")) {
					(js.Boot.__cast(selfElement , $)).m3dialog("close");
					qoid.model.EM.change(qoid.model.EMEvent.BACKUP);
				}
			});
		}).appendTo(self.container);
		new $("<button>Restore</button>").button().click(function(evt) {
			if(confirm("Restore from backup?")) {
				(js.Boot.__cast(selfElement , $)).m3dialog("close");
				qoid.model.EM.change(qoid.model.EMEvent.RESTORE);
			}
		}).appendTo(self.container);
		(js.Boot.__cast(selfElement , $)).m3dialog({ autoOpen : false, title : "Data Backup & Restore"});
	}, open : function() {
		var selfElement = this.element;
		selfElement.m3dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.restoreWidget",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of RevokeAccessDialog must be a div element");
		selfElement.addClass("revokeAccessDialog").hide();
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement = this.element;
		var lacls = qoid.AppContext.GROUPED_LABELACLS.delegate().get(self1.options.connection.iid);
		if(lacls == null) lacls = qoid.AppContext.GROUPED_LABELACLS.addEmptyGroup(self1.options.connection.iid);
		selfElement.append("<div style='margin-bottom:4px;'>To revoke access, check the label.</div>");
		var $it2 = lacls.iterator();
		while( $it2.hasNext() ) {
			var labelAcl = $it2.next();
			var laclDiv = new $("<div></div>").appendTo(selfElement);
			new $("<input type=\"checkbox\" style=\"position:relative;top:-18px;\" id=\"cb-" + labelAcl.iid + "\"/>").appendTo(laclDiv);
			new $("<div></div>").labelComp({ dndEnabled : false, labelIid : labelAcl.labelIid}).appendTo(laclDiv);
		}
		var dlgOptions = { autoOpen : false, title : "Revoke Access", height : 290, width : 400, modal : true, buttons : { 'Revoke Access' : function() {
			self1._revokeAccess();
			$(this).dialog("close");
		}, Cancel : function() {
			$(this).dialog("close");
		}}};
		selfElement.dialog(dlgOptions);
	}, _revokeAccess : function() {
		var self = this;
		var selfElement = this.element;
		var se = new Array();
		selfElement.find("input[type=checkbox]").each(function(indexInArray,ele) {
			var cb = new $(ele);
			if(cb.prop("checked") == true) {
				var id = cb.attr("id").split("-")[1];
				se.push(m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_LABELACLS,id));
			}
		});
		if(se.length > 0) qoid.model.EM.change(qoid.model.EMEvent.RevokeAccess,se);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(selfElement.exists()) {
			selfElement.empty();
			self._create();
		}
		self._buildDialog();
		selfElement.dialog("open");
		selfElement.dialog("widget").attr("id","revokeAccessDialog");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.revokeAccessDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of VerificationRequestDialog must be a div element");
		selfElement.addClass("verificationRequestDialog").hide();
		var uberDiv = new $("<div style='text-align:left'></div>");
		selfElement.append(uberDiv);
		uberDiv.append("<h3>Message:</h3>");
		uberDiv.append("<textarea id='vr_message' style='width:450px;'></textarea>");
		uberDiv.append("<h3>Verifiers:</h3>");
		var connectionContainer = new $("<div class='container' style='width:450px;height:135px;'></div>");
		uberDiv.append(connectionContainer);
		var $it3 = qoid.AppContext.MASTER_CONNECTIONS.iterator();
		while( $it3.hasNext() ) {
			var conn = $it3.next();
			var div = new $("<div></div>");
			div.append("<input type='checkbox' class='conn_cb' id='cb_" + conn.iid + "'/>");
			self._appendConnectionAvatar(conn,div);
			connectionContainer.append(div);
		}
	}, _appendConnectionAvatar : function(connection,parent) {
		var avatar = new $("<div class='avatar'></div>").connectionAvatar({ connectionIid : connection.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(parent).css("display","inline");
		parent.append("<div class='labelDiv' style='display:inline'>" + connection.data.name + "</div>");
	}, initialized : false, _sendRequest : function() {
		var self = this;
		var selfElement1 = this.element;
		var connectionIids = new Array();
		new $(".conn_cb").each(function(i,dom) {
			var cb = new $(dom);
			if(cb.prop("checked")) connectionIids.push(cb.attr("id").split("_")[1]);
		});
		var vr = new qoid.model.VerificationRequest(self.options.content.iid,connectionIids,new $("#vr_message").val());
		qoid.model.EM.listenOnce(qoid.model.EMEvent.VerificationRequest_RESPONSE,function(n) {
			selfElement1.dialog("close");
		});
		qoid.model.EM.change(qoid.model.EMEvent.VerificationRequest,vr);
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement2 = this.element;
		if(self1.initialized) return;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Verification Request", height : 400, width : 600, buttons : { Send : function() {
			self1._sendRequest();
		}, Cancel : function() {
			$(this).dialog("close");
		}}, close : function(evt,ui) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement2.dialog(dlgOptions);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(selfElement.exists()) {
			selfElement.empty();
			self._create();
		}
		self._buildDialog();
		selfElement.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.verificationRequestDialog",defineWidget());
var defineWidget = function() {
	return { _updateTimeLines : function() {
		var self = this;
		var $it4 = self.contentTimeLines.iterator();
		while( $it4.hasNext() ) {
			var timeline = $it4.next();
			timeline.reposition(self.startTime.getTime(),self.endTime.getTime());
		}
	}, _getProfile : function(content) {
		var alias = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_ALIASES,content.aliasIid);
		if(alias != null) return alias.profile;
		var connection = m3.helper.OSetHelper.getElement(qoid.AppContext.MASTER_CONNECTIONS,content.connectionIid);
		if(connection != null) return connection.data;
		return new qoid.model.Profile();
	}, _addContent : function(content) {
		try {
			var self = this;
			var updateTimelines = false;
			if(self.startTime.getTime() > content.get_created().getTime()) {
				self.startTime = content.get_created();
				updateTimelines = true;
			}
			if(self.endTime.getTime() < content.get_created().getTime()) {
				self.endTime = content.get_created();
				updateTimelines = true;
			}
			if(updateTimelines) self._updateTimeLines();
			if(self.contentTimeLines.get(content.aliasIid) == null) {
				var timeLine = new qoid.widget.score.ContentTimeLine(self.paper,self._getProfile(content),self.startTime.getTime(),self.endTime.getTime(),self.viewBoxWidth);
				self.contentTimeLines.set(content.aliasIid,timeLine);
			}
			self.contentTimeLines.get(content.aliasIid).addContent(content);
			self.uberGroup.append(self.contentTimeLines.get(content.aliasIid).timeLineElement);
		} catch( e ) {
			qoid.AppContext.LOGGER.error("error calling _addContent",e);
		}
	}, _deleteContent : function(content) {
		var self = this;
		var ctl = self.contentTimeLines.get(content.aliasIid);
		if(ctl != null) {
			ctl.removeElements();
			self.contentTimeLines.remove(content.aliasIid);
			if(!self.contentTimeLines.iterator().hasNext()) qoid.widget.score.ContentTimeLine.resetPositions();
		}
	}, _updateContent : function(content) {
	}, _create : function() {
		var self1 = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ScoreComp must be a div element");
		selfElement.addClass("container shadow scoreComp");
		var mapListener = function(content,ele,evt) {
			if(evt.isAdd()) self1._addContent(content); else if(evt.isUpdate()) self1._updateContent(content); else if(evt.isDelete()) self1._deleteContent(content);
		};
		var beforeSetContent = function() {
			new $("#score-comp-svg").empty();
			self1.contentTimeLines = new haxe.ds.StringMap();
			self1.viewBoxWidth = 1000;
			self1.paper = new Snap("#score-comp-svg");
			self1.uberGroup = ((function($this) {
				var $r;
				var e123 = [];
				var me123 = self1.paper;
				$r = me123.group.apply(me123, e123);
				return $r;
			}(this))).attr("id","uber-group").attr("transform","matrix(1 0 0 1 0 0)");
			self1.startTime = null;
			self1.endTime = null;
			if(self1.startTime == null) {
				self1.startTime = (function($this) {
					var $r;
					var d = new Date();
					d.setTime(new Date().getTime() - 7200000.);
					$r = d;
					return $r;
				}(this));
				self1.endTime = (function($this) {
					var $r;
					var d = new Date();
					d.setTime(self1.startTime.getTime() + 7200000.);
					$r = d;
					return $r;
				}(this));
			} else {
				self1.startTime = (function($this) {
					var $r;
					var d = new Date();
					d.setTime(self1.startTime.getTime() - 7200000.);
					$r = d;
					return $r;
				}(this));
				self1.endTime = (function($this) {
					var $r;
					var d = new Date();
					d.setTime(self1.endTime.getTime() + 7200000.);
					$r = d;
					return $r;
				}(this));
			}
			self1.timeMarker = new qoid.widget.score.TimeMarker(self1.uberGroup,self1.paper,self1.viewBoxWidth,self1.startTime,self1.endTime);
		};
		var widgetCreator = function(content) {
			return null;
		};
		qoid.model.ContentSource.addListener(mapListener,beforeSetContent,widgetCreator);
	}, destroy : function() {
		var self = this;
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.scoreComp",defineWidget());
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
js.d3._D3.InitPriority.important = "important";
m3.observable.OSet.__rtti = "<class path=\"m3.observable.OSet\" params=\"T\" interface=\"1\">\n\t<identifier public=\"1\" set=\"method\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<listen public=\"1\" set=\"method\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.OSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<removeListener public=\"1\" set=\"method\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.OSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListener>\n\t<iterator public=\"1\" set=\"method\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet.T\"/>\n</x></f></delegate>\n\t<getVisualId public=\"1\" set=\"method\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.EventManager.__rtti = "<class path=\"m3.observable.EventManager\" params=\"T\" module=\"m3.observable.OSet\">\n\t<_listeners><c path=\"Array\"><f a=\":\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_listeners>\n\t<_set><c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c></_set>\n\t<add public=\"1\" set=\"method\" line=\"47\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.EventManager.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></add>\n\t<remove public=\"1\" set=\"method\" line=\"55\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.EventManager.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></remove>\n\t<fire public=\"1\" set=\"method\" line=\"58\"><f a=\"t:type\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<listenerCount public=\"1\" set=\"method\" line=\"69\"><f a=\"\"><x path=\"Int\"/></f></listenerCount>\n\t<new public=\"1\" set=\"method\" line=\"43\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.EventType.Add = new m3.observable.EventType("Add",true,false);
m3.observable.EventType.Update = new m3.observable.EventType("Update",false,true);
m3.observable.EventType.Delete = new m3.observable.EventType("Delete",false,false);
m3.observable.AbstractSet.__rtti = "<class path=\"m3.observable.AbstractSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<implements path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></implements>\n\t<_eventManager public=\"1\"><c path=\"m3.observable.EventManager\"><c path=\"m3.observable.AbstractSet.T\"/></c></_eventManager>\n\t<visualId public=\"1\"><c path=\"String\"/></visualId>\n\t<listen public=\"1\" set=\"method\" line=\"121\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<removeListener public=\"1\" set=\"method\" line=\"125\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListener>\n\t<filter public=\"1\" set=\"method\" line=\"129\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></c>\n</f></filter>\n\t<map public=\"1\" params=\"U\" set=\"method\" line=\"133\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"map.U\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"map.U\"/></c>\n</f></map>\n\t<fire set=\"method\" line=\"137\"><f a=\"t:type\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<getVisualId public=\"1\" set=\"method\" line=\"141\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<identifier public=\"1\" set=\"method\" line=\"145\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"149\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.AbstractSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"153\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n</x></f></delegate>\n\t<new set=\"method\" line=\"117\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.ObservableSet.__rtti = "<class path=\"m3.observable.ObservableSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.ObservableSet.T\"/></extends>\n\t<_delegate><c path=\"m3.util.SizedMap\"><c path=\"m3.observable.ObservableSet.T\"/></c></_delegate>\n\t<_identifier><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></_identifier>\n\t<add public=\"1\" set=\"method\" line=\"173\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addAll public=\"1\" set=\"method\" line=\"177\"><f a=\"tArr\">\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></addAll>\n\t<iterator public=\"1\" set=\"method\" line=\"185\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.ObservableSet.T\"/></t></f></iterator>\n\t<isEmpty public=\"1\" set=\"method\" line=\"189\"><f a=\"\"><x path=\"Bool\"/></f></isEmpty>\n\t<addOrUpdate public=\"1\" set=\"method\" line=\"193\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></addOrUpdate>\n\t<delegate public=\"1\" set=\"method\" line=\"205\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n</x></f></delegate>\n\t<update public=\"1\" set=\"method\" line=\"209\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></update>\n\t<delete public=\"1\" set=\"method\" line=\"213\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<identifier public=\"1\" set=\"method\" line=\"221\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<clear public=\"1\" set=\"method\" line=\"225\"><f a=\"\"><x path=\"Void\"/></f></clear>\n\t<size public=\"1\" set=\"method\" line=\"232\"><f a=\"\"><x path=\"Int\"/></f></size>\n\t<asArray public=\"1\" set=\"method\" line=\"236\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"164\"><f a=\"identifier:?tArr\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.MappedSet.__rtti = "<class path=\"m3.observable.MappedSet\" params=\"T:U\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.MappedSet.U\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c></_source>\n\t<_mapper><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</f></_mapper>\n\t<_mappedSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></_mappedSet>\n\t<_remapOnUpdate><x path=\"Bool\"/></_remapOnUpdate>\n\t<_mapListeners><c path=\"Array\"><f a=\"::\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_mapListeners>\n\t<_sourceListener set=\"method\" line=\"264\"><f a=\"t:type\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></_sourceListener>\n\t<identifier public=\"1\" set=\"method\" line=\"285\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<delegate public=\"1\" set=\"method\" line=\"289\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></f></delegate>\n\t<identify set=\"method\" line=\"293\"><f a=\"u\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"304\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.MappedSet.U\"/></t></f></iterator>\n\t<mapListen public=\"1\" set=\"method\" line=\"308\"><f a=\"f\">\n\t<f a=\"::\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></mapListen>\n\t<removeListeners public=\"1\" set=\"method\" line=\"319\"><f a=\"mapListener\">\n\t<f a=\"::\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListeners>\n\t<new public=\"1\" set=\"method\" line=\"254\"><f a=\"source:mapper:?remapOnUpdate\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.FilteredSet.__rtti = "<class path=\"m3.observable.FilteredSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.FilteredSet.T\"/></extends>\n\t<_filteredSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></_filteredSet>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c></_source>\n\t<_filter><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Bool\"/>\n</f></_filter>\n\t<delegate public=\"1\" set=\"method\" line=\"352\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></f></delegate>\n\t<apply set=\"method\" line=\"356\"><f a=\"t\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Void\"/>\n</f></apply>\n\t<refilter public=\"1\" set=\"method\" line=\"373\"><f a=\"\"><x path=\"Void\"/></f></refilter>\n\t<identifier public=\"1\" set=\"method\" line=\"377\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"381\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.FilteredSet.T\"/></t></f></iterator>\n\t<asArray public=\"1\" set=\"method\" line=\"385\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.FilteredSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"331\"><f a=\"source:filter\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.GroupedSet.__rtti = "<class path=\"m3.observable.GroupedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></_source>\n\t<_groupingFn><f a=\"\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_groupingFn>\n\t<_groupedSets><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></_groupedSets>\n\t<_identityToGrouping><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n</x></_identityToGrouping>\n\t<delete set=\"method\" line=\"423\"><f a=\"t:?deleteEmptySet\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"446\"><f a=\"t\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addEmptyGroup public=\"1\" set=\"method\" line=\"465\"><f a=\"key\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</f></addEmptyGroup>\n\t<identifier public=\"1\" set=\"method\" line=\"474\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<identify set=\"method\" line=\"478\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"489\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"493\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"403\"><f a=\"source:groupingFn\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.SortedSet.__rtti = "<class path=\"m3.observable.SortedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.SortedSet.T\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c></_source>\n\t<_sortByFn><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_sortByFn>\n\t<_sorted><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></_sorted>\n\t<_dirty><x path=\"Bool\"/></_dirty>\n\t<_comparisonFn><f a=\":\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></_comparisonFn>\n\t<sorted public=\"1\" set=\"method\" line=\"545\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></f></sorted>\n\t<indexOf set=\"method\" line=\"553\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></indexOf>\n\t<binarySearch set=\"method\" line=\"558\"><f a=\"value:sortBy:startIndex:endIndex\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n</f></binarySearch>\n\t<delete set=\"method\" line=\"576\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"580\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<identifier public=\"1\" set=\"method\" line=\"586\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"590\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.SortedSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"594\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"506\"><f a=\"source:?sortByFn\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.SortedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.util.ColorProvider._INDEX = 0;
qoid.api.ChannelMessage.__rtti = "<class path=\"qoid.api.ChannelMessage\" params=\"\" module=\"qoid.api.CrudMessage\" interface=\"1\"><meta><m n=\":rtti\"/></meta></class>";
qoid.api.BennuMessage.__rtti = "<class path=\"qoid.api.BennuMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<type public=\"1\"><c path=\"String\"/></type>\n\t<new public=\"1\" set=\"method\" line=\"15\"><f a=\"type\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.DeleteMessage.__rtti = "<class path=\"qoid.api.DeleteMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<extends path=\"qoid.api.BennuMessage\"/>\n\t<create public=\"1\" set=\"method\" line=\"28\" static=\"1\"><f a=\"object\">\n\t<c path=\"qoid.model.ModelObjWithIid\"/>\n\t<c path=\"qoid.api.DeleteMessage\"/>\n</f></create>\n\t<primaryKey><c path=\"String\"/></primaryKey>\n\t<new public=\"1\" set=\"method\" line=\"23\"><f a=\"type:primaryKey\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.api.CrudMessage.__rtti = "<class path=\"qoid.api.CrudMessage\" params=\"\">\n\t<extends path=\"qoid.api.BennuMessage\"/>\n\t<create public=\"1\" set=\"method\" line=\"51\" static=\"1\"><f a=\"object:?optionals\">\n\t<c path=\"qoid.model.ModelObjWithIid\"/>\n\t<d/>\n\t<c path=\"qoid.api.CrudMessage\"/>\n</f></create>\n\t<instance><d/></instance>\n\t<parentIid>\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</parentIid>\n\t<profileName>\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</profileName>\n\t<profileImgSrc>\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</profileImgSrc>\n\t<labelIids>\n\t\t<c path=\"Array\"><c path=\"String\"/></c>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</labelIids>\n\t<new public=\"1\" set=\"method\" line=\"40\"><f a=\"type:instance:?optionals\">\n\t<c path=\"String\"/>\n\t<d/>\n\t<d/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.api.DeregisterMessage.__rtti = "<class path=\"qoid.api.DeregisterMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<handle public=\"1\"><c path=\"String\"/></handle>\n\t<new public=\"1\" set=\"method\" line=\"60\"><f a=\"handle\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.IntroMessage.__rtti = "<class path=\"qoid.api.IntroMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<aConnectionIid public=\"1\"><c path=\"String\"/></aConnectionIid>\n\t<aMessage public=\"1\"><c path=\"String\"/></aMessage>\n\t<bConnectionIid public=\"1\"><c path=\"String\"/></bConnectionIid>\n\t<bMessage public=\"1\"><c path=\"String\"/></bMessage>\n\t<new public=\"1\" set=\"method\" line=\"72\"><f a=\"i\">\n\t<c path=\"qoid.model.IntroductionRequest\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.VerificationRequestMessage.__rtti = "<class path=\"qoid.api.VerificationRequestMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<connectionIids public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></connectionIids>\n\t<message public=\"1\"><c path=\"String\"/></message>\n\t<new public=\"1\" set=\"method\" line=\"86\"><f a=\"vr\">\n\t<c path=\"qoid.model.VerificationRequest\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.VerificationResponseMessage.__rtti = "<class path=\"qoid.api.VerificationResponseMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<notificationIid public=\"1\"><c path=\"String\"/></notificationIid>\n\t<verificationContent public=\"1\"><c path=\"String\"/></verificationContent>\n\t<new public=\"1\" set=\"method\" line=\"98\"><f a=\"vr\">\n\t<c path=\"qoid.model.VerificationResponse\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.AcceptVerificationMessage.__rtti = "<class path=\"qoid.api.AcceptVerificationMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<notificationIid public=\"1\"><c path=\"String\"/></notificationIid>\n\t<new public=\"1\" set=\"method\" line=\"108\"><f a=\"notificationIid\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.IntroResponseMessage.__rtti = "<class path=\"qoid.api.IntroResponseMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<notificationIid public=\"1\"><c path=\"String\"/></notificationIid>\n\t<accepted public=\"1\"><x path=\"Bool\"/></accepted>\n\t<new public=\"1\" set=\"method\" line=\"118\"><f a=\"notificationIid:accepted\">\n\t<c path=\"String\"/>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.GetProfileMessage.__rtti = "<class path=\"qoid.api.GetProfileMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<connectionIids public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></connectionIids>\n\t<new public=\"1\" set=\"method\" line=\"128\"><f a=\"?connectionIids\">\n\t<c path=\"Array\"><c path=\"String\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.QueryMessage.__rtti = "<class path=\"qoid.api.QueryMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<create public=\"1\" set=\"method\" line=\"160\" static=\"1\"><f a=\"type\">\n\t<c path=\"String\"/>\n\t<c path=\"qoid.api.QueryMessage\"/>\n</f></create>\n\t<type public=\"1\"><c path=\"String\"/></type>\n\t<q public=\"1\"><c path=\"String\"/></q>\n\t<aliasIid public=\"1\"><c path=\"String\"/></aliasIid>\n\t<connectionIids public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></connectionIids>\n\t<standing public=\"1\"><x path=\"Bool\"/></standing>\n\t<historical public=\"1\"><x path=\"Bool\"/></historical>\n\t<local public=\"1\"><x path=\"Bool\"/></local>\n\t<new public=\"1\" set=\"method\" line=\"143\"><f a=\"fd:?type:?q\">\n\t<c path=\"qoid.model.FilterData\"/>\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.ChannelRequestMessage.__rtti = "<class path=\"qoid.api.ChannelRequestMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<path><c path=\"String\"/></path>\n\t<context><c path=\"String\"/></context>\n\t<parms><d/></parms>\n\t<new public=\"1\" set=\"method\" line=\"171\"><f a=\"path:context:msg\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"qoid.api.ChannelMessage\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.ChannelRequestMessageBundle.__rtti = "<class path=\"qoid.api.ChannelRequestMessageBundle\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<channel><c path=\"String\"/></channel>\n\t<requests><c path=\"Array\"><c path=\"qoid.api.ChannelRequestMessage\"/></c></requests>\n\t<addChannelRequest public=\"1\" set=\"method\" line=\"193\"><f a=\"request\">\n\t<c path=\"qoid.api.ChannelRequestMessage\"/>\n\t<x path=\"Void\"/>\n</f></addChannelRequest>\n\t<addRequest public=\"1\" set=\"method\" line=\"197\"><f a=\"path:context:parms\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"qoid.api.BennuMessage\"/>\n\t<x path=\"Void\"/>\n</f></addRequest>\n\t<new public=\"1\" set=\"method\" line=\"184\"><f a=\"?requests_\">\n\t<c path=\"Array\"><c path=\"qoid.api.ChannelRequestMessage\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.ProtocolHandler.QUERY = "/api/query";
qoid.api.ProtocolHandler.UPSERT = "/api/upsert";
qoid.api.ProtocolHandler.DELETE = "/api/delete";
qoid.api.ProtocolHandler.INTRODUCE = "/api/introduction/initiate";
qoid.api.ProtocolHandler.DEREGISTER = "/api/query/deregister";
qoid.api.ProtocolHandler.INTRO_RESPONSE = "/api/introduction/respond";
qoid.api.ProtocolHandler.VERIFY = "/api/verification/verify";
qoid.api.ProtocolHandler.VERIFICATION_ACCEPT = "/api/verification/accept";
qoid.api.ProtocolHandler.VERIFICATION_REQUEST = "/api/verification/request";
qoid.api.ProtocolHandler.VERIFICATION_RESPONSE = "/api/verification/respond";
qoid.api.Synchronizer.synchronizers = new haxe.ds.StringMap();
qoid.model.ModelObj.__rtti = "<class path=\"qoid.model.ModelObj\" params=\"\">\n\t<objectType public=\"1\" set=\"method\" line=\"25\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<new public=\"1\" set=\"method\" line=\"22\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.ModelObjWithIid.__rtti = "<class path=\"qoid.model.ModelObjWithIid\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"43\" static=\"1\"><f a=\"t\">\n\t<c path=\"qoid.model.ModelObjWithIid\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<deleted public=\"1\"><x path=\"Bool\"/></deleted>\n\t<iid public=\"1\"><c path=\"String\"/></iid>\n\t<new public=\"1\" set=\"method\" line=\"37\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Profile.__rtti = "<class path=\"qoid.model.Profile\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"60\" static=\"1\"><f a=\"profile\">\n\t<c path=\"qoid.model.Profile\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<sharedId public=\"1\"><c path=\"String\"/></sharedId>\n\t<aliasIid public=\"1\"><c path=\"String\"/></aliasIid>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<new public=\"1\" set=\"method\" line=\"54\"><f a=\"?name:?imgSrc:?aliasIid\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.AliasData.__rtti = "<class path=\"qoid.model.AliasData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<isDefault public=\"1\">\n\t\t<x path=\"Bool\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</isDefault>\n\t<new public=\"1\" set=\"method\" line=\"67\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Alias.__rtti = "<class path=\"qoid.model.Alias\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"85\" static=\"1\"><f a=\"alias\">\n\t<c path=\"qoid.model.Alias\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<rootLabelIid public=\"1\"><c path=\"String\"/></rootLabelIid>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<profile public=\"1\">\n\t\t<c path=\"qoid.model.Profile\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</profile>\n\t<data public=\"1\">\n\t\t<c path=\"qoid.model.AliasData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"79\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.LabelData.__rtti = "<class path=\"qoid.model.LabelData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<color public=\"1\"><c path=\"String\"/></color>\n\t<new public=\"1\" set=\"method\" line=\"92\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Label.__rtti = "<class path=\"qoid.model.Label\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"109\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.Label\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<data public=\"1\">\n\t\t<c path=\"qoid.model.LabelData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<labelChildren public=\"1\">\n\t\t<c path=\"m3.observable.OSet\"><c path=\"qoid.model.LabelChild\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labelChildren>\n\t<new public=\"1\" set=\"method\" line=\"103\"><f a=\"?name\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.LabelChild.__rtti = "<class path=\"qoid.model.LabelChild\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"128\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.LabelChild\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<parentIid public=\"1\"><c path=\"String\"/></parentIid>\n\t<childIid public=\"1\"><c path=\"String\"/></childIid>\n\t<data public=\"1\">\n\t\t<d/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"119\"><f a=\"?parentIid:?childIid\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.LabelAcl.__rtti = "<class path=\"qoid.model.LabelAcl\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"143\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.LabelAcl\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<connectionIid public=\"1\"><c path=\"String\"/></connectionIid>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<new public=\"1\" set=\"method\" line=\"137\"><f a=\"?connectionIid:?labelIid\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.Connection.__rtti = "<class path=\"qoid.model.Connection\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"155\" static=\"1\"><f a=\"c\">\n\t<c path=\"qoid.model.Connection\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<aliasIid public=\"1\"><c path=\"String\"/></aliasIid>\n\t<localPeerId public=\"1\"><c path=\"String\"/></localPeerId>\n\t<remotePeerId public=\"1\"><c path=\"String\"/></remotePeerId>\n\t<metaLabelIid public=\"1\"><c path=\"String\"/></metaLabelIid>\n\t<data public=\"1\">\n\t\t<c path=\"qoid.model.Profile\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<equals public=\"1\" set=\"method\" line=\"164\"><f a=\"c\">\n\t<c path=\"qoid.model.Connection\"/>\n\t<x path=\"Bool\"/>\n</f></equals>\n\t<new public=\"1\" set=\"method\" line=\"159\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.LabeledContent.__rtti = "<class path=\"qoid.model.LabeledContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"239\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.LabeledContent\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<data public=\"1\">\n\t\t<d/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"243\"><f a=\"contentIid:labelIid\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.ContentData.__rtti = "<class path=\"qoid.model.ContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<created public=\"1\"><c path=\"Date\"/></created>\n\t<modified public=\"1\"><c path=\"Date\"/></modified>\n\t<new public=\"1\" set=\"method\" line=\"255\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.ContentVerification.__rtti = "<class path=\"qoid.model.ContentVerification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<verifierId public=\"1\"><c path=\"String\"/></verifierId>\n\t<verificationIid public=\"1\"><c path=\"String\"/></verificationIid>\n\t<hash public=\"1\"><d/></hash>\n\t<hashAlgorithm public=\"1\"><c path=\"String\"/></hashAlgorithm>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.ContentMetaData.__rtti = "<class path=\"qoid.model.ContentMetaData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<verifications>\n\t\t<c path=\"Array\"><c path=\"qoid.model.ContentVerification\"/></c>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</verifications>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.Content.__rtti = "<class path=\"qoid.model.Content\" params=\"T\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<contentType public=\"1\"><e path=\"qoid.model.ContentType\"/></contentType>\n\t<aliasIid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</aliasIid>\n\t<connectionIid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</connectionIid>\n\t<metaData public=\"1\">\n\t\t<c path=\"qoid.model.ContentMetaData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</metaData>\n\t<data><d/></data>\n\t<props public=\"1\">\n\t\t<c path=\"qoid.model.Content.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</props>\n\t<created public=\"1\" get=\"accessor\" set=\"null\">\n\t\t<c path=\"Date\"/>\n\t\t<meta>\n\t\t\t<m n=\":transient\"/>\n\t\t\t<m n=\":isVar\"/>\n\t\t</meta>\n\t</created>\n\t<modified public=\"1\" get=\"accessor\" set=\"null\">\n\t\t<c path=\"Date\"/>\n\t\t<meta>\n\t\t\t<m n=\":transient\"/>\n\t\t\t<m n=\":isVar\"/>\n\t\t</meta>\n\t</modified>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"qoid.model.Content.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<get_created public=\"1\" set=\"method\" line=\"296\"><f a=\"\"><c path=\"Date\"/></f></get_created>\n\t<get_modified public=\"1\" set=\"method\" line=\"300\"><f a=\"\"><c path=\"Date\"/></f></get_modified>\n\t<setData public=\"1\" set=\"method\" line=\"305\"><f a=\"data\">\n\t<d/>\n\t<x path=\"Void\"/>\n</f></setData>\n\t<readResolve set=\"method\" line=\"309\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"313\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<getTimestamp public=\"1\" set=\"method\" line=\"317\"><f a=\"\"><c path=\"String\"/></f></getTimestamp>\n\t<objectType public=\"1\" set=\"method\" line=\"321\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<new public=\"1\" set=\"method\" line=\"287\"><f a=\"contentType:type\">\n\t<e path=\"qoid.model.ContentType\"/>\n\t<x path=\"Class\"><c path=\"qoid.model.Content.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.ImageContentData.__rtti = "<class path=\"qoid.model.ImageContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<imgSrc public=\"1\"><c path=\"String\"/></imgSrc>\n\t<caption public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</caption>\n\t<new public=\"1\" set=\"method\" line=\"330\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.ImageContent.__rtti = "<class path=\"qoid.model.ImageContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.ImageContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"336\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.AudioContentData.__rtti = "<class path=\"qoid.model.AudioContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<audioSrc public=\"1\"><c path=\"String\"/></audioSrc>\n\t<audioType public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</audioType>\n\t<title public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</title>\n\t<new public=\"1\" set=\"method\" line=\"346\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.AudioContent.__rtti = "<class path=\"qoid.model.AudioContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.AudioContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"352\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.MessageContentData.__rtti = "<class path=\"qoid.model.MessageContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<new public=\"1\" set=\"method\" line=\"360\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.MessageContent.__rtti = "<class path=\"qoid.model.MessageContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.MessageContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"366\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.UrlContentData.__rtti = "<class path=\"qoid.model.UrlContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<url public=\"1\"><c path=\"String\"/></url>\n\t<text public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</text>\n\t<new public=\"1\" set=\"method\" line=\"375\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.UrlContent.__rtti = "<class path=\"qoid.model.UrlContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.UrlContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"381\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Notification.__rtti = "<class path=\"qoid.model.Notification\" params=\"T\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<consumed public=\"1\"><x path=\"Bool\"/></consumed>\n\t<fromConnectionIid public=\"1\"><c path=\"String\"/></fromConnectionIid>\n\t<kind public=\"1\"><e path=\"qoid.model.NotificationKind\"/></kind>\n\t<data><d/></data>\n\t<props public=\"1\">\n\t\t<c path=\"qoid.model.Notification.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</props>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"qoid.model.Notification.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<readResolve set=\"method\" line=\"438\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"442\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<new public=\"1\" set=\"method\" line=\"430\"><f a=\"kind:type\">\n\t<e path=\"qoid.model.NotificationKind\"/>\n\t<x path=\"Class\"><c path=\"qoid.model.Notification.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.IntroductionRequest.__rtti = "<class path=\"qoid.model.IntroductionRequest\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<aConnectionIid public=\"1\"><c path=\"String\"/></aConnectionIid>\n\t<bConnectionIid public=\"1\"><c path=\"String\"/></bConnectionIid>\n\t<aMessage public=\"1\"><c path=\"String\"/></aMessage>\n\t<bMessage public=\"1\"><c path=\"String\"/></bMessage>\n\t<new public=\"1\" set=\"method\" line=\"455\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Introduction.__rtti = "<class path=\"qoid.model.Introduction\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<aConnectionIid public=\"1\"><c path=\"String\"/></aConnectionIid>\n\t<bConnectionIid public=\"1\"><c path=\"String\"/></bConnectionIid>\n\t<aState public=\"1\"><e path=\"qoid.model.IntroductionState\"/></aState>\n\t<bState public=\"1\"><e path=\"qoid.model.IntroductionState\"/></bState>\n\t<new public=\"1\" set=\"method\" line=\"462\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.IntroductionRequestNotification.__rtti = "<class path=\"qoid.model.IntroductionRequestNotification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Notification\"><c path=\"qoid.model.IntroductionRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"471\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.IntroductionRequestData.__rtti = "<class path=\"qoid.model.IntroductionRequestData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<introductionIid public=\"1\"><c path=\"String\"/></introductionIid>\n\t<message public=\"1\"><c path=\"String\"/></message>\n\t<profile public=\"1\"><c path=\"qoid.model.Profile\"/></profile>\n\t<accepted public=\"1\">\n\t\t<x path=\"Bool\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</accepted>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.VerificationRequestNotification.__rtti = "<class path=\"qoid.model.VerificationRequestNotification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Notification\"><c path=\"qoid.model.VerificationRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"484\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationRequestData.__rtti = "<class path=\"qoid.model.VerificationRequestData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<contentType public=\"1\"><e path=\"qoid.model.ContentType\"/></contentType>\n\t<contentData public=\"1\"><d/></contentData>\n\t<message public=\"1\"><c path=\"String\"/></message>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.VerificationResponseNotification.__rtti = "<class path=\"qoid.model.VerificationResponseNotification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Notification\"><c path=\"qoid.model.VerificationResponseData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"497\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationResponseData.__rtti = "<class path=\"qoid.model.VerificationResponseData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<verificationContentIid public=\"1\"><c path=\"String\"/></verificationContentIid>\n\t<verificationContentData public=\"1\"><d/></verificationContentData>\n\t<verifierId public=\"1\"><c path=\"String\"/></verifierId>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.Login.__rtti = "<class path=\"qoid.model.Login\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<agentId public=\"1\"><c path=\"String\"/></agentId>\n\t<password public=\"1\"><c path=\"String\"/></password>\n\t<new public=\"1\" set=\"method\" line=\"514\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.NewUser.__rtti = "<class path=\"qoid.model.NewUser\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<userName public=\"1\"><c path=\"String\"/></userName>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<pwd public=\"1\"><c path=\"String\"/></pwd>\n\t<new public=\"1\" set=\"method\" line=\"527\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.widget.score.ContentTimeLine.initial_y_pos = 60;
qoid.widget.score.ContentTimeLine.next_y_pos = qoid.widget.score.ContentTimeLine.initial_y_pos;
qoid.widget.score.ContentTimeLine.next_x_pos = 10;
qoid.widget.score.ContentTimeLine.width = 60;
qoid.widget.score.ContentTimeLine.height = 70;
qoid.AgentUi.main();
function $hxExpose(src, path) {
	var o = typeof window != "undefined" ? window : exports;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
