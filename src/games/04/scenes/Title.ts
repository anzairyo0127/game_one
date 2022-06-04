import Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: "titleScene", active: true })
  }
  preload() {

  }
  create() {
    const text = this.add.text(100, 100, "EScape Game1").setFontSize(64).setColor("#ff0");
    const clickButton = this.add.text(200, 300, "click to start", { color: "#0f0" });
    clickButton.setStroke("#0000ff", 4).setFontSize(40).setInteractive();
    clickButton.on("pointerdown", () => {
      this.scene.start("MyScene1", this);
    });
  }
  update() { }
}