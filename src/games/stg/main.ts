import "phaser";
import { TitleScene } from "./scenes/Title";
import { GameScene } from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL, //canvasかwebGLかを自動選択
  title: "stg", //タイトル
  version: "0.0.1", //バージョン
  width: 480, //画面幅
  height: 560, //画面高さ
  parent: "gameContainer", //DOM上の親
  backgroundColor: "#4488aa",
  audio: { disableWebAudio: true },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [GameScene], //利用するSceneクラス
};
export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}
window.addEventListener("load", () => {
  new Game(config);
});
