package pagent.widget;

import m3.log.Logga;
import m3.serialization.Serialization.Serializer;
import pagent.PinterContext;
import pagent.pages.PinterPage;
import pagent.pages.PinterPageMgr;
import haxe.Json;
import js.Browser;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.observable.OSet;
import pagent.model.EM;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import pagent.widget.DialogManager;
import qoid.Qoid;
import qoid.QoidAPI;
import qoid.ResponseProcessor.Response;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using m3.helper.ArrayHelper;

typedef ContentCompOptions = {
	var content: Content<Dynamic>;
}

typedef ContentCompWidgetDef = {
	@:optional var options: ContentCompOptions;
	@:optional var menu:M3Menu;
	
	var _create: Void->Void;
	var _createWidgets:JQ->ContentCompWidgetDef->Void;
	var update: Content<Dynamic>->Void;
	var destroy: Void->Void;
	
	@:optional var _onBoardCreatorProfile: Profile->EventType->Void;
	@:optional var linkListener: String;
	@:optional var removeLinkListener: Void->Void;
}

class ContentCompHelper {
	public static function content(cc: ContentComp): Content<Dynamic> {
		return cc.contentComp("option", "content");
	}

	public static function update(cc: ContentComp, c:Content<Dynamic>): Void {
		return cc.contentComp("update", c);
	}
}


@:native("$")
extern class ContentComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, param:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function contentComp(?opts: ContentCompOptions): ContentComp;

	private static function __init__(): Void {
		var defineWidget: Void->ContentCompWidgetDef = function(): ContentCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ContentComp must be a div element");
		        	}

		        	selfElement.addClass("contentComp ui-corner-all " + Widgets.getWidgetClasses());
		        	selfElement.click(function(evt: JQEvent){
		        		//go to post page
		        		PinterContext.CURRENT_MEDIA = self.options.content.iid;
		        		PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.CONTENT_SCREEN;
		        		// Browser.window.history.pushState(
	           //  				{}, 
	           //  				self.options.content.iid,
	           //  				Browser.window.history.state. +"&media=" + self.options.content.iid
            // 				);
		        	});

		        	self._createWidgets(selfElement, self);

		        	// EM.addListener(EMEvent.EditContentClosed, function(content: Content<Dynamic>): Void {
		        	// 	if (content.iid == self.options.content.iid) {
		        	// 		selfElement.show();
		        	// 	}
		        	// });
		        },

				_createWidgets: function(selfElement: JQ, self: ContentCompWidgetDef): Void {


					var c: Content<Dynamic> = self.options.content;

					var fcn: Content<Dynamic>->Void = null;
					fcn = function(content: Content<Dynamic>) {
						selfElement.empty();
						var captionDiv: JQ = new JQ("<div class='caption ui-corner-bottom'></div>");
						var addCptDiv = function() {
							captionDiv.appendTo(selfElement);
				        	var creatorDiv: JQ = new JQ("<div class='creatorDiv' style='min-height: 17px;'></div>").insertBefore(captionDiv);

				        	self._onBoardCreatorProfile = function(p: Profile, evt: EventType) {
								if(evt.isAddOrUpdate()) {
									if(p.connectionIid == content.connectionIid) {
										creatorDiv.empty().append("<i>created by</i> <b>" + p.name + "</b>");
									}

								}
							}
							Qoid.profiles.listen(self._onBoardCreatorProfile);
						}

						switch(content.contentType) {
			        		case ContentTypes.IMAGE:
			        			var img: ImageContent = cast(content, ImageContent);
			        			selfElement.append("<div class='imgDiv ui-corner-top'><img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/></div>");
								if(img.props.caption.isNotBlank()) {
									captionDiv.append(img.props.caption);
								} else {
									// captionDiv.append( html : String )
								}
								addCptDiv();
							case ContentTypes.TEXT:
								var text: MessageContent = cast(content, MessageContent);
								selfElement.append("<div class='msgDiv'>" + text.props.text + "</div>");
								addCptDiv();
							case ContentTypes.LINK:
								selfElement.hide();
								var link: LinkContent = cast(content, LinkContent);
								var route: Array<String> = {
									if(content.connectionIid == Qoid.currentAlias.connectionIid)
										link.props.route;
									else 
										[content.connectionIid].concat(link.props.route);
								}
								QoidAPI.query(
									new RequestContext("contentLink_" + link.props.contentIid, "_contentComp"), 
									"content", 
									"iid = '" + link.props.contentIid + "'" ,
									true, true, 
									route
								);
								self.linkListener = EM.addListener(
									"onContentLink_" + link.props.contentIid, 
									function(response: Response){
										var reqCtx: RequestContext = Serializer.instance.fromJsonX(response.context, RequestContext);
										if(reqCtx.handle == "_contentComp" && response.result.results.hasValues()) {
											var c: Content<Dynamic> = Serializer.instance.fromJsonX(response.result.results[0], Content);
											c.connectionIid = link.props.route[0];
											selfElement.show();
											fcn(c);
											
										}
									}, 
									"ContentComp-Link-" + link.props.contentIid	 
								);
	 							self.removeLinkListener = function() {
	 								EM.removeListener("onContentLink_" + link.props.contentIid, self.linkListener);
	 							}
			        		case _:
			        			Logga.DEFAULT.warn("Unsupported content type"); 
			        	}
					}

		        	fcn(c);
				},
		        
		        update: function(content:Content<Dynamic>) : Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					self.options.content = content;
        			self._createWidgets(selfElement, self);
        			selfElement.show();
		        },

		        destroy: function() {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
		        	Qoid.profiles.removeListener(self._onBoardCreatorProfile);
		        	if(self.linkListener.isNotBlank()) {
		        		self.removeLinkListener();
		        	}
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentComp", defineWidget());
	}
}