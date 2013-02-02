package ui.model;

class ModelObj<T> implements haxe.rtti.Infos {

}

class User extends ModelObj<User> {

}

class Label extends ModelObj<Label> {

}

class Connection extends ModelObj<Connection> {
	public var uid: String;
	public var fname: String;
	public var lname: String;
	public var imgSrc: String;

	public function new(?fname: String, ?lname: String, ?imgSrc: String) {
		this.fname = fname;
		this.lname = lname;
		this.imgSrc = imgSrc;
	}
}