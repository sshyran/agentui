package ap.widget;

import ap.APhotoContext;
import ap.AppContext;
import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.observable.OSet;
import m3.widget.Widgets;
import m3.exception.Exception;

import qoid.model.ModelObj;
import qoid.model.EM;
import ap.widget.LabelTree;
import qoid.widget.Popup;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using qoid.widget.UploadComp;
using ap.widget.ConnectionAvatar;

typedef AlbumListOptions = {
	var title: String;
}

typedef AlbumListWidgetDef = {
	@:optional var options: AlbumListOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	
	var _showNewLabelPopup: JQ->Void;

	@:optional var listenerId: String;
}

@:native("$")
extern class AlbumList extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function albumList(opts: AlbumListOptions): AlbumList;

	private static function __init__(): Void {
		var defineWidget: Void->AlbumListWidgetDef = function(): AlbumListWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: AlbumListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AlbumList must be a div element");
		        	}

		        	selfElement.addClass("_albumList");

		        	var title: JQ = new JQ("<h2>" + self.options.title + "</h2>").appendTo(selfElement);

		        	var processAliasFcn = function(alias: Alias) {
	        			// Create the top-level label tree
	        			selfElement.children(".labelTree").remove();
						var labelTree: LabelTree = new LabelTree("<div id='labels' class='labelDT'></div>").labelTree({
			                parentIid:APhotoContext.ROOT_ALBUM.iid,
			                labelPath:[alias.rootLabelIid, APhotoContext.ROOT_LABEL_OF_ALL_APPS.iid, APhotoContext.ROOT_ALBUM.iid]
			            });
			        	labelTree.insertAfter(title);
        			};

		        	self.listenerId = EM.addListener(EMEvent.AliasLoaded, processAliasFcn, "LabelsList-Alias");

		        	new JQ("<button>Add New Album</button>")
		        		.appendTo(selfElement)
		        		.button()
		        		.click(function(evt: JQEvent) {
		        				evt.stopPropagation();
			        			self._showNewLabelPopup(JQ.cur);
		        			});

	        		if(AppContext.currentAlias != null) 
	        			processAliasFcn(AppContext.currentAlias);
		        },

		       	_showNewLabelPopup: function(reference: JQ): Void {
					var self: AlbumListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div class='newLabelPopup' style='position: absolute;width:300px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var createLabel: Void->Void = null;
        						var updateLabel: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
        							if(evt.keyCode == 13) {
        								createLabel();
    								}
        						};

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn).keypress(enterFcn);
        						
        						container.append("<br/><label for='labelName'>Name: </label> ");
        						var input: JQ = new JQ("<input id='labelName' class='ui-corner-all ui-widget-content' value='New Label'/>").appendTo(container);
        						input.keypress(enterFcn).click(function(evt: JQEvent): Void {
        								evt.stopPropagation();
        								if(JQ.cur.val() == "New Label") {
        									JQ.cur.val("");
        								}
    								}).focus();
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>Add Label</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								createLabel();
        							});

        						createLabel = function(): Void {
									if (input.val().length == 0) {return;}
									AppContext.LOGGER.info("Create new label | " + input.val());
									var label: Label = new Label();
									label.name = input.val();
  									var eventData = new EditLabelData(label, APhotoContext.ROOT_ALBUM.iid);
  									EM.change(EMEvent.CreateLabel, eventData);
									new JQ("body").click();
        						};
        					},
        					positionalElement: reference
        				});

					},

		        destroy: function() {
		        	var self: AlbumListWidgetDef = Widgets.getSelf();
		        	EM.removeListener(EMEvent.AliasLoaded, self.listenerId);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.albumList", defineWidget());
	}
}