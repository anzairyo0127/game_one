import Phaser from "phaser";
import { FighterShotGroup } from "../objects/FighterShot";

export class Fighter extends Phaser.Physics.Arcade.Sprite {
  private lastShotTime = 0;
  private shotInterval = 100; // ショット間隔をミリ秒単位で設定（例: 500ms）
  public shots: FighterShotGroup;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private crouching = false;
  private speed = 180;
  private AKey: Phaser.Input.Keyboard.Key; // 左
  private DKey: Phaser.Input.Keyboard.Key; // 右
  private SKey: Phaser.Input.Keyboard.Key; // 下
  private ShotKey: Phaser.Input.Keyboard.Key; // ショットキー

  constructor(
    scene: Phaser.Scene,
    position: { x: number; y: number },
    shots: FighterShotGroup
  ) {
    super(scene, position.x, position.y, "fighter");
    this.setPosition(position.x, position.y);
    this.shots = shots;
    scene.physics.add.existing(this);
    this.body.setSize(5, 5);
    this.body.setOffset(14, 18);

    // キーボード入力の設定
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.AKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.DKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
    this.SKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.ShotKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.handleInput(time, delta);
  }

  update(...args: any[]): void {
    super.update(...args);
  }

  private handleInput(time: number, delta: number) {
    // 左右移動
    if (this.cursors.left.isDown || this.AKey.isDown) {
      this.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown || this.DKey.isDown) {
      this.setVelocityX(this.speed);
    } else {
      this.setVelocityX(0);
    }

    // しゃがみ状態
    if (this.cursors.down.isDown || this.SKey.isDown) {
      this.crouching = true;
    } else {
      this.crouching = false;
    }

    // ショット発射
    if (this.ShotKey.isDown && time - this.lastShotTime > this.shotInterval) {
      this.lastShotTime = time;
      this.fire();
    }
  }

  private fire = () => {
    this.shots.fireLaser(this.x, this.y);
  };
}
