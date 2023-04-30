import Phaser from "phaser";

// https://www.codecaptain.io/blog/game-development/shooting-bullets-phaser-3-using-arcade-physics-groups/696

export class FighterShotGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      classType: FighterShot, // This is the class we create just below
      frameQuantity: 3, // Create 30 instances in the pool
      active: false,
      visible: false,
      key: FighterShot.texture,
    });
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }

  fireLaser(x: number, y: number) {
    // Get the first available sprite in the group
    const laser = this.getFirstDead(false);
    if (laser) {
      laser.fire(x, y);
    }
  }
}

export class FighterShot extends Phaser.Physics.Arcade.Sprite {
  private speed: number;
  static texture = "bullet";
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, FighterShot.texture);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (this.y <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
    this.checkOutOfBounds();
  }

  fire(x: number, y: number) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityY(-700);
  }
  private checkOutOfBounds() {
    // 画面外に出たかどうかをチェック
    if (
      this.x < -this.width ||
      this.x > this.scene.scale.width + this.width ||
      this.y < -this.height ||
      this.y > this.scene.scale.height + this.height
    ) {
      // 画面外に出た場合、破棄
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
