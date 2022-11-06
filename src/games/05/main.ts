import "phaser";
import { TitleScene } from "./scenes/Title";
import { MyScene } from "./scenes/MyScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, //canvasかwebGLかを自動選択
  title: "05", //タイトル
  version: "0.0.1", //バージョン
  width: 800, //画面幅
  height: 600, //画面高さ
  parent: "gameContainer", //DOM上の親
  backgroundColor: "#4488aa",
  audio: { disableWebAudio: true },
  scene: [MyScene], //利用するSceneクラス
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};
export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}
window.addEventListener("load", () => {
  const game = new Game(config);
});
