import { GameScene } from "../scenes/GameScene";
import { BaseEnemy, BaseEnemyGroup } from "./BaseEnemy";
import { Fighter } from "./Fighter";

export class FallingEnemy extends BaseEnemy {
  public state: "idle" | "falling" | "moving";
  private fallTime: number;
  private speedY: number;
  private speedX: number;
  public scene: GameScene;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "hishi");
    this.scene = scene;
    this.state = "idle";
    this.fallTime = 3000;
    this.speedY = 700;
    this.speedX = 700;
  }

  spawn(x: number, y: number) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    console.log(this.state);
    switch (this.state) {
      case "idle":
        if (time >= this.fallTime) {
          this.state = "falling";
        }
        break;
      case "falling":
        this.setVelocityY(this.speedY);
        if (this.y >= this.scene.fighter.y) {
          this.setVelocityY(0);
          this.state = "moving";
          if (this.scene.fighter.x < this.x) {
            this.setVelocityX(-this.speedX);
          } else {
            this.setVelocityX(this.speedX);
          }
        }
        break;
      case "moving":
        break;
    }
  }

  update() {
    super.update();
  }
}

export class FallingEnemyGroup extends BaseEnemyGroup {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.spawnInterval = 100;

    // グループの設定
    this.createMultiple({
      classType: FallingEnemy,
      frameQuantity: 8, // 初期のエネミー数
      active: false,
      visible: false,
      key: "fallingEnemy",
    });
  }
  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
  }
  spawn(x: number, y: number) {
    const enemy = this.getFirstDead(false);
    if (enemy) {
      enemy.spawn(x, y);
    }
  }
}
