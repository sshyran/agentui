package ui.api;

import ui.model.Filter;
import ui.model.ModelObj;
using m3.serialization.TypeTools;

interface ChannelMessage {
}

@:rtti
class BennuMessage implements ChannelMessage {
	public var type:String;

	public function new(type:String) {
		this.type = type;
	}
}

class DeleteMessage extends BennuMessage {
	private var primaryKey: String;

	public function new(type:String, primaryKey: String) {
		super(type);
		this.primaryKey = primaryKey;		
	}

	public static function create(object:ModelObjWithIid):DeleteMessage {
		return new DeleteMessage(object.objectType(), object.iid);
	}
}

class CrudMessage extends BennuMessage {
	private var instance: Dynamic;

	public function new(type:String, instance: Dynamic) {
		super(type);
		this.instance = instance;		
	}

	public static function create(object:ModelObjWithIid):CrudMessage {
		var instance = AppContext.SERIALIZER.toJson(object);
		return new CrudMessage(object.objectType(), instance);
	}
}

class QueryMessage extends BennuMessage {
	private var q:String;

	public function new(type:String, q:String="1=1") {
		super(type);
		this.q = q;		
	}
}

@:rtti
class RegisterMessage implements ChannelMessage {
	public var types: Array<String>;
	public function new (types:Array<String>) {
		this.types = types;
	}	
}

@:rtti
class DeregisterMessage implements ChannelMessage {
	public var handle:String;
	public function new(handle:String) {
		this.handle = handle;
	}
}


@:rtti
class IntroMessage implements ChannelMessage {
	public var aConnectionIid: String;
	public var aMessage: String;
	public var bConnectionIid: String;
	public var bMessage: String;
	public function new(i:IntroductionRequest) {
		this.aConnectionIid = i.aConnectionIid;
		this.aMessage = i.aMessage;
		this.bConnectionIid = i.bConnectionIid;
		this.bMessage = i.bMessage;
	}
}

@:rtti
class IntroResponseMessage implements ChannelMessage {
	public var notificationIid: String;
	public var accepted: Bool;

	public function new(notificationIid: String, accepted: Bool) {
		this.notificationIid = notificationIid;
		this.accepted = accepted;
	}
}

@:rtti
class GetProfileMessage implements ChannelMessage {
	public var connectionIids:Array<String>;

	public function new(?connectionIids:Array<String>) {
		this.connectionIids = (connectionIids == null) ? new Array<String>() : connectionIids;
	}
}

@:rtti
class DistributedQueryMessage implements ChannelMessage{
	public var type: String;
	public var q: String;
	public var aliasIids: Array<String>;
	public var connectionIids: Array<String>;
	public var leaveStanding: Bool;
	public var historical: Bool;

	public function new(fd:FilterData) {
		type           = fd.type;
		q              = fd.filter.q;
		aliasIids      = fd.aliasIids;
		connectionIids = fd.connectionIids;
		historical     = true;
		leaveStanding  = false;
	}
}

@:rtti
class ChannelRequestMessage {
	private var path:String;
	private var context:String;
	private var parms:Dynamic;

	public function new(path:String, context:String, msg:ChannelMessage):Void {
		this.path    = path;
		this.context = context;
		this.parms   = AppContext.SERIALIZER.toJson(msg);
	}
}

@:rtti
class ChannelRequestMessageBundle {

	private var agentId:String;
	private var channel:String;
	private var requests:Array<ChannelRequestMessage>;

	public function new(?requests_:Array<ChannelRequestMessage>, ?agentId:String) {
		this.agentId = agentId;
		if (this.agentId == null) {
			this.agentId = AppContext.AGENT.iid;
		}
		this.channel = AppContext.SUBMIT_CHANNEL;
		if (requests_ == null) {
			this.requests = new Array<ChannelRequestMessage>();
		} else {
			this.requests = requests_;
		}
	}

	public function addChannelRequest(request:ChannelRequestMessage):Void {
		this.requests.push(request);
	}

	public function addRequest(path:String, context:String, parms:BennuMessage):Void {
		var request = new ChannelRequestMessage(path, context, parms);
		this.addChannelRequest(request);
	}
}
