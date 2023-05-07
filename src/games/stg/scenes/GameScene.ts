import Phaser from "phaser";
import { Fighter } from "../chars/Fighter";
import { FighterShot, FighterShotGroup } from "../objects/FighterShot";
import { DiagonalEnemyGroup } from "../chars/DiaglonalEnemy";
import { BaseEnemy, BaseEnemyGroup } from "../chars/BaseEnemy";
import { FallingEnemyGroup } from "../chars/FallingEnemy";

export class GameScene extends Phaser.Scene {
  public fighter: Fighter;
  private enemyGroups: BaseEnemyGroup[];
  protected score: number = 10;

  constructor() {
    super({ key: "GameScene", active: false });
  }
  preload() {
    this.load.image("hishi", "/public/stg/hishi.png");
    this.load.image("bullet", "/public/stg/bullet.png");
    this.load.image("fighter", "/public/stg/fighter.png");
    this.load.image("background", "/public/stg/haikei.png");
    this.load.spritesheet("explosion", "/public/stg/stg0737.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }
  create() {
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "background")
      .setScrollFactor(0.25);
    this.fighter = this.add.existing(
      new Fighter(
        this,
        { x: this.scale.width / 2, y: this.scale.height * 0.9 },
        new FighterShotGroup(this)
      )
    );
    this.physics.add.existing(this.fighter);
    this.enemyGroups = [
      new DiagonalEnemyGroup(this),
      new FallingEnemyGroup(this),
    ];
    this.enemyGroups.forEach((enemyGroup) => {
      this.add.existing(enemyGroup);
      this.physics.add.collider(
        enemyGroup,
        this.fighter.shots,
        this.onEnemyShotCollision,
        null,
        this
      );
    });
  }

  update(time: number, delta: number) {
    this.enemyGroups.forEach((enemyGroup) => {
      enemyGroup.spawnTimer += delta;
      if (enemyGroup.spawnTimer > enemyGroup.spawnInterval) {
        (enemyGroup as DiagonalEnemyGroup).spawn(10, 10);
        enemyGroup.spawnTimer = 0;
      }
    });
  }

  onEnemyShotCollision(enemy: BaseEnemy, shot: FighterShot) {
    if (enemy.y >= 100) {
      enemy.takeDamage(1);
      shot.hit();
    }
  }
}
