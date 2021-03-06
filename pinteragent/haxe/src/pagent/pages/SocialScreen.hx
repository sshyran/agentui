package pagent.pages;

import m3.jq.JQ;

import pagent.PinterContext;
import pagent.widget.AliasComp;
import pagent.widget.BoardList;
import pagent.widget.OptionBar;

using m3.helper.OSetHelper;

class SocialScreen extends PinterPage {

	public function new(): Void {
		super({
			id: "#socialScreen",
			pageBeforeShowFcn: pageBeforeShowFcn, 
			pageHideFcn: pageHideFcn, 
			reqUser: true,
			showBackButton: false
		});
	}

	private function pageBeforeShowFcn(screen: JQ): Void {
		var content: JQ = new JQ(".content", screen).empty();
		content.addClass("center");

		var boardListing: BoardList = new BoardList("<div></div>");
		boardListing.appendTo(content);
		boardListing.boardList({
				boardList: PinterContext.sharedBoards
			});
	}

	private function pageHideFcn(screen: JQ): Void {
		new JQ(".content", screen).empty();
	}
	
}