import "phaser";
import { TitleScene } from "./scenes/Title";
import { MyScene1 } from "./scenes/MyScene"

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, //canvasかwebGLかを自動選択
  title: "04", //タイトル
  version: "0.0.1", //バージョン
  width: 800, //画面幅
  height: 600, //画面高さ
  parent: "gameContainer", //DOM上の親
  backgroundColor: "#4488aa",
  audio: { disableWebAudio: true },
  scene: [TitleScene, MyScene1], //利用するSceneクラス
};
export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}
window.addEventListener("load", () => {
  const game = new Game(config);
  let bg001, seCnt, seDoor, seBoom;
  let msgBox, txtTime;
  let messageMode = 0, itemFlag = false;
  let cntTimer = 0, remainTimer = 15, gameState = 0;
});
