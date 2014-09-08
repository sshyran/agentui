package pagent.widget;

import pagent.AppContext;
import pagent.widget.DialogManager;
import m3.util.M;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.jq.JQTooltip;
import m3.observable.OSet;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import qoid.model.Node;
import m3.observable.OSet.ObservableSet;
import qoid.widget.FilterableComponent;
import m3.exception.Exception;

using StringTools;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;

typedef ConnectionAvatarOptions = {
	>FilterableCompOptions,
	@:optional var connectionIid: String;
	@:optional var aliasIid: String;
}

typedef ConnectionAvatarWidgetDef = {
	var options: ConnectionAvatarOptions;
	var _create: Void->Void;
	@:optional var _super: Void->Void;
	var destroy: Void->Void;
	var _updateWidgets: Profile->Void;
	var getAlias: Void->Alias;

	@:optional var filteredSetConnection:FilteredSet<Connection>;
	@:optional var _onUpdateConnection: Connection->EventType->Void;
	@:optional var filteredSetAlias:FilteredSet<Alias>;
	@:optional var _onUpdateAlias: Alias->EventType->Void;
}

class ConnectionAvatarHelper {
	public static function getAlias(c: ConnectionAvatar): Alias {
		return c.connectionAvatar("getAlias");
	}
}

@:native("$")
extern class ConnectionAvatar extends FilterableComponent {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionAvatar(opts: ConnectionAvatarOptions): ConnectionAvatar;

	static function __init__(): Void {
		var defineWidget: Void->ConnectionAvatarWidgetDef = function(): ConnectionAvatarWidgetDef {
			return {
		        options: {
		            isDragByHelper: true,
		            containment: false,
		            dndEnabled: true,
		            classes: null,
		            dragstop: null,
		            cloneFcn: function(filterableComp: FilterableComponent, ?isDragByHelper: Bool = false, ?containment: Dynamic = false, ?dragstop: JQEvent->UIDraggable->Void): ConnectionAvatar {
			            	var connectionAvatar: ConnectionAvatar = cast(filterableComp, ConnectionAvatar);
			            	if(connectionAvatar.hasClass("clone")) return connectionAvatar;
			            	var clone: ConnectionAvatar = new ConnectionAvatar("<div class='clone'></div>");
			            	clone.connectionAvatar({
			                        connectionIid: connectionAvatar.connectionAvatar("option", "connectionIid"),
			                        aliasIid: connectionAvatar.connectionAvatar("option", "aliasIid"),
			                        isDragByHelper: isDragByHelper,
			                        containment: containment,
			                        dragstop: dragstop,
			                        classes: connectionAvatar.connectionAvatar("option", "classes"),
			                        cloneFcn: connectionAvatar.connectionAvatar("option", "cloneFcn"),
			                        dropTargetClass: connectionAvatar.connectionAvatar("option", "dropTargetClass"),
			                        helperFcn: connectionAvatar.connectionAvatar("option", "helperFcn")
			                    });
			            	return clone;
		            	},
					dropTargetClass: "connectionDT",
					helperFcn: function(): JQ {
			    			var clone: JQ = JQ.cur.clone();
			    			return clone.children("img").addClass("connectionDraggingImg");
	    				}
		        },

		        getAlias: function():Alias {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
		        	return AppContext.ALIASES.getElement(self.options.aliasIid);
		        },

		        _create: function(): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionAvatar must be a div element");
		        	}


		        	var id = "connavatar_" + ((self.options.aliasIid == null) ? self.options.connectionIid : self.options.aliasIid);
		        	selfElement.attr("id", id);
		        	selfElement.addClass(Widgets.getWidgetClasses() + " connectionAvatar filterable");
		        	if (self.options.aliasIid != null) {
		        		selfElement.addClass("aliasAvatar");
		        	}
		            var img: JQ = new JQ("<img class=''/>");
		            selfElement.append(img);

		            self._updateWidgets(new Profile());

		        	if (self.options.aliasIid != null){
		        		self.filteredSetAlias = new FilteredSet<Alias>(AppContext.ALIASES,function(a:Alias):Bool{
		        			return a.iid == self.options.aliasIid;
		        		});
		        		self._onUpdateAlias = function(a:Alias, evt:EventType) {
		        			if (evt.isAddOrUpdate()) {
		        				self._updateWidgets(a.profile);
		        			} else if (evt.isDelete()) {
		        				self.destroy();
		        				selfElement.remove();
		        			}
		        		}
		        		self.filteredSetAlias.listen(self._onUpdateAlias);
		        	} else {
		        		AppContext.LOGGER.warn("AliasIid is not set for Avatar");
		        	}

		            cast(selfElement, JQTooltip).tooltip();

		            if(!self.options.dndEnabled) {
		            	img.mousedown(function(evt: JQEvent) { 
		            		untyped __js__("return false;"); 
	            		});
	            	} 
		        },

		        _updateWidgets: function(profile:Profile): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					var imgSrc: String = "media/default_avatar.jpg";
		        	if(M.getX(profile.imgSrc, "").isNotBlank() ) {
		        		imgSrc = profile.imgSrc;
		        	}

		        	selfElement.children("img").attr("src", imgSrc);
		            selfElement.attr("title", M.getX(profile.name,""));
	        	},

		        destroy: function() {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
		        	if (self.filteredSetConnection != null) {
			        	self.filteredSetConnection.removeListener(self._onUpdateConnection);
		        	}
		        	else if (self.filteredSetAlias != null) {
			        	self.filteredSetAlias.removeListener(self._onUpdateAlias);
		        	}

		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionAvatar", defineWidget());
	}	
}