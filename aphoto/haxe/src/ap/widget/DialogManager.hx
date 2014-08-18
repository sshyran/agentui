package ap.widget;

import qoid.model.ModelObj;
import m3.jq.JQ;
import qoid.widget.AliasManagerDialog;
import qoid.widget.LoginDialog;
import qoid.widget.CreateAgentDialog;

@:expose
class DialogManager {

    private static function showDialog(dialogFcnName: String, ?options:Dynamic):Void {
        if (options == null) {
            options = {};
        }
        var selector:String = "." + dialogFcnName;
        var dialog: JQ = new JQ(selector);
        if (!dialog.exists()) {
            dialog = new JQ("<div></div>");
            dialog.appendTo(js.Browser.document.body);
            var dlg = Reflect.field(JQ.ui, dialogFcnName)(options);
            dlg.open();
        } else {
            var field = Reflect.field(dialog, dialogFcnName);

            for (key in Reflect.fields(options)) {
                var value:String = Reflect.field(options, key);
                Reflect.callMethod(dialog, field, ["option", key, value]);
            }
            Reflect.callMethod(dialog, field, ["open"]);
        }
    }

    public static function showLogin(): Void {
        showDialog("loginDialog");
    }

    public static function showCreateAgent(): Void {
        showDialog("createAgentDialog");
    }

    public static function showAliasManager(): Void {
        showDialog("aliasManagerDialog");
    }
}
