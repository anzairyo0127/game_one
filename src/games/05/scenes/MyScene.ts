import Phaser from "phaser";

export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: "MyScene", active: false })
  }
  preload() {
  }
  create() {
    const bg001 = this.add.tileSprite(400, 300, 800, 600, "bg001");
  }
}