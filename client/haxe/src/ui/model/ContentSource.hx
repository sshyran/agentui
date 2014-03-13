package ui.model;

import m3.observable.OSet;
import ui.model.EM;
import ui.model.ModelObj;
import ui.model.Filter;


class ContentSource<T> {
	var filteredContent: ObservableSet<Content<Dynamic>>;
	var contentMap: MappedSet<Content<Dynamic>, T>;
	var mapListener: Content<Dynamic>->T->EventType->Void;
	var widgetCreator:Content<Dynamic>->T;
	var onBeforeSetContent:OSet<Content<Dynamic>>->Void;

	var filterIid:String;

	public function new(mapListener:Content<Dynamic>->T->EventType->Void, 
		               onBeforeSetContent:OSet<Content<Dynamic>>->Void,
		               widgetCreator:Content<Dynamic>->T) 
	{
		this.mapListener = mapListener;
		this.onBeforeSetContent = onBeforeSetContent;
		this.widgetCreator = widgetCreator;
		this.filterIid = null;

    	EM.addListener(EMEvent.AliasLoaded, this.onAliasLoaded, 
    		                                "ContentSource-AliasLoaded"
    	);

    	EM.addListener(EMEvent.LoadFilteredContent, this.onLoadFilteredContent, 
    		                                        "ContentSource-LoadFilteredContent"
    	);
	}

	private function onLoadFilteredContent(fr: FilterResponse): Void {
		if (this.filterIid == fr.filterIid) {
			this.filteredContent.addAll(fr.content.asArray());
    	} else {
    		this.filterIid = fr.filterIid;
    		this.filteredContent = fr.content;
    		this.setContent(fr.content);
    	}
    }

	private function onAliasLoaded(alias:Alias) {
		this.filterIid = null;
        setContent(new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier));
	}

	private function setContent(content:OSet<Content<Dynamic>>) {
		this.onBeforeSetContent(content);
		this.cleanup();

    	this.contentMap = new MappedSet<Content<Dynamic>, T>(content, function(content: Content<Dynamic>): T {
			return widgetCreator(content);
		});
    	this.contentMap.mapListen(this.mapListener);
    }

    public function cleanup() {
    	if (this.contentMap != null) {
    		this.contentMap.removeListeners(this.mapListener);
    	}    	
    }
}