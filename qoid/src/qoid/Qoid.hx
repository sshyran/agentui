package qoid;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;
import m3.event.EventManager;

import qoid.model.ModelObj;
import qoid.ResponseProcessor.Response;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using m3.helper.OSetHelper;
using m3.serialization.TypeTools;

using Lambda;

class Qoid {
    public static var aliases:ObservableSet<Alias>;

    public static var notifications:ObservableSet<Notification<Dynamic>>;

    public static var introductions: ObservableSet<Introduction>;

    public static var connections: ObservableSet<Connection>;
    public static var groupedConnections: GroupedSet<Connection>;

    public static var labels:ObservableSet<Label>;

    public static var labelAcls:ObservableSet<LabelAcl>;
    public static var groupedLabelAcls: GroupedSet<LabelAcl>;
    
    public static var labelChildren:ObservableSet<LabelChild>;
    public static var groupedLabelChildren: GroupedSet<LabelChild>;

    public static var labeledContent:ObservableSet<LabeledContent>;
    public static var groupedLabeledContent: GroupedSet<LabeledContent>;

    public static var profiles:ObservableSet<Profile>;

    @:isVar public static var currentAlias(get,set): Alias;
    public static function set_currentAlias(a:Alias):Alias {
        currentAlias = a;
        EventManager.instance.change(QE.onAliasLoaded, currentAlias);
        labels.removeListener(setConnectionIidOnLabel);
        labels.listen(setConnectionIidOnLabel);
        return currentAlias;
    }

    public static function get_currentAlias():Alias {
        return currentAlias;
    }

    static function setConnectionIidOnLabel(l: Label, evt: EventType): Void {
        if (evt.isAdd()) {
            l.connectionIid = currentAlias.connectionIid;
        }
    }

    public static var verificationContent: ObservableSet<Content<Dynamic>>;

    private static function fireChangeEvent<T>(obj:T, evt:EventType): Void {
        var eventId = "on";

        if (evt.isAdd()) {
            eventId += "Add";
        } else if (evt.isClear()) {
            eventId += "Clear";
        } else if (evt.isDelete()) {
            eventId += "Delete";
        } else {
            eventId += "Update";
        }
        eventId += obj.clazz().shortClassName();

        EventManager.instance.fire(eventId, obj);
    }

    private static function __init__(): Void {
        introductions = new ObservableSet<Introduction>(ModelObjWithIid.identifier);
        introductions.listen(fireChangeEvent);

        notifications = new ObservableSet<Notification<Dynamic>>(ModelObjWithIid.identifier);
        notifications.listen(function(n:Notification<Dynamic>, evt:EventType) {
            if (evt.isAddOrUpdate()) {
                if (n.kind == NotificationKind.IntroductionRequest) {
                    var introRequest:IntroductionRequestNotification = cast(n);
                    QoidAPI.getProfile([introRequest.connectionIid, introRequest.props.connectionIid]);
                }
            }
            fireChangeEvent(n, evt);
        });

        aliases = new ObservableSet<Alias>(ModelObjWithIid.identifier);
        aliases.listen(function(a:Alias, evt:EventType):Void {
            if (evt.isAddOrUpdate()) {
                Logga.DEFAULT.debug(evt.name() + " | alias " + a.iid + "(" + a.objectId + ")");
                var p = profiles.getElementComplex(a.iid, "aliasIid");
                if (p != null) {
                    Logga.DEFAULT.debug("Assigning profile '" + p.name + "'(" + p.objectId + ") to alias " + a.iid + "(" + a.objectId + ")");
                    a.profile = p;
                }
            }

            fireChangeEvent(a, evt);
        });

        labels = new ObservableSet<Label>(Label.identifier);
        labels.listen(fireChangeEvent);

        connections = new ObservableSet<Connection>(Connection.identifier);
        connections.listen(function(c:Connection, evt:EventType): Void {
            if (evt.isAdd()) {
                QoidAPI.getProfile([c.iid]);
            } else {
                var profile: Profile = Qoid.profiles.getElementComplex(c.iid, "connectionIid");
                if(profile != null) {
                    c.data = profile;
                } else {
                    qoid.QoidAPI.getProfile([c.iid]);
                }
            }
            fireChangeEvent(c, evt);
        });
        groupedConnections = new GroupedSet<Connection>(connections, function(c:Connection):String {
            return c.aliasIid;
        });

        labelAcls = new ObservableSet<LabelAcl>(LabelAcl.identifier);
        labelAcls.listen(fireChangeEvent);
        groupedLabelAcls = new GroupedSet<LabelAcl>(labelAcls, function(l:LabelAcl):String {
            return l.connectionIid;
        });

        labelChildren = new ObservableSet<LabelChild>(LabelChild.identifier);
        labelChildren.listen(fireChangeEvent);
        groupedLabelChildren = new GroupedSet<LabelChild>(labelChildren, function(lc:LabelChild):String {
            return lc.parentIid;
        });

        labeledContent = new ObservableSet<LabeledContent>(LabeledContent.identifier);
        labeledContent.listen(fireChangeEvent);
        groupedLabeledContent = new GroupedSet<LabeledContent>(labeledContent, function(lc:LabeledContent):String {
            return lc.contentIid;
        });
        
        profiles = new ObservableSet<Profile>(Profile.identifier);
        profiles.listen( function(p:Profile, evt:EventType): Void{
            if (evt.isAddOrUpdate()) {
                var alias = aliases.getElement(p.aliasIid);
                if (alias != null) {
                    Logga.DEFAULT.debug("Assigning profile '" + p.name + "'(" + p.objectId + ") to alias " + alias.iid + "(" + alias.objectId + ")");
                    alias.profile = p;
                    aliases.addOrUpdate(alias);
                }
            }
            fireChangeEvent(p, evt);
        });

        verificationContent = new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier);
        verificationContent.listen(fireChangeEvent);

        // Add Handlers to the Serializer instance
        Serializer.instance.addHandler(Content, new ContentHandler());
        Serializer.instance.addHandler(Notification, new NotificationHandler());

        EventManager.instance.on("onConnectionProfile", processProfile, "EventManager-onConnectionProfile");
    }

    public static function onInitialDataLoadComplete(alias: Alias) {
        currentAlias = alias;
    }

    public static function processProfile(rec: Response) {
        var connectionIid: String = rec.result.route[rec.result.route.length - 1];
        var connection: Connection = Qoid.connections.getElement(connectionIid);
        var profile: Profile = Serializer.instance.fromJsonX(rec.result.results[0], Profile);
        profile.connectionIid = connectionIid;
        if(connection != null) {
            connection.data = profile;
            Qoid.connections.addOrUpdate(connection);
        } else {
            Logga.DEFAULT.warn("We have a profile with no connection | profile --> iid: " + profile.iid + " - name: " + profile.name);   
        }
        Qoid.profiles.addOrUpdate(profile);
    }

    public static function getLabelDescendents(iid:String):ObservableSet<Label> {
        var labelDescendents = new ObservableSet<Label>(Label.identifier);

        var getDescendentIids:String->Array<String>->Void;
        getDescendentIids = function(iid:String, iidList:Array<String>):Void {
            iidList.insert(0, iid);
            var children: Array<LabelChild> = new FilteredSet(Qoid.labelChildren, function(lc:LabelChild):Bool {
                return lc.parentIid == iid;
            }).asArray();

            for (i in 0...children.length) {
                getDescendentIids(children[i].childIid, iidList);
            }
        };

        var iid_list = new Array<String>();
        getDescendentIids(iid, iid_list);
        for (iid_ in iid_list) {
            var label = labels.getElement(iid_);
            if (label == null) {
                Logga.DEFAULT.error("LabelChild references missing label: " + iid_);
            } else {
                labelDescendents.add(label);
            }
        }
        //edit by isaiah --> remove the parent iid
        iid_list.remove(iid);
        return labelDescendents;
    }

    public static function connectionFromLabel(labelIid:String):Connection {
        var ret:Connection = null;
        for (connection in connections) {
            if (connection.labelIid == labelIid) {
                ret = connection;
                break;
            }
        }
        return ret;
    }

    public static function labelFromPath(path:Array<String>):Label {
        var ret:Label = null;

        var parentIid = Qoid.currentAlias.labelIid;
        var labels:Array<Label> = new Array<Label>();
        for (labelName in path) {
            var acls = new FilteredSet<LabelChild>(Qoid.labelChildren, function(l:LabelChild):Bool{return l.parentIid == parentIid;});
            for (acl in acls.asArray()) {
                var label = Qoid.labels.getElement(acl.childIid);
                if (label != null && label.name == labelName) {
                    labels.push(label);
                    parentIid = label.iid;
                    break;
                }
            }
        }

        if (labels.length == path.length) {
            ret = labels[labels.length - 1];
        }

        return ret;
    }
}