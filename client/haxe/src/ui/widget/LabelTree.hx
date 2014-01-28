package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet;
import ui.widget.LabelComp;
import m3.exception.Exception;

using m3.helper.OSetHelper;

typedef LabelTreeOptions = {
	var labels: OSet<Label>;
	@:optional var itemsClass: String;
}

typedef LabelTreeWidgetDef = {
	var options: LabelTreeOptions;
	@:optional var mappedLabels: MappedSet<Label, LabelTreeBranch>;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class LabelTree extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelTree(opts: LabelTreeOptions): LabelTree;

	private static function __init__(): Void {
		var defineWidget: Void->LabelTreeWidgetDef = function(): LabelTreeWidgetDef {
			return {
		        options: {
		            labels: null,
		            itemsClass: null
		        },

		        _create: function(): Void {
		        	var self: LabelTreeWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of LabelTree must be a div element");
		        	}

		        	selfElement.addClass("labelTree boxsizingBorder " + Widgets.getWidgetClasses());

		        	self.mappedLabels = new MappedSet<Label, LabelTreeBranch>(self.options.labels, function(label: Label): LabelTreeBranch {
		        			if (label == null || label.iid == AppContext.placeHolderLabel.iid) { return null; }
		        			// If there iare no children for this label, add a placeholder
		        			if (AppContext.LCG.delegate().get(label.iid) == null) {
		        				ui.AppContext.LABELCHILDREN.add(new LabelChild(label.iid, AppContext.placeHolderLabel.iid));
		        			}

		        			var children = new MappedSet<LabelChild, Label>(
		        				AppContext.LCG.delegate().get(label.iid), 
		        				function(lc: LabelChild): Label{
		        						return AppContext.LABELS.getElement(lc.childIid);
		        					}
        					);
		        			children.visualId = "filteredLabelTree--" + label.name;
			        		
		        			return new LabelTreeBranch("<div></div>").labelTreeBranch({
		        				label: label,
	        					children: children
		        			});
		        		});
		        	self.mappedLabels.visualId = self.options.labels.getVisualId() + "_map";
		        	self.mappedLabels.listen(function(labelTreeBranch: LabelTreeBranch, evt: EventType): Void {
		        			if (labelTreeBranch == null) {return;}
		        			AppContext.LOGGER.debug(self.mappedLabels.visualId + " | LabelTree | " + evt.name() + " | New Branch");
		            		if(evt.isAdd()) {
		            			selfElement.append(labelTreeBranch);
		            		} else if (evt.isUpdate()) {
		            			labelTreeBranch.labelTreeBranch("update");
		            		} else if (evt.isDelete()) {
		            			labelTreeBranch.remove();
		            		}
		            	});
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelTree", defineWidget());
	}
}