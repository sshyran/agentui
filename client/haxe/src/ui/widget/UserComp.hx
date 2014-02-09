
package ui.widget;

import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.observable.OSet;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import ui.widget.UploadComp;
import ui.widget.ConnectionAvatar;
import m3.util.M;
import m3.exception.Exception;
import m3.util.JqueryUtil;

using m3.helper.StringHelper;
using ui.widget.UploadComp;
using ui.widget.ConnectionAvatar;

typedef UserCompOptions = {
}

typedef UserCompWidgetDef = {
	@:optional var options: UserCompOptions;
	var _create: Void->Void;
	var _setUser: Void->Void;
	var _setTarget: Connection->Void;
	var _createAliasMenu: UserCompWidgetDef->OSet<Alias>->M3Menu;
	var destroy: Void->Void;

	@:optional var container: JQ;
	@:optional var userImg: JQ;
	@:optional var userIdTxt: JQ;
	@:optional var switchAliasLink: JQ;
}

@:native("$")
extern class UserComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function userComp(?opts: UserCompOptions): UserComp;

	private static function __init__(): Void {
		var defineWidget: Void->UserCompWidgetDef = function(): UserCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of UserComp must be a div element");
		        	}

		        	selfElement.addClass("ocontainer shadow ");
		        	self.container = new JQ("<div class='container'></div>");
		        	selfElement.append(self.container);
		        	self._setUser();//init the components

		        	EM.addListener(EMEvent.AliasLoaded, new EMListener(function(alias: Alias): Void {
		        			self._setUser();
		        		}, "UserComp-Alias")
		        	);

		        	cast(self.container, JQDroppable).droppable({
							accept: function(d) {
				    			return d.is(".connectionAvatar");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	drop: function( event: JQEvent, _ui: UIDroppable ) {
					      		// Check to see if the element being dropped is already in the container
					      		var dragstop = function(dragstopEvt: JQEvent, dragstopUi: UIDraggable): Void {
				                	if(!self.container.intersects(dragstopUi.helper)) {
				                		dragstopUi.helper.remove();
				                		selfElement.removeClass("targetChange");
				                		JqueryUtil.deleteEffects(dragstopEvt);
				                		AppContext.TARGET = null;
				                		self._setUser();
				                	}
				                };

				                selfElement.addClass("targetChange");

				                var clone: ConnectionAvatar = _ui.draggable.data("clone")(_ui.draggable, false, false, dragstop);
				                clone.addClass("small");
				                
			                	clone.insertBefore(new JQ(".ui-helper-clearfix", self.container));

			                	self._setTarget(clone.getConnection());
					      	}
						});
		        },

		       	_createAliasMenu: function(self: UserCompWidgetDef, aliases:OSet<Alias>) : M3Menu {
		        	var menu: M3Menu = new M3Menu("<ul id='userAliasMenu'></ul>");
		        	menu.appendTo(self.container);

		        	var menuOptions:Array<MenuOption> = [];

					var menuOption: MenuOption;

					for (alias in aliases) {
						menuOption = {
							label: alias.name,
							icon: "ui-icon-person",
							action: function(evt: JQEvent, m: M3Menu): Void {
								if (Alias.identifier(AppContext.currentAlias) == Alias.identifier(alias)) {
									menu.hide();
								} else {
    								AppContext.currentAlias = alias;
    								EM.change(EMEvent.AliasLoaded, alias);
    							}
							}
						};
						menuOptions.push(menuOption);
					}

					menuOption = {
						label: "Manage Aliases...",
						icon: "ui-icon-circle-plus",
						action: function(evt: JQEvent, m: M3Menu): Void {
			        		ui.widget.DialogManager.showAliasManager();
						}
					};
					menuOptions.push(menuOption);

        			menu.m3menu({menuOptions:menuOptions}).hide();

					return menu;
		       	},


		        _setUser: function(): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					self.container.empty();
					var imgSrc: String = "media/test/koi.jpg";
					if ( M.getX(AppContext.currentAlias.data.imgSrc, "").isNotBlank()) {
						imgSrc = AppContext.currentAlias.data.imgSrc;
					}

		        	self.userImg = new JQ("<img alt='user' src='" + imgSrc + "' class='userImg shadow'/>");
		        	self.container.append(self.userImg);

		        	self.userIdTxt = new JQ("<div class='userIdTxt'></div>");
		        	self.container.append(self.userIdTxt);
		        	var name: String = M.getX(AppContext.AGENT.data.name, "");
		        	var aliasLabel: String = M.getX(AppContext.currentAlias.name, "");
		        	if(aliasLabel.isBlank()) aliasLabel = "";
		        	self.userIdTxt
		        		.append("<strong>" + name + "</strong>")
		        		.append("<br/>")
		        		.append("<font style='font-size:12px'>" + aliasLabel + "</font>");
		        	var changeDiv: JQ = new JQ("<div class='ui-helper-clearfix'></div>");
	        		self.container.append(changeDiv);

		        	self.switchAliasLink = new JQ("<a class='aliasToggle'>Aliases</a>");
	        		changeDiv.append(self.switchAliasLink);

	        		var aliasMenu = self._createAliasMenu(self, AppContext.ALIASES);

		        	self.switchAliasLink.click(function(evt: JQEvent): Dynamic {
		        		// ui.widget.DialogManager.showAliasManager();
	        			aliasMenu.show();
	        			aliasMenu.position({
		        			my: "left top",
		        			at: "right-6px center",
		        			of: selfElement
		        		});

						evt.preventDefault();
	        			evt.stopPropagation();
	        			return false;
		        	});
	        	},

	        	_setTarget: function(conn: Connection): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
		        	self.switchAliasLink.hide();
	        		self.userIdTxt
	        			.empty()
		        		.append("<strong>" + conn.name() + "</strong>");

		        	AppContext.TARGET = conn;
	        		EM.change(EMEvent.TARGET_CHANGE, conn);
        		},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.userComp", defineWidget());
	}
}