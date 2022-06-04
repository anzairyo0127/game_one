class messageBox {
  currentThis: any;
  background_: any;
  txtName_: any;
  txtMessage_: any;
  constructor(that) {
    this.currentThis = that;
    this.background_ = this.currentThis.add.rectangle(
      400,
      480,
      750,
      160,
      0x6666ff
    );
    this.background_.setFillStyle(0x6666ff, 128);
    this.background_.visible = false;

    this.txtName_ = this.currentThis.add
      .text(50, 400, "Name:")
      .setFontSize("28px")
      .setColor("#ffffff")
      .setStroke("#ffffff", 2)
      .setPadding(0, 4, 0, 0);
    this.txtName_.visible = false;

    this.txtMessage_ = this.currentThis.add
      .text(50, 450, "messageArea")
      .setFontSize("32px")
      .setColor("#ffffff")
      .setPadding(0, 6, 0, 0);
    this.txtMessage_.visible = false;
  }

  show(pname, mess_text) {
    var nameSplit = "";
    if (pname.length > 0) {
      nameSplit = ":";
    }
    this.background_.visible = true;
    this.txtName_.text = pname + nameSplit;
    this.txtMessage_.text = mess_text;
    this.txtName_.visible = true;
    this.txtMessage_.visible = true;
  }
  hide() {
    this.background_.visible = false;
    this.txtName_.visible = false;
    this.txtMessage_.visible = false;
    this.txtName_.setColor("#ffffff");
    this.txtMessage_.setColor("#ffffff");
  }
  setMessageColor(code_) {
    this.txtMessage_.setColor(code_);
  }
}

export default messageBox;