import "phaser";
import { GameScene } from "./scenes/game-scene";
import { TitleScene } from "./scenes/title-scene";
import { Configcene } from "./scenes/config-scene";

const config: Phaser.Types.Core.GameConfig = {
  title: "03", //タイトル
  version: "0.0.1", //バージョン
  width: 640, //画面幅
  height: 480, //画面高さ
  parent: "gameContainer", //DOM上の親
  type: Phaser.AUTO, //canvasかwebGLかを自動選択
  scene: [GameScene, TitleScene, Configcene], //利用するSceneクラス
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    }
  }
};
export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}
window.addEventListener("load", () => {
  const game = new Game(config);
});
