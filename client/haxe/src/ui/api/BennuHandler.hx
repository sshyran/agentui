package ui.api;

import haxe.Json;
import m3.jq.JQ;

import ui.api.Requester;
import ui.api.EventDelegate;
import ui.model.ModelObj;
import ui.model.Filter;
import ui.model.EM;

using Lambda;

class BennuHandler implements ProtocolHandler {
	private var eventDelegate:EventDelegate;
	private var listeningChannel: LongPollingRequest;


	public function new() {
		this.eventDelegate = new EventDelegate(this);
	}

	public function getUser(login: Login): Void {
		// Create a dummy user
		var user = new User();
		user.userData = new UserData("Nicola Tesla", "media/test/tesla.jpg");
		EM.change(EMEvent.USER, user);
		EM.change(EMEvent.FitWindow);

		// Establish a connection with the server and get the channel_id
		var request = new BennuRequest("/api/channel/create", "", onCreateChannel);
		request.start();
	}

	public function filter(filter: Filter): Void { }
	public function stopCurrentFilter(onSuccessOrError: Void->Void, async: Bool=true): Void { }
	public function nextPage(nextPageURI: String): Void { }
	public function getAliasInfo(alias: Alias): Void { }
	public function createUser(newUser: NewUser): Void { }
	public function validateUser(token: String): Void { }
	public function updateUser(user: User): Void { }
	public function post(content: Content): Void { }
	public function updateLabels():Void { }
	public function addAlias(alias: Alias): Void { }
	public function removeAlias(alias: Alias): Void { }
	public function setDefaultAlias(alias: Alias): Void { }
	public function getAliasConnections(alias: Alias): Void { }
	public function getAliasLabels(alias: Alias): Void { }
	public function beginIntroduction(intro: Introduction): Void { } 
	public function confirmIntroduction(confirmation: IntroductionConfirmation): Void { }
	public function backup(/*backupName: String*/): Void { }
	public function restore(/*backupName: String*/): Void { }
	public function restores(): Void { }

	private function onCreateChannel(data: Dynamic, textStatus: String, jqXHR: JQXHR):Void {
		BennuRequest.channelId = data.id;
		_startPolling();
	}

	private function _startPolling(): Void {
		// TODO:  add the ability to set the timeout value
		var timeout = 10000;
		var path:String = "/api/channel/poll?channel=" + BennuRequest.channelId + "&timeoutMillis=" + Std.string(timeout);
		var ajaxOptions:AjaxOptions = {
	        contentType: "",
	        type: "GET"
		};

		listeningChannel = new LongPollingRequest("", _onPoll, path, ajaxOptions);
		listeningChannel.timeout = timeout + 2000;
		listeningChannel.start();
	}

	private function _onPoll(dataArr: Array<Dynamic>, textStatus: String, jqXHR: JQXHR) {
		if (dataArr == null || dataArr.length == 0) { return; }

		dataArr.iter(function(data:Dynamic): Void {

		});
	}
}
