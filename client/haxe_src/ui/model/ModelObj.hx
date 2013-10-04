package ui.model;

import m3.util.ColorProvider;
import m3.util.UidGenerator;
import m3.observable.OSet;
import m3.serialization.Serialization;
import m3.exception.Exception;

import ui.helper.LabelStringParser;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using StringTools;
using Lambda;

@:rtti
class ModelObj<T> {
	@:transient public var uid: String;

	public static function identifier<T>(t: {uid: String}): String {
		return t.uid;
	}
}

class Login extends ModelObj<Login> {
	public function new () {}
	public var password: String;

	public function getUri(): String {
		return throw new Exception("don't call me!");
	}
}

class LoginByUn extends Login {
	public var email: String;
	// public var agency: String;

	override public function getUri(): String {
		// return "agent://" + username + ":" + password + "@server:9876/" + agency + "?email=george@costanza.com&fullname=George+Costanza";
		return "agent://email/" + email + "?password=" + password;
	}
}

class LoginById extends Login {
	public var uuid: String;

	override public function getUri(): String {
		return uuid + "?password=" + password;
	}
}

class NewUser extends ModelObj<NewUser> {
	public var name: String;
	public var userName: String;
	public var email: String;
	public var pwd: String;

	public function new () {}
}

class User extends ModelObj<User> {
	public var sessionURI: String;
	public var userData: UserData; 
	@:optional public var imgSrc: String;
	@:transient public var aliasSet: ObservableSet<Alias>;
	private var aliases: Array<Alias>;
	@:isVar public var currentAlias (get,set): Alias;


	public function new () {}

	private function get_currentAlias(): Alias {
		if(currentAlias == null && aliasSet != null) {
			currentAlias = aliasSet.iterator().next();
		} else if (currentAlias == null) {
			currentAlias = new Alias();
			AgentUi.LOGGER.warn("No aliases found for user.");
		}
		return currentAlias;
	}

	private function set_currentAlias(alias: Alias): Alias {
		currentAlias = alias;
		return currentAlias;
	}

	public function hasValidSession(): Bool {
		//TODO //IMPLEMENT ME
		ui.AgentUi.LOGGER.warn("implement User.hasValidSession");
		return true;
	}

	private function readResolve(): Void {
		aliasSet = new ObservableSet<Alias>(ModelObj.identifier, aliases);
	}

	private function writeResolve(): Void {
		aliases = aliasSet.asArray();
	}
}

class UserData extends ModelObj<UserData> {
	public var name: String;

	public function new() { }
}

class Alias extends ModelObj<Alias> {
	@:optional public var imgSrc: String;
	public var label: String;
	@:transient public var labelSet: ObservableSet<Label>;
	private var labels: Array<Label>;
	@:transient public var connectionSet: ObservableSet<Connection>;
	private var connections: Array<Connection>;

	@:transient var loadedFromDb: Bool = false;


	public function new () {}

	private function readResolve(): Void {
		labelSet = new ObservableSet<Label>(ModelObj.identifier, labels);
		connectionSet = new ObservableSet<Connection>(ModelObj.identifier, connections);
	}

	private function writeResolve(): Void {
		labels = labelSet.asArray();
		connections = connectionSet.asArray();
	}

	public function labelsAsString(): String {
		var sarray: Array<String> = new Array<String>();
		var topLevelLabels: FilteredSet<Label> = new FilteredSet(labelSet, function(l: Label): Bool { return l.parentUid.isBlank(); });

		topLevelLabels.iter(function(l: Label): Void {
				var s: String = "";
				var children: FilteredSet<Label> = new FilteredSet(labelSet, function(l: Label): Bool { return l.parentUid == l.uid; });
				if(children.hasValues()) {
					s += "n_" + l.text + "(" + _processLabelChildren(children) + ")";
				} else {
					s += l.text;
				}

				sarray.push(s);
			});

		var str: String = {
			if(sarray.hasValues() && sarray.length == 1) sarray[0];
			else if (sarray.hasValues()) "and(" + sarray.join(",") + ")";
			else "";
		}

		return str;
	}

	private function _processLabelChildren(set: FilteredSet<Label>): String {
		var str: String = set.fold(function(l: Label, s: String): String {
				var children: FilteredSet<Label> = new FilteredSet(labelSet, function(l: Label): Bool { return l.parentUid == l.uid; });
				if(children.hasValues()) {
					s += "n_" + l.text + "(";
					s += _processLabelChildren(children);
					s += ")";
				} else {
					s += l.text;
				}

				return s;
			},
			"");
		return str;
	}

	public function _processDataLog(str: String): Array<Label> {
		var larray: Array<Label> = new Array<Label>();
		var parser: LabelStringParser = new LabelStringParser(str);
		var term: String = parser.nextTerm();
		if(term != "and") { // there are multiple top level labels
			parser.restore(term);
		}
		larray = _processDataLogChildren(null, parser);
		return larray;
	}

	public function _processDataLogChildren(parentLabel: Label, parser: LabelStringParser): Array<Label> {
		var larray: Array<Label> = new Array<Label>();
		var term = parser.nextTerm();
		if(term == "(") { // this was the leading paren
			term = parser.nextTerm();
		}

		while(term != null && term != ")") { //continue until we hit our closing paren or we are out of data [null]
			if(term.startsWith("n_")) { // this node has children
				term = term.substring(2);
				var l: Label = new Label(term);
				l.uid = UidGenerator.create(10);
				if(parentLabel != null) l.parentUid = parentLabel.uid;
				larray.push(l);
				var children: Array<Label> = _processDataLogChildren(l, parser);
				larray = larray.concat(children);
			} else if(term.isNotBlank() && !term.contains(",")) { // this node has no children
				var l: Label = new Label(term);
				l.uid = UidGenerator.create(10);
				if(parentLabel != null) l.parentUid = parentLabel.uid;
				larray.push(l);
			}
			term = parser.nextTerm();
		}

		return larray;
	}

}

interface Filterable {

}

class Label extends ModelObj<Connection> implements Filterable {
	public var text: String;
	@:optional public var parentUid: String;

	@:transient public var color: String;

	public function new(?text: String) {
		this.text = text;
		color = ColorProvider.getNextColor();
	}
}

class Connection extends ModelObj<Connection> implements Filterable {
	public var fname: String;
	public var lname: String;
	public var imgSrc: String;

	public var src: String;
	public var trgt: String;
	public var label: String;

	public function new(?fname: String, ?lname: String, ?imgSrc: String) {
		this.fname = fname;
		this.lname = lname;
		this.imgSrc = imgSrc;
	}
}

class Content extends ModelObj<Content> {
	/**
		ContentType of this content
	*/
	public var type: ContentType;
	
	@:transient public var labelSet: ObservableSet<String>;
	@:transient public var connectionSet: ObservableSet<String>;
	
	private var labels: Array<String>;
	private var connections: Array<String>;
	
	/**
		UID of connection that created the content
	*/
	public var creator: String;

	private function readResolve(): Void {
		labelSet = new ObservableSet<String>(OSetHelper.strIdentifier, labels);
		connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier, connections);
	}

	private function writeResolve(): Void {
		labels = labelSet.asArray();
		connections = connectionSet.asArray();
	}
}

class ImageContent extends Content {
	public var imgSrc: String;
	public var caption: String;

	public function new () {}
}

class AudioContent extends Content {
	public var audioSrc: String;
	public var audioType: String;
	public var title: String;

	public function new () {}
}

class MessageContent extends Content {
	public var text: String;

	public function new () {}
}

class UrlContent extends MessageContent {
	public var url: String;
}

enum ContentType {
	AUDIO;
	IMAGE;
	URL;
	TEXT;
}