import { GameScene } from "../scenes/GameScene";
import { BaseEnemy, BaseEnemyGroup } from "./BaseEnemy";

export class DiagonalEnemy extends BaseEnemy {
  private readonly descentThreshold: number;
  private readonly centerX: number;
  private readonly textureId: string = "hishi";

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "hishi");
    this.setActive(false);
    this.setVisible(false);
    // パラメータを設定
    this.descentThreshold = this.scene.scale.height * 0.3; // 画面の%まで下降
    this.centerX = this.scene.scale.width / 2; // 画面の中心X座標
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    // 一定の位置まで下降
    if (this.y < this.descentThreshold) {
      this.y += this.speed * delta;
    } else {
      // 一定の位置に達したら中心に向かって斜めに移動
      const direction = this.x < this.centerX ? 1 : -1;
      this.x += direction * this.speed * delta;
      this.y += this.speed * delta;
    }
  }
  update(): void {
    super.update();
  }
  spawn(x: number, y: number) {
    this.body.reset(x, y);
    this.scene.physics.add.existing(this);
    this.setActive(true);
    this.setVisible(true);
  }
  takeDamage(amount: number) {
    this.health -= amount;

    if (this.health <= 0) {
      this.die();
    } else {
      // 敵がダメージを受けたときのアニメーションや効果音を再生
    }
  }
}

export class DiagonalEnemyGroup extends BaseEnemyGroup {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.spawnInterval = 100;

    // グループの設定
    this.createMultiple({
      classType: DiagonalEnemy,
      frameQuantity: 10, // 初期のエネミー数
      active: false,
      visible: false,
      key: "diagonalEnemy",
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
