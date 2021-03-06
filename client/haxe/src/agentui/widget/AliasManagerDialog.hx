package agentui.widget;

import haxe.Timer;
import m3.exception.Exception;
import m3.jq.JQ;
import m3.widget.Widgets;
import m3.observable.OSet;
import m3.util.M;
import qoid.model.ModelObj;
import agentui.model.EM;
import qoid.QoidAPI;
import qoid.Qoid;
import qoid.QE;

using m3.jq.M3Dialog;
using agentui.widget.UploadComp;
using m3.helper.StringHelper;
using m3.jq.JQDialog;
using Lambda;

typedef AliasManagerDialogOptions = {
}

typedef AliasManagerDialogWidgetDef = {
	@:optional var options: AliasManagerDialogOptions;

	@:optional var aliasName: JQ;

	@:optional var leftDiv: JQ;
	@:optional var rightDiv: JQ;
	@:optional var newAliasButton: JQ;
	@:optional var aliasMap: MappedSet<Alias, JQ>;
	
	var initialized: Bool;

	var _buildDialog: Void->Void;
	var open: Void->Void;
	var _showAliasDetail: Alias->Void;
	var _showAliasEditor: Alias->Void;
	var _onAliasDeleted:  Alias->JQ->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class AliasManagerDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function aliasManagerDialog(?opts: AliasManagerDialogOptions): AliasManagerDialog;

	private static function __init__(): Void {
		var defineWidget: Void->AliasManagerDialogWidgetDef = function(): AliasManagerDialogWidgetDef {
			return {
		        initialized: false,

		        _create: function(): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AliasManagerDialog must be a div element");
		        	}

		        	selfElement.addClass("_aliasManagerDialog").hide();

					self.leftDiv  = new JQ("<div class='fleft boxsizingBorder' id='leftDiv'></div>").appendTo(selfElement);
					self.rightDiv = new JQ("<div class='fright ui-corner-all'  id='rightDiv'></div>").appendTo(selfElement);
		        	self.rightDiv.append("<h2>Aliases</h2>");
		        	var alii_div = new JQ("<div class='alii'><div>").appendTo(self.rightDiv);
		        	
 	  				self.aliasMap = new MappedSet<Alias, JQ>(Qoid.aliases, function(a: Alias):JQ {
        				return new JQ("<div class='clickable alias_link' id='a_" + a.iid + "'></div>")
        					.appendTo(alii_div)
        					.click(function(evt: JQEvent) {
        						self._showAliasDetail(a);
        					})
        					.append(a.profile.name);
 	  				});

 	  				self.aliasMap.mapListen( function(a:Alias, w:JQ, evt:EventType): Void{
 	  					if (evt.isAddOrUpdate()) {
 	  						w.html(a.profile.name);
 	  					} else if (evt.isDelete()) {
	  						self._onAliasDeleted(a, w);
 	  					}
 	  				});

	        		self.newAliasButton = new JQ("<button id='new_alias_button'>New Alias</button>")
		        		.button()
		        		.click(function(evt: JQEvent) {
		        				self._showAliasEditor(null);
		        			})
		        		.appendTo(self.rightDiv);

		        	self._showAliasDetail(Qoid.currentAlias);
		        },

		        _onAliasDeleted: function(alias:Alias, w:JQ) {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
		        	w.remove();
		        	new JQ(".alias_link")[0].click();
		        },

		        _showAliasDetail: function(alias: Alias): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
					self.leftDiv.empty();

		        	var imgSrc: String = "media/default_avatar.jpg";

	        		var loadAliasBtn: JQ = new JQ("<button class='fleft'>Use This Alias</button>")
		        		.appendTo(self.leftDiv)
		        		.button()
		        		.click( function(evt: JQEvent): Void {
	        				Qoid.currentAlias = alias;
							EM.change(QE.onAliasLoaded, alias);
	        				selfElement.close();
	        			});
	        		self.leftDiv.append("<br class='clear'/><br/>");

					if (M.getX(alias.profile.imgSrc, "").isNotBlank()) {
						imgSrc = alias.profile.imgSrc;
					}
		        	self.leftDiv.append(new JQ("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>"));

		        	self.leftDiv.append(new JQ("<h2>" + alias.profile.name + "</h2>"));

		        	var btnDiv: JQ = new JQ("<div></div>").appendTo(self.leftDiv);

		        	var setDefaultBtn: JQ = new JQ("<button>Set Default</button>")
		        		.appendTo(btnDiv)
		        		.button()
		        		.click( function(evt: JQEvent): Void {
		        			alias.data.isDefault = true;
		        			EM.change(EMEvent.UpdateAlias, alias);
		        		});

		        	var editBtn: JQ = new JQ("<button>Edit</button>")
		        		.appendTo(btnDiv)
		        		.button()
		        		.click( function(evt: JQEvent): Void {
		        				self._showAliasEditor(alias);
		        			} );

		        	var deleteBtn: JQ = new JQ("<button>Delete</button>")
		        		.appendTo(btnDiv)
		        		.button()
		        		.click( function(evt: JQEvent): Void {
	        				EM.change(EMEvent.DeleteAlias, alias);
		        		});

		        	self.newAliasButton.show();
	        	},

	        	_showAliasEditor: function(alias: Alias): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
					self.leftDiv.empty();

		        	var imgSrc: String = "media/default_avatar.jpg";

		        	self.leftDiv.append("<div id='alias_name_label'>Alias Name:</div>");
		        	var aliasName = new JQ("<input class='ui-corner-all ui-state-active ui-widget-content' id='alias_name_input'/>").appendTo(self.leftDiv);
		        	if (alias != null) {
			        	aliasName.val(alias.profile.name);
			        }
		        	self.leftDiv.append("<br/><br/>");

		        	var aliasImg: JQ = null;
					
		        	self.leftDiv.append(
		        			new JQ("<div id='profile_picture_label'>Profile Picture: </div>")
		        				.append(
		        						new JQ("<a id='change_profile_picture'>Change</a>")
		        							.click(function(evt: JQEvent): Void {
		        									var dlg: M3Dialog = new M3Dialog("<div id='profilePictureUploader'></div>");
			        								dlg.appendTo(selfElement);
			        								var uploadComp: UploadComp = new UploadComp("<div class='boxsizingBorder' style='height: 150px;'></div>");
			        								uploadComp.appendTo(dlg);
			        								uploadComp.uploadComp({
			        										onload: function(bytes: String): Void {
			        											dlg.close();
			        											aliasImg.attr("src", bytes);
			        										}
			        									});
			        								
			        								dlg.m3dialog({
			        										width: 600,
			        										height: 305,
			        										title: "Profile Image Uploader",
			        										buttons: {
			        											"Cancel" : function() {
																	M3Dialog.cur.close();
																}
			        										}
			        									});
		        								})
		        					)
		        		);
					if ( M.getX(alias.profile.imgSrc, "").isNotBlank()) {
						imgSrc = alias.profile.imgSrc;
					}
					aliasImg = new JQ("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>");
		        	self.leftDiv.append(aliasImg);
		        	
		        	self.leftDiv.append("<br/><br/>");

		        	var btnDiv = new JQ("<div></div>").appendTo(self.leftDiv);

		        	var updateBtn = new JQ("<button>" + (alias != null ? "Update":"Create") + "</button>")
		        		.appendTo(btnDiv)
		        		.button()
		        		.click( function(evt: JQEvent): Void {
		        				var name: String = aliasName.val();
		        				if(name.isBlank()) {
		        					m3.util.JqueryUtil.alert( "Alias name cannot be blank.", "Error");
		        					return;
		        				}
		        				var profilePic: String = aliasImg.attr("src");
		        				if(profilePic.startsWithAny(["media"])) profilePic = "";
		        				var applyDlg = {
		        					if(alias == null) {
		        						alias = new Alias();
				        				alias.profile.name = name;
				        				alias.profile.imgSrc = profilePic;
				        				alias.labelIid = Qoid.currentAlias.labelIid;
		        						function() {
					        				EM.listenOnce("onAddAlias", function(alias:Alias) {
						        				Timer.delay(function() {
							        				self._showAliasDetail(alias);
							        			}, 100); 
					        				});
					        				QoidAPI.createAlias(alias.profile.name, alias.profile.imgSrc);
		        						};
		        					} else {
				        				alias.profile.name   = name;
				        				alias.profile.imgSrc = profilePic;
		        						function() {
					        				EM.listenOnce("onUpdateAlias", function(alias:Alias) {
						        				self._showAliasDetail(alias);
					        				});
					        				QoidAPI.updateAliasProfile(alias.iid, name, profilePic);
		        						};
		        					}
		        				}
		        				applyDlg();
		        	});

		        	var cancelBtn: JQ = new JQ("<button>Cancel</button>")
		        		.appendTo(btnDiv)
		        		.button()
		        		.click( function(evt: JQEvent): Void {
		        				self._showAliasDetail(alias);
		        			} );

					self.newAliasButton.hide();
	        	},

		        _buildDialog: function(): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Alias Manager",
		        		height: 440,
		        		width: 550,
		        		buttons: {
		        		},
		        		close: function(evt: JQEvent, ui: UIJQDialog): Void {
		        			selfElement.find(".placeholder").removeClass("ui-state-error");
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

	        	open: function(): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	if(!self.initialized) {
		        		self._buildDialog();
		        	}
	        		selfElement.open();
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.aliasManagerDialog", defineWidget());
	}
}