import Phaser from "phaser";
import messageBox from "../libs/MessageBox";

export class MyScene1 extends Phaser.Scene {
  constructor() {
    super({ key: "MyScene1", active: false })
  }
  preload() {
    this.load.image("bg001", '../../../public/room1_bg.jpg');
  }
  create() {
    const bg001 = this.add.tileSprite(400, 300, 800, 600, "bg001");
    const msgBox = new messageBox(this);
    msgBox.show("Me", "ここはどこだ・・・？")
  }
}