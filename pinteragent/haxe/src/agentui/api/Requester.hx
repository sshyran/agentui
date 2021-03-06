package agentui.api;

import haxe.Timer;

import m3.comm.BaseRequest;
import m3.exception.Exception;
import m3.jq.JQ;
import m3.serialization.Serialization.Serializer;
import m3.util.JqueryUtil;

import qoid.model.ModelObj;
import agentui.api.CrudMessage;

/**
 * Base class for making http requests.
 */
class SimpleRequest extends BaseRequest {
	public function new(path:String, data:String, successFcn: Dynamic->Void) {
		baseOpts = {
			async: true,
			url: path 
		};

		super(data, path, successFcn);
	}
}

class SubmitRequest extends BaseRequest {
	public function new(msgs:Array<ChannelRequestMessage>,
		                ?successFcn: Dynamic->Void) {
		this.baseOpts = {
			dataType: "text",
			async: true,
			url: "/api/channel/submit" 
		};

		if (successFcn == null) {
			successFcn = function(data: Dynamic):Void {
			};
		}

		var bundle = new ChannelRequestMessageBundle(msgs);
		var data = Serializer.instance.toJsonString(bundle);

		super(data, "/api/channel/submit", successFcn);
	}
}

