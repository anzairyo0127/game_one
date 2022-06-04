export class TitleScene extends Phaser.Scene {
  constructor() {
    //識別ID設定のみ
    super({
      key: "title",
    });
  }

  //本来はこのメソッドで、画像ファイルなどのロード
  preload(): void {
    //今回はコンソール表示だけ
    console.log("Hello Phaser");
  }
  create(): void {
    const sceneName = this.add
      .text(150, 70, "Title")
      .setFontSize(30)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    const change = this.add
      .text(150, 130, "Change Scene!")
      .setFontSize(20)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    change.on(
      "pointerdown",
      (pointer) => {
        this.scene.start("config");
      },
      this
    );
  }
}
