// package qoid.model;

// import pagent.AppContext;
// import pagent.model.EM;

// import m3.util.ColorProvider;
// import m3.util.UidGenerator;
// import m3.observable.OSet;
// import m3.serialization.Serialization;
// import m3.exception.Exception;

// using m3.serialization.TypeTools;
// using m3.helper.ArrayHelper;
// using m3.helper.OSetHelper;
// using m3.helper.StringHelper;
// import DateTools;
// import pagent.PinterContext;
// using StringTools;
// using Lambda;

// @:rtti
// class ModelObj {

// 	public function new() {
// 	}

// 	public function objectType():String {
// 		var className = this.clazz().classname().toLowerCase();
// 		var parts = className.split(".");
// 		return parts[parts.length-1];
// 	}
// }

// class ModelObjWithIid extends ModelObj {
// 	public var iid: String;
// 	public var created:Date;
// 	public var modified:Date;
// 	public var createdByAliasIid:String;
// 	public var modifiedByAliasIid:String;

// 	public function new() {
// 		super();
// 		this.iid = UidGenerator.create(32);
// 		this.created = Date.now();
// 		this.modified = Date.now();
// 	}

// 	public static function identifier(t: ModelObjWithIid): String {
// 		return t.iid;
// 	}
// }

// class Profile extends ModelObjWithIid {
// 	public var sharedId:String;
// 	public var aliasIid:String;
// 	public var name: String;
// 	@:optional public var imgSrc: String;
// 	@:transient public var connectionIid:String;

// 	public function new(?name:String, ?imgSrc:String, ?aliasIid:String) {
// 		super();
// 		this.name   = (name == null)   ? "Unknown"       : name;
// 		this.imgSrc = (imgSrc == null) ? "media/koi.jpg" : imgSrc;
// 		this.aliasIid = aliasIid;
// 	}
// 	public static function identifier(profile: Profile): String {
// 		return profile.iid;
// 	}
// }

// class AliasData extends ModelObj {
// 	@:optional public var isDefault:Bool;
// 	public function new() {
// 		super();
// 		this.isDefault = false;
// 	}
// }

// class Alias extends ModelObjWithIid {
// 	public var rootLabelIid:String;
// 	public var name:String;
// 	@:transient public var profile: Profile;
// 	@:optional public var data: AliasData;

// 	public function new() {
// 		super();
// 		this.profile = new Profile();
// 		this.data = new AliasData();
// 	}
	
// 	public static function identifier(alias: Alias): String {
// 		return alias.iid;
// 	}
// }

// class LabelData extends ModelObj {
// 	public var color:String;
// 	public function new() {
// 		super();
// 		this.color = ColorProvider.getNextColor();
// 	}
// }

// class Label extends ModelObjWithIid {
// 	public var name: String;
// 	@:optional public var data: LabelData;
// 	@:transient public var labelChildren:OSet<LabelChild>;

// 	public function new(?name: String) {
// 		super();
// 		this.name = name;
// 		this.data = new LabelData();
// 	}

// 	public static function identifier(l: Label): String {
// 		return l.iid;
// 	}
// }

// class LabelChild extends ModelObjWithIid {
// 	public var parentIid: String;
// 	public var childIid: String;
// 	@:optional public var data: Dynamic;

// 	public function new(?parentIid: String, ?childIid: String) {
// 		if (parentIid != null && childIid != null && parentIid == childIid) {
// 			throw new Exception("parentIid and childIid of LabelChild must be different");
// 		}
// 		super();
// 		this.parentIid = parentIid;
// 		this.childIid  = childIid;
// 	}

// 	public static function identifier(l: LabelChild): String {
// 		return l.iid;
// 	}
// }

// class LabelAcl extends ModelObjWithIid {
// 	public var connectionIid: String;
//   	public var labelIid: String;

// 	public function new(?connectionIid: String, ?labelIid: String) {
// 		super();
// 		this.connectionIid = connectionIid;
// 		this.labelIid  = labelIid;
// 	}

// 	public static function identifier(l: LabelAcl): String {
// 		return l.iid;
// 	}
// }

// class Connection extends ModelObjWithIid {
// 	public var aliasIid:String;
// 	public var localPeerId: String;
//   	public var remotePeerId: String;
// 	public var allowedDegreesOfVisibility:Int;
//   	public var metaLabelIid: String;
// 	@:optional public var data:Profile;

// 	public static function identifier(c: Connection): String {
// 		return c.iid;
// 	}

// 	public function new() {
// 		super();
// 		this.data = new Profile("-->*<--", "");
// 	}

// 	public function equals(c: Connection): Bool {
// 		return this.iid == c.iid;
// 	}
// }

// //-------------------------------------------------------------------------------------
// // Content
// //-------------------------------------------------------------------------------------

// class ContentType {
// 	public static var AUDIO = "AUDIO";
// 	public static var IMAGE = "IMAGE";
// 	public static var URL = "URL";
// 	public static var TEXT = "TEXT";
// 	public static var VERIFICATION = "VERIFICATION";
// 	public static var CONFIG = PinterContext.APP_ROOT_LABEL_NAME + ".config";
// }


// class ContentHandler implements TypeHandler {
	
//     public function new() {
//     }

//     public function read(fromJson: {contentType: String}, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
//         var obj: Content<Dynamic> = null;

//         switch ( fromJson.contentType ) {
//         	case ContentType.AUDIO:
//         		obj = AppContext.SERIALIZER.fromJsonX(fromJson, AudioContent);
//         	case ContentType.IMAGE:
//         		obj = AppContext.SERIALIZER.fromJsonX(fromJson, ImageContent);
//         	case ContentType.TEXT:
//         		obj = AppContext.SERIALIZER.fromJsonX(fromJson, MessageContent);
//         	case ContentType.URL:
//         		obj = AppContext.SERIALIZER.fromJsonX(fromJson, UrlContent);
//         	case ContentType.VERIFICATION:
//         		obj = AppContext.SERIALIZER.fromJsonX(fromJson, VerificationContent);
//         }

//         return obj;
//     }

//     public function write(value: Dynamic, writer: JsonWriter): Dynamic {
//         return AppContext.SERIALIZER.toJson(value);
//     }
// }

// class ContentFactory {
// 	public static function create(contentType:String, data:Dynamic):Content<Dynamic> {
// 		var ret:Content<Dynamic> = null;

// 		switch (contentType) {
//         	case ContentType.AUDIO:
//         		var ac = new AudioContent();
//         		ac.props.audioSrc = cast(data, String);
//         		ret = ac;
//         	case ContentType.IMAGE:
//         		var ic = new ImageContent();
//         		ic.props.imgSrc = cast(data, String);
//         		ret = ic;
//         	case ContentType.TEXT:
//         		var mc = new MessageContent();
//         		mc.props.text = cast(data, String);
//         		ret = mc;
//         	case ContentType.URL:
//         		var uc = new UrlContent();
//         		uc.props.url = cast(data, String);
//         		ret = uc;
//         	case ContentType.VERIFICATION:
//         		var uc = new VerificationContent();
//         		uc.props.text = cast(data, String);
//         		ret = uc;
//     		case ContentType.CONFIG:
//         		var mc = new ConfigContent();
//         		mc.props.defaultImg = cast(data, String);
//         		ret = mc;
//         }
//         return ret;
// 	}
// }

// class LabeledContent extends ModelObjWithIid {
//   	public var contentIid: String;
//   	public var labelIid: String;
// 	@:optional public var data: Dynamic;

// 	public static function identifier(l: LabeledContent): String {
// 		return l.iid;
// 	}

// 	public function new(contentIid: String, labelIid: String) {
// 		super();
// 		this.contentIid = contentIid;
// 		this.labelIid  = labelIid;
// 	}
// }

// @:rtti
// class ContentData {
// 	public function new() {
// 	}
// }

// @:rtti
// class ContentVerification {
// 	public var verifierId:String;
//     public var verificationIid:String;
//     public var hash:Dynamic;
//     public var hashAlgorithm:String;
// }

// @:rtti
// class VerifiedContentMetaData {
//     public var hash:Dynamic;
//     public var hashAlgorithm:String;
// }

// @:rtti
// class ContentMetaData {
// 	@:optional public var verifications: Array<ContentVerification>;
// 	@:optional public var verifiedContent: VerifiedContentMetaData;

// 	public function new() {
// 		this.verifications = new Array<ContentVerification>();
// 	}
// }

// class Content<T:(ContentData)> extends ModelObjWithIid {
// 	public var contentType: String;
// 	@:optional public var aliasIid: String;
// 	@:optional public var connectionIid: String;
// 	@:optional public var metaData:ContentMetaData;

// 	private var data:Dynamic;
// 	@:transient public var props: T;

// 	@:transient var type: Class<T>;

// 	public function new (contentType:String, type: Class<T>) {
// 		super();
// 		this.contentType = contentType;
// 		this.aliasIid = (AppContext.currentAlias == null) ? null : AppContext.currentAlias.iid;
// 		this.data = {};
// 		this.type = type;
// 		this.props = Type.createInstance(type, []);
// 		this.metaData = new ContentMetaData();
// 	}

// 	// For testing only	
// 	public function setData(data:Dynamic) {
// 		this.data = data;
// 	}

// 	private function readResolve(): Void {
// 		this.props = AppContext.SERIALIZER.fromJsonX(this.data, this.type);
// 	}

// 	private function writeResolve(): Void {
// 		this.data = AppContext.SERIALIZER.toJson(this.props);
// 	}

// 	public function getTimestamp(): String {
// 		return DateTools.format(this.created, "%Y-%m-%d %T");
// 	}

// 	override public function objectType():String {
// 		return "content";
// 	}
// }

// class ImageContentData extends ContentData {
// 	public var imgSrc: String;
// 	@:optional public var caption: String;

// 	public function new() {
// 		super();
// 	}
// }

// class ImageContent extends Content<ImageContentData> {
// 	public function new () {
// 		super(ContentType.IMAGE, ImageContentData);
// 	}
// }

// class AudioContentData extends ContentData {
// 	public var audioSrc: String;
// 	@:optional public var audioType: String;
// 	@:optional public var title: String;

// 	public function new () {
// 		super();
// 	}
// }

// class AudioContent extends Content<AudioContentData> {
// 	public function new () {
// 		super(ContentType.AUDIO, AudioContentData);
// 	}
// }

// class MessageContentData extends ContentData {
// 	public var text: String;

// 	public function new () {
// 		super();
// 	}
// }

// class MessageContent extends Content<MessageContentData> {
// 	public function new () {
// 		super(ContentType.TEXT, MessageContentData);
// 	}
// }

// class ConfigContentData extends ContentData {
// 	public var defaultImg: String;

// 	public function new () {
// 		super();
// 	}
// }

// class ConfigContent extends Content<ConfigContentData> {
// 	public function new () {
// 		super(ContentType.CONFIG, ConfigContentData);
// 	}
// }

// class UrlContentData extends ContentData {
// 	public var url: String;
// 	@:optional public var text: String;

// 	public function new () {
// 		super();
// 	}	
// }

// class UrlContent extends Content<UrlContentData> {
// 	public function new () {
// 		super(ContentType.URL, UrlContentData);
// 	}
// }

// class VerificationContentData extends ContentData {
// 	public var text: String;
// 	public var created: Date;
// 	public var modified: Date;
// 	public function new () {
// 		super();
// 	}	
// }

// class VerificationContent extends Content<VerificationContentData> {
// 	public function new () {
// 		super(ContentType.VERIFICATION, VerificationContentData);
// 	}
// }

// //----------------------------------------------------------------
// // Notifications
// //----------------------------------------------------------------

// class NotificationHandler implements TypeHandler {
	
//     public function new() {
//     }

//     public function read(fromJson: {kind: String}, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
//         var obj: Notification<Dynamic> = null;

//         switch (NotificationKind.createByName(fromJson.kind) ) {
//         	case NotificationKind.IntroductionRequest:
//         		obj = AppContext.SERIALIZER.fromJsonX(fromJson, IntroductionRequestNotification);
//         	case NotificationKind.VerificationRequest:
//         		obj = AppContext.SERIALIZER.fromJsonX(fromJson, VerificationRequestNotification);
//         	case NotificationKind.VerificationResponse:
//         		obj = AppContext.SERIALIZER.fromJsonX(fromJson, VerificationResponseNotification);
//         }

//         return obj;
//     }

//     public function write(value: Dynamic, writer: JsonWriter): Dynamic {
//         return AppContext.SERIALIZER.toJson(value);
//     }
// }

// enum NotificationKind {
//     IntroductionRequest;
//     VerificationRequest;
//     VerificationResponse;
// }

// class Notification<T> extends ModelObjWithIid {
// 	public var consumed: Bool;
// 	public var fromConnectionIid: String;  
// 	public var kind: NotificationKind;
// 	private var data:Dynamic;
// 	@:transient public var props: T;

// 	@:transient var type: Class<T>;

// 	override public function objectType():String {
// 		return "notification";
// 	}

// 	public function new (kind:NotificationKind, type: Class<T>) {
// 		super();
// 		this.kind = kind;
// 		this.data = {};
// 		this.type = type;
// 		this.props = Type.createInstance(type, []);
// 	}

// 	private function readResolve(): Void {
// 		this.props = AppContext.SERIALIZER.fromJsonX(this.data, this.type);
// 	}

// 	private function writeResolve(): Void {
// 		this.data = AppContext.SERIALIZER.toJson(this.props);
// 	}
// }



// enum IntroductionState {
// 	NotResponded;
//     Accepted;
//     Rejected;
// }

// class IntroductionRequest extends ModelObjWithIid {
// 	public var aConnectionIid: String;
// 	public var bConnectionIid: String;
// 	public var aMessage: String;
// 	public var bMessage: String;
// }

// class Introduction extends ModelObjWithIid {
// 	public var aConnectionIid: String;
// 	public var bConnectionIid: String;
// 	public var aState: IntroductionState;
// 	public var bState: IntroductionState;
// 	public var recordVersion:Int;
// }


// class IntroductionRequestNotification extends Notification<IntroductionRequestData> {
// 	public function new () {
// 		super(NotificationKind.IntroductionRequest, IntroductionRequestData);
// 	}
// }
// 	@:rtti
// 	class IntroductionRequestData {
// 		public var introductionIid: String;
// 		public var message: String;
// 		public var profile: Profile;
// 		@:optional public var accepted:Bool;
// 	}

// class VerificationRequestNotification extends Notification<VerificationRequestData> {
// 	public function new () {
// 		super(NotificationKind.VerificationRequest, VerificationRequestData);
// 	}
// }
// 	@:rtti
// 	class VerificationRequestData {
// 		public var contentIid:String;
//     	public var contentType:ContentType;
//     	public var contentData:Dynamic;
//     	public var message:String;


//     	@:transient public function getContent():Content<Dynamic> {
//     		try {
// 	    		var fromJson:Dynamic = {
// 	    			iid: contentIid,
// 	    			contentType: Std.string(this.contentType),
// 	    			data:this.contentData,
// 	    			created:Date.now().toString(),
// 					modified:Date.now().toString(),
// 					createdByAliasIid:"Chewbaca",
// 					modifiedByAliasIid:"PizzaTheHut"
// 	    		};
// 	    		return AppContext.SERIALIZER.fromJsonX(fromJson, Content);
// 	    	} catch (e:Dynamic) {
// 	    		AppContext.LOGGER.error(e);
// 	    		throw e;
// 	    	}
//     	}
// 	}

// class VerificationResponseNotification extends Notification<VerificationResponseData> {
// 	public function new () {
// 		super(NotificationKind.VerificationResponse, VerificationResponseData);
// 	}
// }

// 	@:rtti
// 	class VerificationResponseData {
// 		public var contentIid:String;
//     	public var verificationContentIid:String;
//     	public var verificationContentData:Dynamic;
//     	public var verifierId:String;
// 	}

// //-------------------------------------------------------------------
// // Classes used to copy data around

// class Login extends ModelObj {
// 	public function new () {
// 		super();
// 	}
// 	public var agentId:String;
// 	public var password: String;
// }

// class NewUser extends ModelObj {
// 	public var name: String;
// 	public var userName: String;
// 	public var email: String;
// 	public var pwd: String;

// 	public function new () {
// 		super();
// 	}
// }

// class EditLabelData {
// 	public var label:Label;
// 	public var parentIid:String;
// 	public var newParentId:String;

// 	public function new(label:Label, ?parentIid:String, ?newParentId) {
// 		this.label = label;
// 		this.parentIid = parentIid;
// 		this.newParentId = newParentId;
// 	}
// }

// class EditContentData {
// 	public var content:Content<Dynamic>;
// 	public var labelIids:Array<String>;

// 	public function new(content:Content<Dynamic>, ?labelIids:Array<String>) {
// 		this.content = content;
// 		if (labelIids == null) {
// 			labelIids = new Array<String>();
// 		}
// 		this.labelIids = labelIids;
// 	}
// }

// class VerificationRequest {
//     public var contentIid:String;
//     public var connectionIids:Array<String>;
//     public var message:String;

//     public function new(contentIid:String, connectionIids:Array<String>, message:String) {
//     	this.message        = message; 
//     	this.contentIid     = contentIid;
//     	this.connectionIids = connectionIids;
//     }
// }

// class VerificationResponse {
// 	public var notificationIid:String;
//     public var verificationContent:String;
//     public function new(notificationIid:String, verificationContent:String) {
//     	this.notificationIid     = notificationIid; 
//     	this.verificationContent = verificationContent;
//     }
// }



// class Verification {
// 	public var connectionIid:String;
//     public var contentIid:String;
//     public var contentData:Content<Dynamic>;
//     public var verificationContent:String;
// }