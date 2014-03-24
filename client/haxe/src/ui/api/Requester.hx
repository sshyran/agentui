package ui.api;

import haxe.Timer;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.util.JqueryUtil;

import ui.model.ModelObj;
import ui.api.CrudMessage;

/**
 * Base class for making http requests.
 */
class BaseRequest {
	private var requestData:String;
	private var onSuccess: Dynamic->String->JQXHR->Void;
	private var onError: JQXHR->String->String->Void;
	private var baseOpts:AjaxOptions;

	public function new(requestData: String, successFcn: Dynamic->String->JQXHR->Void, ?errorFcn: JQXHR->String->String->Void) {
		this.requestData = requestData;
		this.onSuccess   = successFcn;
		this.onError     = errorFcn;
	}

	public function start(?opts: AjaxOptions): Dynamic {
		// NB:  url must be passed in through opts
		var ajaxOpts: AjaxOptions = {
	        dataType: "json", 
	        contentType: "application/json",
	        data: requestData,
	        type: "POST",
			success: function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR) {
				SystemStatus.instance().onMessage();
   				if (jqXHR.getResponseHeader("Content-Length") == "0") {
   					return;
   				}
				onSuccess(data, textStatus, jqXHR);
			},
   			error: function(jqXHR:JQXHR, textStatus:String, errorThrown:Dynamic) {
   				if (jqXHR.getResponseHeader("Content-Length") == "0") {
   					return;
   				}

				var error_message:String = "";

				if (errorThrown == null || Std.is(errorThrown, String)) {
					error_message = errorThrown;

					if (jqXHR.message != null) {
						error_message = jqXHR.message;
					} else if (jqXHR.responseText != null && jqXHR.responseText.charAt(0) != "<") {
						error_message = jqXHR.responseText;
					}
		   		} else {
		   			error_message = textStatus + ":  " + errorThrown.message;
		   		}

   				if (onError != null) {
   					onError(jqXHR, textStatus, errorThrown);
   				} else {
	   				JqueryUtil.alert("There was an error making your request:  " + error_message);
	   				throw new Exception("Error executing ajax call | Response Code: " + jqXHR.status + " | " + error_message);
	   			}
			}
        };

        JQ.extend(ajaxOpts, baseOpts);
        if (opts != null) {
        	JQ.extend(ajaxOpts, opts);
        }
		return JQ.ajax(ajaxOpts);
	}

	public function abort(): Void {
	}
}

class BennuRequest extends BaseRequest {
	public function new(path:String, data:String, successFcn: Dynamic->String->JQXHR->Void) {
		baseOpts = {
			async: true,
			url: AgentUi.URL + path 
		};

		super(data, successFcn);
	}
}

class SubmitRequest extends BaseRequest {
	public function new(msgs:Array<ChannelRequestMessage>,
		                ?successFcn: Dynamic->String->JQXHR->Void) {
		this.baseOpts = {
			dataType: "text",
			async: true,
			url: AgentUi.URL + "/api/channel/submit" 
		};

		if (successFcn == null) {
			successFcn = function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR) {
			};
		}

		var bundle = new ChannelRequestMessageBundle(msgs);
		var data = AppContext.SERIALIZER.toJsonString(bundle);

		super(data, successFcn);
	}
}

class CrudRequest extends BaseRequest {

	public function new(object:ModelObjWithIid, path:String, successFcn: Dynamic->String->JQXHR->Void):Void {
		var crudMessage = CrudMessage.create(object);

		baseOpts = {
			async: true,
			url: AgentUi.URL + path
		};
		super(AppContext.SERIALIZER.toJsonString(crudMessage), successFcn);
	}
}

class UpsertRequest extends CrudRequest {
	public function new(object:ModelObjWithIid, successFcn: Dynamic->String->JQXHR->Void):Void {
		super(object, "/api/upsert", successFcn);
	}	
}

class DeleteRequest extends CrudRequest {
	public function new(object:ModelObjWithIid, successFcn: Dynamic->String->JQXHR->Void):Void {
		super(object, "/api/delete", successFcn);
	}	
}

class LongPollingRequest extends BaseRequest {

	private var jqXHR: Dynamic;
	private var running: Bool = true;
	private var delayNextPoll: Bool = false;

	public var timeout:Int = 30000;

	public function new(requestToRepeat: String, successFcn: Dynamic->String->JQXHR->Void, ?ajaxOpts:AjaxOptions) {
		baseOpts = {
	        complete: function(jqXHR:JQXHR, textStatus:String): Void {
	        	this.poll();
        	}
        };

        if (ajaxOpts != null) {
    		JQ.extend(baseOpts, ajaxOpts);
    	}

		var wrappedSuccessFcn = function(data: Dynamic, textStatus: String, jqXHR: JQXHR) {
			SystemStatus.instance().onMessage();
			if (running) {
				try {
					successFcn(data, textStatus, jqXHR);
				} catch (e:Exception) {
					AppContext.LOGGER.error("Error while polling", e);
				}
			}
		};
		var errorFcn = function(jqXHR:JQXHR, textStatus:String, errorThrown:String): Void {
	   		delayNextPoll = true;
	   		AppContext.LOGGER.error("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
		};

		super(requestToRepeat, wrappedSuccessFcn, errorFcn);

		setupHotKey();
	}

	private function setupHotKey():Void {
		AgentUi.HOT_KEY_ACTIONS.push(function(evt: JQEvent): Void {
            if(evt.altKey && evt.shiftKey && evt.keyCode == 80 /* ALT+SHIFT+P */) {
                running = !running;
                AppContext.LOGGER.debug("Long Polling is running? " + running);
                poll();
            }
        });		
	}

	override public function start(?opts: AjaxOptions): Dynamic {
		poll();
		return jqXHR;
	}

	override public function abort(): Void {
		running = false;
		if(jqXHR != null) {
			try {
				jqXHR.abort();
				jqXHR = null;
			} catch (err: Dynamic) {
				//TODO what happens if we error on abort?
				AppContext.LOGGER.error("error on poll abort | " + err);
			}
		}
	}

	private function poll(): Void {
		if (running) {
			if (delayNextPoll == true) {
				delayNextPoll = false;
				Timer.delay(poll, Std.int(timeout/2));
			} else {
				// Set the url here in case the polling frequency has changed
				baseOpts.url = AgentUi.URL + "/api/channel/poll?channel=" + 
				               AppContext.SUBMIT_CHANNEL + "&timeoutMillis=" + Std.string(this.timeout);
				baseOpts.timeout = this.timeout + 1000;

				jqXHR = super.start();
			}
		}
	}
}