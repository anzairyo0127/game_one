export class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
  protected speed: number;
  protected health: number;

  constructor(scene: Phaser.Scene, x: number, y: number, textureId: string) {
    super(scene, x, y, textureId);
    scene.physics.add.existing(this);
    this.speed = 0.3;
    this.health = 1;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    // 継承したクラスでこのメソッドをオーバーライドします
  }
  update(): void {
    super.update();
    this.checkOutOfBounds();
  }
  takeDamage(damage: number) {
    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
    }
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
      this.destroy();
    }
  }
  spawn(x: number, y: number) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
  }
  die() {
    // エフェクトや効果音を再生
    // スコアを更新

    this.destroy();
  }
}

export class BaseEnemyGroup extends Phaser.Physics.Arcade.Group {
  public spawnTimer: number;
  public spawnInterval: number;

  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.spawnTimer = 0;
    this.spawnInterval = 500;
  }

  spawn(x: number, y: number, texture: string) {
    const enemy = this.getFirstDead(false);
  }
}
